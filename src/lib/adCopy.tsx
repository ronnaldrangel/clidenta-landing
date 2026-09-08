import type { ReactNode } from 'react';

/**
 * Copy dinámico por anuncio.
 *
 * La landing lee `?ad=<slug>` (o `utm_content`) de la URL del anuncio y
 * renderiza el copy del Hero que corresponde a ese anuncio, para que el
 * visitante aterrice en el mismo mensaje que acaba de ver en Meta.
 *
 * Los variants se crean y editan desde el panel admin (página Anuncios);
 * el backend los sirve en GET /public/landing/copy?ad=<slug>.
 *
 * Marcado ligero dentro de los textos:
 *   *texto*  → resaltado en color primary
 *   _texto_  → resaltado primary sin salto de línea (para el término clave)
 *
 * URL a pegar en el anuncio de Meta (campo "Parámetros de URL"):
 *   ad=<slug>&utm_source=facebook&utm_medium=paid&utm_content={{ad.name}}
 */

export type AdCopy = {
  /** Texto de la ficha roja superior; el Hero agrega el mercado objetivo. */
  eyebrow: string;
  title: string;
  subtitle: string;
  cta: string;
};

export const DEFAULT_COPY: AdCopy = {
  eyebrow: 'Atención odontólogos',
  title:
    'Aumenta la facturación de tu Clínica Dental *hasta un 60%* con una _Recepcionista IA_',
  subtitle:
    'Atiende tu WhatsApp 24/7, agenda citas sola y llega con tu clínica completa.',
  cta: 'Agendar demostración gratis',
};

/** Backend que sirve los copys creados desde el panel admin. */
const COPY_API_URL =
  process.env.LANDING_COPY_API_URL || 'https://api.clidenta.net';

/**
 * Trae el copy de un anuncio por slug, consultando el backend (server-side,
 * cache 60s). Cualquier fallo → copy por defecto: la landing nunca se cae por
 * culpa del API. La extracción del slug desde la URL vive en el middleware,
 * que reescribe /?ad=<slug> a /a/<slug>.
 */
export async function fetchAdCopy(slug: string): Promise<AdCopy> {
  try {
    const res = await fetch(
      `${COPY_API_URL}/public/landing/copy?ad=${encodeURIComponent(slug)}`,
      { next: { revalidate: 60 }, signal: AbortSignal.timeout(1500) },
    );
    if (!res.ok) return DEFAULT_COPY;
    const data = (await res.json()) as { copy: AdCopy | null };
    return data.copy ?? DEFAULT_COPY;
  } catch {
    return DEFAULT_COPY;
  }
}

/**
 * Convierte el marcado ligero en nodos React.
 * `highlightClass` estiliza *texto*; `_texto_` añade además el subrayado.
 */
export function renderCopy(
  text: string,
  highlightClass = 'text-primary',
): ReactNode[] {
  return text.split(/(\*[^*]+\*|_[^_]+_)/g).map((part, i) => {
    if (part.startsWith('*') && part.endsWith('*')) {
      return (
        <span key={i} className={highlightClass}>
          {part.slice(1, -1)}
        </span>
      );
    }
    if (part.startsWith('_') && part.endsWith('_')) {
      return (
        <span key={i} className="whitespace-nowrap text-primary">
          {part.slice(1, -1)}
        </span>
      );
    }
    return part;
  });
}
