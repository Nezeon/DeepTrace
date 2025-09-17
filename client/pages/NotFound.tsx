import { useLocation } from "react-router-dom";
import { useEffect } from "react";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname,
    );
  }, [location.pathname]);

  return (
    <div className="flex min-h-screen flex-col bg-muted/30">
      <header className="sticky top-0 z-40 w-full border-b bg-white/80 backdrop-blur supports-[backdrop-filter]:bg-white/60">
        <div className="mx-auto flex h-14 max-w-7xl items-center gap-3 px-4">
          <a href="/" className="flex items-center gap-2 font-semibold text-primary">404</a>
        </div>
      </header>
      <div className="flex flex-1 items-center justify-center">
        <div className="text-center">
          <h1 className="mb-2 text-3xl font-bold">Page not found</h1>
          <p className="mb-4 text-muted-foreground">The page you are looking for does not exist.</p>
          <a href="/" className="text-primary underline underline-offset-4">
            Return to Dashboard
          </a>
        </div>
      </div>
    </div>
  );
};

export default NotFound;
