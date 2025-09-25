import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"

export function SalaryTooltip({ children, salaryInfo }) {
  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          {children}
        </TooltipTrigger>
        <TooltipContent
          className="max-w-xs sm:max-w-sm p-3 sm:p-4 bg-white border shadow-lg"
          collisionPadding={8}
          sideOffset={8}
        >
          <div className="space-y-2 text-xs sm:text-sm">
            <div className="font-semibold text-navy text-sm sm:text-base">Dados sobre salários em programação:</div>
            <div className="text-gray-700">
              • Média júnior: R$ 4.154/mês
            </div>
            <div className="text-gray-700">
              • Baseado em 12.510 participantes
            </div>
            <div className="text-gray-700">
              • 56% conseguem primeira oportunidade &lt; 1 ano
            </div>
            <div className="pt-2 border-t">
              <a
                href="https://pesquisa.codigofonte.com.br/2025"
                target="_blank"
                rel="noopener noreferrer"
                className="text-teal underline hover:text-teal/80 text-xs break-all"
              >
                Fonte: Pesquisa Código Fonte TV 2025
              </a>
            </div>
            <div className="text-xs text-gray-500 italic">
              *Salários variam por região, empresa e experiência
            </div>
          </div>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  )
}