import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Button } from "../ui/Button";
import { Menu, X } from "lucide-react";
import { cn } from "../../lib/utils";

export const Navbar = () => {
  const [scrolled, setScrolled] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <header
      className={cn(
        "fixed top-0 left-0 right-0 z-50 transition-all duration-300",
        scrolled ? "bg-white/80 backdrop-blur-md shadow-sm py-4 border-b border-surface-200" : "bg-transparent py-6"
      )}
    >
      <div className="container mx-auto px-6 md:px-12 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2">
          <img src="/assets/logo.png" alt="Counity Lands" className="h-6 md:h-8" />
        </Link>

        {/* Desktop Menu */}
        <nav className="hidden md:flex items-center gap-8">
          <Link to="/lands" className="text-sm font-medium text-text-secondary hover:text-text-primary transition-colors">Las Lands</Link>
          <Link to="/match" className="text-sm font-medium text-text-secondary hover:text-text-primary transition-colors">Match Test</Link>
          <Link to="#vida" className="text-sm font-medium text-text-secondary hover:text-text-primary transition-colors">La Vida Regenerativa</Link>
          <Button variant="primary" size="sm">Postular Tierra / Idea</Button>
        </nav>

        {/* Mobile Toggle */}
        <button className="md:hidden text-text-primary" onClick={() => setIsOpen(!isOpen)}>
          {isOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="md:hidden absolute top-full left-0 right-0 bg-white shadow-lg border-t border-surface-200 p-6 flex flex-col gap-4">
          <Link to="/lands" className="text-base font-medium text-text-secondary">Las Lands</Link>
          <Link to="/match" className="text-base font-medium text-text-secondary">Match Test</Link>
          <Link to="#vida" className="text-base font-medium text-text-secondary">La Vida Regenerativa</Link>
          <Button variant="primary" className="w-full mt-4">Postular Tierra / Idea</Button>
        </div>
      )}
    </header>
  );
};
