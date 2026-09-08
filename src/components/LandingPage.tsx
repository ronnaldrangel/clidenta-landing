import LandingHeader from './LandingHeader';
import Hero from '@/sections/Hero';
import ReviewsMarquee from '@/sections/ReviewsMarquee';
import Footer from '@/sections/Footer';
import type { AdCopy } from '@/lib/adCopy';
import '@/sections/landing-demo.css';
import '@/sections/landing-desktop.css';

/** Composición completa de la landing; el copy del Hero varía por anuncio. */
export default function LandingPage({ copy }: { copy: AdCopy }) {
  return (
    <div className="clidenta-desktop">
      <LandingHeader />
      <main>
      <Hero copy={copy} />
      <ReviewsMarquee />
      </main>
      <Footer />
    </div>
  );
}
