import React, { useState, useEffect, useRef } from 'react';
import { Mic, Phone, MessageCircle, X, ShieldCheck, Clock, CheckCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { startLiveSession, endLiveSession } from './services/geminiService';

function Navbar() {
  return (
    <nav className="fixed top-0 w-full z-40 bg-[#0a0f1d]/80 backdrop-blur-md border-b border-white/5">
      <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <div className="w-8 h-8 rounded-sm bg-gradient-gold flex items-center justify-center font-display font-bold text-navy">M</div>
          <span className="font-display text-2xl tracking-wide font-semibold text-white">
            Mas <span className="text-gradient-gold">Enterprise</span>
          </span>
        </div>
        <div className="hidden md:flex items-center space-x-8 text-sm uppercase tracking-widest text-silver">
          <a href="#home" className="hover:text-white transition">Home</a>
          <a href="#products" className="hover:text-white transition">Products</a>
          <a href="https://wa.me/918296641774" target="_blank" rel="noreferrer" className="flex items-center gap-2 hover:text-white transition">
            <MessageCircle size={16} /> WhatsApp
          </a>
        </div>
      </div>
    </nav>
  );
}

function Hero({ onStartCall }: { onStartCall: () => void }) {
  return (
    <div id="home" className="relative min-h-screen flex items-center justify-center pt-20 overflow-hidden">
      <div className="absolute inset-0 z-0">
        <img 
          src="https://images.unsplash.com/photo-1549646452-fdd6b815965f?auto=format&fit=crop&q=80" 
          alt="Luxury Steel Door" 
          className="w-full h-full object-cover"
          referrerPolicy="no-referrer"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-[#0a0f1d]/90 via-[#0a0f1d]/80 to-[#0a0f1d]"></div>
      </div>

      <div className="relative z-10 max-w-5xl mx-auto px-6 text-center">
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="inline-block mb-4 px-4 py-1.5 rounded-full border border-[#d4af37]/30 bg-[#d4af37]/10"
        >
          <span className="text-xs uppercase tracking-[0.2em] text-[#d4af37]">Trusted for over 10 years</span>
        </motion.div>
        
        <motion.h1 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.1 }}
          className="text-5xl md:text-7xl lg:text-8xl font-display font-semibold mb-6 tracking-tight leading-tight"
        >
          Premium Steel <br className="hidden md:block"/> 
          <span className="text-gradient-gold italic pr-4">Security Doors</span>
        </motion.h1>

        <motion.p 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="max-w-2xl mx-auto text-lg md:text-xl text-silver font-light leading-relaxed"
        >
          Experience unmatched strength and luxury finish. Talk live to our AI Voice Expert to find the perfect custom door for your space.
        </motion.p>
        
        <motion.p
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.3 }}
          className="max-w-2xl mx-auto text-sm text-[#d4af37]/80 mb-12 uppercase tracking-wider font-semibold"
        >
          Use Only For Basic Info.
        </motion.p>

        <motion.div
           initial={{ opacity: 0, scale: 0.9 }}
           animate={{ opacity: 1, scale: 1 }}
           transition={{ duration: 0.8, delay: 0.4 }}
        >
          <button 
            onClick={onStartCall}
            className="group relative flex items-center justify-center mx-auto space-x-3 bg-gradient-gold text-navy px-10 py-5 rounded-full text-lg font-semibold uppercase tracking-widest glow-btn transition-all active:scale-95"
          >
            <span className="absolute inset-0 rounded-full border-2 border-[#d4af37] scale-105 opacity-0 group-hover:opacity-100 group-hover:scale-110 transition-all duration-300"></span>
            <Mic className="animate-pulse" size={24} />
            <span>Start Voice Call Now</span>
          </button>
          <p className="mt-4 text-xs text-silver/60 uppercase tracking-widest">Available 24/7 • Instant Response</p>
        </motion.div>
      </div>
    </div>
  );
}

function Features() {
  const features = [
    { icon: <ShieldCheck size={28} className="text-[#d4af37]" />, title: "Premium Quality", desc: "GL rust-prevention material with custom Powder or Luxury Copper coating." },
    { icon: <Clock size={28} className="text-[#d4af37]" />, title: "Fast Dispatch", desc: "Delivery within 10-15 working days with 3-year warranty on accessories." },
    { icon: <CheckCircle size={28} className="text-[#d4af37]" />, title: "Custom Fit", desc: "Available in 36\" to 60\" widths, single & double-leaf luxury designs." },
  ];

  return (
    <div className="py-24 bg-[#0a0f1d] border-t border-white/5 relative z-10" id="products">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
          {features.map((f, i) => (
            <motion.div 
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.2 }}
              className="p-8 rounded-2xl bg-white/[0.02] border border-white/5 hover:border-[#d4af37]/30 transition-colors"
            >
              <div className="mb-6 bg-[#d4af37]/10 w-16 h-16 rounded-full flex items-center justify-center">
                {f.icon}
              </div>
              <h3 className="text-xl font-display font-semibold mb-3">{f.title}</h3>
              <p className="text-silver/80 font-light leading-relaxed">{f.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}

function Gallery() {
  const images = [
    "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&q=80",
    "https://images.unsplash.com/photo-1574362848149-11496d93a7c7?auto=format&fit=crop&q=80"
  ];
  
  return (
    <div className="py-24 bg-[#05080f] relative z-10">
      <div className="max-w-5xl mx-auto px-6">
        <h2 className="text-4xl lg:text-5xl font-display font-semibold mb-16 text-center">
          Our <span className="text-gradient-gold italic">Excellence</span>
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {images.map((img, i) => (
            <div key={i} className="group overflow-hidden rounded-xl aspect-[4/5] relative">
              <img 
                src={img} 
                alt="Product" 
                className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-700"
                referrerPolicy="no-referrer"
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function Footer() {
  return (
    <footer className="py-12 bg-[#0a0f1d] border-t border-white/10 relative z-10 text-center text-sm text-silver/60">
      <div className="max-w-4xl mx-auto px-6 space-y-4">
        <div className="flex flex-wrap items-center justify-center gap-6 text-white mb-6">
          <a href="tel:+918296641774" className="flex items-center gap-2 hover:text-[#d4af37] transition"><Phone size={16}/> 8296641774</a>
          <a href="https://wa.me/918296641774" target="_blank" rel="noreferrer" className="flex items-center gap-2 hover:text-[#d4af37] transition"><MessageCircle size={16}/> WhatsApp Us</a>
        </div>
        <p className="pt-4 border-t border-white/5">Owner: Mr. Mehtab Rahman | Near Akra Station Road, Maheshtala, Kolkata 700141</p>
        <p className="uppercase tracking-[0.2em] text-xs pt-4">Powered by Mas Enterprise AI Voice Agent</p>
        
        <div className="pt-8 mt-8 border-t border-white/5 flex flex-col items-center gap-3">
          <p>
            Site made by {" "}
            <a href="https://www.facebook.com/share/1B3CdKJ5L9/" target="_blank" rel="noreferrer" className="text-[#d4af37] hover:underline font-medium">
              Jolly Ai
            </a>
          </p>
          <a href="https://wa.me/919330273530" target="_blank" rel="noreferrer" className="flex items-center gap-2 text-silver hover:text-[#d4af37] transition text-xs uppercase tracking-widest">
            <MessageCircle size={14} /> WhatsApp For Getting The Great Business Growth Services
          </a>
        </div>
      </div>
    </footer>
  );
}

function VoiceAgentModal({ onClose }: { onClose: () => void }) {
  const [agentState, setAgentState] = useState<'IDLE' | 'LISTENING' | 'THINKING' | 'SPEAKING'>('IDLE');
  const [errorText, setErrorText] = useState("");

  useEffect(() => {
    setAgentState('IDLE');
    let isConnected = true;
    startLiveSession(
      (state) => {
        if (!isConnected) return;
        setAgentState(state === 'IDLE' ? 'IDLE' : state);
      },
      () => {
        if (!isConnected) return;
        setAgentState('IDLE');
        setErrorText("Session disconnected. Please close and try again.");
      },
      (err) => {
        if (!isConnected) return;
        console.error("Live API Error:", err);
        setAgentState('IDLE');
        setErrorText(typeof err === "string" ? err : "Error connecting to AI. Please try again.");
      }
    );

    return () => {
      isConnected = false;
      endLiveSession();
    };
  }, []);

  const handleClose = () => {
    endLiveSession();
    onClose();
  };

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center p-6 bg-[#0a0f1d]/90 backdrop-blur-2xl"
    >
      <button onClick={handleClose} className="absolute top-8 right-8 p-3 rounded-full bg-white/5 hover:bg-white/10 transition text-white z-[60]">
        <X size={24} />
      </button>

      <div className="max-w-2xl w-full text-center flex flex-col items-center">
        {/* Visualizer */}
        <div className="relative w-48 h-48 mb-16 flex items-center justify-center">
          {agentState === 'SPEAKING' && (
            <>
              <div className="absolute inset-0 rounded-full border border-[#d4af37] pulse-ring-anim" style={{ animationDelay: '0s' }}></div>
              <div className="absolute inset-0 rounded-full border border-[#d4af37] pulse-ring-anim" style={{ animationDelay: '0.5s' }}></div>
              <div className="absolute inset-0 rounded-full border border-[#d4af37] pulse-ring-anim" style={{ animationDelay: '1s' }}></div>
            </>
          )}
          <div className={`relative z-10 w-32 h-32 rounded-full flex items-center justify-center shadow-2xl transition-colors duration-500 ${agentState === 'LISTENING' ? 'bg-[#d4af37]/20 border border-[#d4af37]/50' : 'bg-gradient-gold'}`}>
            <Mic size={48} className={agentState === 'LISTENING' ? 'text-[#d4af37]' : 'text-navy'} />
          </div>
        </div>

        {/* Status */}
        <div className="uppercase tracking-[0.2em] text-xs font-semibold mb-6 flex items-center justify-center gap-2">
          {agentState === 'LISTENING' && <><span className="w-2 h-2 rounded-full bg-red-500 animate-pulse"></span> Aria is listening...</>}
          {agentState === 'SPEAKING' && <span className="text-white">Aria is speaking</span>}
          {agentState === 'IDLE' && !errorText && <span className="text-silver">Initializing secure connection...</span>}
          {errorText && <span className="text-red-400">{errorText}</span>}
        </div>

        {/* Subtitles */}
        <p className="text-2xl md:text-3xl font-display font-medium text-white/90 leading-relaxed min-h-[120px]">
          {errorText ? "Connection failed." : (agentState === 'IDLE' ? "Setting up voice..." : "Please speak naturally as if you're on a phone call.")}
        </p>
        
        {agentState === 'LISTENING' && (
           <p className="mt-8 text-sm text-silver/50 uppercase tracking-widest font-mono">(Speak now)</p>
        )}
      </div>
    </motion.div>
  );
}

export default function App() {
  const [isAgentOpen, setIsAgentOpen] = useState(false);

  return (
    <div className="min-h-screen bg-[#0a0f1d] text-white selection:bg-[#d4af37] selection:text-navy font-sans">
      <Navbar />
      <Hero onStartCall={() => setIsAgentOpen(true)} />
      <Features />
      <Gallery />
      <Footer />

      <AnimatePresence>
        {isAgentOpen && (
          <VoiceAgentModal onClose={() => setIsAgentOpen(false)} />
        )}
      </AnimatePresence>
    </div>
  );
}
