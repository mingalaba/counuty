import { motion, AnimatePresence } from "framer-motion";
import { ArrowRight, ArrowLeft } from "lucide-react";
import { useState } from "react";
import { Link } from "react-router-dom";
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

export const Home = () => {
  const [currentModel, setCurrentModel] = useState(0);

  const nextModel = () => setCurrentModel((prev) => (prev + 1) % lands.length);
  const prevModel = () => setCurrentModel((prev) => (prev - 1 + lands.length) % lands.length);

  return (
    <div className="bg-[#050505] text-white font-sans selection:bg-brand-cyan/30">
      
      {/* 1.1 Hero Section */}
      <section className="min-h-screen flex flex-col justify-center px-6 md:px-12 relative overflow-hidden pt-20">
        <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-brand-cyan/5 rounded-full blur-[150px] pointer-events-none" />
        <div className="max-w-[1400px] mx-auto w-full">
          <Reveal>
            <h1 className="text-[12vw] md:text-[8vw] font-medium tracking-tighter leading-[0.9] mb-12">
              EL MERCADO<br />
              VENDE PAREDES.<br />
              <span className="text-surface-400">DISEÑAMOS<br />LUGARES VIVOS.</span>
            </h1>
          </Reveal>
          <div className="grid md:grid-cols-12 gap-8">
            <div className="md:col-span-5 md:col-start-8">
              <Reveal delay={0.1}>
                <p className="text-xl md:text-2xl text-surface-300 leading-snug mb-10 font-light">
                  Adquirir tu casa no debería anclarte ni endeudarte. Counity Lands son hábitats físicos para mentes inquietas, donde el diseño regenerativo, el tejido social y la flexibilidad de moverte por el mundo se encuentran.
                </p>
                <div className="flex flex-col sm:flex-row gap-4">
                  <Link to="/lands" className="bg-white text-black px-8 py-4 rounded-full font-medium hover:bg-surface-200 transition-colors text-center">
                    Explorar las Lands Piloto
                  </Link>
                  <button className="border border-white/20 text-white px-8 py-4 rounded-full font-medium hover:bg-white/5 transition-colors">
                    Entendé la visión
                  </button>
                </div>
              </Reveal>
            </div>
          </div>
        </div>
      </section>

      {/* 1.2 ¿Qué es Counity? */}
      <section className="py-32 px-6 md:px-12 border-t border-white/10">
        <div className="max-w-[1400px] mx-auto">
          <div className="grid md:grid-cols-12 gap-12">
            <div className="md:col-span-4">
              <Reveal>
                <span className="text-xs uppercase tracking-widest text-surface-400">Qué estamos construyendo</span>
              </Reveal>
            </div>
            <div className="md:col-span-8">
              <Reveal>
                <h2 className="text-4xl md:text-6xl font-medium tracking-tighter leading-[1.1] mb-8">
                  No vendemos metros cuadrados. Fundamos nodos en una red global.
                </h2>
              </Reveal>
              <Reveal delay={0.1}>
                <p className="text-xl text-surface-400 leading-relaxed max-w-3xl font-light">
                  Counity no es un proyecto de real estate. Es una infraestructura física y digital para rediseñar cómo vivimos, cómo tomamos decisiones y cómo impactamos la tierra. Adquirir tu refugio es conectar un cable directo a una red de inteligencia y recursos. Vivir acá es formar parte de un colectivo que decide su propio futuro, respaldado por tecnología que garantiza movilidad y transparencia.
                </p>
              </Reveal>
            </div>
          </div>
        </div>
      </section>

      {/* 1.3 El Problema: La Triple Desconexión */}
      <section className="py-32 px-6 md:px-12 bg-white text-black">
        <div className="max-w-[1400px] mx-auto">
          <Reveal>
            <h2 className="text-5xl md:text-7xl font-medium tracking-tighter leading-none mb-6">
              La forma en la que diseñaron<br />nuestras ciudades nos rompió.
            </h2>
            <p className="text-2xl text-surface-500 mb-20 font-light">El desarrollo tradicional no falló por accidente. Fue diseñado para extraer valor a costa de aislarte.</p>
          </Reveal>

          <div className="grid md:grid-cols-3 gap-12">
            <Reveal delay={0.1}>
              <h3 className="text-xl font-bold mb-4 flex items-center gap-3">
                <span className="w-2 h-2 rounded-full bg-black" /> Desconexión de la Tierra
              </h3>
              <p className="text-surface-600 leading-relaxed font-light">Las casas se construyen arrasando ecosistemas. Consumimos sin saber de dónde viene el agua ni a dónde va la energía. Habitamos cajas desconectadas de la biología.</p>
            </Reveal>
            <Reveal delay={0.2}>
              <h3 className="text-xl font-bold mb-4 flex items-center gap-3">
                <span className="w-2 h-2 rounded-full bg-black" /> Desconexión Humana
              </h3>
              <p className="text-surface-600 leading-relaxed font-light">Te venden "exclusividad" y seguridad privada, pero no conocés a la persona que vive a dos metros tuyos. El aislamiento es la verdadera pandemia urbana.</p>
            </Reveal>
            <Reveal delay={0.3}>
              <h3 className="text-xl font-bold mb-4 flex items-center gap-3">
                <span className="w-2 h-2 rounded-full bg-black" /> Desconexión de las Decisiones
              </h3>
              <p className="text-surface-600 leading-relaxed font-light">Estás atado a administraciones invisibles e ineficientes. No tenés voz real sobre el lugar donde pasás el 80% de tu vida. Callate y pagá las expensas.</p>
            </Reveal>
          </div>
        </div>
      </section>

      {/* 1.4 La Propuesta Counity */}
      <section className="py-32 px-6 md:px-12 border-t border-white/10">
        <div className="max-w-[1400px] mx-auto">
          <div className="grid md:grid-cols-12 gap-12">
            <div className="md:col-span-4">
              <Reveal>
                <h2 className="text-5xl md:text-6xl font-medium tracking-tighter leading-none">
                  Rediseñamos<br />la forma<br />de habitar.
                </h2>
              </Reveal>
            </div>
            <div className="md:col-span-8">
              <div className="grid sm:grid-cols-2 gap-12">
                <Reveal delay={0.1}>
                  <div className="border-t border-white/20 pt-6">
                    <h4 className="text-lg font-medium mb-3">Regeneración Activa</h4>
                    <p className="text-surface-400 font-light">No nos conformamos con ser "sustentables". Construimos para devolverle vitalidad al suelo, cuidar el agua y generar nuestra propia energía.</p>
                  </div>
                </Reveal>
                <Reveal delay={0.2}>
                  <div className="border-t border-white/20 pt-6">
                    <h4 className="text-lg font-medium mb-3">Tejido Social Vivo</h4>
                    <p className="text-surface-400 font-light">Privacidad absoluta de la puerta para adentro; vida compartida e interacción real de la puerta para afuera.</p>
                  </div>
                </Reveal>
                <Reveal delay={0.3}>
                  <div className="border-t border-white/20 pt-6">
                    <h4 className="text-lg font-medium mb-3">Gobernanza Distribuida</h4>
                    <p className="text-surface-400 font-light">A través de nuestra tecnología, el poder y la administración son transparentes, participativos y auditables por quienes habitan la Land.</p>
                  </div>
                </Reveal>
                <Reveal delay={0.4}>
                  <div className="border-t border-white/20 pt-6">
                    <h4 className="text-lg font-medium mb-3">Economía Consciente</h4>
                    <p className="text-surface-400 font-light">Financiamos infraestructura real, no especulación. Y gracias a la interoperabilidad, hoy podés vivir en el bosque y mañana hacer swap para vivir frente al mar.</p>
                  </div>
                </Reveal>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 1.5 Encontrá a tus pares (¿Es para vos?) */}
      <section className="py-32 px-6 md:px-12 bg-[#090909] border-t border-white/10">
        <div className="max-w-[1400px] mx-auto">
          <div className="grid lg:grid-cols-12 gap-12 mb-24">
            <div className="lg:col-span-5">
              <Reveal>
                <span className="text-xs font-mono uppercase tracking-widest text-brand-cyan mb-6 block">Encontrá a tus pares</span>
                <h2 className="text-5xl md:text-7xl font-medium tracking-tighter leading-none mb-8">
                  Esto es para quienes buscan algo diferente.
                </h2>
              </Reveal>
            </div>
            <div className="lg:col-span-6 lg:col-start-7 flex flex-col justify-end">
              <Reveal delay={0.1}>
                <p className="text-xl md:text-2xl text-surface-300 font-light leading-relaxed mb-6">
                  Tal vez lográs la estabilidad que exige el sistema convencional, pero sentís que falta una pieza clave: un entorno donde las personas compartan tu visión del mundo y tu casa sea un refugio real de privacidad.
                </p>
                <p className="text-lg text-surface-400 font-light leading-relaxed mb-6">
                  Diseñamos un punto de equilibrio. Ni el aislamiento frío de un barrio cerrado tradicional, ni la rigidez o el caos organizativo de una ecoaldea. Tu espacio es 100% privado, pero el territorio común se gestiona de forma ágil y transparente para que la convivencia fluya sin fricciones.
                </p>
                <p className="text-lg text-surface-400 font-light leading-relaxed">
                  No te prometemos una utopía perfecta. Te ofrecemos la tecnología y la infraestructura física real para vivir rodeado de afinidad.
                </p>
              </Reveal>
            </div>
          </div>

          <div className="grid md:grid-cols-3 gap-8 mb-20">
            <Reveal delay={0.2}>
              <div className="border border-white/10 p-10 rounded-[2rem] bg-[#0d0d0d] hover:border-brand-cyan/30 transition-colors h-full flex flex-col justify-between">
                <div>
                  <div className="text-xs font-mono text-brand-cyan/60 mb-8">01 / ENTORNO ACTIVO</div>
                  <h3 className="text-2xl font-medium mb-4 text-white">Creadores & Mentes Inquietas</h3>
                  <p className="text-surface-400 font-light leading-relaxed text-base">
                    Personas que trabajan en tecnología, ciencia o arte remoto, que necesitan alta conectividad y silencio absoluto para enfocarse, pero se cansaron de la soledad del aislamiento urbano.
                  </p>
                </div>
              </div>
            </Reveal>
            <Reveal delay={0.3}>
              <div className="border border-white/10 p-10 rounded-[2rem] bg-[#0d0d0d] hover:border-brand-cyan/30 transition-colors h-full flex flex-col justify-between">
                <div>
                  <div className="text-xs font-mono text-brand-cyan/60 mb-8">02 / INTERGENERACIONAL</div>
                  <h3 className="text-2xl font-medium mb-4 text-white">Custodios de la Longevidad</h3>
                  <p className="text-surface-400 font-light leading-relaxed text-base">
                    Adultos activos que planifican sus próximos años buscando un entorno intergeneracional, dinámico, integrado con la naturaleza y enfocado en el cuidado preventivo y el apoyo mutuo.
                  </p>
                </div>
              </div>
            </Reveal>
            <Reveal delay={0.4}>
              <div className="border border-white/10 p-10 rounded-[2rem] bg-[#0d0d0d] hover:border-brand-cyan/30 transition-colors h-full flex flex-col justify-between">
                <div>
                  <div className="text-xs font-mono text-brand-cyan/60 mb-8">03 / INVERSIÓN CONSCIENTE</div>
                  <h3 className="text-2xl font-medium mb-4 text-white">Capital con Sentido</h3>
                  <p className="text-surface-400 font-light leading-relaxed text-base">
                    Quienes tienen los recursos para asegurar su vivienda, pero eligen no alimentar la especulación inmobiliaria tradicional, prefiriendo volcar su capital en infraestructura que regenera el territorio y protege el valor de su esfuerzo.
                  </p>
                </div>
              </div>
            </Reveal>
          </div>

          <div className="border-t border-white/10 pt-16 mb-16">
            <Reveal delay={0.5}>
              <h4 className="text-sm font-mono uppercase tracking-widest text-surface-500 mb-8">
                Tu entorno de afinidad:
              </h4>
              <div className="flex flex-wrap gap-3">
                {[
                  "Amantes de la naturaleza",
                  "Creadores de espacios",
                  "Constructores",
                  "Facilitadores del bienestar",
                  "Trabajadores remotos",
                  "Pensadores sistémicos",
                  "Familias buscando una red",
                  "Almas curiosas"
                ].map((role, i) => (
                  <span 
                    key={i} 
                    className="px-5 py-2.5 rounded-full border border-white/10 bg-white/[0.02] text-sm text-surface-300 font-light hover:border-white/30 hover:bg-white/5 transition-all cursor-default"
                  >
                    {role}
                  </span>
                ))}
              </div>
            </Reveal>
          </div>
          
          <Reveal delay={0.6} className="flex justify-center">
            <button className="bg-white text-black px-10 py-5 rounded-full font-medium hover:bg-surface-200 transition-colors flex items-center gap-3 text-lg">
              Descubrí tu lugar en la red
              <ArrowRight size={20} />
            </button>
          </Reveal>
        </div>
      </section>

      {/* 1.6 Conocé los Modelos (Axis Haus Slider Style) */}
      <section className="py-32 px-6 md:px-12 min-h-screen flex flex-col justify-center border-t border-white/10">
        <div className="max-w-[1400px] mx-auto w-full">
          <div className="mb-16 flex flex-col md:flex-row justify-between items-start md:items-end gap-10">
            <Reveal className="max-w-2xl">
              <h2 className="text-4xl md:text-5xl font-medium tracking-tighter mb-6">
                Lands.
              </h2>
              <p className="text-lg text-surface-400 font-light leading-relaxed">
                Cada Land es un ecosistema físico diseñado para un estilo de vida específico. Al sumarte, no comprás una propiedad tradicional; asegurás tu refugio privado de alta tecnología y te convertís en fundador de una comunidad con infraestructuras compartidas de primer nivel.
              </p>
            </Reveal>
            <Reveal className="flex items-center gap-6 shrink-0">
              <Link to="/lands" className="border border-brand-cyan/50 text-brand-cyan px-6 py-3 rounded-full text-sm font-medium hover:bg-brand-cyan/10 transition-colors flex items-center gap-2">
                Explorar las Lands <ArrowRight size={16} />
              </Link>
            </Reveal>
          </div>

          <div className="grid lg:grid-cols-12 gap-12 lg:gap-24 h-auto lg:h-[600px]">
            {/* Slider Content - Left */}
            <div className="lg:col-span-5 flex flex-col justify-between h-full">
              <AnimatePresence mode="wait">
                <motion.div
                  key={currentModel}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
                  className="flex flex-col h-full"
                >
                  <div className="text-[120px] md:text-[160px] font-light leading-none tracking-tighter text-white mb-2">
                    {`0${currentModel + 1}`}
                  </div>
                  <h3 className="text-4xl md:text-5xl font-medium tracking-tighter mb-4">
                    {lands[currentModel].name}
                  </h3>
                  
                  <div className="text-brand-cyan font-medium mb-6">
                    {lands[currentModel].headline}
                  </div>
                  
                  <div className="grid grid-cols-2 gap-x-8 gap-y-4 border-t border-white/20 pt-6 mb-8">
                    {lands[currentModel].highlights.map((spec, i) => (
                      <div key={i} className="text-sm text-surface-400 font-light flex items-start gap-2">
                        <div className="w-1.5 h-1.5 rounded-full bg-brand-cyan/50 mt-1.5 shrink-0" />
                        <span className="leading-snug">{spec}</span>
                      </div>
                    ))}
                  </div>

                  <p className="text-lg text-surface-300 font-light mb-12 flex-grow">
                    {lands[currentModel].summary}
                  </p>

                  <div>
                    <Link to={`/lands/${lands[currentModel].id}`} className="inline-block border border-white/30 text-white px-8 py-3 rounded-full text-sm font-medium hover:bg-white hover:text-black transition-colors">
                      Explorar Land
                    </Link>
                  </div>
                </motion.div>
              </AnimatePresence>
            </div>

            {/* Slider Image - Right */}
            <div className="lg:col-span-7 h-[400px] lg:h-full relative overflow-hidden rounded-[2rem]">
              <AnimatePresence mode="wait">
                <motion.img
                  key={currentModel}
                  src={lands[currentModel].image}
                  alt={lands[currentModel].name}
                  className="absolute inset-0 w-full h-full object-cover"
                  initial={{ opacity: 0, scale: 1.05 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
                />
              </AnimatePresence>
              <div className="absolute top-6 left-6 flex gap-3">
                <div className="bg-black/50 backdrop-blur-md border border-white/10 px-4 py-2 rounded-full text-xs font-mono uppercase tracking-widest text-white">
                  {lands[currentModel].tag}
                </div>
              </div>
            </div>
          </div>

          {/* Slider Controls */}
          <div className="mt-12 flex items-center justify-between border-t border-white/10 pt-6">
            <div className="text-surface-500 font-mono text-sm tracking-widest">
              {`0${currentModel + 1}`} / 0{lands.length}
            </div>
            <div className="flex gap-4">
              <button 
                onClick={prevModel}
                className="w-12 h-12 rounded-full border border-white/20 flex items-center justify-center hover:bg-white/10 transition-colors"
                aria-label="Previous Project"
              >
                <ArrowLeft size={18} />
              </button>
              <button 
                onClick={nextModel}
                className="w-12 h-12 rounded-full border border-white/20 flex items-center justify-center hover:bg-white/10 transition-colors"
                aria-label="Next Project"
              >
                <ArrowRight size={18} />
              </button>
            </div>
          </div>
        </div>
      </section>

    </div>
  );
};


