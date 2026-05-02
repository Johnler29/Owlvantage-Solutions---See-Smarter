import { Link } from "wouter";
import { BookOpen, Code, Users, BarChart3, Zap, Shield, ArrowRight, Sparkles, CheckCircle2 } from "lucide-react";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import ScrollReveal from "@/components/ScrollReveal";

/**
 * Services Page
 * Design Philosophy: Modern Corporate Minimalism
 * - Three major service categories
 * - Detailed service descriptions
 * - Professional layout with teal accents
 */
export default function Services() {
  const servicesBannerImage =
    "https://images.unsplash.com/photo-1521737711867-e3b97375f902?auto=format&fit=crop&w=1800&q=80";

  const learningServices = [
    {
      icon: BookOpen,
      title: "Corporate Training Programs",
      description: "Professional training tailored for organizational growth and employee development.",
      image: "https://images.unsplash.com/photo-1552664730-d307ca884978?auto=format&fit=crop&w=900&q=80",
    },
    {
      icon: Users,
      title: "Professional Development Courses",
      description: "Courses designed to upgrade workplace skills and enhance career prospects.",
      image: "https://images.unsplash.com/photo-1517048676732-d65bc937f952?auto=format&fit=crop&w=900&q=80",
    },
    {
      icon: Zap,
      title: "Online & Blended Learning",
      description: "Flexible digital and hybrid learning solutions that fit modern work environments.",
      image: "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=900&q=80",
    },
  ];

  const workshopServices = [
    {
      icon: BarChart3,
      title: "Skills Enhancement Workshops",
      description: "Hands-on sessions for practical skills development in specialized areas.",
      image: "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?auto=format&fit=crop&w=900&q=80",
    },
    {
      icon: Shield,
      title: "Leadership & Management Seminars",
      description: "Programs designed to strengthen leadership capabilities and management effectiveness.",
      image: "https://images.unsplash.com/photo-1542744173-8e7e53415bb0?auto=format&fit=crop&w=900&q=80",
    },
    {
      icon: Code,
      title: "Customized Training Sessions",
      description: "Training designed specifically for your company's unique needs and challenges.",
      image: "https://images.unsplash.com/photo-1461749280684-dccba630e2f6?auto=format&fit=crop&w=900&q=80",
    },
  ];

  const itServices = [
    {
      title: "Learning Management System Implementation",
      description:
        "Deployment and customization of LMS platforms for organizations seeking to centralize and scale their training programs.",
    },
    {
      title: "E-learning Platform Development",
      description:
        "Custom learning portals and training systems built to your specifications and integrated with existing systems.",
    },
    {
      title: "IT Consulting for Training Solutions",
      description:
        "Technology consulting for modern learning environments, including infrastructure planning and implementation.",
    },
  ];

  const advisoryServices = [
    {
      title: "Curriculum & Training Program Design",
      description: "Strategic design of comprehensive training programs aligned with organizational objectives.",
    },
    {
      title: "Learning Program Evaluation",
      description: "Assessment and evaluation of existing programs to identify improvement opportunities.",
    },
    {
      title: "Strategic IT Integration for Learning",
      description: "Planning and implementation of technology solutions to enhance learning effectiveness.",
    },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-white">
      <Navigation />

      <main className="animate-in fade-in-20 slide-in-from-bottom-4 duration-500">
        {/* Hero Section */}
        <section className="relative overflow-hidden py-20 md:py-32">
          <div
            className="absolute inset-0 bg-cover bg-center"
            style={{ backgroundImage: `url('${servicesBannerImage}')` }}
          />
          <div className="absolute inset-0 bg-gradient-to-r from-[#1b2e45]/88 via-[#1b2e45]/70 to-[#25badf]/45" />

          <div className="container mx-auto px-4 relative z-10">
            <ScrollReveal as="div" variant="pop" className="max-w-3xl">
              <p className="mb-4 inline-flex items-center gap-2 rounded-full border border-white/30 bg-white/10 px-4 py-1.5 text-sm font-semibold uppercase tracking-widest text-white">
                <Sparkles size={14} />
                End-to-End Solutions
              </p>
              <h1 className="heading-xl mb-6 text-white">Our Services</h1>
              <p className="text-xl text-white/90 leading-relaxed">
                Comprehensive solutions across learning, technology, and professional development designed to drive
                organizational success.
              </p>
            </ScrollReveal>
          </div>
        </section>

        {/* Learning Solutions */}
        <section className="py-20 md:py-32 bg-white">
        <div className="container mx-auto px-4">
          <ScrollReveal as="div" variant="fade-up" className="mb-12 text-center">
            <p className="mb-4 inline-flex items-center gap-2 rounded-full border border-[#25badf]/25 bg-[#25badf]/5 px-4 py-1.5 text-sm font-semibold uppercase tracking-widest text-[#1b2e45]">
              <BookOpen size={14} className="text-[#25badf]" />
              Learning Solutions
            </p>
            <h2 className="heading-lg mb-4 text-[#1b2e45]">Learning Solutions</h2>
            <p className="text-lg text-slate-600 mb-8 max-w-3xl mx-auto">
              Comprehensive training programs designed to build skills and drive organizational performance.
            </p>
          </ScrollReveal>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {learningServices.map((service, idx) => {
              const Icon = service.icon;
              return (
                <ScrollReveal
                  key={idx}
                  as="div"
                  variant="pop"
                  delay={idx * 80}
                  className="card-hover overflow-hidden rounded-2xl border border-slate-200 bg-slate-50 shadow-sm"
                >
                  <div className="relative h-36 w-full overflow-hidden">
                    <img src={service.image} alt={service.title} className="h-full w-full object-cover" />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#1b2e45]/60 to-transparent" />
                  </div>
                  <div className="p-6">
                    <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-xl bg-[#25badf]/15">
                      <Icon className="w-6 h-6 text-[#25badf]" />
                    </div>
                    <h3 className="heading-sm mb-3 text-[#1b2e45]">{service.title}</h3>
                    <p className="text-slate-600 leading-relaxed">{service.description}</p>
                  </div>
                </ScrollReveal>
              );
            })}
          </div>
        </div>
        </section>

        {/* Workshops & Seminars */}
        <section className="py-20 md:py-32 bg-slate-50">
        <div className="container mx-auto px-4">
          <ScrollReveal as="div" variant="fade-up" className="mb-12 text-center">
            <p className="mb-4 inline-flex items-center gap-2 rounded-full border border-[#25badf]/25 bg-white px-4 py-1.5 text-sm font-semibold uppercase tracking-widest text-[#1b2e45]">
              <Sparkles size={14} className="text-[#25badf]" />
              Workshops & Seminars
            </p>
            <h2 className="heading-lg mb-4 text-[#1b2e45]">Workshops & Seminars</h2>
            <p className="text-lg text-slate-600 mb-8 max-w-3xl mx-auto">
              Interactive sessions and seminars focused on practical skill development and leadership excellence.
            </p>
          </ScrollReveal>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {workshopServices.map((service, idx) => {
              const Icon = service.icon;
              return (
                <ScrollReveal
                  key={idx}
                  as="div"
                  variant="pop"
                  delay={idx * 80}
                  className="card-hover overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm"
                >
                  <div className="relative h-36 w-full overflow-hidden">
                    <img src={service.image} alt={service.title} className="h-full w-full object-cover" />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#1b2e45]/60 to-transparent" />
                  </div>
                  <div className="p-6">
                    <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-xl bg-[#25badf]/15">
                      <Icon className="w-6 h-6 text-[#25badf]" />
                    </div>
                    <h3 className="heading-sm mb-3 text-[#1b2e45]">{service.title}</h3>
                    <p className="text-slate-600 leading-relaxed">{service.description}</p>
                  </div>
                </ScrollReveal>
              );
            })}
          </div>
        </div>
        </section>

        {/* IT Services */}
        <section className="py-20 md:py-32 bg-white">
        <div className="container mx-auto px-4">
          <ScrollReveal as="div" variant="fade-up" className="mb-12 text-center">
            <h2 className="heading-lg mb-4 text-[#1b2e45]">IT Services</h2>
            <p className="text-lg text-slate-600 mb-8 max-w-3xl mx-auto">
              Technology solutions and consulting services to modernize your learning infrastructure.
            </p>
          </ScrollReveal>

          <div className="space-y-6">
            {itServices.map((service, idx) => (
              <ScrollReveal
                key={idx}
                as="div"
                variant="pop"
                delay={idx * 60}
                className="card-hover bg-slate-50 p-8 rounded-2xl border border-gray-200 shadow-sm"
              >
                <h3 className="heading-sm mb-3 text-[#1b2e45] inline-flex items-start gap-2">
                  <CheckCircle2 size={18} className="mt-1 text-[#25badf]" />
                  {service.title}
                </h3>
                <p className="text-slate-600 leading-relaxed">{service.description}</p>
              </ScrollReveal>
            ))}
          </div>
        </div>
        </section>

        {/* Advisory Services */}
        <section className="py-20 md:py-32 bg-slate-50">
        <div className="container mx-auto px-4">
          <ScrollReveal as="div" variant="fade-up" className="mb-12 text-center">
            <h2 className="heading-lg mb-4 text-[#1b2e45]">Advisory Services</h2>
            <p className="text-lg text-slate-600 mb-8 max-w-3xl mx-auto">
              Strategic consulting to optimize your learning and development initiatives.
            </p>
          </ScrollReveal>

          <div className="space-y-6">
            {advisoryServices.map((service, idx) => (
              <ScrollReveal
                key={idx}
                as="div"
                variant="pop"
                delay={idx * 60}
                className="card-hover bg-white p-8 rounded-2xl border border-gray-200 shadow-sm"
              >
                <h3 className="heading-sm mb-3 text-[#1b2e45] inline-flex items-start gap-2">
                  <CheckCircle2 size={18} className="mt-1 text-[#25badf]" />
                  {service.title}
                </h3>
                <p className="text-slate-600 leading-relaxed">{service.description}</p>
              </ScrollReveal>
            ))}
          </div>
        </div>
        </section>

        {/* CTA Section */}
        <section className="py-20 md:py-32 bg-[#1b2e45] text-white">
        <ScrollReveal as="div" variant="pop" className="container mx-auto px-4 text-center">
          <h2 className="text-4xl md:text-5xl font-bold mb-6">Ready to Get Started?</h2>
          <p className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto">
            Let's discuss which services are right for your organization and how we can help you achieve your goals.
          </p>
          <Link href="/contact">
            <span className="inline-flex items-center gap-2 bg-[#25badf] text-white px-8 py-4 rounded-md font-semibold hover:bg-[#1a8fb8] transition-all duration-300 hover:-translate-y-0.5 hover:shadow-xl">
              Schedule a Consultation
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
