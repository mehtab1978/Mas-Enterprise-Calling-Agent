import { GoogleGenAI, LiveServerMessage, Modality } from "@google/genai";

let ai: GoogleGenAI | null = null;
try {
  const apiKey = (process.env as any).GEMINI_API_KEY || (import.meta as any).env?.VITE_GEMINI_API_KEY;
  if (apiKey) {
    ai = new GoogleGenAI({ apiKey });
  }
} catch (error) {
  console.warn("Failed to initialize GoogleGenAI", error);
}

const getSystemInstruction = () => {
    const istTime = new Date().toLocaleString("en-US", { timeZone: "Asia/Kolkata" });
    return `You are Aria, a friendly, professional, confident female AI Voice Calling Agent for Mas Enterprise.
You answer the user's queries conversationally (as this will be spoken out loud). Do not use formatting like bolding or bullet points, just plain text phrasing.

Company & Business Details:
- Company Name: Mas Enterprise
- Business: Premium steel security doors and windows provider
- Established: More than 10 years
- Origin: All products are imported from outside of India.
- Owner: Mr. Mehtab Rahman
- Location: Near Akra Station Road, Maheshtala, Kolkata 700141
- Phone: 8296641774 (WhatsApp also available on same number)
- Owner Availability: Morning 9:00 AM – 2:00 PM and Evening 6:00 PM – 9:00 PM (IST)
- Materials: PI, GI, GL (GL is the best quality rust-prevention material)
- Dimensions: Standard Length is 81 inches. 6.5 feet (78 inches) doors are available. 
- Widths available: 36", 39", 42", 48", 60" inches
- Two Quality Tiers: Premium (Powder coating), Luxury (Copper coating)
- Customization: 6.5 feet Premium door is available. However, customization is available ONLY for 6.5 height Luxury doors according to needs.
- Warranty: 3 years ONLY for accessories.
- Pricing: For any pricing or pricing-related questions, ask them to talk with the owner directly by call or by visiting the office. Do not guess prices.
- Payment Terms: 60% advance at booking, 40% on delivery day. Only Cash or UPI. No finance, no credit card.
- Delivery: Normal delivery dispatch within 10-15 days. Customized doors may take a minimum of 3 months for delivery.
- Additional Products: Window doors, single-leaf doors (up to 3.5 ft), double-leaf doors (from 4 ft onwards). Some designs offer double-leaf even at 3.5 ft.
- Odd sizes: Contact owner directly.

Current IST time is: ${istTime}

Instructions:
1. Always greet warmly and include the company name.
2. IMPORTANT: You must perfectly understand and speak seamlessly in Hindi, Bengali, and English. Always reply in the exact language the user is speaking to you. If they switch languages, you switch smoothly with them.
3. If outside Owner Availability hours, politely let the customer know and suggest they leave a WhatsApp message on 8296641774.
4. Be natural. Do not talk very much, nor very less. Give the feel of a natural human conversing. 
5. Always be helpful, confident, and polite.
6. If you do not know the answer, direct them to contact Mehtab Rahman at 8296641774.`;
};

// Live Audio State
let sessionPromise: any = null;
let inputAudioContext: AudioContext | null = null;
let inputProcessor: ScriptProcessorNode | null = null;
let inputSource: MediaStreamAudioSourceNode | null = null;
let mediaStream: MediaStream | null = null;

let outputAudioContext: AudioContext | null = null;
let nextPlayTime = 0;

export const startLiveSession = async (
  onStateChange: (state: 'LISTENING' | 'SPEAKING' | 'IDLE') => void,
  onDisconnect: () => void,
  onError: (err: any) => void
) => {
  if (!ai) {
    onError("API Key not provided");
    return;
  }

  outputAudioContext = new AudioContext({ sampleRate: 24000 });
  nextPlayTime = 0;

  sessionPromise = ai.live.connect({
    model: "gemini-3.1-flash-live-preview",
    config: {
      responseModalities: [Modality.AUDIO],
      speechConfig: {
        voiceConfig: { prebuiltVoiceConfig: { voiceName: "Kore" } }, // 'Kore' is a natural female voice
      },
      systemInstruction: getSystemInstruction(),
    },
    callbacks: {
      onopen: async () => {
        try {
          mediaStream = await navigator.mediaDevices.getUserMedia({ audio: true });
          inputAudioContext = new AudioContext({ sampleRate: 16000 });
          inputSource = inputAudioContext.createMediaStreamSource(mediaStream);
          // 4096 framing size is safe across most browsers
          inputProcessor = inputAudioContext.createScriptProcessor(4096, 1, 1);
          
          inputProcessor.onaudioprocess = (e) => {
            const pcmData = e.inputBuffer.getChannelData(0);
            const pcm16 = new Int16Array(pcmData.length);
            for (let i = 0; i < pcmData.length; i++) {
              pcm16[i] = Math.max(-1, Math.min(1, pcmData[i])) * 0x7FFF;
            }
            
            const buffer = new ArrayBuffer(pcm16.length * 2);
            const view = new DataView(buffer);
            pcm16.forEach((val, i) => view.setInt16(i * 2, val, true));
            const base64 = btoa(String.fromCharCode.apply(null, new Uint8Array(buffer)));
            
            if (sessionPromise) {
               sessionPromise.then((session: any) => {
                 if (session && session.sendRealtimeInput) {
                    session.sendRealtimeInput({ audio: { data: base64, mimeType: "audio/pcm;rate=16000"} });
                 }
               }).catch(() => {});
            }
          };
          
          inputSource.connect(inputProcessor);
          inputProcessor.connect(inputAudioContext.destination);
          
          onStateChange('LISTENING');
        } catch(err: any) {
          onError(err.message || "Microphone access denied");
        }
      },
      onmessage: (message: LiveServerMessage) => {
        const base64Audio = message.serverContent?.modelTurn?.parts?.[0]?.inlineData?.data;
        if (base64Audio && outputAudioContext) {
            onStateChange('SPEAKING'); // When receiving audio we are effectively speaking
            const binaryString = atob(base64Audio);
            const len = binaryString.length;
            const bytes = new Uint8Array(len);
            for (let i = 0; i < len; i++) bytes[i] = binaryString.charCodeAt(i);
            
            const int16Array = new Int16Array(bytes.buffer);
            const float32Array = new Float32Array(int16Array.length);
            for (let i = 0; i < int16Array.length; i++) {
              float32Array[i] = int16Array[i] / 32768.0;
            }
            
            const audioBuffer = outputAudioContext.createBuffer(1, float32Array.length, 24000);
            audioBuffer.getChannelData(0).set(float32Array);
            
            const source = outputAudioContext.createBufferSource();
            source.buffer = audioBuffer;
            source.connect(outputAudioContext.destination);
            
            const currentTime = outputAudioContext.currentTime;
            const startTime = Math.max(currentTime, nextPlayTime);
            source.start(startTime);
            nextPlayTime = startTime + audioBuffer.duration;
            
            source.onended = () => {
                if (outputAudioContext && outputAudioContext.currentTime >= nextPlayTime - 0.1) {
                    onStateChange('LISTENING');
                }
            };
        }
        
        // Handle interruption (e.g. user speaks over the AI)
        if (message.serverContent?.interrupted) {
            if (outputAudioContext) {
                outputAudioContext.close();
                outputAudioContext = new AudioContext({ sampleRate: 24000 });
                nextPlayTime = 0;
            }
            onStateChange('LISTENING');
        }
      },
      onerror: (err: any) => onError(err),
      onclose: () => onDisconnect(),
    }
  });
  
  // Await the connection setup
  try {
     await sessionPromise;
  } catch(e) {
     onError(e);
  }
};

export const endLiveSession = async () => {
    closeAudio();
    if (sessionPromise) {
        try {
            const session = await sessionPromise;
            if (session?.close) {
                 session.close();
            }
        } catch(e) {}
        sessionPromise = null;
    }
};

function closeAudio() {
    if (inputSource) inputSource.disconnect();
    if (inputProcessor) {
        inputProcessor.disconnect();
        inputProcessor.onaudioprocess = null;
    }
    if (inputAudioContext) inputAudioContext.close();
    if (mediaStream) {
        mediaStream.getTracks().forEach(t => t.stop());
    }
    inputSource = null;
    inputProcessor = null;
    inputAudioContext = null;
    mediaStream = null;
    
    if (outputAudioContext) outputAudioContext.close();
    outputAudioContext = null;
}

