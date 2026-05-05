import { useEffect, useState } from "react";
import { Link } from "wouter";
import { ArrowRight, BookOpen, Zap, Users, Calendar, Clock3, MapPin, Sparkles, GraduationCap } from "lucide-react";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import ScrollReveal from "@/components/ScrollReveal";
import { apiUrl } from "@/lib/api";

/**
 * Home Page
 * Design Philosophy: Modern Corporate Minimalism
 * - Hero section with owl imagery and clear CTA
 * - Services overview with icons
 * - Why Choose Owlvantage section
 * - Featured seminars
 * - Professional, clean layout with teal accents
 */
export default function Home() {
  const [featuredPrograms, setFeaturedPrograms] = useState([]);

  const services = [
    {
      icon: "https://d2xsxph8kpxj0f.cloudfront.net/310519663423259711/4MdUcbSqby5GLfYivgSoHu/services-icon-learning-2xMeMbGDWAgyd4RsYfkHi3.webp",
      title: "Learning Solutions",
      description: "Comprehensive training programs tailored to organizational growth and employee development.",
    },
    {
      icon: "https://d2xsxph8kpxj0f.cloudfront.net/310519663423259711/4MdUcbSqby5GLfYivgSoHu/services-icon-it-HSHoMpc3ov92oSAdHhNTuy.webp",
      title: "IT Services",
      description: "Technology-driven solutions for modern learning environments and digital transformation.",
    },
    {
      icon: "https://d2xsxph8kpxj0f.cloudfront.net/310519663423259711/4MdUcbSqby5GLfYivgSoHu/services-icon-workshops-aeUfWhf68GuTJ4R5KZ54kc.webp",
      title: "Workshops & Seminars",
      description: "Hands-on training sessions and seminars designed for practical skills development.",
    },
  ];

  const whyChoose = [
    { icon: Users, text: "Expert trainers with industry experience" },
    { icon: BookOpen, text: "Industry-relevant programs and curriculum" },
    { icon: Zap, text: "Technology-driven learning approach" },
    { icon: ArrowRight, text: "Customized corporate solutions" },
  ];

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const res = await fetch(apiUrl("/api/events"));
        if (!res.ok) {
          throw new Error("Failed to fetch events");
        }

        const data = await res.json();
        const rows = Array.isArray(data) ? data : [];
        setFeaturedPrograms(rows.filter((event) => event.type === "featured"));
      } catch (error) {
        console.error("Failed to fetch featured programs", error);
        setFeaturedPrograms([]);
      }
    };

    fetchEvents();
  }, []);

  return (
    <div className="min-h-screen flex flex-col bg-white">
      <Navigation />

      {/* Hero Section */}
      <section
        className="relative py-20 md:py-32 bg-cover bg-center"
        style={{
          backgroundImage:
            "url('https://d2xsxph8kpxj0f.cloudfront.net/310519663423259711/4MdUcbSqby5GLfYivgSoHu/hero-background-LYEmnoHrvHVcJWDCjgvCAY.webp')",
        }}
      >
        <div className="absolute inset-0 bg-white/70"></div>
        <div className="container mx-auto px-4 relative z-10">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
            <ScrollReveal as="div" variant="pop">
              <h1 className="heading-xl mb-4">Empowering Learning Through Technology</h1>
              <p className="text-xl text-gray-700 mb-2 font-semibold text-[#25badf]">See Smarter</p>
              <p className="text-lg text-gray-600 mb-8 leading-relaxed">
                Owlvantage Solutions provides innovative learning and technology solutions designed to transform
                organizations and professionals.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Link href="/seminars">
                  <span className="btn-primary inline-flex w-full sm:w-auto items-center justify-center gap-2">
                    Book a Seminar <ArrowRight size={18} />
                  </span>
                </Link>
                <Link href="/contact">
                  <span className="btn-outline inline-flex w-full sm:w-auto items-center justify-center gap-2">
                    Request Consultation <ArrowRight size={18} />
                  </span>
                </Link>
              </div>
            </ScrollReveal>
          </div>
        </div>
      </section>

      {/* Services Overview */}
      <section className="py-20 md:py-32 bg-gray-50">
        <div className="container mx-auto px-4">
          <ScrollReveal as="div" variant="fade-up" className="text-center mb-16">
            <h2 className="heading-lg mb-4">Our Services</h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              We offer comprehensive solutions across learning, technology, and professional development.
            </p>
          </ScrollReveal>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {services.map((service, idx) => (
              <ScrollReveal
                key={idx}
                as="div"
                variant="pop"
                delay={idx * 80}
                className="card-hover bg-white p-8 rounded-lg border border-gray-200"
              >
                <img src={service.icon} alt={service.title} className="w-20 h-20 mb-6" />
                <h3 className="heading-sm mb-3">{service.title}</h3>
                <p className="text-gray-600 leading-relaxed">{service.description}</p>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* Why Choose Owlvantage */}
      <section className="py-20 md:py-32 bg-white">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            <ScrollReveal as="div" variant="fade-up">
              <h2 className="heading-lg mb-8">Why Choose Owlvantage</h2>
              <div className="space-y-6">
                {whyChoose.map((item, idx) => {
                  const Icon = item.icon;
                  return (
                    <ScrollReveal key={idx} as="div" variant="fade-up" delay={idx * 70} className="flex gap-4 items-start">
                      <div className="flex-shrink-0 mt-1">
                        <Icon className="w-6 h-6 text-[#25badf]" />
                      </div>
                      <p className="text-lg text-gray-700 font-medium">{item.text}</p>
                    </ScrollReveal>
                  );
                })}
              </div>
            </ScrollReveal>
            <ScrollReveal as="div" variant="pop" className="bg-white p-8 rounded-lg border border-gray-200 card-hover">
              <div className="flex flex-col lg:flex-row lg:items-center gap-8">
                <div className="text-center lg:text-left">
                  <div className="text-4xl sm:text-5xl lg:text-6xl font-bold text-[#25badf] leading-none">15+</div>
                  <p className="mt-3 text-gray-700 font-semibold">Years of Industry Experience</p>
                </div>

                <div className="lg:flex-1 text-center lg:text-left">
                  <p className="text-gray-600 leading-relaxed mb-6">
                    Trusted by leading organizations to deliver transformative learning and technology solutions.
                  </p>
                  <Link href="/about">
                    <span className="text-[#25badf] font-semibold hover:underline inline-flex items-center gap-2">
                      Learn More <ArrowRight size={18} />
                    </span>
                  </Link>
                </div>
              </div>
            </ScrollReveal>
          </div>
        </div>
      </section>

      {/* Featured Seminars */}
      <section className="relative py-20 md:py-32 bg-slate-50 overflow-hidden">
        <div className="absolute -top-20 right-0 h-72 w-72 rounded-full bg-[#25badf]/15 blur-3xl" />
        <div className="absolute -bottom-16 left-10 h-64 w-64 rounded-full bg-[#1b2e45]/8 blur-3xl" />
        <div className="container mx-auto px-4">
          <ScrollReveal as="div" variant="fade-up" className="relative z-10 text-center mb-16">
            <p className="mb-4 inline-flex items-center gap-2 rounded-full border border-[#25badf]/25 bg-white px-4 py-1.5 text-sm font-semibold uppercase tracking-widest text-[#1b2e45]">
              <Sparkles size={14} className="text-[#25badf]" />
              Signature Programs
            </p>
            <h2 className="heading-lg mb-4">Featured Programs</h2>
            <p className="text-lg text-slate-600 max-w-2xl mx-auto">
              Explore our most popular seminars and training programs.
            </p>
          </ScrollReveal>

          {featuredPrograms.length > 0 ? (
            <div className="relative z-10 grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
              {featuredPrograms.map((program, idx) => (
                <ScrollReveal
                  key={program.id ?? idx}
                  as="div"
                  variant="pop"
                  delay={idx * 80}
                  className="card-hover rounded-2xl border border-slate-200 bg-white shadow-sm"
                >
                  <div className="p-7">
                    <h3 className="heading-sm mb-3 text-[#1b2e45]">{program.title}</h3>
                    <p className="text-slate-600 mb-5 leading-relaxed">{program.description || "No description provided yet."}</p>
                    <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-sm text-slate-600 mb-6">
                      {program.type === "featured" ? (
                        <>
                          <span className="inline-flex items-center gap-2 whitespace-nowrap">
                            <Clock3 size={15} className="shrink-0 text-[#25badf]" />
                            {program.duration || "Duration TBD"}
                          </span>
                          <span className="inline-flex items-center gap-2 whitespace-nowrap">
                            <GraduationCap size={15} className="shrink-0 text-[#25badf]" />
                            {program.level || "Level TBD"}
                          </span>
                          <span className="inline-flex items-center gap-2 whitespace-nowrap">
                            <MapPin size={15} className="shrink-0 text-[#25badf]" />
                            {program.location || "Location TBD"}
                          </span>
                        </>
                      ) : (
                        <>
                          <span className="inline-flex items-center gap-2 whitespace-nowrap">
                            <Calendar size={15} className="shrink-0 text-[#25badf]" />
                            {program.date || "Date TBD"}
                          </span>
                          <span className="inline-flex items-center gap-2 whitespace-nowrap">
                            <Clock3 size={15} className="shrink-0 text-[#25badf]" />
                            {program.time || "Time TBD"}
                          </span>
                          <span className="inline-flex items-center gap-2 whitespace-nowrap">
                            <MapPin size={15} className="shrink-0 text-[#25badf]" />
                            {program.location || "Location TBD"}
                          </span>
                        </>
                      )}
                    </div>
                    <Link href="/seminars">
                      <span className="text-[#25badf] font-semibold hover:underline inline-flex items-center gap-2">
                        Learn More <ArrowRight size={18} />
                      </span>
                    </Link>
                  </div>
                </ScrollReveal>
              ))}
            </div>
          ) : (
            <div className="relative z-10 mb-12 rounded-lg border border-dashed border-gray-300 bg-white p-8 text-center text-gray-600">
              No featured programs yet. Add events with type <span className="font-semibold">Featured Program</span> in the admin dashboard.
            </div>
          )}

          <ScrollReveal as="div" variant="fade-up" className="text-center">
            <Link href="/seminars">
              <span className="btn-primary inline-flex items-center gap-2">
                View All Programs <ArrowRight size={18} />
              </span>
            </Link>
          </ScrollReveal>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 md:py-32 bg-[#1b2e45] text-white">
        <ScrollReveal as="div" variant="pop" className="container mx-auto px-4 text-center">
          <h2 className="text-4xl md:text-5xl font-bold mb-6">Ready to Transform Your Organization?</h2>
          <p className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto">
            Let's discuss how Owlvantage Solutions can help your team achieve its goals through innovative learning and
            technology solutions.
          </p>
          <Link href="/contact">
            <span className="inline-flex items-center gap-2 bg-[#25badf] text-white px-8 py-4 rounded-md font-semibold hover:bg-[#1a8fb8] transition-all duration-300">
              Request a Consultation <ArrowRight size={18} />
            </span>
          </Link>
        </ScrollReveal>
      </section>

      <Footer />
    </div>
  );
}
