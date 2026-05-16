import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowRight, ArrowLeft, Check, Loader2 } from "lucide-react";
import { matchQuestions } from "../data/matchQuestions";
import type { MatchOption } from "../data/matchQuestions";
import { lands } from "../data/lands";

export const MatchTest = () => {
  // -1: Intro, 0-5: Preguntas, 6: Lead Capture, 7: Loading, 8: Resultado
  const [step, setStep] = useState(-1);
  const [answers, setAnswers] = useState<Record<number, MatchOption>>({});
  const [winningLandId, setWinningLandId] = useState<string | null>(null);

  // Form state
  const [formData, setFormData] = useState({ name: "", email: "", phone: "" });

  const handleOptionSelect = (option: MatchOption) => {
    setAnswers({ ...answers, [step]: option });
    setTimeout(() => {
      setStep(step + 1);
    }, 400); // Pequeño delay para ver la selección
  };

  const calculateMatch = () => {
    const scores: Record<string, number> = {
      "hub-innovacion": 0,
      "costa-olas": 0,
      "campo-soberania": 0,
      "longevidad-salud": 0,
    };

    // Solo puntuamos la Q1 y Q2
    [0, 1].forEach((qIndex) => {
      const answer = answers[qIndex];
      if (answer && answer.pointsTo && scores[answer.pointsTo] !== undefined) {
        scores[answer.pointsTo] += 1;
      }
    });

    // Encontrar el mayor puntaje
    let maxScore = -1;
    let winner = "hub-innovacion"; // Default fallback

    for (const [landId, score] of Object.entries(scores)) {
      if (score > maxScore) {
        maxScore = score;
        winner = landId;
      }
    }

    setWinningLandId(winner);
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.email) return;

    // Calcular land antes de pasar al loading
    calculateMatch();
    setStep(7); // Loading
  };

  // Simular tiempo de cálculo
  useEffect(() => {
    if (step === 7) {
      const timer = setTimeout(() => {
        setStep(8); // Resultado
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [step]);

  const currentQuestion = step >= 0 && step < matchQuestions.length ? matchQuestions[step] : null;
  const winningLand = lands.find((l) => l.id === winningLandId);

  // Generar mensaje personalizado basado en las respuestas
  const getPersonalizedMessage = () => {
    if (!winningLand) return "";
    const q1Ans = answers[0]?.text.toLowerCase().replace(".", "");
    const q2Ans = answers[1]?.text.toLowerCase().replace(".", "");
    
    return `Tu perfil encaja perfectamente con ${winningLand.name} porque priorizás "${q1Ans}" y te imaginás "${q2Ans}". El nivel de inversión que buscás se ajusta a este ecosistema.`;
  };

  return (
    <div className="min-h-screen bg-[#050505] text-white flex flex-col font-sans selection:bg-brand-cyan/30">
      {/* Barra de progreso superior */}
      {step >= 0 && step < 6 && (
        <div className="absolute top-0 left-0 right-0 h-1 bg-zinc-800 z-50">
          <motion.div
            className="h-full bg-brand-cyan"
            initial={{ width: 0 }}
            animate={{ width: `${((step) / matchQuestions.length) * 100}%` }}
            transition={{ duration: 0.5 }}
          />
        </div>
      )}

      {/* Botón de retroceso o salida */}
      <div className="absolute top-8 left-6 md:left-12 z-40">
        {step > -1 && step < 7 ? (
          <button
            onClick={() => setStep(step - 1)}
            className="text-surface-400 hover:text-white transition-colors flex items-center gap-2 text-sm uppercase tracking-widest font-mono"
          >
            <ArrowLeft size={16} /> Volver
          </button>
        ) : (
          <Link
            to="/"
            className="text-surface-400 hover:text-white transition-colors flex items-center gap-2 text-sm uppercase tracking-widest font-mono"
          >
            <ArrowLeft size={16} /> Inicio
          </Link>
        )}
      </div>

      <div className="flex-grow flex items-center justify-center p-6 md:p-12 relative overflow-hidden">
        
        {/* Decorative ambient light */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-brand-cyan/5 rounded-full blur-[120px] pointer-events-none" />

        <AnimatePresence mode="wait">
          {/* PASO -1: INTRO */}
          {step === -1 && (
            <motion.div
              key="intro"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.6 }}
              className="max-w-2xl w-full text-center relative z-10"
            >
              <span className="text-brand-cyan text-sm tracking-[0.2em] uppercase font-mono mb-6 block">
                Counity Match Test
              </span>
              <h1 className="text-5xl md:text-7xl font-medium tracking-tighter mb-8 leading-tight">
                Encontrá a tus pares.
              </h1>
              <p className="text-xl text-surface-400 font-light leading-relaxed mb-12">
                No tenés que analizar todas las opciones. Respondé 6 preguntas rápidas sobre tu estilo de vida y te diremos en qué nodo de nuestra red encajás perfectamente.
              </p>
              <button
                onClick={() => setStep(0)}
                className="bg-white text-black px-10 py-4 rounded-full text-lg font-medium hover:bg-brand-cyan hover:text-white transition-all duration-300 flex items-center gap-3 mx-auto"
              >
                Comenzar el Test <ArrowRight size={20} />
              </button>
            </motion.div>
          )}

          {/* PASOS 0-5: PREGUNTAS */}
          {step >= 0 && step < 6 && currentQuestion && (
            <motion.div
              key={`q-${step}`}
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -50 }}
              transition={{ duration: 0.5, ease: "easeOut" }}
              className="max-w-3xl w-full relative z-10"
            >
              <span className="text-brand-cyan text-sm tracking-[0.2em] uppercase font-mono mb-6 block">
                Paso 0{step + 1} / 06
              </span>
              <h2 className="text-3xl md:text-5xl font-medium tracking-tighter mb-4 leading-tight">
                {currentQuestion.title}
              </h2>
              {currentQuestion.subtitle && (
                <p className="text-lg text-surface-400 font-light mb-12">
                  {currentQuestion.subtitle}
                </p>
              )}

              <div className="flex flex-col gap-4">
                {currentQuestion.options.map((option) => {
                  const isSelected = answers[step]?.id === option.id;
                  return (
                    <button
                      key={option.id}
                      onClick={() => handleOptionSelect(option)}
                      className={`text-left p-6 md:p-8 rounded-2xl border transition-all duration-300 flex justify-between items-center group backdrop-blur-md ${
                        isSelected
                          ? "bg-brand-cyan/20 border-brand-cyan text-white"
                          : "bg-zinc-900/50 border-white/10 text-surface-300 hover:bg-zinc-800 hover:border-white/30 hover:text-white"
                      }`}
                    >
                      <span className="text-lg md:text-xl font-light pr-8">{option.text}</span>
                      <div
                        className={`w-6 h-6 rounded-full border flex items-center justify-center shrink-0 transition-colors ${
                          isSelected ? "bg-brand-cyan border-brand-cyan text-black" : "border-zinc-700 group-hover:border-white text-transparent"
                        }`}
                      >
                        <Check size={14} />
                      </div>
                    </button>
                  );
                })}
              </div>
            </motion.div>
          )}

          {/* PASO 6: CAPTURA DE DATOS */}
          {step === 6 && (
            <motion.div
              key="capture"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.6 }}
              className="max-w-xl w-full relative z-10"
            >
              <div className="text-center mb-12">
                <span className="text-brand-cyan text-sm tracking-[0.2em] uppercase font-mono mb-4 block">
                  Análisis completado
                </span>
                <h2 className="text-4xl md:text-5xl font-medium tracking-tighter mb-4">
                  Encontramos tu entorno de afinidad.
                </h2>
                <p className="text-surface-400 font-light text-lg">
                  Ingresá tus datos para descubrir tu Land ideal y guardar los resultados.
                </p>
              </div>

              <form onSubmit={handleFormSubmit} className="space-y-6">
                <div>
                  <label className="block text-sm text-surface-400 mb-2 font-mono uppercase tracking-wider">Nombre Completo</label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full bg-zinc-900 border border-white/10 rounded-xl p-4 text-white placeholder-zinc-500 focus:outline-none focus:border-brand-cyan focus:bg-zinc-900 transition-colors"
                    placeholder="Ej. Martín Pérez"
                  />
                </div>
                <div>
                  <label className="block text-sm text-surface-400 mb-2 font-mono uppercase tracking-wider">Email</label>
                  <input
                    type="email"
                    required
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full bg-zinc-900 border border-white/10 rounded-xl p-4 text-white placeholder-zinc-500 focus:outline-none focus:border-brand-cyan focus:bg-zinc-900 transition-colors"
                    placeholder="tu@email.com"
                  />
                </div>
                <div>
                  <label className="block text-sm text-surface-400 mb-2 font-mono uppercase tracking-wider">Teléfono (Opcional)</label>
                  <input
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className="w-full bg-zinc-900 border border-white/10 rounded-xl p-4 text-white placeholder-zinc-500 focus:outline-none focus:border-brand-cyan focus:bg-zinc-900 transition-colors"
                    placeholder="+54 9 11..."
                  />
                </div>
                
                <button
                  type="submit"
                  className="w-full bg-white text-black py-4 rounded-xl font-medium text-lg hover:bg-brand-cyan hover:text-white transition-all flex items-center justify-center gap-2 mt-8"
                >
                  Ver mi Land ideal <ArrowRight size={20} />
                </button>
              </form>
            </motion.div>
          )}

          {/* PASO 7: LOADING */}
          {step === 7 && (
            <motion.div
              key="loading"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex flex-col items-center justify-center text-center relative z-10"
            >
              <Loader2 className="w-16 h-16 text-brand-cyan animate-spin mb-8" />
              <h2 className="text-3xl font-medium tracking-tighter mb-4">Calculando tu Match...</h2>
              <p className="text-surface-400 font-mono text-sm tracking-widest uppercase">Procesando respuestas</p>
            </motion.div>
          )}

          {/* PASO 8: RESULTADO */}
          {step === 8 && winningLand && (
            <motion.div
              key="result"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8, ease: "easeOut" }}
              className="max-w-4xl w-full relative z-10"
            >
              <div className="grid md:grid-cols-2 gap-12 items-center bg-zinc-900/30 p-8 md:p-12 rounded-3xl border border-white/10 backdrop-blur-xl">
                <div>
                  <span className="text-brand-cyan text-sm tracking-[0.2em] uppercase font-mono mb-4 block">
                    Match 100%
                  </span>
                  <h2 className="text-4xl md:text-6xl font-medium tracking-tighter mb-6">
                    {winningLand.name}
                  </h2>
                  <p className="text-lg text-surface-300 font-light leading-relaxed mb-8">
                    {getPersonalizedMessage()}
                  </p>
                  <p className="text-surface-400 text-sm mb-10 italic">
                    "No te prometemos una utopía perfecta. Te ofrecemos la tecnología y la infraestructura física real para vivir rodeado de afinidad."
                  </p>
                  <Link
                    to={`/lands/${winningLand.id}`}
                    className="inline-flex bg-brand-cyan text-black px-8 py-4 rounded-full font-medium hover:bg-white transition-colors items-center gap-3"
                  >
                    Explorar esta Land a fondo <ArrowRight size={20} />
                  </Link>
                </div>
                
                <div className="relative aspect-square rounded-2xl overflow-hidden border border-white/10">
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent z-10" />
                  <img 
                    src={winningLand.image} 
                    alt={winningLand.name}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute bottom-6 left-6 z-20">
                    <p className="text-sm font-mono uppercase tracking-widest text-brand-cyan mb-1">{winningLand.location}</p>
                    <p className="text-white text-sm opacity-80">{winningLand.highlights[0]}</p>
                  </div>
                </div>
              </div>
            </motion.div>
          )}

        </AnimatePresence>
      </div>
    </div>
  );
};
