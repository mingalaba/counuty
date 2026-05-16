import { Link } from "react-router-dom";

export const Footer = () => {
  return (
    <footer className="bg-surface-100 border-t border-surface-200 py-16">
      <div className="container mx-auto px-6 md:px-12 grid grid-cols-1 md:grid-cols-4 gap-12">
        <div className="md:col-span-1">
          <span className="font-bold text-2xl tracking-tight text-text-primary">Counity<span className="text-brand-cyan">Lands</span></span>
          <p className="mt-4 text-text-secondary text-sm">
            Rediseñamos la forma de habitar el mundo. Espacios vivos, tejido social y gobernanza participativa.
          </p>
        </div>
        
        <div>
          <h4 className="font-semibold text-text-primary mb-4">Para Exploradores</h4>
          <ul className="space-y-3">
            <li><Link to="#lands" className="text-sm text-text-secondary hover:text-brand-cyan transition-colors">Las Lands</Link></li>
            <li><Link to="/match" className="text-sm text-text-secondary hover:text-brand-cyan transition-colors">Match Test</Link></li>
            <li><Link to="#postular" className="text-sm text-text-secondary hover:text-brand-cyan transition-colors">Postular Tierra</Link></li>
          </ul>
        </div>
        
        <div>
          <h4 className="font-semibold text-text-primary mb-4">El Modelo (Deep Dive)</h4>
          <ul className="space-y-3">
            <li><Link to="#manifiesto" className="text-sm text-text-secondary hover:text-brand-cyan transition-colors">El Manifiesto</Link></li>
            <li><Link to="#swap" className="text-sm text-text-secondary hover:text-brand-cyan transition-colors">Intercambio (Swap)</Link></li>
            <li><Link to="#gobernanza" className="text-sm text-text-secondary hover:text-brand-cyan transition-colors">Gobernanza</Link></li>
            <li><Link to="#foundation" className="text-sm text-text-secondary hover:text-brand-cyan transition-colors">Counity Foundation</Link></li>
          </ul>
        </div>

        <div>
          <h4 className="font-semibold text-text-primary mb-4">Soporte</h4>
          <ul className="space-y-3">
            <li><Link to="#faq" className="text-sm text-text-secondary hover:text-brand-cyan transition-colors">FAQ</Link></li>
            <li><a href="mailto:hello@counity.com" className="text-sm text-text-secondary hover:text-brand-cyan transition-colors">Contacto</a></li>
          </ul>
        </div>
      </div>
      
      <div className="container mx-auto px-6 md:px-12 mt-16 pt-8 border-t border-surface-200 flex flex-col md:flex-row justify-between items-center gap-4">
        <p className="text-xs text-text-tertiary">© {new Date().getFullYear()} Counity Lands. Todos los derechos reservados.</p>
        <div className="flex gap-4">
          <Link to="#terms" className="text-xs text-text-tertiary hover:text-text-primary">Términos y Condiciones</Link>
          <Link to="#privacy" className="text-xs text-text-tertiary hover:text-text-primary">Privacidad</Link>
        </div>
      </div>
    </footer>
  );
};
