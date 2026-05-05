import { useState } from "react";
import { Mail, Phone, MapPin, Building2, MessageSquare, User, ArrowRight, Sparkles, CheckCircle2 } from "lucide-react";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { toast } from "sonner";
import ScrollReveal from "@/components/ScrollReveal";
import { apiUrl } from "@/lib/api";

/**
 * Contact Page
 * Design Philosophy: Modern Corporate Minimalism
 * - Contact form with validation
 * - Company contact information
 * - Social media links
 * - Professional layout with teal accents
 */
export default function Contact() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    company: "",
    message: "",
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.name || !formData.email || !formData.message) {
      toast.error("Please fill in all required fields");
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      toast.error("Please enter a valid email address");
      return;
    }

    setIsSubmitting(true);

    try {
      const res = await fetch(apiUrl("/api/inquiries"), {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (!res.ok) {
        let errorMessage = "An error occurred. Please try again.";
        try {
          const data = await res.json();
          if (data?.error) errorMessage = data.error;
        } catch {
          // ignore
        }
        throw new Error(errorMessage);
      }

      toast.success("Thank you for your message! We'll be in touch soon.");
      setFormData({
        name: "",
        email: "",
        phone: "",
        company: "",
        message: "",
      });
    } catch (error) {
      toast.error(error?.message || "An error occurred. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-white">
      <Navigation />

      <main className="animate-in fade-in-20 slide-in-from-bottom-4 duration-500">
        {/* Hero Section */}
        <section className="relative overflow-hidden py-20 md:py-32 bg-gradient-to-br from-[#25badf]/10 to-[#1b2e45]/10">
          <div className="absolute -top-20 right-0 h-72 w-72 rounded-full bg-[#25badf]/20 blur-3xl" />
          <div className="absolute bottom-0 left-0 h-60 w-60 rounded-full bg-[#1b2e45]/10 blur-3xl" />

          <div className="container mx-auto px-4 relative z-10">
            <ScrollReveal as="div" variant="pop" className="max-w-3xl">
              <p className="mb-4 inline-flex items-center gap-2 rounded-full border border-[#25badf]/30 bg-white/80 px-4 py-1.5 text-sm font-semibold uppercase tracking-widest text-[#1b2e45]">
                <Sparkles size={14} className="text-[#25badf]" />
                Let&apos;s Start a Conversation
              </p>
              <h1 className="heading-xl mb-6">Get in Touch</h1>
              <p className="text-xl text-gray-700 leading-relaxed">
                Have questions or ready to discuss your learning and development needs? We&apos;d love to hear from you.
              </p>
            </ScrollReveal>
          </div>
        </section>

        {/* Contact Section */}
        <section className="relative py-20 md:py-32 bg-slate-50 overflow-hidden">
        <div className="absolute inset-0 opacity-50 [background-image:radial-gradient(#25badf_1px,transparent_1px)] [background-size:22px_22px]" />
        <div className="container mx-auto px-4">
          <div className="relative z-10 grid grid-cols-1 lg:grid-cols-3 gap-10 lg:gap-12 items-start">
            {/* Contact Information */}
            <div className="lg:col-span-1">
              <div className="space-y-8">
                {/* Email */}
                <ScrollReveal as="div" variant="pop" className="card-hover bg-white p-8 rounded-2xl border border-gray-200 shadow-sm">
                  <div className="flex items-start gap-4">
                    <Mail className="w-8 h-8 text-[#25badf] flex-shrink-0 mt-1" />
                    <div>
                      <h3 className="text-xl font-bold text-[#1b2e45] mb-2">Email</h3>
                      <a
                        href="mailto:info@owlvantage.com"
                        className="text-slate-600 hover:text-[#25badf] transition-colors"
                      >
                        info@owlvantage.com
                      </a>
                    </div>
                  </div>
                </ScrollReveal>

                {/* Phone */}
                <ScrollReveal
                  as="div"
                  variant="pop"
                  delay={80}
                  className="card-hover bg-white p-8 rounded-2xl border border-gray-200 shadow-sm"
                >
                  <div className="flex items-start gap-4">
                    <Phone className="w-8 h-8 text-[#25badf] flex-shrink-0 mt-1" />
                    <div>
                      <h3 className="text-xl font-bold text-[#1b2e45] mb-2">Phone</h3>
                      <a
                        href="tel:09567193823"
                        className="text-slate-600 hover:text-[#25badf] transition-colors"
                      >
                        0956 719 3823
                      </a>
                    </div>
                  </div>
                </ScrollReveal>

                {/* Location */}
                <ScrollReveal
                  as="div"
                  variant="pop"
                  delay={160}
                  className="card-hover bg-white p-8 rounded-2xl border border-gray-200 shadow-sm"
                >
                  <div className="flex items-start gap-4">
                    <MapPin className="w-8 h-8 text-[#25badf] flex-shrink-0 mt-1" />
                    <div>
                      <h3 className="text-xl font-bold text-[#1b2e45] mb-2">Location</h3>
                      <p className="text-slate-600">Serving clients globally</p>
                      <p className="text-slate-600 text-sm mt-2">Virtual and in-person options available</p>
                    </div>
                  </div>
                </ScrollReveal>

                {/* Social Media */}
                <ScrollReveal
                  as="div"
                  variant="fade-up"
                  delay={220}
                  className="bg-[#25badf]/10 p-8 rounded-2xl border border-[#25badf]/20"
                >
                  <h3 className="text-xl font-bold text-[#1b2e45] mb-4">Connect With Us</h3>
                  <div className="space-y-3">
                    <a
                      href="#"
                      className="block text-[#25badf] hover:underline font-medium"
                      aria-label="LinkedIn"
                    >
                      LinkedIn
                    </a>
                    <a
                      href="https://www.facebook.com/owlvantagesolutions"
                      target="_blank"
                      rel="noreferrer"
                      className="block text-[#25badf] hover:underline font-medium"
                      aria-label="Facebook"
                    >
                      Facebook
                    </a>
                    <a
                      href="#"
                      className="block text-[#25badf] hover:underline font-medium"
                      aria-label="Twitter"
                    >
                      Twitter/X
                    </a>
                  </div>
                </ScrollReveal>
              </div>
            </div>

            {/* Contact Form */}
            <div className="lg:col-span-2">
              <ScrollReveal as="div" variant="fade-up">
                <form onSubmit={handleSubmit} className="space-y-6 rounded-2xl border border-slate-200 bg-white p-6 md:p-10 shadow-xl shadow-slate-900/5">
                <div className="flex items-start justify-between gap-4 flex-wrap">
                  <div>
                    <h2 className="heading-sm mb-2">Send Us a Message</h2>
                    <p className="text-slate-600">Tell us about your goals and we&apos;ll recommend the best next steps.</p>
                  </div>
                  <span className="inline-flex items-center gap-1.5 rounded-full bg-[#25badf]/10 px-3 py-1 text-xs font-semibold text-[#1b2e45]">
                    <CheckCircle2 size={14} className="text-[#25badf]" />
                    Typically replies within 24 hours
                  </span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Name */}
                  <div>
                    <label htmlFor="name" className="flex items-center gap-2 text-sm font-semibold text-[#1b2e45] mb-2">
                      <User size={15} className="text-[#25badf]" /> Name *
                    </label>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#25badf] focus:border-transparent transition-all"
                      placeholder="Your name"
                      required
                    />
                  </div>

                  {/* Email */}
                  <div>
                    <label htmlFor="email" className="flex items-center gap-2 text-sm font-semibold text-[#1b2e45] mb-2">
                      <Mail size={15} className="text-[#25badf]" /> Email *
                    </label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#25badf] focus:border-transparent transition-all"
                      placeholder="your@email.com"
                      required
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Phone */}
                  <div>
                    <label htmlFor="phone" className="flex items-center gap-2 text-sm font-semibold text-[#1b2e45] mb-2">
                      <Phone size={15} className="text-[#25badf]" /> Phone
                    </label>
                    <input
                      type="tel"
                      id="phone"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#25badf] focus:border-transparent transition-all"
                      placeholder="Your phone number"
                    />
                  </div>

                  {/* Company */}
                  <div>
                    <label htmlFor="company" className="flex items-center gap-2 text-sm font-semibold text-[#1b2e45] mb-2">
                      <Building2 size={15} className="text-[#25badf]" /> Company
                    </label>
                    <input
                      type="text"
                      id="company"
                      name="company"
                      value={formData.company}
                      onChange={handleChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#25badf] focus:border-transparent transition-all"
                      placeholder="Your company"
                    />
                  </div>
                </div>

                {/* Message */}
                <div>
                  <label htmlFor="message" className="flex items-center gap-2 text-sm font-semibold text-[#1b2e45] mb-2">
                    <MessageSquare size={15} className="text-[#25badf]" /> Message *
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    rows={6}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#25badf] focus:border-transparent transition-all resize-none"
                    placeholder="Tell us about your needs..."
                    required
                  ></textarea>
                </div>

                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="btn-primary w-full inline-flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isSubmitting ? "Sending..." : "Send Message"}
                  {!isSubmitting && <ArrowRight size={16} />}
                </button>

                <p className="text-sm text-slate-600 text-center">
                  We'll get back to you as soon as possible. Thank you for reaching out!
                </p>
                </form>
              </ScrollReveal>
            </div>
          </div>
        </div>
        </section>

        {/* CTA Section */}
        <section className="py-20 md:py-32 bg-gray-50">
        <ScrollReveal as="div" variant="pop" className="container mx-auto px-4 text-center">
          <h2 className="text-4xl md:text-5xl font-bold text-[#1b2e45] mb-6">Prefer to Call?</h2>
          <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
            Our team is ready to discuss your learning and development needs. Reach out via email or contact form above.
          </p>
          <a href="tel:09567193823" className="btn-primary inline-flex items-center gap-2">
            Talk to Our Team
            <Phone size={16} />
          </a>
        </ScrollReveal>
        </section>
      </main>

      <Footer />
    </div>
  );
}
