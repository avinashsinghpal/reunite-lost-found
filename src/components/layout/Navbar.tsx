import { useState } from "react";
import { Link, NavLink } from "react-router-dom";
import { Menu } from "lucide-react";
import { Button } from "@/components/ui/button";
import ThemeToggle from "@/components/theme/ThemeToggle";

const navLinkCls = ({ isActive }: { isActive: boolean }) =>
  `${isActive ? "text-primary" : "text-muted-foreground hover:text-foreground"} transition-colors`;

const Navbar = () => {
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 bg-background/80 backdrop-blur border-b">
      <nav className="container mx-auto flex items-center justify-between py-3">
        <div className="flex items-center gap-3">
          <Link to="/" aria-label="Lost & Found home" className="flex items-center gap-2">
            <span className="text-lg font-semibold tracking-tight">Lost&Found</span>
          </Link>
        </div>

        <div className="hidden md:flex items-center gap-6">
          <NavLink to="/" end className={navLinkCls}>Home</NavLink>
          <NavLink to="/lost" className={navLinkCls}>Lost Items</NavLink>
          <NavLink to="/found" className={navLinkCls}>Found Items</NavLink>
          <NavLink to="/contact" className={navLinkCls}>Contact</NavLink>
        </div>

        <div className="hidden md:flex items-center gap-2">
          <ThemeToggle />
          <Button asChild variant="outline">
            <Link to="/report-found">Report Found</Link>
          </Button>
          <Button asChild variant="hero">
            <Link to="/report-lost">Report Lost</Link>
          </Button>
        </div>

        <button
          aria-label="Toggle menu"
          className="md:hidden p-2 rounded-md hover:bg-accent"
          onClick={() => setOpen(!open)}
        >
          <Menu className="h-5 w-5" />
        </button>
      </nav>

      {open && (
        <div className="md:hidden border-t">
          <div className="container mx-auto py-4 flex flex-col gap-4">
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Menu</span>
              <ThemeToggle />
            </div>
            <NavLink to="/" end className={navLinkCls} onClick={() => setOpen(false)}>Home</NavLink>
            <NavLink to="/lost" className={navLinkCls} onClick={() => setOpen(false)}>Lost Items</NavLink>
            <NavLink to="/found" className={navLinkCls} onClick={() => setOpen(false)}>Found Items</NavLink>
            <NavLink to="/contact" className={navLinkCls} onClick={() => setOpen(false)}>Contact</NavLink>
            <div className="flex gap-2">
              <Button asChild variant="outline" className="flex-1" onClick={() => setOpen(false)}>
                <Link to="/report-found">Report Found</Link>
              </Button>
              <Button asChild variant="hero" className="flex-1" onClick={() => setOpen(false)}>
                <Link to="/report-lost">Report Lost</Link>
              </Button>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};

export default Navbar;
