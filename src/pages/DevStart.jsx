import { Helmet } from '@dr.pogodin/react-helmet';
import { Toaster } from '@/components/ui/sonner';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Rocket } from '@phosphor-icons/react';

// DevStart Components
import HeroSection from '@/components/devstart/HeroSection';
import DualAudienceCards from '@/components/devstart/DualAudienceCards';
import MissionTimeline from '@/components/devstart/MissionTimeline';
import CodeSimulator from '@/components/devstart/CodeSimulator';
import DevStartFAQ from '@/components/devstart/DevStartFAQ';
import CTAFinal from '@/components/devstart/CTAFinal';
import TypeformInscription from '@/components/devstart/TypeformInscription';

// Data
import { devstartData } from '@/data/devstart';

const DevStart = () => {
  const { seo, afterDevStart } = devstartData;

  return (
    <>
      {/* SEO Meta Tags */}
      <Helmet>
        <title>{seo.title}</title>
        <meta name="description" content={seo.description} />
        <meta name="keywords" content={seo.keywords} />

        {/* Open Graph */}
        <meta property="og:title" content={seo.title} />
        <meta property="og:description" content={seo.description} />
        <meta property="og:image" content={seo.ogImage} />
        <meta property="og:url" content={seo.url} />
        <meta property="og:type" content="website" />

        {/* Twitter Card */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={seo.title} />
        <meta name="twitter:description" content={seo.description} />
        <meta name="twitter:image" content={seo.ogImage} />

        {/* Structured Data - EducationalEvent */}
        <script type="application/ld+json">
          {JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'EducationalEvent',
            name: devstartData.event.title,
            description: devstartData.event.description,
            eventAttendanceMode: 'https://schema.org/OfflineEventAttendanceMode',
            eventStatus: 'https://schema.org/EventScheduled',
            location: {
              '@type': 'Place',
              name: devstartData.location.name,
              address: {
                '@type': 'PostalAddress',
                streetAddress: devstartData.location.address,
                addressLocality: devstartData.location.city,
                addressRegion: devstartData.location.state,
                postalCode: devstartData.location.cep,
                addressCountry: 'BR',
              },
            },
            isAccessibleForFree: true,
            offers: {
              '@type': 'Offer',
              price: 0,
              priceCurrency: 'BRL',
              availability: 'https://schema.org/InStock',
              validFrom: new Date().toISOString(),
            },
            organizer: {
              '@type': 'Organization',
              name: 'Escola Habilidade',
              url: devstartData.location.website,
            },
          })}
        </script>
      </Helmet>

      {/* Toast Notifications */}
      <Toaster position="top-right" richColors closeButton />

      {/* Main Page Content */}
      <div className="min-h-screen bg-gray-950">
        {/* Hero Section */}
        <HeroSection />

        {/* Dual Audience Cards */}
        <DualAudienceCards />

        {/* Mission Timeline */}
        <MissionTimeline />

        {/* Code Simulator */}
        <CodeSimulator />

        {/* After DevStart Section (Inline) */}
        <section className="py-20 px-4 bg-gradient-to-b from-gray-950 to-gray-900">
          <div className="container mx-auto max-w-5xl">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <Card className="border-4 border-purple-500/50 bg-gradient-to-br from-purple-950 to-blue-950 shadow-2xl">
                <CardContent className="p-8 md:p-12 text-center">
                  {/* Title */}
                  <div className="mb-6">
                    <h2 className="text-4xl md:text-5xl font-black text-white mb-3 flex items-center justify-center gap-3">
                      <Rocket size={48} weight="fill" className="text-orange-400" />
                      {afterDevStart.title}
                    </h2>
                    <p className="text-2xl md:text-3xl font-bold text-purple-300">
                      {afterDevStart.subtitle}
                    </p>
                  </div>

                  {/* Description */}
                  <p className="text-lg md:text-xl text-gray-200 max-w-2xl mx-auto mb-8 leading-relaxed">
                    {afterDevStart.description}
                  </p>

                  {/* Benefits Grid */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
                    {afterDevStart.benefits.map((benefit, index) => (
                      <motion.div
                        key={index}
                        className="flex items-center gap-3 bg-purple-900/30 border border-purple-500/30 rounded-lg p-4"
                        initial={{ opacity: 0, x: index % 2 === 0 ? -20 : 20 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: index * 0.1, duration: 0.4 }}
                      >
                        <span className="text-2xl">✨</span>
                        <span className="text-gray-200 font-semibold text-left">{benefit}</span>
                      </motion.div>
                    ))}
                  </div>

                  {/* CTA */}
                  <motion.div
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <Button
                      size="lg"
                      onClick={() => (window.location.href = afterDevStart.cta.link)}
                      variant="outline"
                      className="text-lg px-8 py-6 border-2 border-purple-400 text-purple-300 hover:bg-purple-900/50 font-bold"
                    >
                      {afterDevStart.cta.text}
                    </Button>
                  </motion.div>

                  {/* Bottom Note */}
                  <p className="mt-6 text-sm text-gray-400 italic">
                    💡 O DevStart é sua porta de entrada para o mundo da programação!
                  </p>
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </section>

        {/* FAQ Section */}
        <DevStartFAQ />

        {/* Final CTA */}
        <CTAFinal />

        {/* Typeform-style Inscription Form */}
        <TypeformInscription />
      </div>
    </>
  );
};

// Export para React Router lazy loading
export { DevStart as Component };
export default DevStart;
