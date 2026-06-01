import { useEffect, useMemo, useState } from "react";
import {
  CalendarDays,
  Clock,
  LayoutDashboard,
  Calendar,
  Users,
  Settings,
  Search,
  Trash2,
  Pencil,
  LogOut,
  ArrowLeft,
  Inbox,
  Plus,
  Eye,
  MessageSquare,
  UserRound,
  Sparkles,
  Activity,
} from "lucide-react";
import { toast } from "sonner";
import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarInset,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/components/ui/empty";
import { apiUrl } from "@/lib/api";
import { StatsGridSkeleton } from "@/components/ui/stats-skeleton";
import { DataTableSkeleton } from "@/components/ui/table-skeleton";

export default function Admin() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [events, setEvents] = useState([]);
  const [registrations, setRegistrations] = useState([]);
  const [inquiries, setInquiries] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isInitialLoad, setIsInitialLoad] = useState(true);
  const [activeMenu, setActiveMenu] = useState("Dashboard");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedSeminarFilter, setSelectedSeminarFilter] = useState("all");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [validationErrors, setValidationErrors] = useState({});
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [deleteRegistrationTarget, setDeleteRegistrationTarget] = useState(null);
  const [viewRegistrationTarget, setViewRegistrationTarget] = useState(null);
  const [editTarget, setEditTarget] = useState(null);
  const [editFormData, setEditFormData] = useState(null);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    date: "",
    time: "",
    location: "",
    duration: "",
    level: "",
    type: "upcoming"
  });

  const sidebarItems = useMemo(
    () => [
      { label: "Dashboard", icon: LayoutDashboard },
      { label: "Events", icon: Calendar },
      { label: "Users", icon: Users },
      { label: "Settings", icon: Settings },
    ],
    []
  );

  useEffect(() => {
    const token = localStorage.getItem("adminToken");
    if (token) {
      setIsLoggedIn(true);
      refreshAdminData();
    }
  }, []);

  const getAdminHeaders = () => {
    const token = localStorage.getItem("adminToken");
    return token ? { Authorization: `Bearer ${token}` } : {};
  };

  const handleUnauthorized = () => {
    localStorage.removeItem("adminToken");
    setIsLoggedIn(false);
    toast.error("Session expired. Please log in again.");
  };

  const fetchEvents = async () => {
    try {
      const res = await fetch(apiUrl("/api/admin/seminar-registration-counts"), {
        headers: { ...getAdminHeaders() },
      });
      if (res.status === 401) {
        handleUnauthorized();
        return;
      }
      const data = await res.json();
      setEvents(data);
    } catch (err) {
      console.error("Failed to fetch events", err);
    }
  };

  const fetchRegistrations = async () => {
    try {
      const res = await fetch(apiUrl("/api/admin/registrations"), {
        headers: { ...getAdminHeaders() },
      });
      if (res.status === 401) {
        handleUnauthorized();
        return;
      }
      const data = await res.json();
      setRegistrations(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error("Failed to fetch registrations", err);
    }
  };

  const fetchInquiries = async () => {
    try {
      const res = await fetch(apiUrl("/api/admin/inquiries"), {
        headers: { ...getAdminHeaders() },
      });
      if (res.status === 401) {
        handleUnauthorized();
        return;
      }
      const data = await res.json();
      setInquiries(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error("Failed to fetch inquiries", err);
      setInquiries([]);
    }
  };

  const refreshAdminData = async () => {
    setIsLoading(true);
    await Promise.all([fetchEvents(), fetchRegistrations(), fetchInquiries()]);
    setIsLoading(false);
    setIsInitialLoad(false);
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    if (isSubmitting) return;
    setIsSubmitting(true);
    try {
      const res = await fetch(apiUrl("/api/admin/login"), {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password })
      });
      const data = await res.json();
      if (data.success) {
        localStorage.setItem("adminToken", data.token);
        setDeleteTarget(null);
        setDeleteRegistrationTarget(null);
        setViewRegistrationTarget(null);
        setEditTarget(null);
        setEditFormData(null);
        setIsLoggedIn(true);
        refreshAdminData();
      } else {
        toast.error("Invalid credentials");
      }
    } catch (err) {
      toast.error("Login failed");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("adminToken");
    setIsLoggedIn(false);
  };

  const normalizeTypeForUi = (type) => {
    if (type === "upcoming") return "Upcoming";
    if (type === "featured") return "Featured Program";
    return type;
  };

  const typeBadgeClassName = (type) => {
    if (type === "upcoming") return "border-transparent bg-blue-100 text-blue-600";
    return "border-transparent bg-gray-100 text-gray-600";
  };

  const filteredEvents = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    if (!q) return events;
    return events.filter((e) => (e.title || "").toLowerCase().includes(q));
  }, [events, searchQuery]);

  const filteredRegistrations = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();

    return registrations.filter((registration) => {
      const seminarMatch =
        selectedSeminarFilter === "all" ||
        String(registration.seminar_id) === selectedSeminarFilter;

      if (!seminarMatch) {
        return false;
      }

      if (!q) {
        return true;
      }

      return [
        registration.name,
        registration.email,
        registration.phone,
        registration.company,
        registration.seminar_title,
      ]
        .map((value) => (value || "").toLowerCase())
        .some((value) => value.includes(q));
    });
  }, [registrations, searchQuery, selectedSeminarFilter]);

  const stats = useMemo(() => {
    const upcoming = events.filter((e) => e.type === "upcoming").length;
    const totalRegistrations = events.reduce(
      (sum, event) => sum + Number(event.registration_count || 0),
      0
    );
    const totalUsers = new Set(registrations.map((registration) => (registration.email || "").toLowerCase())).size;
    const totalInquiries = inquiries.length;

    return { upcoming, totalRegistrations, totalUsers, totalInquiries };
  }, [events, registrations, inquiries]);

  const now = useMemo(() => new Date(), []);
  const currentDateLabel = now.toLocaleDateString(undefined, {
    weekday: "long",
    month: "long",
    day: "numeric",
    year: "numeric",
  });
  const currentTimeLabel = now.toLocaleTimeString(undefined, {
    hour: "numeric",
    minute: "2-digit",
  });

  const formatRegistrationDate = (value) => {
    if (!value) return "-";
    const parsed = new Date(value);
    if (Number.isNaN(parsed.getTime())) return value;
    return parsed.toLocaleString();
  };

  const isRegistrationApproved = (registration) => Boolean(registration?.approved_at);

  const validateEvent = (data) => {
    const errors = {};

    if (!data.title?.trim()) errors.title = "Title is required";

    if (data.type === "upcoming") {
      if (!data.date?.trim()) errors.date = "Date is required";
      if (!data.time?.trim()) errors.time = "Time is required";
    } else {
      if (!data.duration?.trim()) errors.duration = "Duration is required";
      if (!data.level?.trim()) errors.level = "Level is required";
    }

    return errors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errors = validateEvent(formData);
    setValidationErrors(errors);
    if (Object.keys(errors).length > 0) {
      toast.error("Please fix the highlighted fields");
      return;
    }

    const url = apiUrl("/api/events");
    const method = "POST";

    setIsSubmitting(true);

    try {
      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json", ...getAdminHeaders() },
        body: JSON.stringify(formData)
      });
      if (res.status === 401) {
        handleUnauthorized();
        return;
      }
      if (!res.ok) {
        let message = "Failed to create event";
        try {
          const data = await res.json();
          if (data?.error) message = data.error;
        } catch {
          // ignore
        }
        throw new Error(message);
      }

      if (res.ok) {
        setFormData({
          title: "",
          description: "",
          date: "",
          time: "",
          location: "",
          duration: "",
          level: "",
          type: "upcoming"
        });
        setValidationErrors({});
        toast.success("Event created successfully");
        refreshAdminData();
      }
    } catch (err) {
      toast.error(err?.message || "Failed to create event");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleEditOpen = (event) => {
    setEditTarget(event);
    setEditFormData({
      title: event.title || "",
      description: event.description || "",
      date: event.date || "",
      time: event.time || "",
      location: event.location || "",
      duration: event.duration || "",
      level: event.level || "",
      type: event.type || "upcoming",
    });
  };

  const handleEditSave = async () => {
    if (!editTarget || !editFormData) return;
    const errors = validateEvent(editFormData);
    if (Object.keys(errors).length > 0) {
      toast.error("Please fix the highlighted fields");
      return;
    }

    setIsSubmitting(true);
    try {
      const res = await fetch(apiUrl(`/api/events/${editTarget.id}`), {
        method: "PUT",
        headers: { "Content-Type": "application/json", ...getAdminHeaders() },
        body: JSON.stringify(editFormData),
      });

      if (res.status === 401) {
        handleUnauthorized();
        return;
      }
      if (!res.ok) {
        let message = "Failed to update event";
        try {
          const data = await res.json();
          if (data?.error) message = data.error;
        } catch {
          // ignore
        }
        throw new Error(message);
      }

      toast.success("Event updated successfully");
      setEditTarget(null);
      setEditFormData(null);
      refreshAdminData();
    } catch (err) {
      toast.error(err?.message || "Failed to update event");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (id) => {
    try {
      const res = await fetch(apiUrl(`/api/events/${id}`), { method: "DELETE", headers: { ...getAdminHeaders() } });
      if (res.status === 401) {
        handleUnauthorized();
        return;
      }
      toast.success("Event deleted");
      refreshAdminData();
    } catch (err) {
      toast.error("Failed to delete event");
    }
  };

  const handleDeleteRegistration = async (id) => {
    try {
      const res = await fetch(apiUrl(`/api/admin/registrations/${id}`), { method: "DELETE", headers: { ...getAdminHeaders() } });
      if (res.status === 401) {
        handleUnauthorized();
        return;
      }
      if (!res.ok) {
        throw new Error("Failed to delete registration");
      }
      toast.success("Registration deleted");
      refreshAdminData();
    } catch (err) {
      toast.error(err?.message || "Failed to delete registration");
    }
  };

  const renderEventForm = (data, setData, errors = {}) => {
    const baseFieldClass =
      "block w-full rounded-xl border border-slate-200 bg-slate-50/80 px-3.5 py-2.5 text-sm text-slate-900 shadow-sm transition duration-200 focus:border-[#25badf] focus:bg-white focus:outline-none focus:ring-4 focus:ring-[#25badf]/20";
    const errorFieldClass =
      "block w-full rounded-xl border border-red-300 bg-red-50/60 px-3.5 py-2.5 text-sm text-slate-900 shadow-sm transition duration-200 focus:border-red-400 focus:outline-none focus:ring-4 focus:ring-red-200";

    return (
      <div className="space-y-5">
        <div className="space-y-1">
          <label className="block text-sm font-semibold text-slate-700">Title</label>
          <input
            type="text"
            value={data.title}
            onChange={(e) => setData({ ...data, title: e.target.value })}
            className={errors.title ? errorFieldClass : baseFieldClass}
            placeholder="Event title"
            required
          />
          {errors.title && <p className="text-xs text-red-600 font-medium">{errors.title}</p>}
        </div>

        <div className="space-y-1">
          <label className="block text-sm font-semibold text-slate-700">Type</label>
          <select
            value={data.type}
            onChange={(e) => {
              const nextType = e.target.value;
              if (nextType === "upcoming") {
                setData({
                  ...data,
                  type: nextType,
                  duration: "",
                  level: "",
                });
                return;
              }

              setData({
                ...data,
                type: nextType,
                date: "",
                time: "",
              });
            }}
            className={baseFieldClass}
          >
            <option value="upcoming">Upcoming</option>
            <option value="featured">Featured Program</option>
          </select>
        </div>

        <div className="space-y-1">
          <label className="block text-sm font-semibold text-slate-700">Description</label>
          <textarea
            value={data.description}
            onChange={(e) => setData({ ...data, description: e.target.value })}
            className={`${baseFieldClass} resize-none`}
            rows={4}
            placeholder="Short description (optional)"
          />
        </div>

        {data.type === "upcoming" ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="block text-sm font-semibold text-slate-700">Date</label>
              <input
                type="text"
                value={data.date}
                onChange={(e) => setData({ ...data, date: e.target.value })}
                className={errors.date ? errorFieldClass : baseFieldClass}
                placeholder="e.g. July 15"
              />
              {errors.date && <p className="text-xs text-red-600 font-medium">{errors.date}</p>}
            </div>

            <div className="space-y-1">
              <label className="block text-sm font-semibold text-slate-700">Time</label>
              <input
                type="text"
                value={data.time}
                onChange={(e) => setData({ ...data, time: e.target.value })}
                className={errors.time ? errorFieldClass : baseFieldClass}
                placeholder="e.g. 9:00 AM - 5:00 PM"
              />
              {errors.time && <p className="text-xs text-red-600 font-medium">{errors.time}</p>}
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="block text-sm font-semibold text-slate-700">Duration</label>
              <input
                type="text"
                value={data.duration}
                onChange={(e) => setData({ ...data, duration: e.target.value })}
                className={errors.duration ? errorFieldClass : baseFieldClass}
                placeholder="e.g. 2 days"
              />
              {errors.duration && <p className="text-xs text-red-600 font-medium">{errors.duration}</p>}
            </div>

            <div className="space-y-1">
              <label className="block text-sm font-semibold text-slate-700">Level</label>
              <input
                type="text"
                value={data.level}
                onChange={(e) => setData({ ...data, level: e.target.value })}
                className={errors.level ? errorFieldClass : baseFieldClass}
                placeholder="e.g. Beginner"
              />
              {errors.level && <p className="text-xs text-red-600 font-medium">{errors.level}</p>}
            </div>
          </div>
        )}

        <div className="space-y-1">
          <label className="block text-sm font-semibold text-slate-700">Location</label>
          <input
            type="text"
            value={data.location}
            onChange={(e) => setData({ ...data, location: e.target.value })}
            className={baseFieldClass}
            placeholder="Virtual / In-person / address"
          />
        </div>
      </div>
    );
  };

  const renderUsersSection = () => {
    return (
      <div className="space-y-8">
        {renderStatsCards()}

        <section className="overflow-hidden rounded-xl border border-gray-100 bg-white shadow-sm">
          <div className="flex flex-col gap-4 border-b border-gray-100 p-5 md:flex-row md:items-end md:justify-between">
            <div>
              <h2 className="text-lg font-semibold text-gray-900">Seminar Registrations</h2>
              <p className="text-sm text-gray-500">Search and manage registered users per seminar</p>
            </div>

            <div className="w-full md:w-80">
              <label className="mb-2 block text-xs font-semibold uppercase tracking-wide text-slate-500">
                Filter by Seminar
              </label>
              <select
                value={selectedSeminarFilter}
                onChange={(e) => setSelectedSeminarFilter(e.target.value)}
                className="w-full rounded-xl border border-slate-200 bg-slate-50/80 py-2.5 px-3 text-sm text-slate-900 shadow-sm transition duration-200 focus:border-[#25badf] focus:bg-white focus:outline-none focus:ring-4 focus:ring-[#25badf]/20"
              >
                <option value="all">All seminars</option>
                {events.map((event) => (
                  <option key={event.id} value={String(event.id)}>
                    {event.title} ({Number(event.registration_count || 0)})
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="overflow-x-auto">
            {isInitialLoad ? (
              <TableSkeleton rows={5} columns={4} />
            ) : (
              <table className="table-base">
                <thead>
                  <tr>
                    <th className="table-head">
                      <span className="inline-flex items-center gap-1.5"><UserRound size={13} /> Registrant</span>
                    </th>
                    <th className="table-head">
                      <span className="inline-flex items-center gap-1.5"><Calendar size={13} /> Seminar</span>
                    </th>
                    <th className="table-head">
                      <span className="inline-flex items-center gap-1.5"><Clock size={13} /> Registered At</span>
                    </th>
                    <th className="table-head text-right">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredRegistrations.map((registration, index) => (
                    <tr
                      key={registration.id}
                      className={index % 2 === 0 ? "table-row-hover" : "table-row-hover bg-slate-50/30"}
                    >
                      <td className="table-cell">
                        <div className="min-w-0">
                          <div className="flex items-center gap-2">
                            <div className="truncate text-sm font-semibold text-slate-900">{registration.name}</div>
                            <span
                              className={
                                isRegistrationApproved(registration)
                                  ? "badge-success"
                                  : "badge-warning"
                              }
                            >
                              <span
                                className={
                                  isRegistrationApproved(registration)
                                    ? "h-1.5 w-1.5 rounded-full bg-emerald-500"
                                    : "h-1.5 w-1.5 rounded-full bg-amber-500"
                                }
                              />
                              {isRegistrationApproved(registration) ? "Approved" : "Pending"}
                            </span>
                          </div>
                          <div className="mt-1 truncate text-xs text-slate-500">{registration.email}</div>
                        </div>
                        {(registration.phone || registration.company) && (
                          <div className="mt-1 text-xs text-slate-500">
                            {[registration.phone, registration.company].filter(Boolean).join(" • ")}
                          </div>
                        )}
                      </td>
                      <td className="table-cell">
                        <div className="text-sm font-medium text-slate-900">{registration.seminar_title}</div>
                        {(registration.seminar_date || registration.seminar_time) && (
                          <div className="mt-1 text-xs text-slate-500">
                            {[registration.seminar_date, registration.seminar_time].filter(Boolean).join(" • ")}
                          </div>
                        )}
                      </td>
                      <td className="table-cell text-sm text-slate-600">{formatRegistrationDate(registration.created_at)}</td>
                      <td className="table-cell text-right">
                        <div className="inline-flex items-center gap-2">
                          <button
                            onClick={() => setViewRegistrationTarget(registration)}
                            className="inline-flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm font-medium text-slate-700 transition-all duration-200 hover:border-slate-300 hover:bg-slate-50 hover:-translate-y-0.5 focus-ring-teal"
                          >
                            <Eye size={16} /> View
                          </button>
                          <button
                            onClick={() => setDeleteRegistrationTarget(registration)}
                            className="inline-flex items-center gap-2 rounded-lg border border-red-200 bg-white px-3 py-2 text-sm font-medium text-red-600 transition-all duration-200 hover:bg-red-50 hover:-translate-y-0.5 focus-ring-teal"
                          >
                            <Trash2 size={16} /> Delete
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}

                {filteredRegistrations.length === 0 && (
                  <tr>
                    <td colSpan={4} className="px-5 py-10">
                      <Empty className="border-0 p-0 text-slate-500">
                        <EmptyHeader>
                          <EmptyMedia variant="icon">
                            <Inbox />
                          </EmptyMedia>
                          <EmptyTitle>No registrations found</EmptyTitle>
                          <EmptyDescription>
                            Try a different search or seminar filter.
                          </EmptyDescription>
                        </EmptyHeader>
                        <EmptyContent />
                      </Empty>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
            )}
          </div>
        </section>
      </div>
    );
  };

  const renderStatsCards = () => {
    if (isInitialLoad) {
      return <StatsGridSkeleton />;
    }

    const cards = [
      {
        label: "Total Registrations",
        value: stats.totalRegistrations,
        icon: Users,
        iconClass: "text-emerald-700",
        iconBgClass: "bg-emerald-100",
        cardClass: "from-emerald-50 to-white",
      },
      {
        label: "Upcoming Events",
        value: stats.upcoming,
        icon: Clock,
        iconClass: "text-blue-700",
        iconBgClass: "bg-blue-100",
        cardClass: "from-blue-50 to-white",
      },
      {
        label: "Total Users",
        value: stats.totalUsers,
        icon: UserRound,
        iconClass: "text-[#1b2e45]",
        iconBgClass: "bg-slate-200",
        cardClass: "from-slate-100 to-white",
      },
      {
        label: "Messages / Inquiries",
        value: stats.totalInquiries,
        icon: MessageSquare,
        iconClass: "text-[#25badf]",
        iconBgClass: "bg-[#25badf]/15",
        cardClass: "from-[#25badf]/10 to-white",
      },
    ];

    return (
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-4">
        {cards.map((card) => {
          const Icon = card.icon;

          return (
            <article
              key={card.label}
              className={`rounded-xl border border-gray-100 bg-gradient-to-br ${card.cardClass} p-6 shadow-sm transition duration-200 hover:-translate-y-0.5 hover:shadow-md`}
            >
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.08em] text-slate-500">
                    {card.label}
                  </p>
                  <p className="mt-3 text-3xl font-semibold leading-none text-slate-900">{card.value}</p>
                </div>
                <div
                  className={`flex h-11 w-11 items-center justify-center rounded-xl ${card.iconBgClass} ${card.iconClass}`}
                >
                  <Icon size={20} />
                </div>
              </div>
            </article>
          );
        })}
      </div>
    );
  };

  const renderDashboardSection = () => {
    return (
      <div className="space-y-8">
        <section className="relative overflow-hidden rounded-xl border border-slate-200 bg-white p-5 shadow-sm md:p-6">
          <div className="absolute -right-10 -top-10 h-36 w-36 rounded-full bg-[#25badf]/10 blur-2xl" />
          <div className="absolute -left-8 -bottom-8 h-24 w-24 rounded-full bg-slate-200/60 blur-xl" />

          <div className="relative z-10 flex flex-col gap-5 md:flex-row md:items-center md:justify-between">
            <div>
              <p className="inline-flex items-center gap-2 rounded-full border border-[#25badf]/20 bg-[#25badf]/10 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-[#1b2e45]">
                <Sparkles size={13} className="text-[#25badf]" />
                Welcome back, Admin
              </p>
              <h2 className="mt-3 text-2xl font-semibold text-slate-900">Dashboard Overview</h2>
              <p className="mt-1 text-sm text-slate-500">{currentDateLabel} • {currentTimeLabel}</p>
            </div>

            <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
              <button
                type="button"
                onClick={() => setActiveMenu("Events")}
                className="inline-flex items-center justify-center gap-2 rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm font-medium text-slate-700 transition duration-200 hover:-translate-y-0.5 hover:border-slate-300 hover:bg-slate-50"
              >
                <Plus size={15} /> Add Event
              </button>
              <button
                type="button"
                onClick={() => setActiveMenu("Users")}
                className="inline-flex items-center justify-center gap-2 rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm font-medium text-slate-700 transition duration-200 hover:-translate-y-0.5 hover:border-slate-300 hover:bg-slate-50"
              >
                <Activity size={15} /> View Registrations
              </button>
            </div>
          </div>
        </section>

        {renderStatsCards()}

        <div className="grid grid-cols-1 gap-8 xl:grid-cols-[1.8fr_1fr]">
          <section className="overflow-hidden rounded-xl border border-gray-100 bg-white shadow-sm">
            <div className="flex items-center justify-between border-b border-gray-100 p-5">
              <div>
                <h2 className="text-lg font-semibold text-gray-900">Recent Events</h2>
                <p className="text-sm text-gray-500">Latest events created</p>
              </div>
            </div>
            {isInitialLoad ? (
              <div className="p-5">
                <TableSkeleton rows={5} columns={3} />
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="table-base">
                  <thead>
                    <tr>
                      <th className="table-head">
                        <span className="inline-flex items-center gap-1.5"><CalendarDays size={13} /> Title</span>
                      </th>
                      <th className="table-head">Status</th>
                      <th className="table-head">
                        <span className="inline-flex items-center gap-1.5"><Users size={13} /> Registrations</span>
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {events.slice(0, 5).map((event, index) => (
                      <tr
                        key={event.id}
                        className={index % 2 === 0 ? "table-row-hover" : "table-row-hover bg-slate-50/30"}
                      >
                        <td className="table-cell">
                          <div className="text-sm font-semibold text-gray-900">{event.title}</div>
                        </td>
                        <td className="table-cell">
                          <Badge
                            variant="outline"
                            className={`rounded-full px-3 py-1 text-xs font-medium ${typeBadgeClassName(event.type)}`}
                          >
                            {normalizeTypeForUi(event.type)}
                          </Badge>
                        </td>
                        <td className="table-cell text-sm font-semibold text-slate-800">{Number(event.registration_count || 0)}</td>
                      </tr>
                    ))}
                    {events.length === 0 && (
                      <tr>
                        <td colSpan={3} className="px-5 py-10">
                          <Empty className="border-0 p-0 text-slate-500">
                            <EmptyHeader>
                              <EmptyMedia variant="icon">
                                <Inbox />
                              </EmptyMedia>
                              <EmptyTitle>No events yet</EmptyTitle>
                              <EmptyDescription>Create one in the Events section.</EmptyDescription>
                            </EmptyHeader>
                            <EmptyContent />
                          </Empty>
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            )}
          </section>

          <section className="rounded-xl border border-gray-100 bg-white p-5 shadow-sm">
            <div className="mb-4 border-b border-gray-100 pb-4">
              <h2 className="text-lg font-semibold text-slate-900">Recent Activity</h2>
              <p className="text-sm text-slate-500">Latest user and inquiry activity</p>
            </div>

            {isInitialLoad ? (
              <div className="space-y-3">
                {Array.from({ length: 5 }).map((_, i) => (
                  <div key={i} className="rounded-lg border border-slate-100 bg-slate-50/70 p-3">
                    <div className="h-4 w-32 rounded-md bg-muted animate-shimmer mb-2" />
                    <div className="h-3 w-48 rounded-md bg-muted animate-shimmer" />
                  </div>
                ))}
              </div>
            ) : (
              <div className="space-y-3">
                {registrations.slice(0, 3).map((registration) => (
                  <div key={`reg-${registration.id}`} className="rounded-lg border border-slate-100 bg-slate-50/70 p-3">
                    <p className="text-sm font-medium text-slate-900">{registration.name}</p>
                    <p className="text-xs text-slate-500">Registered for {registration.seminar_title}</p>
                  </div>
                ))}

                {inquiries.slice(0, 2).map((inquiry) => (
                  <div key={`inq-${inquiry.id}`} className="rounded-lg border border-slate-100 bg-slate-50/70 p-3">
                    <p className="text-sm font-medium text-slate-900">{inquiry.name}</p>
                    <p className="text-xs text-slate-500">Sent an inquiry</p>
                  </div>
                ))}

                {registrations.length === 0 && inquiries.length === 0 && (
                  <Empty className="border border-dashed border-slate-200 bg-slate-50/60 p-4 text-slate-500">
                    <EmptyHeader>
                      <EmptyMedia variant="icon">
                        <Activity />
                      </EmptyMedia>
                      <EmptyTitle>No activity yet</EmptyTitle>
                      <EmptyDescription>Activity will appear here once users interact with your site.</EmptyDescription>
                    </EmptyHeader>
                    <EmptyContent />
                  </Empty>
                )}
              </div>
            )}
          </section>
        </div>
      </div>
    );
  };

  const renderEventsSection = () => {
    return (
      <div className="space-y-8">
        {renderStatsCards()}

        <div className="grid grid-cols-1 gap-8 xl:grid-cols-2">
          <section className="rounded-xl border border-gray-100 bg-white p-6 shadow-sm lg:p-7">
            <div className="mb-5 flex items-center justify-between gap-4">
              <div>
                <h2 className="text-lg font-semibold text-slate-900">Add New Event</h2>
                <p className="text-sm text-slate-500">Create and publish an event</p>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              {renderEventForm(formData, setFormData, validationErrors)}

              <button
                type="submit"
                disabled={isSubmitting}
                className={
                  isSubmitting
                    ? "w-full cursor-not-allowed rounded-xl bg-[#25badf]/70 px-4 py-3 text-sm font-semibold text-white transition-colors"
                    : "w-full rounded-xl bg-[#25badf] px-4 py-3 text-sm font-semibold text-white shadow-sm transition duration-200 hover:bg-[#1a8fb8] hover:shadow"
                }
              >
                <span className="inline-flex items-center justify-center gap-2">
                  <Plus size={15} />
                  {isSubmitting ? "Creating..." : "Create Event"}
                </span>
              </button>
            </form>
          </section>

          <section className="overflow-hidden rounded-xl border border-gray-100 bg-white shadow-sm">
            <div className="flex items-center justify-between border-b border-gray-100 p-5">
              <div>
                <h2 className="text-lg font-semibold text-gray-900">Events</h2>
                <p className="text-sm text-gray-500">Search, edit, or delete</p>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="min-w-full">
                <thead className="border-b border-gray-100 bg-gray-50">
                  <tr>
                    <th className="px-5 py-4 text-left text-xs font-semibold uppercase tracking-wide text-gray-400">
                      <span className="inline-flex items-center gap-1.5"><CalendarDays size={13} /> Title</span>
                    </th>
                    <th className="px-5 py-4 text-left text-xs font-semibold uppercase tracking-wide text-gray-400">
                      Status
                    </th>
                    <th className="px-5 py-4 text-left text-xs font-semibold uppercase tracking-wide text-gray-400">
                      <span className="inline-flex items-center gap-1.5"><Users size={13} /> Registrations</span>
                    </th>
                    <th className="px-5 py-4 text-right text-xs font-semibold uppercase tracking-wide text-gray-400">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {filteredEvents.map((event, index) => (
                    <tr
                      key={event.id}
                      className={index % 2 === 0 ? "border-b border-gray-100 bg-white transition-all duration-200 hover:bg-gray-50" : "border-b border-gray-100 bg-gray-50/50 transition-all duration-200 hover:bg-gray-50"}
                    >
                      <td className="px-5 py-4">
                        <div className="text-sm font-semibold text-gray-900">{event.title}</div>
                        {(event.type === "upcoming" && (event.date || event.time || event.location)) && (
                          <div className="mt-1 text-xs text-slate-500">
                            {[event.date, event.time, event.location].filter(Boolean).join(" • ")}
                          </div>
                        )}
                        {(event.type === "featured" && (event.duration || event.level)) && (
                          <div className="mt-1 text-xs text-slate-500">
                            {[event.duration, event.level].filter(Boolean).join(" • ")}
                          </div>
                        )}
                      </td>
                      <td className="px-5 py-4">
                        <Badge
                          variant="outline"
                          className={`rounded-full px-3 py-1 text-xs font-medium ${typeBadgeClassName(event.type)}`}
                        >
                          {normalizeTypeForUi(event.type)}
                        </Badge>
                      </td>
                      <td className="px-5 py-4 text-sm font-semibold text-slate-800">{Number(event.registration_count || 0)}</td>
                      <td className="px-5 py-4 text-right">
                        <div className="inline-flex items-center gap-2">
                          <button
                            onClick={() => handleEditOpen(event)}
                            className="inline-flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm font-medium text-slate-700 transition duration-200 hover:border-slate-300 hover:bg-slate-100"
                          >
                            <Eye size={16} /> View
                          </button>
                          <button
                            onClick={() => handleEditOpen(event)}
                            className="inline-flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm font-medium text-slate-700 transition duration-200 hover:border-slate-300 hover:bg-slate-100"
                          >
                            <Pencil size={16} /> Edit
                          </button>
                          <button
                            onClick={() => setDeleteTarget(event)}
                            className="inline-flex items-center gap-2 rounded-lg border border-red-200 bg-white px-3 py-2 text-sm font-medium text-red-600 transition duration-200 hover:bg-red-50"
                          >
                            <Trash2 size={16} /> Delete
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}

                  {filteredEvents.length === 0 && (
                    <tr>
                      <td colSpan={4} className="px-5 py-10">
                        <Empty className="border-0 p-0 text-slate-500">
                          <EmptyHeader>
                            <EmptyMedia variant="icon">
                              <Inbox />
                            </EmptyMedia>
                            <EmptyTitle>No events found</EmptyTitle>
                            <EmptyDescription>
                              Add one using the form, or try a different search.
                            </EmptyDescription>
                          </EmptyHeader>
                          <EmptyContent />
                        </Empty>
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </section>
        </div>
      </div>
    );
  };

  const renderPlaceholderSection = (title, description) => {
    return (
      <section className="rounded-xl border border-gray-100 bg-white p-6 shadow-sm lg:p-7">
        <h2 className="text-lg font-semibold text-slate-900">{title}</h2>
        <p className="mt-1 text-sm text-slate-500">{description}</p>
        <div className="mt-6">
          <Empty className="border-0 p-0 text-slate-500">
            <EmptyHeader>
              <EmptyMedia variant="icon">
                <Inbox />
              </EmptyMedia>
              <EmptyTitle>Coming soon</EmptyTitle>
              <EmptyDescription>This section isn’t wired up yet.</EmptyDescription>
            </EmptyHeader>
            <EmptyContent />
          </Empty>
        </div>
      </section>
    );
  };

  if (!isLoggedIn) {
    return (
      <div className="min-h-screen bg-[#f9fafb]">
        <header className="w-full border-b border-slate-200 bg-white/95 shadow-sm backdrop-blur">
          <div className="w-full px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
            <h1 className="text-lg font-semibold text-slate-900">Admin Dashboard</h1>
            <div />
          </div>
        </header>

        <main className="w-full px-4 sm:px-6 lg:px-8 py-8">
          <div className="w-full max-w-md mx-auto">
            <div className="rounded-xl border border-gray-100 bg-white p-6 shadow-sm">
              <h2 className="mb-6 text-center text-xl font-semibold text-slate-900">Admin Login</h2>
              <form onSubmit={handleLogin} className="space-y-4">
                <div className="space-y-1">
                  <label className="block text-sm font-medium text-slate-700">Username</label>
                  <input
                    type="text"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    className="block w-full rounded-xl border border-slate-200 bg-slate-50/80 px-3.5 py-2.5 text-sm text-slate-900 shadow-sm transition duration-200 focus:border-[#25badf] focus:bg-white focus:outline-none focus:ring-4 focus:ring-[#25badf]/20"
                    required
                  />
                </div>
                <div className="space-y-1">
                  <label className="block text-sm font-medium text-slate-700">Password</label>
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="block w-full rounded-xl border border-slate-200 bg-slate-50/80 px-3.5 py-2.5 text-sm text-slate-900 shadow-sm transition duration-200 focus:border-[#25badf] focus:bg-white focus:outline-none focus:ring-4 focus:ring-[#25badf]/20"
                    required
                  />
                </div>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full rounded-xl bg-[#25badf] px-4 py-2.5 font-semibold text-white shadow-sm transition duration-200 hover:bg-[#1a8fb8] hover:shadow"
                >
                  {isSubmitting ? "Logging in..." : "Login"}
                </button>
              </form>
            </div>
          </div>
        </main>
      </div>
    );
  }

  return (
    <SidebarProvider defaultOpen={true}>
      <Sidebar
        collapsible="icon"
        variant="sidebar"
        className="border-r border-slate-200 bg-[#f8fafc] text-slate-600 shadow-[2px_0_12px_rgba(15,23,42,0.04)]"
      >
        <SidebarHeader className="border-b border-slate-200 px-4 pt-6 pb-5">
          <div className="flex items-center gap-3.5 rounded-xl border border-slate-200 bg-white px-3.5 py-3.5 shadow-sm">
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-sky-100 text-sm font-semibold text-sky-700">
              AD
            </div>
            <div className="min-w-0 group-data-[collapsible=icon]:hidden">
              <div className="truncate text-sm font-semibold text-slate-900">Owlvantage</div>
              <div className="truncate text-xs font-medium text-slate-500">Admin User</div>
            </div>
          </div>
          <div className="mt-4 border-t border-slate-200 group-data-[collapsible=icon]:hidden" />
        </SidebarHeader>
        <SidebarContent className="px-3 py-4">
          <SidebarMenu className="gap-3">
            {sidebarItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeMenu === item.label;
              return (
                <SidebarMenuItem key={item.label}>
                  <SidebarMenuButton
                    isActive={isActive}
                    tooltip={item.label}
                    onClick={() => setActiveMenu(item.label)}
                    className={
                      isActive
                        ? "relative h-10 justify-start rounded-lg px-3 text-slate-900 transition-all duration-200 ease-out before:absolute before:left-0 before:top-2 before:h-6 before:w-[3px] before:rounded-r-full before:bg-[#25badf] hover:bg-slate-100/70 group-data-[collapsible=icon]:justify-center"
                        : "h-10 justify-start rounded-lg px-3 text-slate-600 transition-all duration-200 ease-out hover:translate-x-0.5 hover:bg-slate-100 hover:text-slate-900 group-data-[collapsible=icon]:justify-center"
                    }
                  >
                    <Icon size={19} strokeWidth={1.9} className="shrink-0" />
                    <span className={isActive ? "truncate font-semibold" : "truncate font-normal"}>{item.label}</span>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              );
            })}
          </SidebarMenu>
        </SidebarContent>
      </Sidebar>

      <SidebarInset className="relative overflow-hidden bg-[#f8fafc]">
        <div className="pointer-events-none absolute -top-16 -right-20 h-52 w-52 rounded-full bg-[#25badf]/10 blur-3xl" />
        <div className="pointer-events-none absolute top-56 -left-16 h-44 w-44 rounded-full bg-slate-300/20 blur-3xl" />
        <div className="sticky top-0 z-20 border-b border-slate-200 bg-white/95 shadow-sm backdrop-blur">
          <div className="h-16 px-4 sm:px-6 lg:px-8 flex items-center gap-3">
            <SidebarTrigger className="rounded-lg border border-slate-200 bg-white text-slate-700 transition duration-200 hover:bg-slate-50" />
            <div className="min-w-0 flex-1">
              <div className="text-base font-semibold text-slate-900 leading-tight">{activeMenu}</div>
              <div className="text-xs text-slate-500">Manage events and data</div>
            </div>

            <div className="hidden md:flex items-center gap-3 w-[360px]">
              <div className="relative w-full">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                <input
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder={activeMenu === "Users" ? "Search registrants..." : "Search events..."}
                  className="w-full rounded-xl border border-slate-200 bg-slate-50/80 py-2.5 pl-9 pr-3 text-sm text-slate-900 shadow-sm transition duration-200 focus:border-[#25badf] focus:bg-white focus:outline-none focus:ring-4 focus:ring-[#25badf]/20"
                />
              </div>
            </div>

            <a
              href="/"
              className="hidden sm:inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-3.5 py-2 text-sm font-medium text-slate-600 transition duration-200 hover:bg-slate-50"
            >
              <ArrowLeft size={16} /> Back to website
            </a>

            <button
              onClick={handleLogout}
              className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-3.5 py-2 text-sm font-medium text-slate-600 transition duration-200 hover:bg-slate-50"
            >
              <LogOut size={16} /> Logout
            </button>
          </div>

          <div className="px-4 sm:px-6 lg:px-8 pb-4 md:hidden">
            <div className="relative w-full">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
              <input
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder={activeMenu === "Users" ? "Search registrants..." : "Search events..."}
                className="w-full rounded-xl border border-slate-200 bg-slate-50/80 py-2.5 pl-9 pr-3 text-sm text-slate-900 shadow-sm transition duration-200 focus:border-[#25badf] focus:bg-white focus:outline-none focus:ring-4 focus:ring-[#25badf]/20"
              />
            </div>
          </div>
        </div>

        <div className="space-y-8 px-4 py-8 sm:px-6 lg:px-8 lg:py-10">
          {activeMenu === "Dashboard" && renderDashboardSection()}
          {activeMenu === "Events" && renderEventsSection()}
          {activeMenu === "Users" && renderUsersSection()}
          {activeMenu === "Settings" &&
            renderPlaceholderSection(
              "Settings",
              "Configure system preferences and integrations."
            )}
        </div>

        <Dialog open={!!deleteTarget} onOpenChange={(open) => (!open ? setDeleteTarget(null) : null)}>
          <DialogContent className="rounded-xl border-slate-200">
            <DialogHeader>
              <DialogTitle>Delete event?</DialogTitle>
              <DialogDescription>
                This action cannot be undone. The event will be permanently removed.
              </DialogDescription>
            </DialogHeader>
            <div className="text-sm text-slate-700">
              <span className="font-medium">{deleteTarget?.title}</span>
            </div>
            <DialogFooter>
              <button
                type="button"
                onClick={() => setDeleteTarget(null)}
                className="inline-flex items-center justify-center rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-700 transition duration-200 hover:bg-slate-50"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={async () => {
                  const target = deleteTarget;
                  setDeleteTarget(null);
                  if (target?.id) await handleDelete(target.id);
                }}
                className="inline-flex items-center justify-center rounded-xl bg-red-600 px-4 py-2 text-sm font-semibold text-white transition duration-200 hover:bg-red-700"
              >
                Delete
              </button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        <Dialog
          open={!!deleteRegistrationTarget}
          onOpenChange={(open) => (!open ? setDeleteRegistrationTarget(null) : null)}
        >
          <DialogContent className="rounded-xl border-slate-200">
            <DialogHeader>
              <DialogTitle>Delete registration?</DialogTitle>
              <DialogDescription>
                This will permanently remove this user from the seminar registration list.
              </DialogDescription>
            </DialogHeader>
            <div className="text-sm text-slate-700">
              <span className="font-medium">{deleteRegistrationTarget?.name}</span>
              {" · "}
              <span>{deleteRegistrationTarget?.seminar_title}</span>
            </div>
            <DialogFooter>
              <button
                type="button"
                onClick={() => setDeleteRegistrationTarget(null)}
                className="inline-flex items-center justify-center rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-700 transition duration-200 hover:bg-slate-50"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={async () => {
                  const target = deleteRegistrationTarget;
                  setDeleteRegistrationTarget(null);
                  if (target?.id) await handleDeleteRegistration(target.id);
                }}
                className="inline-flex items-center justify-center rounded-xl bg-red-600 px-4 py-2 text-sm font-semibold text-white transition duration-200 hover:bg-red-700"
              >
                Delete
              </button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        <Dialog
          open={!!viewRegistrationTarget}
          onOpenChange={(open) => (!open ? setViewRegistrationTarget(null) : null)}
        >
          <DialogContent className="rounded-xl border-slate-200 sm:max-w-xl">
            <DialogHeader>
              <DialogTitle>Registration details</DialogTitle>
              <DialogDescription>View the registrant’s information for this seminar.</DialogDescription>
            </DialogHeader>

            <div className="space-y-5">
              <div className="rounded-xl border border-slate-200 bg-slate-50/70 p-4">
                <div className="text-sm font-semibold text-slate-900">{viewRegistrationTarget?.name || "-"}</div>
                <div className="mt-1 text-xs text-slate-500">{viewRegistrationTarget?.email || "-"}</div>
                {(viewRegistrationTarget?.phone || viewRegistrationTarget?.company) && (
                  <div className="mt-2 text-xs text-slate-500">
                    {[viewRegistrationTarget?.phone, viewRegistrationTarget?.company]
                      .filter(Boolean)
                      .join(" • ")}
                  </div>
                )}
              </div>

              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                <div className="rounded-xl border border-slate-200 bg-white p-4">
                  <div className="text-xs font-semibold uppercase tracking-wide text-slate-500">Seminar</div>
                  <div className="mt-1 text-sm font-medium text-slate-900">
                    {viewRegistrationTarget?.seminar_title || "-"}
                  </div>
                  {(viewRegistrationTarget?.seminar_date || viewRegistrationTarget?.seminar_time) && (
                    <div className="mt-1 text-xs text-slate-500">
                      {[viewRegistrationTarget?.seminar_date, viewRegistrationTarget?.seminar_time]
                        .filter(Boolean)
                        .join(" • ")}
                    </div>
                  )}
                </div>

                <div className="rounded-xl border border-slate-200 bg-white p-4">
                  <div className="text-xs font-semibold uppercase tracking-wide text-slate-500">Registered at</div>
                  <div className="mt-1 text-sm font-medium text-slate-900">
                    {formatRegistrationDate(viewRegistrationTarget?.created_at)}
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                <div className="rounded-xl border border-slate-200 bg-white p-4">
                  <div className="text-xs font-semibold uppercase tracking-wide text-slate-500">Status</div>
                  <div className="mt-1">
                    <span
                      className={
                        isRegistrationApproved(viewRegistrationTarget)
                          ? "inline-flex items-center rounded-full bg-emerald-100 px-2.5 py-1 text-xs font-semibold text-emerald-700"
                          : "inline-flex items-center rounded-full bg-amber-100 px-2.5 py-1 text-xs font-semibold text-amber-800"
                      }
                    >
                      {isRegistrationApproved(viewRegistrationTarget) ? "Approved" : "Pending"}
                    </span>
                  </div>
                  {isRegistrationApproved(viewRegistrationTarget) && (
                    <div className="mt-2 text-xs text-slate-500">
                      Approved at {formatRegistrationDate(viewRegistrationTarget?.approved_at)}
                    </div>
                  )}
                </div>

                <div className="rounded-xl border border-slate-200 bg-white p-4">
                  <div className="text-xs font-semibold uppercase tracking-wide text-slate-500">Phone</div>
                  <div className="mt-1 text-sm font-medium text-slate-900">
                    {viewRegistrationTarget?.phone || "-"}
                  </div>
                </div>

                <div className="rounded-xl border border-slate-200 bg-white p-4">
                  <div className="text-xs font-semibold uppercase tracking-wide text-slate-500">Company</div>
                  <div className="mt-1 text-sm font-medium text-slate-900">
                    {viewRegistrationTarget?.company || "-"}
                  </div>
                </div>
              </div>
            </div>

            <DialogFooter>
              {viewRegistrationTarget?.id && (
                <button
                  type="button"
                  onClick={async () => {
                    const target = viewRegistrationTarget;
                    if (!target?.id) return;

                    const nextApproved = !isRegistrationApproved(target);
                    setIsSubmitting(true);
                    try {
                      const res = await fetch(apiUrl(`/api/admin/registrations/${target.id}/approval`), {
                        method: "POST",
                        headers: { "Content-Type": "application/json", ...getAdminHeaders() },
                        body: JSON.stringify({ approved: nextApproved }),
                      });
                      if (res.status === 401) {
                        handleUnauthorized();
                        return;
                      }
                      const data = await res.json();
                      if (!res.ok || !data?.ok) {
                        throw new Error(data?.error || "Failed to update status");
                      }

                      toast.success(nextApproved ? "Registration approved" : "Approval removed");
                      setViewRegistrationTarget(null);
                      refreshAdminData();
                    } catch (err) {
                      toast.error(err?.message || "Failed to update approval status");
                    } finally {
                      setIsSubmitting(false);
                    }
                  }}
                  disabled={isSubmitting}
                  className={
                    isSubmitting
                      ? "inline-flex items-center justify-center rounded-xl bg-slate-200 px-4 py-2 text-sm font-semibold text-slate-500"
                      : isRegistrationApproved(viewRegistrationTarget)
                        ? "inline-flex items-center justify-center rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-700 transition duration-200 hover:bg-slate-50"
                        : "inline-flex items-center justify-center rounded-xl bg-emerald-600 px-4 py-2 text-sm font-semibold text-white transition duration-200 hover:bg-emerald-700"
                  }
                >
                  {isSubmitting
                    ? "Saving..."
                    : isRegistrationApproved(viewRegistrationTarget)
                      ? "Unapprove"
                      : "Approve"}
                </button>
              )}
              <button
                type="button"
                onClick={() => setViewRegistrationTarget(null)}
                className="inline-flex items-center justify-center rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-700 transition duration-200 hover:bg-slate-50"
              >
                Close
              </button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        <Dialog
          open={!!editTarget}
          onOpenChange={(open) => {
            if (!open) {
              setEditTarget(null);
              setEditFormData(null);
            }
          }}
        >
          <DialogContent className="rounded-xl border-slate-200 sm:max-w-xl">
            <DialogHeader>
              <DialogTitle>Edit event</DialogTitle>
              <DialogDescription>Update event details, then save changes.</DialogDescription>
            </DialogHeader>

            {editFormData && renderEventForm(editFormData, setEditFormData, {})}

            <DialogFooter>
              <button
                type="button"
                onClick={() => {
                  setEditTarget(null);
                  setEditFormData(null);
                }}
                className="inline-flex items-center justify-center rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-700 transition duration-200 hover:bg-slate-50"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleEditSave}
                disabled={isSubmitting}
                className={
                  isSubmitting
                    ? "inline-flex cursor-not-allowed items-center justify-center rounded-xl bg-[#25badf]/70 px-4 py-2 text-sm font-semibold text-white"
                    : "inline-flex items-center justify-center rounded-xl bg-[#25badf] px-4 py-2 text-sm font-semibold text-white transition duration-200 hover:bg-[#1a8fb8]"
                }
              >
                {isSubmitting ? "Saving..." : "Save"}
              </button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </SidebarInset>
    </SidebarProvider>
  );
 }
