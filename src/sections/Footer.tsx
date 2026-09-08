import Image from 'next/image';
import { ArrowUpRight, CalendarDays, Heart, Users } from 'lucide-react';
import LeadCaptureTrigger from '@/components/LeadCaptureTrigger';

export default function Footer() {
  return (
    <footer className="cl-footer">
      <div className="cl-footer-inner">
        <div className="cl-footer-top">
          <div><span className="cl-section-index">EL SIGUIENTE PASO</span><h2>Tu consultorio.<br />Más simple.</h2><p>Descubre cómo Clidenta nuestro sistema puede llevar tu clínica al siguiente nivel</p></div>
          <LeadCaptureTrigger label="Agendar demostración gratis" variant="secondary" />
        </div>
        <nav className="cl-footer-nav" aria-label="Navegación del pie de página"><a href="#inicio">Volver al inicio <ArrowUpRight size={14} aria-hidden="true" /></a><a href="#demo">Explorar Clidenta <ArrowUpRight size={14} aria-hidden="true" /></a><a href="#resenas">Reseñas <ArrowUpRight size={14} aria-hidden="true" /></a></nav>
        <div className="cl-footer-signature">
          <div className="cl-footer-folders" aria-hidden="true"><div className="cl-folder"><div className="cl-folder-sheet" /><div className="cl-folder-front"><Users size={32} strokeWidth={1.3} /></div></div><div className="cl-folder"><div className="cl-folder-sheet" /><div className="cl-folder-front"><CalendarDays size={32} strokeWidth={1.3} /></div></div><div className="cl-folder"><div className="cl-folder-sheet" /><div className="cl-folder-front"><Heart size={32} strokeWidth={1.3} /></div></div></div>
          <Image src="/logo/clidenta-logo.svg" alt="Clidenta" width={785} height={151} className="cl-footer-wordmark" />
        </div>
        <div className="cl-footer-bottom"><p>Rangel Group LLC · Todos los derechos reservados</p><span>Hecho para cuidar tu consultorio.</span></div>
      </div>
    </footer>
  );
}
