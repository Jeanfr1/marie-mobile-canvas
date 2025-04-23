
import { NavLink } from "react-router-dom";
import { Menu, Gift, Users, PlusSquare } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState } from "react";

export function Header() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          <div className="flex items-center">
            <NavLink to="/" className="text-xl font-semibold text-primary hover:text-primary/90 transition-colors flex items-center gap-2">
              <Gift className="h-6 w-6" />
              <span>GiftTracker</span>
            </NavLink>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-4">
            <NavLink
              to="/"
              className={({ isActive }) => 
                `nav-link flex items-center gap-1 ${isActive ? 'nav-link-active' : ''}`
              }
            >
              <PlusSquare className="h-4 w-4" />
              Dashboard
            </NavLink>
            <NavLink
              to="/gifts-received"
              className={({ isActive }) => 
                `nav-link flex items-center gap-1 ${isActive ? 'nav-link-active' : ''}`
              }
            >
              <Gift className="h-4 w-4" />
              Gifts Received
            </NavLink>
            <NavLink
              to="/gifts-given"
              className={({ isActive }) => 
                `nav-link flex items-center gap-1 ${isActive ? 'nav-link-active' : ''}`
              }
            >
              <Gift className="h-4 w-4" />
              Gifts Given
            </NavLink>
            <NavLink
              to="/contacts"
              className={({ isActive }) => 
                `nav-link flex items-center gap-1 ${isActive ? 'nav-link-active' : ''}`
              }
            >
              <Users className="h-4 w-4" />
              Contacts
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
                `nav-link flex items-center gap-2 p-2 ${isActive ? 'nav-link-active bg-primary/10 rounded-md' : ''}`
              }
              onClick={() => setIsOpen(false)}
            >
              <PlusSquare className="h-5 w-5" />
              Dashboard
            </NavLink>
            <NavLink
              to="/gifts-received"
              className={({ isActive }) => 
                `nav-link flex items-center gap-2 p-2 ${isActive ? 'nav-link-active bg-primary/10 rounded-md' : ''}`
              }
              onClick={() => setIsOpen(false)}
            >
              <Gift className="h-5 w-5" />
              Gifts Received
            </NavLink>
            <NavLink
              to="/gifts-given"
              className={({ isActive }) => 
                `nav-link flex items-center gap-2 p-2 ${isActive ? 'nav-link-active bg-primary/10 rounded-md' : ''}`
              }
              onClick={() => setIsOpen(false)}
            >
              <Gift className="h-5 w-5" />
              Gifts Given
            </NavLink>
            <NavLink
              to="/contacts"
              className={({ isActive }) => 
                `nav-link flex items-center gap-2 p-2 ${isActive ? 'nav-link-active bg-primary/10 rounded-md' : ''}`
              }
              onClick={() => setIsOpen(false)}
            >
              <Users className="h-5 w-5" />
              Contacts
            </NavLink>
          </nav>
        )}
      </div>
    </header>
  );
}
