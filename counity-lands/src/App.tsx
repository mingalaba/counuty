import { BrowserRouter as Router, Routes, Route, Outlet } from "react-router-dom";
import { Navbar } from "./components/layout/Navbar";
import { Footer } from "./components/layout/Footer";
import { Home } from "./pages/Home";
import { Marketplace } from "./pages/Marketplace";
import { LandDetail } from "./pages/LandDetail";
import { MatchTest } from "./pages/MatchTest";
import { ScrollToTop } from "./components/layout/ScrollToTop";

// Layout principal que incluye Navbar y Footer
function MainLayout() {
  return (
    <div className="min-h-screen flex flex-col font-sans text-text-primary bg-surface-50 selection:bg-brand-cyan/30">
      <Navbar />
      <main className="flex-grow">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
}

function App() {
  return (
    <Router>
      <ScrollToTop />
      <Routes>
        {/* Rutas con Navbar y Footer */}
        <Route element={<MainLayout />}>
          <Route path="/" element={<Home />} />
          <Route path="/lands" element={<Marketplace />} />
          <Route path="/lands/:id" element={<LandDetail />} />
        </Route>
        
        {/* Rutas a pantalla completa (sin Navbar/Footer) */}
        <Route path="/match" element={<MatchTest />} />
      </Routes>
    </Router>
  );
}

export default App;
