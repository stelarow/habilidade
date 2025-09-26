import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"

export function FAQSection() {
  const faqs = [
    {
      id: 1,
      question: 'Preciso ter conhecimento prévio em programação?',
      answer: 'Não! Começamos do absoluto zero com lógica de programação e evoluímos gradualmente até linguagens avançadas.'
    },
    {
      id: 2,
      question: 'Qual a diferença entre as modalidades Presencial e Online?',
      answer: 'Presencial: aulas na escola com instrutores. Online: acesso remoto com suporte. Mesmo conteúdo e apostilas em ambas.'
    },
    {
      id: 3,
      question: 'As apostilas estão incluídas no preço?',
      answer: 'Sim! Material didático impresso completo dos 6 módulos incluso sem custo adicional. Sua referência permanente!'
    },
    {
      id: 4,
      question: 'O que é o Claude Code e quando estará disponível?',
      answer: 'Claude Code é uma ferramenta de IA para desenvolvimento de código. O conteúdo programático está sendo desenvolvido pela equipe.'
    }
  ]

  return (
    <section className="py-20 bg-muted/30">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <div className="text-teal font-semibold mb-4">FAQ</div>
          <h2 className="text-3xl lg:text-4xl font-bold mb-6">
            Perguntas Frequentes
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Tire suas dúvidas sobre o curso de programação
          </p>
        </div>

        <div className="max-w-3xl mx-auto">
          <Accordion type="single" collapsible className="space-y-4">
            {faqs.map((faq) => (
              <AccordionItem
                key={faq.id}
                value={`item-${faq.id}`}
                className="bg-card border rounded-lg px-6"
              >
                <AccordionTrigger className="text-left py-6 hover:no-underline">
                  <span className="font-semibold">{faq.question}</span>
                </AccordionTrigger>
                <AccordionContent className="pb-6 text-muted-foreground">
                  {faq.answer}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>

        {/* Console motivacional */}
        <div className="max-w-2xl mx-auto mt-12">
          <div className="bg-gray-900 rounded-lg p-6 font-mono text-sm">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-3 h-3 bg-red-500 rounded-full"></div>
              <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
              <div className="w-3 h-3 bg-green-500 rounded-full"></div>
              <span className="text-gray-400 ml-4">motivacao.py</span>
            </div>
            <div className="space-y-1 text-center">
              <div className="text-blue-400"># Ainda tem dúvidas?</div>
              <div className="text-green-400">if duvidas == True:</div>
              <div className="text-white ml-4">entre_em_contato()</div>
              <div className="text-white ml-4">fale_com_consultor()</div>
              <div className="text-teal">print("Estamos aqui para ajudar! 🚀")</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}