
import { NavLink } from "react-router-dom";
import { Menu } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState } from "react";

export function Header() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          <div className="flex items-center">
            <NavLink to="/" className="text-xl font-semibold text-primary hover:text-primary/90 transition-colors">
              Marie
            </NavLink>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-4">
            <NavLink
              to="/"
              className={({ isActive }) => 
                `nav-link ${isActive ? 'nav-link-active' : ''}`
              }
            >
              Home
            </NavLink>
            <NavLink
              to="/features"
              className={({ isActive }) => 
                `nav-link ${isActive ? 'nav-link-active' : ''}`
              }
            >
              Features
            </NavLink>
            <NavLink
              to="/about"
              className={({ isActive }) => 
                `nav-link ${isActive ? 'nav-link-active' : ''}`
              }
            >
              About
            </NavLink>
          </nav>

          <Button
            variant="ghost"
            size="icon"
            className="md:hidden"
            onClick={() => setIsOpen(!isOpen)}
          >
            <Menu className="h-6 w-6" />
          </Button>
        </div>

        {/* Mobile Navigation */}
        {isOpen && (
          <nav className="md:hidden py-4 space-y-2">
            <NavLink
              to="/"
              className={({ isActive }) => 
                `nav-link block ${isActive ? 'nav-link-active' : ''}`
              }
              onClick={() => setIsOpen(false)}
            >
              Home
            </NavLink>
            <NavLink
              to="/features"
              className={({ isActive }) => 
                `nav-link block ${isActive ? 'nav-link-active' : ''}`
              }
              onClick={() => setIsOpen(false)}
            >
              Features
            </NavLink>
            <NavLink
              to="/about"
              className={({ isActive }) => 
                `nav-link block ${isActive ? 'nav-link-active' : ''}`
              }
              onClick={() => setIsOpen(false)}
            >
              About
            </NavLink>
          </nav>
        )}
      </div>
    </header>
  );
}
