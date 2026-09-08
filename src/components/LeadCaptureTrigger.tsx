import { ArrowRight } from "lucide-react";

const FALLBACK_WHATSAPP = "51920789569";
const FALLBACK_MESSAGE = encodeURIComponent(
  "Hola, quiero agendar una demostración gratuita de Clidenta.",
);

/**
 * CTA renderizado por el servidor. Si JavaScript todavía no cargó o falla,
 * conserva una salida funcional hacia WhatsApp; LeadCapture intercepta el
 * clic cuando está hidratado y abre el formulario sin abandonar la página.
 */
export default function LeadCaptureTrigger({ label, variant = "primary" }: { label: string; variant?: "primary" | "compact" | "secondary" }) {
  return (
    <a
      href={`https://wa.me/${FALLBACK_WHATSAPP}?text=${FALLBACK_MESSAGE}`}
      target="_blank"
      rel="noopener noreferrer"
      data-lead-form-trigger={variant === "primary" ? "primary" : "secondary"}
      data-cta="lead-form"
      data-cta-label={label}
      className={`cl-button cl-button-aqua ${variant === "compact" ? "cl-button-compact" : ""}`}
    >
      {label}
      <ArrowRight aria-hidden="true" size={19} />
    </a>
  );
}
