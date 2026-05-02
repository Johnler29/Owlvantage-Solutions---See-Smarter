import { Link } from "wouter";
import { Lightbulb, Crown, Compass, ArrowRight, Sparkles, CheckCircle2 } from "lucide-react";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import ScrollReveal from "@/components/ScrollReveal";

/**
 * About Page
 * Design Philosophy: Modern Corporate Minimalism
 * - Company overview and mission
 * - Vision statement
 * - Core values with icons
 * - Professional, clean layout
 */
export default function About() {
  const aboutBannerImage =
    "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?auto=format&fit=crop&w=1800&q=80";

  const coreValues = [
    {
      icon: Compass,
      title: "Opportunity",
      description: "We create opportunities for growth and learning for individuals and organizations.",
    },
    {
      icon: Lightbulb,
      title: "Wisdom",
      description: "We share knowledge and insights to enable informed decisions and meaningful progress.",
    },
    {
      icon: Crown,
      title: "Leadership",
      description: "We lead with integrity, innovation, and excellence in all that we do.",
    },
  ];

  const whyChoose = [
    "Tailored programs for each client",
    "Expert facilitators with practical experience",
    "Technology-driven and measurable outcomes",
    "Flexible virtual and in-person delivery",
  ];

  return (
    <div className="min-h-screen flex flex-col bg-white">
      <Navigation />

      <main className="animate-in fade-in-20 slide-in-from-bottom-4 duration-500">
        {/* Hero Section */}
        <section className="relative overflow-hidden py-20 lg:py-32">
          <div
            className="absolute inset-0 bg-cover bg-center"
            style={{ backgroundImage: `url('${aboutBannerImage}')` }}
          />
          <div className="absolute inset-0 bg-gradient-to-r from-[#1b2e45]/90 via-[#1b2e45]/70 to-[#25badf]/40" />

          <div className="container mx-auto px-4 relative z-10">
            <ScrollReveal as="div" variant="pop" className="max-w-3xl">
              <p className="mb-4 inline-flex items-center gap-2 rounded-full border border-white/30 bg-white/10 px-4 py-1.5 text-sm font-semibold uppercase tracking-widest text-white">
                <Sparkles size={14} />
                Who We Are
              </p>
              <h1 className="heading-xl mb-6 text-white">About Owlvantage Solutions, Inc.</h1>
              <p className="text-xl text-white/90 leading-relaxed">
                Owlvantage Solutions, Inc. is a dynamic IT and learning solutions company dedicated to helping
                organizations and individuals achieve their fullest potential through innovative learning experiences,
                technology-driven solutions, and practical workshops.
              </p>
            </ScrollReveal>
          </div>
        </section>

        {/* Company Overview */}
        <section className="py-20 lg:py-32 bg-slate-50">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <ScrollReveal as="div" variant="fade-up">
              <h2 className="heading-lg mb-6">Our Story</h2>
              <p className="text-slate-700 mb-4 leading-relaxed text-lg">
                Founded with the vision of bridging knowledge gaps and empowering professionals, Owlvantage combines
                expertise in IT, corporate training, and learning development to deliver measurable results.
              </p>
              <p className="text-slate-700 mb-4 leading-relaxed text-lg">
                We are committed to helping our clients grow, enhance skills, and achieve organizational success
                through impactful learning experiences and innovative IT solutions.
              </p>
            </ScrollReveal>
            <ScrollReveal as="div" variant="pop" className="card-hover overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
              <div className="relative h-48 w-full overflow-hidden">
                <img
                  src="https://images.unsplash.com/photo-1521737604893-d14cc237f11d?auto=format&fit=crop&w=1200&q=80"
                  alt="Owlvantage team collaborating"
                  className="h-full w-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#1b2e45]/65 to-transparent" />
              </div>
              <div className="p-8">
                <h3 className="heading-md mb-6 text-[#1b2e45]">Why Choose Owlvantage?</h3>
                <div className="space-y-3.5">
                  {whyChoose.map((item) => (
                    <p key={item} className="inline-flex items-start gap-2.5 text-slate-700 leading-relaxed">
                      <CheckCircle2 size={18} className="mt-0.5 text-[#25badf]" />
                      {item}
                    </p>
                  ))}
                </div>
              </div>
            </ScrollReveal>
          </div>
        </div>
        </section>

        {/* Mission & Vision */}
        <section className="py-20 lg:py-32 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Mission */}
            <ScrollReveal as="div" variant="pop" className="card-hover bg-white p-8 rounded-2xl border border-gray-200 shadow-sm">
              <h3 className="heading-md mb-4 text-[#1b2e45]">Our Mission</h3>
              <p className="text-slate-700 leading-relaxed text-lg">
                To provide cutting-edge learning solutions and IT services that inspire growth, enhance skills, and
                drive organizational success.
              </p>
            </ScrollReveal>

            {/* Vision */}
            <ScrollReveal as="div" variant="pop" delay={80} className="card-hover bg-white p-8 rounded-2xl border border-gray-200 shadow-sm">
              <h3 className="heading-md mb-4 text-[#1b2e45]">Our Vision</h3>
              <p className="text-slate-700 leading-relaxed text-lg">
                To become a trusted partner for businesses and professionals seeking impactful learning experiences and
                innovative IT solutions.
              </p>
            </ScrollReveal>
          </div>
        </div>
        </section>

        {/* Core Values */}
        <section className="py-20 lg:py-32 bg-white">
        <div className="container mx-auto px-4">
          <ScrollReveal as="div" variant="fade-up" className="text-center mb-16">
            <h2 className="heading-lg mb-4">Our Core Values</h2>
            <p className="text-lg text-slate-600 max-w-2xl mx-auto">
              These principles guide everything we do and shape how we serve our clients.
            </p>
          </ScrollReveal>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {coreValues.map((value, idx) => {
              const Icon = value.icon;
              const card = (
                <ScrollReveal
                  key={idx}
                  as="div"
                  variant="pop"
                  delay={idx * 80}
                  className="card-hover overflow-hidden rounded-2xl border border-gray-200 bg-slate-50 shadow-sm"
                >
                  <div className="flex items-start gap-4 p-7">
                    <div className="flex h-11 w-11 flex-shrink-0 items-center justify-center rounded-xl bg-[#25badf]/15">
                      <Icon className="w-6 h-6 text-[#25badf]" />
                    </div>
                    <div>
                      <h3 className="heading-sm mb-2 text-[#1b2e45]">{value.title}</h3>
                      <p className="text-slate-600 leading-relaxed">{value.description}</p>
                    </div>
                  </div>
                </ScrollReveal>
              );

              if (idx === 2) {
                return (
                  <div key={value.title} className="lg:col-span-2 flex justify-center">
                    <div className="w-full lg:max-w-[calc(50%-1rem)]">{card}</div>
                  </div>
                );
              }

              return card;
            })}
          </div>
        </div>
        </section>

        {/* CTA Section */}
        <section className="py-20 lg:py-32 bg-[#1b2e45] text-white">
        <ScrollReveal as="div" variant="pop" className="container mx-auto px-4 text-center">
          <h2 className="text-4xl lg:text-5xl font-bold mb-6">Let's Work Together</h2>
          <p className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto">
            Discover how Owlvantage Solutions can help your organization achieve its learning and development goals.
          </p>
          <Link href="/contact">
            <span className="inline-flex items-center gap-2 bg-[#25badf] text-white px-8 py-4 rounded-md font-semibold hover:bg-[#1a8fb8] transition-all duration-300 hover:-translate-y-0.5 hover:shadow-xl">
              Get in Touch
              <ArrowRight size={18} />
            </span>
          </Link>
        </ScrollReveal>
        </section>
      </main>

      <Footer />
    </div>
  );
}
