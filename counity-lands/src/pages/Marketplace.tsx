import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import { lands } from "../data/lands";

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

export const Marketplace = () => {
  return (
    <div className="bg-[#050505] min-h-screen text-white font-sans pt-32 pb-24 px-6 md:px-12 selection:bg-brand-cyan/30">
      <div className="max-w-[1400px] mx-auto">
        <Reveal>
          <div className="mb-6 flex items-center gap-4">
            <Link to="/" className="text-surface-400 hover:text-white transition-colors text-sm font-mono tracking-widest uppercase">
              HOME
            </Link>
            <span className="text-surface-600">/</span>
            <span className="text-brand-cyan text-sm font-mono tracking-widest uppercase">
              MARKETPLACE
            </span>
          </div>
          <h1 className="text-5xl md:text-8xl font-medium tracking-tighter leading-[0.9] mb-8">
            Encontrá tu<br />lugar en la red.
          </h1>
          <p className="text-xl md:text-2xl text-surface-400 font-light max-w-3xl mb-24 leading-relaxed">
            Explora nuestros modelos piloto. Cada Land está diseñada para un estilo de vida específico, pero todas comparten el mismo sistema operativo: gobernanza transparente, economía consciente y diseño regenerativo.
          </p>
        </Reveal>

        <div className="flex flex-col gap-12 md:gap-24">
          {lands.map((land, index) => (
            <Reveal key={land.id} delay={0.1 * (index % 2)}>
              <Link 
                to={`/lands/${land.id}`}
                className="group block relative rounded-[2rem] overflow-hidden bg-[#0a0a0a] border border-white/5 hover:border-brand-cyan/30 transition-all duration-500"
              >
                <div className="grid md:grid-cols-2 lg:grid-cols-12 min-h-[500px]">
                  
                  {/* Image Area */}
                  <div className="lg:col-span-7 relative overflow-hidden h-[300px] md:h-auto">
                    <motion.img
                      src={land.image}
                      alt={land.name}
                      className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-black/20 group-hover:bg-transparent transition-colors duration-500" />
                    
                    <div className="absolute top-6 left-6 flex gap-3">
                      <div className="bg-black/50 backdrop-blur-md border border-white/10 px-4 py-2 rounded-full text-xs font-mono uppercase tracking-widest text-white">
                        {land.tag}
                      </div>
                    </div>
                  </div>

                  {/* Content Area */}
                  <div className="lg:col-span-5 p-8 md:p-12 lg:p-16 flex flex-col justify-between">
                    <div>
                      <div className="text-surface-500 font-mono text-sm tracking-widest mb-4">
                        {`0${index + 1}`} / 0{lands.length}
                      </div>
                      <h2 className="text-4xl md:text-5xl font-medium tracking-tighter mb-4 group-hover:text-brand-cyan transition-colors">
                        {land.name}
                      </h2>
                      <p className="text-xl text-surface-300 font-light mb-8">
                        {land.headline}
                      </p>
                      
                      <div className="space-y-3 mb-10">
                        {land.highlights.map((highlight, i) => (
                          <div key={i} className="text-sm text-surface-400 font-light flex items-start gap-3">
                            <div className="w-1.5 h-1.5 rounded-full bg-brand-cyan/50 mt-1.5 shrink-0" />
                            <span>{highlight}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="flex items-center gap-4 text-white font-medium group-hover:translate-x-2 transition-transform duration-300">
                      <span>Explorar Land</span>
                      <ArrowRight size={20} className="text-brand-cyan" />
                    </div>
                  </div>

                </div>
              </Link>
            </Reveal>
          ))}
        </div>
      </div>
    </div>
  );
};
