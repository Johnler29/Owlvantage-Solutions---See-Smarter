import { useState, useEffect } from "react";
import { Link } from "wouter";
import { Calendar, Users, Award, Network, Clock3, ArrowRight, Sparkles, MapPin } from "lucide-react";
import { toast } from "sonner";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import ScrollReveal from "@/components/ScrollReveal";
import { apiUrl } from "@/lib/api";
import { EventCardSkeleton } from "@/components/ui/card-skeleton";
import { SeminarListSkeleton } from "@/components/ui/card-skeleton";
import { ModalFormSkeleton } from "@/components/ui/form-skeleton";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

/**
 * Seminars Page
 * Design Philosophy: Modern Corporate Minimalism
 * - Featured programs showcase
 * - Upcoming seminars schedule
 * - Benefits of attending
 * - Professional layout with teal accents
 */
export default function Seminars() {
  const emptyFormData = {
    name: "",
    email: "",
    phone: "",
    company: "",
    message: "",
  };

  const [featuredPrograms, setFeaturedPrograms] = useState([]);
  const [upcomingSeminars, setUpcomingSeminars] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedSeminarId, setSelectedSeminarId] = useState(null);
  const [selectedSeminar, setSelectedSeminar] = useState(null);
  const [isRegistrationModalOpen, setIsRegistrationModalOpen] = useState(false);
  const [formData, setFormData] = useState({ ...emptyFormData });
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    try {
      const saved = localStorage.getItem("selectedSeminar");
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed?.id) {
          setSelectedSeminarId(parsed.id);
          setSelectedSeminar(parsed);
        }
      }
    } catch {
      // ignore localStorage parsing errors
    }
  }, []);

  useEffect(() => {
    const fetchEvents = async () => {
      setIsLoading(true);
      try {
        const res = await fetch(apiUrl("/api/events"));
        if (!res.ok) {
          throw new Error("Failed to fetch events");
        }

        const data = await res.json();
        const rows = Array.isArray(data) ? data : [];

        setFeaturedPrograms(rows.filter((e) => e.type === "featured"));
        setUpcomingSeminars(rows.filter((e) => e.type === "upcoming"));
      } catch (err) {
        console.error("Failed to fetch events", err);
        setFeaturedPrograms([]);
        setUpcomingSeminars([]);
      } finally {
        setIsLoading(false);
      }
    };
    fetchEvents();
  }, []);

  const benefits = [
    { icon: Award, text: "Learn from industry experts" },
    { icon: Users, text: "Gain practical, applicable skills" },
    { icon: Network, text: "Network with professionals" },
    { icon: Calendar, text: "Improve leadership and productivity" },
  ];

  const seminarBannerImage =
    "https://images.unsplash.com/photo-1543269865-cbf427effbad?auto=format&fit=crop&w=1800&q=80";

  const handleRegisterNow = (seminar) => {
    if (!seminar?.id) {
      toast.error("This seminar is not available for registration yet.");
      return;
    }

    const payload = {
      id: seminar.id,
      title: seminar.title,
      date: seminar.date,
      time: seminar.time,
    };

    localStorage.setItem("selectedSeminar", JSON.stringify(payload));
    setSelectedSeminarId(seminar.id);
    setSelectedSeminar(payload);
    setIsRegistrationModalOpen(true);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmitRegistration = async (e) => {
    e.preventDefault();

    if (!selectedSeminar?.id) {
      toast.error("Please select a seminar first.");
      return;
    }

    if (!formData.name || !formData.email) {
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
      const res = await fetch(apiUrl("/api/register-seminar"), {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...formData,
          seminar_id: selectedSeminar.id,
        }),
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

      toast.success("You are successfully registered for this seminar.");
      setFormData({ ...emptyFormData });
      setIsRegistrationModalOpen(false);
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
        <section className="relative overflow-hidden py-20 md:py-32">
          <div
            className="absolute inset-0 bg-cover bg-center"
            style={{ backgroundImage: `url('${seminarBannerImage}')` }}
          />
          <div className="absolute inset-0 bg-gradient-to-r from-[#1b2e45]/85 via-[#1b2e45]/70 to-[#25badf]/40" />
          <div className="absolute -bottom-20 -left-20 h-56 w-56 rounded-full bg-[#25badf]/30 blur-3xl" />

          <div className="container mx-auto px-4 relative z-10">
            <ScrollReveal as="div" variant="pop" className="max-w-3xl">
              <p className="mb-4 inline-flex items-center gap-2 rounded-full border border-white/30 bg-white/10 px-4 py-1.5 text-sm font-semibold uppercase tracking-widest text-white">
                <Sparkles size={14} />
                Professional Learning Tracks
              </p>
              <h1 className="heading-xl mb-6 text-white">Seminars & Workshops</h1>
              <p className="text-xl text-white/85 leading-relaxed max-w-2xl">
                Discover our comprehensive range of seminars and workshops designed to develop skills, enhance leadership,
                and drive organizational success.
              </p>
            </ScrollReveal>
          </div>
        </section>

        {/* Featured Programs */}
        <section className="py-20 md:py-32 bg-gradient-to-br from-[#1b2e45]/5 via-white to-[#0f1a2e]/5 relative overflow-hidden">
          <div className="absolute -top-20 right-0 h-72 w-72 rounded-full bg-[#1b2e45]/10 blur-3xl" />
          <div className="absolute -bottom-16 left-10 h-64 w-64 rounded-full bg-[#0f1a2e]/10 blur-3xl" />
        <div className="container mx-auto px-4 relative z-10">
          <ScrollReveal as="div" variant="fade-up" className="text-center mb-16">
            <span className="inline-flex items-center gap-2 rounded-full bg-[#1b2e45]/10 text-[#1b2e45] px-4 py-1.5 text-sm font-semibold uppercase tracking-widest mb-4">
              <Sparkles size={14} />
              Featured
            </span>
            <h2 className="heading-lg mb-4">Featured Programs</h2>
            <p className="text-lg text-slate-600 max-w-2xl mx-auto">
              Our most popular seminars and training programs designed for professional development.
            </p>
          </ScrollReveal>

          {isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {Array.from({ length: 2 }).map((_, idx) => (
                <EventCardSkeleton key={idx} />
              ))}
            </div>
          ) : featuredPrograms.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {featuredPrograms.map((program, idx) => (
                <ScrollReveal
                  key={program.id ?? idx}
                  as="div"
                  variant="pop"
                  delay={idx * 80}
                  className="card-featured"
                >
                  <div className="p-7">
                    <div className="flex items-start justify-between gap-4 mb-4">
                      <h3 className="text-2xl font-bold text-[#1b2e45] leading-tight">{program.title}</h3>
                      <span className="badge-navy">
                        <Sparkles size={12} />
                        Featured
                      </span>
                    </div>

                    <p className="text-slate-600 mb-6 leading-relaxed">
                      {program.description || "No description provided yet."}
                    </p>

                    <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-sm">
                      <span className="badge-teal">
                        <Clock3 size={14} className="shrink-0" />
                        {program.duration || "Duration TBD"}
                      </span>
                      <span className="badge-navy">
                        <Sparkles size={14} className="shrink-0" />
                        {program.level || "Level TBD"}
                      </span>
                      <span className="badge-teal">
                        <MapPin size={14} className="shrink-0" />
                        {program.location || "Location TBD"}
                      </span>
                    </div>

                    <div className="mt-7">
                      <button
                        type="button"
                        onClick={() => handleRegisterNow(program)}
                        className="btn-primary inline-flex items-center gap-2"
                      >
                        Register Now
                        <ArrowRight size={16} />
                      </button>
                    </div>
                  </div>
                </ScrollReveal>
              ))}
            </div>
          ) : (
            <div className="rounded-lg border-2 border-dashed border-[#1b2e45]/30 bg-[#1b2e45]/5 p-8 text-center text-slate-600">
              No featured programs yet. Add events with type <span className="font-semibold text-[#1b2e45]">Featured Program</span> in the admin dashboard.
            </div>
          )}
        </div>
        </section>

        {/* Upcoming Seminars */}
        <section className="py-20 md:py-32 bg-gradient-to-br from-[#25badf]/5 via-white to-[#0fa3c1]/5 relative overflow-hidden">
          <div className="absolute top-10 right-10 h-40 w-40 rounded-full bg-[#25badf]/10 blur-3xl" />
          <div className="absolute bottom-10 left-10 h-32 w-32 rounded-full bg-[#0fa3c1]/10 blur-3xl" />
        <div className="container mx-auto px-4 relative z-10">
          <ScrollReveal as="div" variant="fade-up" className="text-center mb-14">
            <span className="inline-flex items-center gap-2 rounded-full bg-[#25badf]/10 text-[#25badf] px-4 py-1.5 text-sm font-semibold uppercase tracking-widest mb-4">
              <Sparkles size={14} />
              Coming Soon
            </span>
            <h2 className="heading-lg mb-4">Upcoming Seminars</h2>
            <p className="text-lg text-slate-600 max-w-2xl mx-auto">
              Register for our upcoming seminars and start your learning journey today.
            </p>
          </ScrollReveal>

          {isLoading ? (
            <div className="space-y-6">
              {Array.from({ length: 3 }).map((_, idx) => (
                <SeminarListSkeleton key={idx} />
              ))}
            </div>
          ) : upcomingSeminars.length > 0 ? (
            <div className="space-y-6">
              {upcomingSeminars.map((seminar, idx) => (
                <ScrollReveal
                  key={seminar.id ?? idx}
                  as="div"
                  variant="pop"
                  delay={idx * 70}
                  className="card-hover bg-white p-8 rounded-lg border-2 border-[#25badf]/20 hover:border-[#25badf]/40 transition-all shadow-sm"
                >
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-6 items-center">
                    <div className="p-5 bg-gradient-to-br from-[#25badf]/10 to-[#0fa3c1]/10 rounded-lg">
                      <div className="text-[#25badf] font-bold text-lg">{seminar.date || "Date TBD"}</div>
                      <p className="text-slate-600 text-sm">{seminar.time || "Time TBD"}</p>
                    </div>

                    <div className="md:col-span-2">
                      <h3 className="heading-sm text-[#1b2e45] mb-2">{seminar.title}</h3>
                      <p className="text-slate-600 flex items-center gap-2">
                        <Calendar size={16} className="text-[#25badf]" />
                        {seminar.location || "Location TBD"}
                      </p>
                    </div>

                    <div className="text-right">
                      <button
                        type="button"
                        onClick={() => handleRegisterNow(seminar)}
                        className="btn-primary inline-flex items-center gap-2"
                      >
                        Register Now
                        <ArrowRight size={16} />
                      </button>
                    </div>
                  </div>
                </ScrollReveal>
              ))}
            </div>
          ) : (
            <div className="rounded-lg border-2 border-dashed border-[#25badf]/30 bg-[#25badf]/5 p-8 text-center text-slate-600">
              No upcoming seminars yet. Add events with type <span className="font-semibold text-[#25badf]">Upcoming</span> in the admin dashboard.
            </div>
          )}
        </div>
        </section>

        {/* Benefits */}
        <section className="py-20 md:py-32 bg-white">
        <div className="container mx-auto px-4">
          <ScrollReveal as="div" variant="fade-up" className="text-center mb-16">
            <h2 className="heading-lg mb-4">Benefits of Attending</h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Discover what our participants gain from our seminars and workshops.
            </p>
          </ScrollReveal>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {benefits.map((benefit, idx) => {
              const Icon = benefit.icon;
              return (
                <ScrollReveal
                  key={idx}
                  as="div"
                  variant="pop"
                  delay={idx * 80}
                  className="card-hover bg-slate-50 p-8 rounded-2xl border border-gray-200 shadow-sm"
                >
                  <div className="flex items-start gap-4">
                    <Icon className="w-10 h-10 text-[#25badf] flex-shrink-0 mt-1" />
                    <p className="text-lg text-slate-700 font-medium">{benefit.text}</p>
                  </div>
                </ScrollReveal>
              );
            })}
          </div>
        </div>
        </section>

        {/* Promotional Banner */}
        <section className="py-20 md:py-32 bg-[#1b2e45] text-white">
        <ScrollReveal as="div" variant="pop" className="container mx-auto px-4 text-center">
          <h2 className="text-4xl md:text-5xl font-bold mb-6">Ready to Enhance Your Skills?</h2>
          <p className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto">
            Join hundreds of professionals who have transformed their careers through our seminars and workshops.
          </p>
          <Link href="/contact">
            <span className="inline-flex items-center gap-2 bg-[#25badf] text-white px-8 py-4 rounded-md font-semibold hover:bg-[#1a8fb8] transition-all duration-300 hover:-translate-y-0.5 hover:shadow-xl">
              Book a Seminar
              <ArrowRight size={18} />
            </span>
          </Link>
        </ScrollReveal>
        </section>
      </main>

      <Dialog open={isRegistrationModalOpen} onOpenChange={setIsRegistrationModalOpen}>
        <DialogContent className="rounded-xl border-slate-200 sm:max-w-2xl">
          <DialogHeader>
            <DialogTitle>Seminar Registration</DialogTitle>
            <DialogDescription>
              Complete the form below to register for your selected seminar.
            </DialogDescription>
          </DialogHeader>

          <div className="rounded-lg border border-[#25badf]/20 bg-[#25badf]/10 p-4">
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <div>
                <p className="mb-1 text-xs font-semibold uppercase tracking-wide text-slate-500">Seminar Title</p>
                <p className="text-sm font-medium text-slate-900">{selectedSeminar?.title || "-"}</p>
              </div>
              <div>
                <p className="mb-1 text-xs font-semibold uppercase tracking-wide text-slate-500">Date & Time</p>
                <p className="text-sm font-medium text-slate-900">
                  {`${selectedSeminar?.date || "TBD"}${selectedSeminar?.time ? ` | ${selectedSeminar.time}` : ""}`}
                </p>
              </div>
            </div>
          </div>

          {isSubmitting ? (
            <ModalFormSkeleton />
          ) : (
            <form onSubmit={handleSubmitRegistration} className="space-y-4">
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <div>
                <label htmlFor="modal-name" className="mb-1 block text-sm font-semibold text-[#1b2e45]">
                  Name *
                </label>
                <input
                  id="modal-name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  className="input-base"
                  placeholder="Your name"
                  required
                />
              </div>
              <div>
                <label htmlFor="modal-email" className="mb-1 block text-sm font-semibold text-[#1b2e45]">
                  Email *
                </label>
                <input
                  id="modal-email"
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleChange}
                  className="input-base"
                  placeholder="you@email.com"
                  required
                />
              </div>
              <div>
                <label htmlFor="modal-phone" className="mb-1 block text-sm font-semibold text-[#1b2e45]">
                  Phone
                </label>
                <input
                  id="modal-phone"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  className="input-base"
                  placeholder="Your phone number"
                />
              </div>
              <div>
                <label htmlFor="modal-company" className="mb-1 block text-sm font-semibold text-[#1b2e45]">
                  Company
                </label>
                <input
                  id="modal-company"
                  name="company"
                  value={formData.company}
                  onChange={handleChange}
                  className="input-base"
                  placeholder="Your company"
                />
              </div>
            </div>

            <div>
              <label htmlFor="modal-message" className="mb-1 block text-sm font-semibold text-[#1b2e45]">
                Message
              </label>
              <textarea
                id="modal-message"
                name="message"
                value={formData.message}
                onChange={handleChange}
                rows={4}
                className="input-base resize-none"
                placeholder="Any notes for the organizer (optional)..."
              />
            </div>

            <button
              type="submit"
              disabled={isSubmitting || !selectedSeminar?.id}
              className="btn-primary w-full disabled:cursor-not-allowed disabled:opacity-50"
            >
              {isSubmitting ? "Submitting..." : "Register for Seminar"}
            </button>
          </form>
          )}
        </DialogContent>
      </Dialog>

      <Footer />
    </div>
  );
}
