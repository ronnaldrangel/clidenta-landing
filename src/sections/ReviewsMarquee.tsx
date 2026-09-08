import Image from 'next/image';
import { ArrowUpRight } from 'lucide-react';

export default function ReviewsMarquee() {
  return (
    <section
      aria-labelledby="reference-heading"
      className="deferred-section bg-background pb-16"
    >
      <div className="max-w-3xl mx-auto px-4">
        <h2
          id="reference-heading"
          className="text-center text-xl md:text-2xl font-serif text-slate-900 font-semibold mb-8"
        >
          Más orden en tus pacientes. Más tiempo para atenderlos.
        </h2>

        <p className="text-slate-600 text-base md:text-lg leading-relaxed mb-6 font-sans text-center">
          Con Clidenta puedes organizar tus pacientes y citas, gestionar los
          mensajes y dar seguimiento a cada consulta. Los recordatorios te ayudan
          a mantener la agenda al día y dedicar más tiempo a la atención en el
          consultorio.
        </p>

        <article className="bg-white border border-border rounded-2xl p-6 md:p-8 shadow-sm">
          <p className="text-xs font-medium uppercase tracking-wider text-slate-500 mb-5">
            Perfil profesional
          </p>
          <div className="flex items-start gap-4">
            <Image
              src="/reviews/karen-armas.jpg"
              alt="Foto del perfil de Instagram de la Dra. Karen Armas"
              width={150}
              height={150}
              sizes="(min-width: 768px) 80px, 64px"
              className="w-16 h-16 md:w-20 md:h-20 rounded-full shrink-0 object-cover border border-border"
            />
            <div>
              <h3 className="font-serif font-semibold text-lg text-slate-900">
                Dra. Karen Armas
              </h3>
              <p className="text-sm text-primary font-medium mt-1">
                Odontólogo · Ortodoncia · Ortopedia Maxilar
              </p>
              <a
                href="https://www.instagram.com/indentatrujillo/"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 mt-3 text-sm text-slate-600 underline underline-offset-4 hover:text-primary focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-primary"
              >
                @indentatrujillo
                <ArrowUpRight size={16} aria-hidden="true" />
                <span className="sr-only"> (abre en una pestaña nueva)</span>
              </a>
            </div>
          </div>
        </article>
      </div>
    </section>
  );
}
