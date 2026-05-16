import { motion } from "framer-motion";
import { useParams, Link, Navigate } from "react-router-dom";
import { ArrowLeft, MapPin, Users, Activity } from "lucide-react";
import { lands } from "../data/lands";
import { useState } from "react";

const Reveal = ({ children, delay = 0, className = "" }: { children: React.ReactNode, delay?: number, className?: string }) => (
  <motion.div
    initial={{ opacity: 0, y: 30 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true, margin: "-100px" }}
    transition={{ duration: 0.8, delay, ease: [0.16, 1, 0.3, 1] }}
    className={className}
  >
    {children}
  </motion.div>
);

export const LandDetail = () => {
  const { id } = useParams();
  const land = lands.find((l) => l.id === id);
  const [formState, setFormState] = useState<"idle" | "submitting" | "success">("idle");

  if (!land) {
    return <Navigate to="/lands" replace />;
  }

  // A visually appealing waitlist random high number based on ID for consistency
  const waitlistCount = (land.name.length * 42) + 117; 

  const handleJoinWaitlist = (e: React.FormEvent) => {
    e.preventDefault();
    setFormState("submitting");
    setTimeout(() => {
      setFormState("success");
    }, 1500);
  };

  return (
    <div className="bg-[#050505] text-white font-sans selection:bg-brand-cyan/30">
      
      {/* Hero Section */}
      <section className="relative h-screen w-full flex flex-col justify-end p-6 md:p-12">
        <div className="absolute inset-0 z-0">
          <motion.img 
            initial={{ scale: 1.05 }}
            animate={{ scale: 1 }}
            transition={{ duration: 1.5, ease: "easeOut" }}
            src={land.image} 
            alt={land.name} 
            className="w-full h-full object-cover" 
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#050505] via-[#050505]/40 to-transparent" />
        </div>
        
        <div className="relative z-10 max-w-[1400px] mx-auto w-full">
          <Reveal>
            <Link to="/lands" className="inline-flex items-center gap-2 text-surface-300 hover:text-white transition-colors mb-12 font-mono text-sm tracking-widest uppercase">
              <ArrowLeft size={16} /> Volver al Marketplace
            </Link>
          </Reveal>
          
          <Reveal delay={0.1}>
            <div className="flex flex-wrap items-center gap-4 mb-6">
              <div className="bg-black/40 backdrop-blur-md border border-white/10 px-4 py-2 rounded-full text-xs font-mono uppercase tracking-widest text-brand-cyan">
                {land.tag}
              </div>
              <div className="flex items-center gap-2 text-surface-300 text-sm font-mono tracking-widest uppercase bg-black/40 backdrop-blur-md border border-white/10 px-4 py-2 rounded-full">
                <MapPin size={14} /> {land.location}
              </div>
            </div>
            
            <h1 className="text-6xl md:text-9xl font-medium tracking-tighter leading-[0.9] mb-6">
              {land.name}
            </h1>
            <p className="text-2xl md:text-3xl text-surface-300 font-light max-w-3xl">
              {land.headline}
            </p>
          </Reveal>
        </div>
      </section>

      {/* Highlights & Swap Indicator */}
      <section className="py-24 px-6 md:px-12 border-b border-white/5">
        <div className="max-w-[1400px] mx-auto">
          <div className="grid md:grid-cols-12 gap-12 lg:gap-24">
            <div className="md:col-span-5">
              <Reveal>
                <h3 className="text-xs font-mono uppercase tracking-widest text-surface-500 mb-6">Nivel de Swap</h3>
                <div className="flex items-end justify-between mb-2">
                  <span className="text-2xl font-medium">{land.swapText}</span>
                  <span className="text-brand-cyan font-mono">{land.swapLevel}%</span>
                </div>
                {/* Visual Bar */}
                <div className="w-full h-1.5 bg-white/10 rounded-full overflow-hidden">
                  <motion.div 
                    initial={{ width: 0 }}
                    whileInView={{ width: `${land.swapLevel}%` }}
                    viewport={{ once: true }}
                    transition={{ duration: 1, delay: 0.2, ease: "easeOut" }}
                    className="h-full bg-brand-cyan rounded-full"
                  />
                </div>
                <p className="text-sm text-surface-400 mt-4 font-light">
                  Probabilidad de rotación e intercambio con otros nodos de la red global Counity.
                </p>
              </Reveal>
            </div>
            
            <div className="md:col-span-6 md:col-start-7">
              <Reveal delay={0.2}>
                <h3 className="text-xs font-mono uppercase tracking-widest text-surface-500 mb-6">Highlights de la Land</h3>
                <div className="space-y-6">
                  {land.highlights.map((highlight, index) => (
                    <div key={index} className="flex items-start gap-4 border-t border-white/10 pt-4">
                      <div className="w-2 h-2 rounded-full bg-brand-cyan/50 mt-2 shrink-0" />
                      <span className="text-xl text-surface-300 font-light">{highlight}</span>
                    </div>
                  ))}
                </div>
              </Reveal>
            </div>
          </div>
        </div>
      </section>

      {/* Extended Description Content (Axis Haus translucent boxes style) */}
      <section className="py-32 px-6 md:px-12 relative">
        <div className="absolute top-1/4 right-0 w-[600px] h-[600px] bg-brand-cyan/5 rounded-full blur-[150px] pointer-events-none" />
        
        <div className="max-w-[1400px] mx-auto space-y-24 relative z-10">
          
          <Reveal>
            <div className="grid md:grid-cols-12 gap-12 items-center">
              <div className="md:col-span-5">
                <h2 className="text-4xl md:text-5xl font-medium tracking-tighter mb-6">Privado vs. Compartido</h2>
                <div className="w-12 h-[1px] bg-brand-cyan mb-6" />
              </div>
              <div className="md:col-span-7 bg-white/[0.02] border border-white/5 p-8 md:p-12 rounded-[2rem] backdrop-blur-sm hover:border-brand-cyan/20 transition-colors">
                <p className="text-lg md:text-xl text-surface-300 font-light leading-relaxed">
                  {land.extendedDescription.privateVsShared}
                </p>
              </div>
            </div>
          </Reveal>

          <Reveal delay={0.1}>
            <div className="grid md:grid-cols-12 gap-12 items-center">
              <div className="md:col-span-7 order-2 md:order-1 bg-white/[0.02] border border-white/5 p-8 md:p-12 rounded-[2rem] backdrop-blur-sm hover:border-brand-cyan/20 transition-colors">
                <p className="text-lg md:text-xl text-surface-300 font-light leading-relaxed">
                  {land.extendedDescription.experience}
                </p>
              </div>
              <div className="md:col-span-5 order-1 md:order-2">
                <h2 className="text-4xl md:text-5xl font-medium tracking-tighter mb-6">La Experiencia</h2>
                <div className="w-12 h-[1px] bg-brand-cyan mb-6" />
              </div>
            </div>
          </Reveal>

          <Reveal delay={0.2}>
            <div className="grid md:grid-cols-12 gap-12 items-center">
              <div className="md:col-span-5">
                <h2 className="text-4xl md:text-5xl font-medium tracking-tighter mb-6">Gobernanza</h2>
                <div className="w-12 h-[1px] bg-brand-cyan mb-6" />
              </div>
              <div className="md:col-span-7 bg-white/[0.02] border border-white/5 p-8 md:p-12 rounded-[2rem] backdrop-blur-sm hover:border-brand-cyan/20 transition-colors">
                <p className="text-lg md:text-xl text-surface-300 font-light leading-relaxed">
                  {land.extendedDescription.governance}
                </p>
              </div>
            </div>
          </Reveal>

        </div>
      </section>

      {/* Waitlist / CTA Section */}
      <section className="py-32 px-6 md:px-12 bg-white text-black rounded-t-[3rem] mt-12 relative overflow-hidden">
        <div className="max-w-[1400px] mx-auto grid lg:grid-cols-2 gap-16 lg:gap-24 items-center">
          
          <Reveal>
            <div>
              <div className="flex items-center gap-3 text-sm font-mono tracking-widest uppercase mb-6 text-surface-500">
                <Activity size={16} /> Lista de Fundadores
              </div>
              <h2 className="text-5xl md:text-7xl font-medium tracking-tighter leading-none mb-8">
                Asegurá tu lugar<br />en el inicio.
              </h2>
              <p className="text-xl text-surface-600 font-light leading-relaxed mb-12">
                Las Lands Piloto están en etapa de pre-registro para fundadores. Al unirte a la waitlist, tendrás acceso prioritario a las unidades y participación en las primeras decisiones de diseño participativo.
              </p>
              
              <div className="bg-surface-50 border border-black/5 p-6 rounded-[1.5rem] flex items-center gap-6">
                <div className="w-16 h-16 rounded-full bg-brand-cyan/20 flex items-center justify-center shrink-0">
                  <Users className="text-brand-cyan" size={24} />
                </div>
                <div>
                  <div className="text-3xl font-medium tracking-tighter">{waitlistCount}</div>
                  <div className="text-sm text-surface-500 uppercase tracking-widest font-mono">Founders esperando</div>
                </div>
              </div>
            </div>
          </Reveal>

          <Reveal delay={0.2}>
            <div className="bg-[#050505] p-8 md:p-12 rounded-[2.5rem] text-white">
              <h3 className="text-3xl font-medium tracking-tighter mb-8">Unite a la Waitlist</h3>
              
              {formState === "success" ? (
                <motion.div 
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="bg-brand-cyan/10 border border-brand-cyan/30 rounded-2xl p-8 text-center"
                >
                  <div className="w-16 h-16 bg-brand-cyan rounded-full mx-auto flex items-center justify-center mb-6">
                    <svg className="w-8 h-8 text-black" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <h4 className="text-2xl font-medium mb-2">¡Estás en la lista!</h4>
                  <p className="text-surface-400 font-light">Pronto te contactaremos con los siguientes pasos para ser founder de {land.name}.</p>
                </motion.div>
              ) : (
                <form onSubmit={handleJoinWaitlist} className="space-y-6">
                  <div>
                    <label htmlFor="name" className="block text-sm font-mono text-surface-400 uppercase tracking-widest mb-2">Nombre completo</label>
                    <input 
                      type="text" 
                      id="name" 
                      required
                      className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-4 text-white focus:outline-none focus:border-brand-cyan/50 transition-colors"
                      placeholder="Ej: Laura Gómez"
                    />
                  </div>
                  <div>
                    <label htmlFor="email" className="block text-sm font-mono text-surface-400 uppercase tracking-widest mb-2">Correo electrónico</label>
                    <input 
                      type="email" 
                      id="email" 
                      required
                      className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-4 text-white focus:outline-none focus:border-brand-cyan/50 transition-colors"
                      placeholder="hola@ejemplo.com"
                    />
                  </div>
                  <div>
                    <label htmlFor="role" className="block text-sm font-mono text-surface-400 uppercase tracking-widest mb-2">Afinidad / Rol</label>
                    <select 
                      id="role" 
                      className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-4 text-white focus:outline-none focus:border-brand-cyan/50 transition-colors appearance-none"
                    >
                      <option value="creator" className="bg-[#050505]">Creador / Desarrollo Tech</option>
                      <option value="investor" className="bg-[#050505]">Inversor Consciente</option>
                      <option value="wellness" className="bg-[#050505]">Profesional del Bienestar</option>
                      <option value="builder" className="bg-[#050505]">Arquitectura / Bioconstrucción</option>
                      <option value="other" className="bg-[#050505]">Otro</option>
                    </select>
                  </div>
                  <button 
                    type="submit"
                    disabled={formState === "submitting"}
                    className="w-full bg-brand-cyan text-black font-medium py-4 rounded-xl mt-4 hover:bg-brand-cyan/90 transition-colors disabled:opacity-70"
                  >
                    {formState === "submitting" ? "Procesando..." : "Solicitar acceso"}
                  </button>
                </form>
              )}
            </div>
          </Reveal>
        </div>
      </section>

    </div>
  );
};
