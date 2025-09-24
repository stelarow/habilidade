"use client"

import { useEffect, useState } from "react"

export function CompanyLogos() {
  const companies = [
    "Google",
    "Microsoft",
    "Amazon",
    "Meta",
    "Netflix",
    "Spotify",
    "Uber",
    "Airbnb",
    "Tesla",
  ]
  const [currentIndex, setCurrentIndex] = useState(0)

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % Math.ceil(companies.length / 3))
    }, 3000)
    return () => clearInterval(interval)
  }, [companies.length])

  return (
    <section className="py-12 bg-background border-b border-border/20">
      <div className="container mx-auto px-4">
        <p className="text-center text-muted-foreground text-sm mb-8 uppercase tracking-wide">
          Nossos alunos trabalham nas maiores empresas de tecnologia
        </p>
        <div className="relative overflow-hidden">
          <div
            className="flex transition-transform duration-500 ease-in-out"
            style={{ transform: `translateX(-${currentIndex * 100}%)` }}
          >
            {Array.from({ length: Math.ceil(companies.length / 3) }).map((_, slideIndex) => (
              <div key={slideIndex} className="w-full flex-shrink-0">
                <div className="flex items-center justify-center gap-8 lg:gap-12">
                  {companies.slice(slideIndex * 3, slideIndex * 3 + 3).map((company) => (
                    <div
                      key={company}
                      className="text-foreground/60 hover:text-foreground font-semibold text-lg transition-colors"
                    >
                      {company}
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Carousel indicators */}
        <div className="flex justify-center gap-2 mt-6">
          {Array.from({ length: Math.ceil(companies.length / 3) }).map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentIndex(index)}
              className={`w-2 h-2 rounded-full transition-colors ${
                index === currentIndex ? "bg-primary" : "bg-muted-foreground/30"
              }`}
            />
          ))}
        </div>
      </div>
    </section>
  )
}