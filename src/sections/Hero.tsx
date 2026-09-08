import { CalendarDays, Check, ChevronDown, MessageCircle, MousePointer2, Sparkles } from 'lucide-react';
import LeadCapture from '@/components/LeadCapture';
import LeadCaptureTrigger from '@/components/LeadCaptureTrigger';
import HeroLivePreview from './HeroLivePreview';
import { AdCopy, DEFAULT_COPY, renderCopy } from '@/lib/adCopy';

export default function Hero({ copy = DEFAULT_COPY }: { copy?: AdCopy }) {
  return (
    <section className="cl-hero" id="inicio">
      <div className="cl-hero-stage">
        <div className="cl-hero-objects" aria-hidden="true">
          <div className="cl-folder cl-hero-folder"><div className="cl-folder-sheet" /><div className="cl-folder-front"><CalendarDays size={36} strokeWidth={1.3} /><span>tu agenda</span></div><span className="cl-object-caption">cada paciente, en su lugar.</span></div>
          <div className="cl-paper-note"><span className="cl-note-pin" /><span className="cl-note-eyebrow">UNA COSA MENOS</span><p>Más tiempo<br />para <mark>atender.</mark></p><Check size={22} strokeWidth={1.5} /></div>
          <div className="cl-message-token"><MessageCircle size={25} strokeWidth={1.5} /><span>hola, Clidenta.</span></div>
          <span className="cl-sparkle"><Sparkles size={34} strokeWidth={1.2} /></span>
        </div>
        <div className="cl-hero-copy">
          <div className="cl-eyebrow"><span className="cl-eyebrow-icon"><Sparkles size={13} aria-hidden="true" /></span>{copy.eyebrow} del Perú <span aria-hidden="true">🇵🇪</span></div>
          <h1>{renderCopy(copy.title)}</h1>
          <p className="cl-hero-description">{renderCopy(copy.subtitle, 'cl-copy-highlight')}</p>
          <div className="cl-hero-actions"><LeadCaptureTrigger label={copy.cta} /><a href="#demo" className="cl-button cl-button-silver"><MousePointer2 size={17} aria-hidden="true" /> Probar Clidenta</a></div>
          <p className="cl-hero-caption">Tu consultorio, con todo en su lugar.</p>
          <a href="#demo" className="cl-scroll-cue" aria-label="Bajar a la demo interactiva"><ChevronDown size={19} aria-hidden="true" /></a>
        </div>
      </div>
      <div className="cl-demo-section" id="demo">
        <div className="cl-demo-intro"><span className="cl-section-index">01 / TU CONSULTORIO</span><span>Se ve bien. Se siente mejor al usarlo.</span></div>
        <HeroLivePreview />
      </div>
      <LeadCapture ctaLabel={copy.cta} />
    </section>
  );
}
