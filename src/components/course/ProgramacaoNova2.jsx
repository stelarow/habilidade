import { HeroSection } from "./programacao/HeroSection"
import { CompanyLogos } from "./programacao/CompanyLogos"
import { PlatformSection } from "./programacao/PlatformSection"
import { AISection } from "./programacao/AISection"
import { FrameworksSection } from "./programacao/FrameworksSection"
import { InvestmentSection } from "./programacao/InvestmentSection"
import { TestimonialSection } from "./programacao/TestimonialSection"
import { FAQSection } from "./programacao/FAQSection"

export function ProgramacaoNova2() {
  return (
    <main className="min-h-screen">
      <HeroSection />
      <CompanyLogos />
      <PlatformSection />
      <AISection />
      <FrameworksSection />
      <InvestmentSection />
      <TestimonialSection />
      <FAQSection />
    </main>
  )
}