"use client";

import {
  FocusEvent,
  FormEvent,
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";
import { ArrowLeft, ArrowRight, Check, Loader2 } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";
import { captureAnalyticsEvent } from "@/instrumentation-client";
import { trackMetaLead } from "@/lib/metaPixel";

import {
  BUDGET_OPTIONS,
  BUDGET_QUESTION,
  CLINIC_NAME_QUESTION,
  PATIENT_CHALLENGE_OPTIONS,
  PATIENT_CHALLENGES_QUESTION,
  PATIENT_VOLUME_OPTIONS,
  PATIENT_VOLUME_QUESTION,
  type Budget,
  type PatientChallenge,
  type PatientVolume,
} from "@/lib/leadQuestions";

type Step = 1 | 2 | 3 | 4 | 5 | 6;
const QUESTION_COUNT = 5;

const FALLBACK_WHATSAPP = "51920789569";

const COUNTRY_OPTIONS = [
  {
    iso: "PE",
    name: "Perú",
    flag: "🇵🇪",
    dialCode: "+51",
    placeholder: "920 789 569",
  },
  {
    iso: "MX",
    name: "México",
    flag: "🇲🇽",
    dialCode: "+52",
    placeholder: "55 1234 5678",
  },
  {
    iso: "CO",
    name: "Colombia",
    flag: "🇨🇴",
    dialCode: "+57",
    placeholder: "300 123 4567",
  },
  {
    iso: "EC",
    name: "Ecuador",
    flag: "🇪🇨",
    dialCode: "+593",
    placeholder: "99 123 4567",
  },
  {
    iso: "CL",
    name: "Chile",
    flag: "🇨🇱",
    dialCode: "+56",
    placeholder: "9 1234 5678",
  },
  {
    iso: "AR",
    name: "Argentina",
    flag: "🇦🇷",
    dialCode: "+54",
    placeholder: "11 1234 5678",
  },
  {
    iso: "BO",
    name: "Bolivia",
    flag: "🇧🇴",
    dialCode: "+591",
    placeholder: "7123 4567",
  },
  {
    iso: "BR",
    name: "Brasil",
    flag: "🇧🇷",
    dialCode: "+55",
    placeholder: "11 91234 5678",
  },
  {
    iso: "CR",
    name: "Costa Rica",
    flag: "🇨🇷",
    dialCode: "+506",
    placeholder: "8888 8888",
  },
  {
    iso: "PA",
    name: "Panamá",
    flag: "🇵🇦",
    dialCode: "+507",
    placeholder: "6123 4567",
  },
  {
    iso: "DO",
    name: "Rep. Dominicana",
    flag: "🇩🇴",
    dialCode: "+1",
    placeholder: "809 123 4567",
  },
  {
    iso: "GT",
    name: "Guatemala",
    flag: "🇬🇹",
    dialCode: "+502",
    placeholder: "5123 4567",
  },
  {
    iso: "HN",
    name: "Honduras",
    flag: "🇭🇳",
    dialCode: "+504",
    placeholder: "9123 4567",
  },
  {
    iso: "SV",
    name: "El Salvador",
    flag: "🇸🇻",
    dialCode: "+503",
    placeholder: "7123 4567",
  },
  {
    iso: "NI",
    name: "Nicaragua",
    flag: "🇳🇮",
    dialCode: "+505",
    placeholder: "8123 4567",
  },
  {
    iso: "PY",
    name: "Paraguay",
    flag: "🇵🇾",
    dialCode: "+595",
    placeholder: "981 123456",
  },
  {
    iso: "UY",
    name: "Uruguay",
    flag: "🇺🇾",
    dialCode: "+598",
    placeholder: "99 123 456",
  },
  {
    iso: "VE",
    name: "Venezuela",
    flag: "🇻🇪",
    dialCode: "+58",
    placeholder: "412 123 4567",
  },
  {
    iso: "US",
    name: "EE. UU. / Canadá",
    flag: "🇺🇸",
    dialCode: "+1",
    placeholder: "305 123 4567",
  },
  {
    iso: "ES",
    name: "España",
    flag: "🇪🇸",
    dialCode: "+34",
    placeholder: "612 345 678",
  },
] as const;

function makeSubmissionId() {
  if (typeof crypto !== "undefined" && "randomUUID" in crypto) {
    return crypto.randomUUID();
  }
  return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(
    /[xy]/g,
    (character) => {
      const random = Math.floor(Math.random() * 16);
      const value = character === "x" ? random : (random & 0x3) | 0x8;
      return value.toString(16);
    },
  );
}

function normalizeNationalPhone(value: string, dialCode: string) {
  let digits = value.replace(/\D/g, "");
  const dialDigits = dialCode.replace(/\D/g, "");
  const maxLength = 15 - dialDigits.length;

  if (digits.startsWith(dialDigits) && digits.length > maxLength) {
    digits = digits.slice(dialDigits.length);
  }

  return digits.slice(0, maxLength);
}

function trackingData() {
  const params = new URLSearchParams(window.location.search);
  const pick = (key: string, max: number) =>
    params.get(key)?.slice(0, max) || undefined;
  return {
    landingVariantSlug: (
      pick("ad", 60) ||
      pick("v", 60) ||
      pick("utm_content", 60)
    )?.toLowerCase(),
    landingPath: `${window.location.pathname}${window.location.search}`.slice(
      0,
      300,
    ),
    referrer: document.referrer.slice(0, 500) || undefined,
    utmSource: pick("utm_source", 200),
    utmMedium: pick("utm_medium", 200),
    utmCampaign: pick("utm_campaign", 300),
    utmTerm: pick("utm_term", 300),
    utmContent: pick("utm_content", 300),
    utmId: pick("utm_id", 200),
    fbclid: pick("fbclid", 500),
  };
}

export default function LeadCapture({ ctaLabel }: { ctaLabel: string }) {
  const [open, setOpen] = useState(false);
  const [step, setStep] = useState<Step>(1);
  const [fullName, setFullName] = useState("");
  const [countryIso, setCountryIso] = useState("PE");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [patientVolume, setPatientVolume] = useState<PatientVolume | null>(
    null,
  );
  const [patientChallenges, setPatientChallenges] = useState<
    PatientChallenge[]
  >([]);
  const [clinicName, setClinicName] = useState("");
  const questionTitle = useRef<HTMLHeadingElement>(null);
  const formTrigger = useRef<HTMLElement | null>(null);
  const questionBody = useRef<HTMLDivElement>(null);
  const [budget, setBudget] = useState<Budget | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [visualViewport, setVisualViewport] = useState<{
    height: number;
    offsetTop: number;
  } | null>(null);
  const submissionId = useRef<string | null>(null);
  const [isPrimaryCtaVisible, setIsPrimaryCtaVisible] = useState(true);
  const selectedCountry =
    COUNTRY_OPTIONS.find((country) => country.iso === countryIso) ??
    COUNTRY_OPTIONS[0];
  const phoneE164 = `${selectedCountry.dialCode}${phone}`;

  useEffect(() => {
    const primaryCta = document.querySelector<HTMLElement>(
      '[data-lead-form-trigger="primary"]',
    );
    if (!primaryCta) return;

    const observer = new IntersectionObserver(([entry]) => {
      setIsPrimaryCtaVisible(entry.isIntersecting);
    });

    observer.observe(primaryCta);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!open || !window.visualViewport) {
      setVisualViewport(null);
      return;
    }

    const viewport = window.visualViewport;
    const mobileQuery = window.matchMedia("(max-width: 639px)");
    const updateViewport = () => {
      if (!mobileQuery.matches) {
        setVisualViewport(null);
        return;
      }

      setVisualViewport({
        height: Math.max(240, Math.floor(viewport.height)),
        offsetTop: Math.max(0, Math.floor(viewport.offsetTop)),
      });
    };

    updateViewport();
    viewport.addEventListener("resize", updateViewport);
    viewport.addEventListener("scroll", updateViewport);
    mobileQuery.addEventListener("change", updateViewport);

    return () => {
      viewport.removeEventListener("resize", updateViewport);
      viewport.removeEventListener("scroll", updateViewport);
      mobileQuery.removeEventListener("change", updateViewport);
    };
  }, [open]);

  useEffect(() => {
    const controller = new AbortController();

    async function detectCountry() {
      try {
        const response = await fetch("/api/country", {
          cache: "no-store",
          signal: controller.signal,
        });
        if (!response.ok) return;

        const payload = (await response.json()) as { countryIso?: string };
        if (
          payload.countryIso &&
          COUNTRY_OPTIONS.some((country) => country.iso === payload.countryIso)
        ) {
          setCountryIso(payload.countryIso);
        }
      } catch (countryError) {
        if (
          countryError instanceof DOMException &&
          countryError.name === "AbortError"
        ) {
          return;
        }
      }
    }

    void detectCountry();
    return () => controller.abort();
  }, []);

  const reset = useCallback(() => {
    setStep(1);
    setFullName("");
    setCountryIso("PE");
    setPhone("");
    setEmail("");
    setPatientVolume(null);
    setPatientChallenges([]);
    setClinicName("");
    setBudget(null);
    setError(null);
    setSubmitting(false);
    submissionId.current = null;
  }, []);

  function handleOpenChange(nextOpen: boolean) {
    setOpen(nextOpen);
    if (!nextOpen) {
      captureAnalyticsEvent("lead_form_closed", { step });
    }
    if (!nextOpen && step === 6) reset();
  }

  const openForm = useCallback((trigger: HTMLElement) => {
    formTrigger.current = trigger;
    if (step === 6) reset();
    setOpen(true);
    captureAnalyticsEvent("lead_form_opened");
  }, [reset, step]);

  useEffect(() => {
    function handleStaticTrigger(event: MouseEvent) {
      const target = event.target;
      if (!(target instanceof Element)) return;
      const trigger = target.closest<HTMLElement>('[data-lead-form-trigger]');
      if (!trigger) return;

      event.preventDefault();
      openForm(trigger);
    }

    document.addEventListener("click", handleStaticTrigger);
    return () => document.removeEventListener("click", handleStaticTrigger);
  }, [openForm]);

  function keepFieldVisible(event: FocusEvent<HTMLInputElement>) {
    const field = event.currentTarget;
    window.setTimeout(() => {
      field.scrollIntoView({ block: "center", behavior: "smooth" });
    }, 180);
  }

  useEffect(() => {
    if (!open) return;
    const frame = window.requestAnimationFrame(() => {
      questionBody.current?.scrollTo({ top: 0 });
      questionTitle.current?.focus({ preventScroll: true });
    });
    return () => window.cancelAnimationFrame(frame);
  }, [open, step]);

  async function continueForm(event: FormEvent) {
    event.preventDefault();
    setError(null);
    if (step === 1 && !patientVolume) {
      setError("Selecciona cuántos pacientes atienden por semana.");
      return;
    }
    if (step === 2 && patientChallenges.length === 0) {
      setError("Selecciona al menos un reto.");
      return;
    }
    if (step === 3 && !budget) {
      setError("Selecciona una respuesta para continuar.");
      return;
    }
    if (step === 4 && clinicName.trim().length < 2) {
      setError("Escribe el nombre de tu clínica o consultorio.");
      return;
    }
    if (step < QUESTION_COUNT) {
      captureAnalyticsEvent("lead_form_step_completed", { step });
      setStep((step + 1) as Step);
      return;
    }
    if (fullName.trim().length < 2) {
      setError("Escribe tu nombre para continuar.");
      return;
    }
    if (!/^\+[1-9]\d{9,14}$/.test(phoneE164)) {
      setError("Ingresa un número de WhatsApp válido.");
      return;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
      setError("Ingresa un correo electrónico válido.");
      return;
    }
    await submit();
  }

  async function submit() {
    if (
      !patientVolume ||
      !patientChallenges.length ||
      !budget ||
      !clinicName.trim() ||
      submitting
    )
      return;
    setSubmitting(true);
    setError(null);
    const currentSubmissionId = submissionId.current ?? makeSubmissionId();
    submissionId.current = currentSubmissionId;

    try {
      const response = await fetch("/api/leads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          submissionId: currentSubmissionId,
          fullName: fullName.trim(),
          phone: phoneE164,
          email: email.trim(),
          patientVolume,
          patientChallenges,
          clinicName: clinicName.trim(),
          budget,
          ...trackingData(),
        }),
      });
      const payload = (await response.json().catch(() => null)) as {
        message?: string | string[];
      } | null;
      if (!response.ok) {
        const message = Array.isArray(payload?.message)
          ? payload?.message[0]
          : payload?.message;
        throw new Error(
          message || "No pudimos guardar tus datos. Inténtalo nuevamente.",
        );
      }
      trackMetaLead(currentSubmissionId);
      captureAnalyticsEvent("lead_form_submitted", {
        patientVolume,
        patientChallenges,
        budget,
      });
      setStep(6);
    } catch (submitError) {
      captureAnalyticsEvent("lead_form_submit_failed");
      setError(
        submitError instanceof Error
          ? submitError.message
          : "No pudimos guardar tus datos. Inténtalo nuevamente.",
      );
    } finally {
      setSubmitting(false);
    }
  }

  const fallbackText = encodeURIComponent(
    `Hola, soy ${fullName || "un doctor interesado"}. Acabo de enviar mis datos y quiero coordinar mi demostración de Clidenta.`,
  );

  return (
    <>
      <button
        type="button"
        onClick={(event) => openForm(event.currentTarget)}
        data-cta="lead-form"
        data-cta-label={ctaLabel}
        aria-hidden={isPrimaryCtaVisible || open}
        tabIndex={isPrimaryCtaVisible || open ? -1 : 0}
        className={cn(
          "cl-mobile-cta fixed inset-x-4 bottom-[max(1rem,env(safe-area-inset-bottom))] z-40 inline-flex min-h-14 items-center justify-center rounded-2xl bg-primary px-5 py-3.5 font-semibold text-primary-foreground shadow-[0_16px_45px_-12px_rgba(15,89,82,0.75)] transition-all duration-200 active:scale-[0.98] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 sm:hidden",
          isPrimaryCtaVisible || open
            ? "pointer-events-none translate-y-4 opacity-0"
            : "translate-y-0 opacity-100",
        )}
      >
        {ctaLabel}
      </button>

      <Dialog open={open} onOpenChange={handleOpenChange}>
        <DialogContent
          onCloseAutoFocus={(event) => {
            event.preventDefault();
            formTrigger.current?.focus({ preventScroll: true });
          }}
          onOpenAutoFocus={(event) => {
            if (window.matchMedia("(max-width: 639px)").matches) {
              event.preventDefault();
            }
          }}
          style={
            visualViewport
              ? {
                  height: `${visualViewport.height}px`,
                  maxHeight: `${visualViewport.height}px`,
                  top: `${visualViewport.offsetTop}px`,
                }
              : undefined
          }
          className="cl-lead-dialog left-0 top-0 flex h-[100dvh] max-h-[100dvh] w-full min-w-0 max-w-none translate-x-0 translate-y-0 flex-col gap-0 overflow-hidden rounded-none border-0 bg-[#fdfcf8] p-0 shadow-2xl sm:left-[50%] sm:top-[50%] sm:h-[640px] sm:max-h-[calc(100dvh-2rem)] sm:max-w-[480px] sm:translate-x-[-50%] sm:translate-y-[-50%] sm:rounded-2xl"
        >
          {step <= QUESTION_COUNT ? (
            <form
              className="flex min-h-0 flex-1 flex-col"
              onSubmit={continueForm}
              noValidate
              aria-busy={submitting}
            >
              <div className="flex h-14 shrink-0 items-center justify-between px-5 pr-14">
                <button
                  type="button"
                  aria-label="Volver a la pregunta anterior"
                  disabled={step === 1 || submitting}
                  onClick={() => {
                    setError(null);
                    setStep((step - 1) as Step);
                  }}
                  className="-ml-2 inline-flex size-10 items-center justify-center rounded-lg text-slate-600 hover:bg-primary/5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary disabled:invisible"
                >
                  <ArrowLeft aria-hidden="true" size={20} />
                </button>
                <span className="text-xs tabular-nums text-slate-500">
                  {step} de {QUESTION_COUNT}
                </span>
              </div>

              <div
                ref={questionBody}
                className="min-h-0 flex-1 overflow-y-auto overscroll-contain px-5 pb-6 pt-2 sm:px-7"
              >
                <DialogHeader className="text-left sm:text-left">
                  <DialogTitle
                    ref={questionTitle}
                    tabIndex={-1}
                    className="font-sans text-lg font-semibold leading-snug tracking-normal text-slate-900 outline-none"
                  >
                    {step === 1 && PATIENT_VOLUME_QUESTION}
                    {step === 2 && PATIENT_CHALLENGES_QUESTION}
                    {step === 3 && BUDGET_QUESTION}
                    {step === 4 && CLINIC_NAME_QUESTION}
                    {step === 5 && "Datos de contacto"}
                  </DialogTitle>
                  <DialogDescription
                    className={cn(
                      "text-sm leading-relaxed",
                      step !== 2 && step !== 5 && "sr-only",
                    )}
                  >
                    {step === 2
                      ? "Selecciona todas las opciones que correspondan"
                      : step === 5
                        ? "Déjanos tus datos y uno de nuestros asesores te escribirá por whatsapp para agendar la demo GRATUITA."
                        : "Completa tu respuesta y pulsa Continuar."}
                  </DialogDescription>
                </DialogHeader>

                {step === 1 && (
                  <fieldset className="mt-5 space-y-2.5">
                    <legend className="sr-only">
                      {PATIENT_VOLUME_QUESTION}
                    </legend>
                    {PATIENT_VOLUME_OPTIONS.map((option) => (
                      <label
                        key={option.value}
                        className={cn(
                          "flex min-h-12 cursor-pointer items-center justify-between gap-4 rounded-lg border bg-white px-4 py-3 text-[15px] leading-snug transition-colors focus-within:ring-2 focus-within:ring-primary",
                          patientVolume === option.value
                            ? "border-primary bg-primary/5"
                            : "border-slate-200 hover:border-primary/40",
                        )}
                      >
                        <span>{option.label}</span>
                        <input
                          type="radio"
                          name="patientVolume"
                          value={option.value}
                          checked={patientVolume === option.value}
                          onChange={() => {
                            setPatientVolume(option.value);
                            setError(null);
                          }}
                          className="size-[18px] shrink-0 accent-primary"
                        />
                      </label>
                    ))}
                  </fieldset>
                )}

                {step === 2 && (
                  <fieldset className="mt-5 space-y-2.5">
                    <legend className="sr-only">
                      {PATIENT_CHALLENGES_QUESTION}
                    </legend>
                    {PATIENT_CHALLENGE_OPTIONS.map((option) => (
                      <label
                        key={option.value}
                        className={cn(
                          "flex min-h-12 cursor-pointer items-center justify-between gap-4 rounded-lg border bg-white px-4 py-3 text-[15px] leading-snug transition-colors focus-within:ring-2 focus-within:ring-primary",
                          patientChallenges.includes(option.value)
                            ? "border-primary bg-primary/5"
                            : "border-slate-200 hover:border-primary/40",
                        )}
                      >
                        <span>{option.label}</span>
                        <input
                          type="checkbox"
                          name="patientChallenges"
                          value={option.value}
                          checked={patientChallenges.includes(option.value)}
                          onChange={(event) => {
                            const checked = event.target.checked;
                            setPatientChallenges((current) =>
                              checked
                                ? [...current, option.value]
                                : current.filter(
                                    (value) => value !== option.value,
                                  ),
                            );
                            setError(null);
                          }}
                          className="size-[18px] shrink-0 accent-primary"
                        />
                      </label>
                    ))}
                  </fieldset>
                )}

                {step === 3 && (
                  <fieldset className="mt-5 space-y-2.5">
                    <legend className="sr-only">{BUDGET_QUESTION}</legend>
                    {BUDGET_OPTIONS.map((option) => (
                      <label
                        key={option.value}
                        className={cn(
                          "flex min-h-12 cursor-pointer items-center justify-between gap-4 rounded-lg border bg-white px-4 py-3 text-[15px] leading-snug transition-colors focus-within:ring-2 focus-within:ring-primary",
                          budget === option.value
                            ? "border-primary bg-primary/5"
                            : "border-slate-200 hover:border-primary/40",
                        )}
                      >
                        <span>{option.label}</span>
                        <input
                          type="radio"
                          name="budget"
                          value={option.value}
                          checked={budget === option.value}
                          onChange={() => {
                            setBudget(option.value);
                            setError(null);
                          }}
                          className="size-[18px] shrink-0 accent-primary"
                        />
                      </label>
                    ))}
                  </fieldset>
                )}

                {step === 4 && (
                  <Input
                    aria-label={CLINIC_NAME_QUESTION}
                    autoComplete="organization"
                    value={clinicName}
                    onChange={(event) => {
                      setClinicName(event.target.value);
                      setError(null);
                    }}
                    onFocus={keepFieldVisible}
                    maxLength={180}
                    placeholder="Escribe tu respuesta."
                    className="mt-5 h-[52px] rounded-lg bg-white px-4 text-base"
                  />
                )}

                {step === 5 && (
                  <div className="mt-5 min-w-0 space-y-4">
                    <label className="block space-y-2">
                      <span className="text-sm font-medium text-slate-800">
                        Correo electrónico
                      </span>
                      <Input
                        type="email"
                        autoComplete="email"
                        inputMode="email"
                        value={email}
                        onChange={(event) => {
                          setEmail(event.target.value);
                          setError(null);
                        }}
                        onFocus={keepFieldVisible}
                        maxLength={180}
                        placeholder="Escribe tu respuesta."
                        className="h-[52px] rounded-lg bg-white px-4 text-base"
                      />
                    </label>
                    <label className="block space-y-2">
                      <span className="text-sm font-medium text-slate-800">
                        Nombre completo
                      </span>
                      <Input
                        autoComplete="name"
                        value={fullName}
                        onChange={(event) => {
                          setFullName(event.target.value);
                          setError(null);
                        }}
                        onFocus={keepFieldVisible}
                        maxLength={120}
                        placeholder="Escribe tu respuesta."
                        className="h-[52px] rounded-lg bg-white px-4 text-base"
                      />
                    </label>
                    <div className="space-y-2">
                      <label
                        htmlFor="lead-whatsapp"
                        className="block text-sm font-semibold text-slate-800"
                      >
                        Número de teléfono
                      </label>
                      <div className="flex h-[52px] min-w-0 max-w-full overflow-hidden rounded-xl border border-input bg-white focus-within:border-ring focus-within:ring-2 focus-within:ring-ring/30">
                        <Select
                          value={countryIso}
                          onValueChange={(nextIso) => {
                            const nextCountry = COUNTRY_OPTIONS.find(
                              (country) => country.iso === nextIso,
                            );
                            if (!nextCountry) return;
                            setCountryIso(nextIso);
                            setPhone((currentPhone) =>
                              normalizeNationalPhone(
                                currentPhone,
                                nextCountry.dialCode,
                              ),
                            );
                            setError(null);
                          }}
                        >
                          <SelectTrigger
                            aria-label="Código de país"
                            className="h-full w-[116px] shrink-0 rounded-none border-0 border-r border-input bg-slate-50/80 px-2.5 shadow-none transition-colors data-[size=default]:h-full hover:bg-slate-100 focus-visible:bg-slate-100 focus-visible:ring-0 sm:w-[132px] sm:px-3"
                          >
                            <SelectValue>
                              <span className="flex items-center gap-2">
                                <span
                                  aria-hidden="true"
                                  className="flex size-7 items-center justify-center rounded-lg bg-white text-base shadow-sm ring-1 ring-slate-200/80"
                                >
                                  {selectedCountry.flag}
                                </span>
                                <span className="font-semibold tabular-nums text-slate-700">
                                  {selectedCountry.dialCode}
                                </span>
                              </span>
                            </SelectValue>
                          </SelectTrigger>
                          <SelectContent
                            position="popper"
                            align="start"
                            className="max-h-[280px] w-[270px] rounded-xl"
                          >
                            {COUNTRY_OPTIONS.map((country) => (
                              <SelectItem
                                key={country.iso}
                                value={country.iso}
                                className="py-2.5 pl-3"
                              >
                                <span className="grid w-[210px] grid-cols-[28px_minmax(0,1fr)_auto] items-center gap-2.5">
                                  <span
                                    aria-hidden="true"
                                    className="flex size-7 items-center justify-center rounded-md bg-slate-50"
                                  >
                                    {country.flag}
                                  </span>
                                  <span className="min-w-0 truncate font-medium">
                                    {country.name}
                                  </span>
                                  <span className="justify-self-end tabular-nums text-muted-foreground">
                                    {country.dialCode}
                                  </span>
                                </span>
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <input
                          id="lead-whatsapp"
                          type="tel"
                          inputMode="numeric"
                          autoComplete="tel-national"
                          value={phone}
                          onChange={(event) => {
                            setPhone(
                              normalizeNationalPhone(
                                event.target.value,
                                selectedCountry.dialCode,
                              ),
                            );
                            setError(null);
                          }}
                          onFocus={keepFieldVisible}
                          placeholder={selectedCountry.placeholder}
                          className="min-w-0 flex-1 bg-transparent px-4 text-base tabular-nums outline-none placeholder:text-slate-400"
                        />
                      </div>
                    </div>

                    <p className="text-xs leading-relaxed text-slate-500">
                      Al continuar, aceptas que Clidenta te contacte por
                      WhatsApp y correo. Usaremos tus datos para coordinar tu
                      demostración y medir el rendimiento de nuestras campañas
                      en Meta.
                    </p>
                  </div>
                )}
              </div>

              <div className="shrink-0 border-t border-primary/10 bg-[#fdfcf8] px-5 pb-[max(1rem,env(safe-area-inset-bottom))] pt-3 sm:px-7 sm:pb-5">
                {error && (
                  <p
                    role="alert"
                    className="mb-3 text-sm font-medium text-red-600"
                  >
                    {error}
                  </p>
                )}
                <div
                  role="progressbar"
                  aria-label="Progreso del formulario"
                  aria-valuemin={0}
                  aria-valuemax={QUESTION_COUNT}
                  aria-valuenow={step}
                  className="mb-3 grid grid-cols-5 gap-1"
                >
                  {[1, 2, 3, 4, 5].map((item) => (
                    <span
                      key={item}
                      className={cn(
                        "h-0.5 rounded-full",
                        item <= step ? "bg-primary" : "bg-primary/10",
                      )}
                    />
                  ))}
                </div>
                <button
                  type="submit"
                  disabled={submitting}
                  className="inline-flex min-h-[48px] w-full items-center justify-center gap-2 rounded-lg bg-primary px-5 py-3 font-semibold text-primary-foreground transition-colors hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 disabled:opacity-60"
                >
                  {submitting ? (
                    <>
                      <Loader2
                        aria-hidden="true"
                        className="animate-spin"
                        size={18}
                      />{" "}
                      Guardando tus datos…
                    </>
                  ) : (
                    "Continuar"
                  )}
                </button>
              </div>
            </form>
          ) : (
            <div className="px-6 py-16 text-center sm:px-8">
              <span className="mx-auto flex size-12 items-center justify-center rounded-full bg-secondary text-primary">
                <Check aria-hidden="true" size={26} />
              </span>
              <DialogHeader className="mt-5 text-center sm:text-center">
                <DialogTitle
                  ref={questionTitle}
                  tabIndex={-1}
                  className="font-sans text-xl font-semibold leading-snug outline-none"
                >
                  ¡Listo! Ya recibimos tus datos
                </DialogTitle>
                <DialogDescription className="text-sm leading-relaxed">
                  Un asesor te escribirá por WhatsApp para coordinar la hora de
                  la reunión.
                </DialogDescription>
              </DialogHeader>
              <a
                href={`https://wa.me/${FALLBACK_WHATSAPP}?text=${fallbackText}`}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-6 inline-flex min-h-12 w-full items-center justify-center gap-2 rounded-lg bg-primary px-5 py-3 font-semibold text-primary-foreground transition hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
              >
                Ir a WhatsApp <ArrowRight aria-hidden="true" size={18} />
              </a>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
}
