import Logo from './Logo';
import LeadCaptureTrigger from './LeadCaptureTrigger';

export default function LandingHeader() {
  return (
    <header className="cl-header">
      <div className="cl-header-inner">
        <a href="#inicio" aria-label="Clidenta, ir al inicio" className="cl-header-logo"><Logo /></a>
        <nav className="cl-header-nav" aria-label="Navegación principal">
          <a href="#demo">Explorar la demo</a>
          <a href="#resenas">Reseñas</a>
        </nav>
        <LeadCaptureTrigger label="Agendar demo" variant="compact" />
      </div>
    </header>
  );
}
