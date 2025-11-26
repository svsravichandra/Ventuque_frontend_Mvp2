import Hero from './components/Hero';
import HowItWorksInteractive from './components/HowItWorksInteractive';
import ProductHighlights from './components/ProductHighlights';
import Showcase from './components/Showcase';
import Footer from './components/Footer';

export default function Home() {
  return (
    <main className="relative">
      <Hero />
      <HowItWorksInteractive />
      <ProductHighlights />
      <Showcase />
      <Footer />
    </main>
  );
}
