import Image from 'next/image';
import { ArrowUpRight, Quote } from 'lucide-react';

const examples = [
  { name: 'Dra. Valeria Ríos', initials: 'VR', specialty: 'Odontología general', quote: 'Entre una consulta y otra, necesito ver rápido quién sigue y qué tratamiento tiene. Tenerlo en una sola agenda hace más simple organizar el día.', color: 'sage' },
  { name: 'Dr. Mateo Salazar', initials: 'MS', specialty: 'Ortodoncia', quote: 'En los controles de ortodoncia, el seguimiento es parte del trabajo. Me resulta práctico tener las próximas citas y los recordatorios en el mismo lugar.', color: 'sand' },
  { name: 'Dra. Camila Torres', initials: 'CT', specialty: 'Rehabilitación oral', quote: 'Cuando recepción y el consultorio trabajan con la misma información, coordinarnos es más fácil. Eso es lo que busco en una herramienta para mi práctica.', color: 'blue' },
];

export default function ReviewsMarquee() {
  return (
    <section id="resenas" aria-labelledby="reviews-heading" className="reviews-section">
      <div className="reviews-container">
        <div className="reviews-heading">
          <span className="cl-section-index">02 / RESEÑAS</span>
          <h2 id="reviews-heading">Lo que opinan los profesionales.</h2>
          <p>Más orden en tu consultorio.<br className="sm:hidden" /> Más tiempo para tus pacientes.</p>
        </div>
        <div className="reviews-grid">
          <article className="review-card review-profile">
            <div className="cl-review-window-bar"><span className="demo-window-lights" aria-hidden="true"><i /><i /><i /></span><span>Perfil profesional</span></div>
            <div className="review-card-label">PERFIL PROFESIONAL</div>
            <div className="review-profile-intro">
              <Image src="/reviews/karen-armas.jpg" alt="Dra. Karen Armas" width={80} height={80} sizes="80px" className="review-profile-photo" />
              <div><h3>Dra. Karen Armas</h3><p>Odontología · Ortodoncia<br />Ortopedia maxilar</p></div>
            </div>
            <p className="review-profile-description">Conoce su práctica y su trabajo en el cuidado de la sonrisa.</p>
            <a href="https://www.instagram.com/indentatrujillo/" target="_blank" rel="noopener noreferrer" className="review-profile-link">@indentatrujillo <ArrowUpRight size={16} aria-hidden="true" /><span className="sr-only"> (abre en una pestaña nueva)</span></a>
          </article>
          {examples.map(example => (
            <article key={example.name} className={`review-card cl-review-${example.color}`}>
              <div className="cl-review-window-bar"><span className="demo-window-lights" aria-hidden="true"><i /><i /><i /></span><span>Notas del consultorio</span></div>
              <div className="review-topline"><Quote size={23} strokeWidth={1.4} aria-hidden="true" /></div>
              <blockquote>“{example.quote}”</blockquote>
              <div className="review-author"><div className={`review-avatar review-avatar-${example.color}`} aria-hidden="true">{example.initials}</div><div><h3>{example.name}</h3><p>{example.specialty}</p></div></div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
