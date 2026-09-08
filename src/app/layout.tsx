import type { Metadata } from 'next';
import { DM_Sans, Fraunces } from 'next/font/google';
import Script from 'next/script';
import './globals.css';

const DEFAULT_META_PIXEL_ID = '1677925763319298';
const META_PIXEL_ID =
  process.env.NEXT_PUBLIC_META_PIXEL_ID?.trim() || DEFAULT_META_PIXEL_ID;

const dmSans = DM_Sans({
  subsets: ['latin'],
  variable: '--font-dm-sans',
  display: 'swap',
});
const fraunces = Fraunces({
  subsets: ['latin'],
  variable: '--font-fraunces',
  display: 'swap',
  preload: false,
});

export const metadata: Metadata = {
  metadataBase: new URL('https://clidenta.net'),
  title: 'El Mejor Recepcionista AI para Clínicas | Clidenta',
  description:
    'Descubre Clidenta: recepcionista IA + software integral para clínicas odontológicas en Perú y LATAM. Agenda, odontograma digital, historias clínicas, recordatorios y atención por WhatsApp 24/7.',
  keywords:
    'el mejor recepcionista AI para clínicas, inteligencia artificial para consultorios, chatbot médico para WhatsApp, agenda de citas médica automatizada, asistente virtual médico, software de recepción dental, Clidenta Perú LATAM',
  authors: [{ name: 'Clidenta' }],
  robots: 'index, follow',
  icons: {
    icon: [
      {
        url: '/logo/clidenta-icon.svg',
        type: 'image/svg+xml',
        media: '(prefers-color-scheme: light)',
      },
      {
        url: '/logo/clidenta-icon-light.svg',
        type: 'image/svg+xml',
        media: '(prefers-color-scheme: dark)',
      },
    ],
  },
  alternates: {
    canonical: 'https://clidenta.net/',
  },
  openGraph: {
    title: 'El Mejor Recepcionista AI para Clínicas | Clidenta',
    description:
      'Automatiza la atención de tus pacientes con la IA más avanzada. Agenda citas y responde consultas 24/7 por WhatsApp.',
    url: 'https://clidenta.net/',
    siteName: 'Clidenta',
    images: [
      {
        url: 'https://clidenta.net/logo/logo_black.png',
        width: 800,
        height: 182,
        alt: 'Clidenta Recepcionista AI',
      },
    ],
    locale: 'es_PE',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'El Mejor Recepcionista AI para Clínicas | Clidenta',
    description:
      'Automatiza la atención de tus pacientes con la IA más avanzada. Agenda citas y responde consultas 24/7 por WhatsApp.',
    images: ['https://clidenta.net/logo/logo_black.png'],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es">
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "SoftwareApplication",
              "name": "Clidenta - Recepcionista AI",
              "operatingSystem": "Web, WhatsApp",
              "applicationCategory": "BusinessApplication",
              "offers": {
                "@type": "Offer",
                "price": "0",
                "priceCurrency": "USD"
              },
              "description": "El mejor recepcionista AI para clínicas en Perú y LATAM. Automatiza agendamiento de citas y atención al paciente por WhatsApp las 24 horas.",
              "publisher": {
                "@type": "Organization",
                "name": "Clidenta"
              }
            }),
          }}
        />
      </head>
      <body className={`${dmSans.variable} ${fraunces.variable}`}>
        <noscript>
          <img
            height="1"
            width="1"
            style={{ display: 'none' }}
            src={`https://www.facebook.com/tr?id=${encodeURIComponent(META_PIXEL_ID)}&ev=PageView&noscript=1`}
            alt=""
          />
        </noscript>
        
        {children}

        <Script
          id="fb-pixel"
          strategy="lazyOnload"
          dangerouslySetInnerHTML={{
            __html: `
              (function(w,d){
                var started=false, timer;
                var events=['pointerdown','keydown'];
                function start(){
                  if(started)return;
                  started=true;
                  if(timer)w.clearTimeout(timer);
                  events.forEach(function(event){w.removeEventListener(event,start)});
                  !function(f,b,e,v,n,t,s)
                  {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
                  n.callMethod.apply(n,arguments):n.queue.push(arguments)};
                  if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
                  n.queue=[];t=b.createElement(e);t.async=!0;
                  t.src=v;s=b.getElementsByTagName(e)[0];
                  s.parentNode.insertBefore(t,s)}(w,d,'script',
                  'https://connect.facebook.net/en_US/fbevents.js');
                  w.fbq('init',${JSON.stringify(META_PIXEL_ID)});
                  w.fbq('track','PageView');
                  var pending=w.__clidentaMetaPixelQueue||[];
                  w.__clidentaMetaPixelQueue=[];
                  pending.forEach(function(args){
                    if(Array.isArray(args))w.fbq.apply(w,args);
                  });
                }
                events.forEach(function(event){w.addEventListener(event,start,{once:true,passive:true})});
                timer=w.setTimeout(start,2500);
              })(window,document);
            `,
          }}
        />
        <Script
          id="ms-clarity"
          strategy="lazyOnload"
          dangerouslySetInnerHTML={{
            __html: `
              (function(w,d){
                var started=false, timer;
                var events=['pointerdown','keydown'];
                function start(){
                  if(started)return;
                  started=true;
                  if(timer)w.clearTimeout(timer);
                  events.forEach(function(event){w.removeEventListener(event,start)});
                  (function(c,l,a,r,i,t,y){
                    c[a]=c[a]||function(){(c[a].q=c[a].q||[]).push(arguments)};
                    t=l.createElement(r);t.async=1;t.src='https://www.clarity.ms/tag/'+i;
                    y=l.getElementsByTagName(r)[0];y.parentNode.insertBefore(t,y);
                  })(w,d,'clarity','script','xiplwu054l');
                }
                events.forEach(function(event){w.addEventListener(event,start,{once:true,passive:true})});
                if(d.readyState==='complete')timer=w.setTimeout(start,6000);
                else w.addEventListener('load',function(){timer=w.setTimeout(start,6000)},{once:true});
              })(window,document);
            `,
          }}
        />

      </body>
    </html>
  );
}
