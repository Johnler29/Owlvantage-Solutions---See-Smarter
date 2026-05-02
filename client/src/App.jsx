import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/NotFound";
import { useLayoutEffect } from "react";
import { Route, Switch, useLocation } from "wouter";
import ErrorBoundary from "./components/ErrorBoundary";
import { ThemeProvider } from "./contexts/ThemeContext.jsx";
import Home from "./pages/Home";
import About from "./pages/About";
import Services from "./pages/Services";
import Seminars from "./pages/Seminars";
import Contact from "./pages/Contact";
import Admin from "./pages/Admin";

function ProtectedAdmin() {
  const token = localStorage.getItem("adminToken");
  if (!token) return <NotFound />;
  return <Admin />;
}

function Router() {
  const [location] = useLocation();

  useLayoutEffect(() => {
    window.scrollTo(0, 0);
  }, [location]);

  return (
    <div key={location} className="page-transition">
      <Switch>
        <Route path={"/"} component={Home} />
        <Route path={"/about"} component={About} />
        <Route path={"/services"} component={Services} />
        <Route path={"/seminars"} component={Seminars} />
        <Route path={"/contact"} component={Contact} />
        <Route path={"/admin"} component={ProtectedAdmin} />
        <Route path={"/admin-login"} component={Admin} />
        <Route path={"/404"} component={NotFound} />
        {/* Final fallback route */}
        <Route component={NotFound} />
      </Switch>
    </div>
  );
}

function App() {
  return (
    <ErrorBoundary>
      <ThemeProvider defaultTheme="light">
        <TooltipProvider>
          <Toaster />
          <Router />
        </TooltipProvider>
      </ThemeProvider>
    </ErrorBoundary>
  );
}

export default App;
