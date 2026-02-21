import { Toaster } from '@/components/ui/sonner';
import SEOHead from '@/components/shared/SEOHead';
import HeroSection from '@/components/afiliacao/HeroSection';
import ComoFunciona from '@/components/afiliacao/ComoFunciona';
import FormularioCadastro from '@/components/afiliacao/FormularioCadastro';
import { seo } from '@/data/afiliacao';

const Afiliacao = () => {
  return (
    <>
      <SEOHead
        title={seo.title}
        description={seo.description}
        path="/afiliacao"
        keywords={seo.keywords}
      />
      <Toaster position="top-right" richColors closeButton />
      <div className="min-h-screen bg-gray-950">
        <HeroSection />
        <ComoFunciona />
        <FormularioCadastro />
      </div>
    </>
  );
};

export { Afiliacao as Component };
export default Afiliacao;
