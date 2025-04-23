
/**
 * Header component containing navigation and user controls
 */
import { NavLink } from "react-router-dom";
import { Menu } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState } from "react";

export function Header() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <header className="border-b bg-white">
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          <div className="flex items-center">
            <h1 className="text-xl font-semibold text-primary">Marie</h1>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-4">
            <NavLink to="/" className={({ isActive }) => 
              `nav-link ${isActive ? 'nav-link-active' : ''}`
            }>
              Home
            </NavLink>
            <NavLink to="/features" className={({ isActive }) => 
              `nav-link ${isActive ? 'nav-link-active' : ''}`
            }>
              Features
            </NavLink>
            <NavLink to="/about" className={({ isActive }) => 
              `nav-link ${isActive ? 'nav-link-active' : ''}`
            }>
              About
            </NavLink>
          </nav>

          {/* Mobile Menu Button */}
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
            <NavLink to="/" className={({ isActive }) => 
              `nav-link block ${isActive ? 'nav-link-active' : ''}`
            }>
              Home
            </NavLink>
            <NavLink to="/features" className={({ isActive }) => 
              `nav-link block ${isActive ? 'nav-link-active' : ''}`
            }>
              Features
            </NavLink>
            <NavLink to="/about" className={({ isActive }) => 
              `nav-link block ${isActive ? 'nav-link-active' : ''}`
            }>
              About
            </NavLink>
          </nav>
        )}
      </div>
    </header>
  );
}
