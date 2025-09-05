import { 
  Handshake, 
  CheckCircle,
  Shield
} from '@phosphor-icons/react';

export const ProjetistaGuarantee = () => {
  return (
    <section className="px-4 py-16 sm:px-6 lg:px-8 lg:py-20 bg-zinc-900/50">
      <div className="container mx-auto max-w-7xl">
        <div className="max-w-4xl mx-auto">
          <div className="relative rounded-2xl bg-green-500/10 backdrop-blur p-8 border border-green-400/20">
            <div className="text-center mb-8">
              <div className="w-20 h-20 mx-auto bg-green-500/20 rounded-full flex items-center justify-center mb-4">
                <Shield className="w-10 h-10 text-green-400" />
              </div>
              
              <h2 className="text-3xl md:text-4xl font-bold text-green-400 mb-2">
                GARANTIA DE 7 DIAS
              </h2>
              
              <p className="text-xl text-green-300 mb-6">
                VOCÊ NÃO PRECISA DECIDIR AGORA
              </p>
            </div>

            <div className="text-center mb-8">
              <div className="flex items-center justify-center gap-2 mb-4">
                <Handshake className="w-6 h-6 text-green-400" />
                <span className="text-lg font-semibold text-green-300">
                  PAGUE APENAS DEPOIS DE 7 DIAS DE AULA EXPERIMENTAL
                </span>
              </div>
              
              <p className="text-white text-lg mb-6 max-w-2xl mx-auto">
                Comece o curso gratuitamente! Se nos primeiros 7 dias você 
                sentir que não é para você, não pague nada. Simples assim.
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-6 mb-8">
              <div className="text-center">
                <CheckCircle className="w-8 h-8 text-green-400 mx-auto mb-2" />
                <span className="text-white font-medium">Sem risco</span>
              </div>
              
              <div className="text-center">
                <CheckCircle className="w-8 h-8 text-green-400 mx-auto mb-2" />
                <span className="text-white font-medium">Sem burocracia</span>
              </div>
              
              <div className="text-center">
                <CheckCircle className="w-8 h-8 text-green-400 mx-auto mb-2" />
                <span className="text-white font-medium">Garantia total</span>
              </div>
            </div>

            <div className="text-center">
              <a 
                href="https://wa.me/5548988559491?text=Ol%C3%A1%21%20Quero%20come%C3%A7ar%20gratuitamente%20os%20primeiros%207%20dias%20do%20Curso%20de%20Projetista%203D"
                target="_blank"
                rel="noopener noreferrer"
                className="group relative overflow-hidden rounded-xl px-8 py-4 text-lg font-bold text-white transition-all duration-300 bg-gradient-to-r from-green-500 to-green-400 shadow-2xl shadow-green-500/30 hover:shadow-green-500/50 hover:-translate-y-1 inline-block"
              >
                COMEÇAR GRATUITAMENTE - PRIMEIROS 7 DIAS GRÁTIS
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};