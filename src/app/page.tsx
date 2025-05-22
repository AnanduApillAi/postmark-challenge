import Header from '@/components/Header';
import Hero from '@/components/Hero';
import TestimonialsGallery from '@/components/TestimonialsGallery';
import Footer from '@/components/Footer';

export default function Home() {
  return (
    <div className="relative flex min-h-screen flex-col overflow-x-hidden bg-[#f8fafc]">
      <Header />
      <main className="flex-grow">
        <Hero />
        <TestimonialsGallery />
      </main>
      <Footer />
    </div>
  );
}
