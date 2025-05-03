import { NavLink, useNavigate } from "react-router-dom";
import { Menu, Gift, Users, PlusSquare, LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { useAuth } from "@/lib/auth-context";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

export function Header() {
  const [isOpen, setIsOpen] = useState(false);
  const { isAuthenticated, user, signOut } = useAuth();
  const navigate = useNavigate();

  const handleSignOut = async () => {
    try {
      await signOut();
      navigate("/");
    } catch (error) {
      console.error("Error signing out:", error);
    }
  };

  const getInitials = () => {
    if (!user) return "GT";

    // First try to get the name from user attributes
    if (user.attributes && user.attributes.name) {
      const name = user.attributes.name;
      // If name contains spaces (first and last name), use first letter of each
      if (name.includes(" ")) {
        const nameParts = name.split(" ");
        return (nameParts[0].charAt(0) + nameParts[1].charAt(0)).toUpperCase();
      }
      // Otherwise use the first letter of the name
      return name.charAt(0).toUpperCase();
    }

    // Fallback to username if no name attribute
    const username = user.username || "";
    if (!username) return "GT";

    // If username appears to be an email, take first letter of the part before @
    if (username.includes("@")) {
      const firstPart = username.split("@")[0];
      return firstPart.charAt(0).toUpperCase();
    }

    // Otherwise, take the first character of the username
    return username.charAt(0).toUpperCase();
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          <div className="flex items-center">
            <NavLink
              to="/"
              className="text-xl font-semibold text-primary hover:text-primary/90 transition-colors flex items-center gap-2"
            >
              <Gift className="h-6 w-6" />
              <span>GiftTracker</span>
            </NavLink>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-4">
            {isAuthenticated ? (
              <>
                <NavLink
                  to="/dashboard"
                  className={({ isActive }) =>
                    `px-4 py-2 text-sm font-medium rounded-md transition-colors ${
                      isActive
                        ? "bg-primary text-primary-foreground"
                        : "text-foreground hover:bg-muted"
                    }`
                  }
                >
                  Tableau de bord
                </NavLink>
                <NavLink
                  to="/gifts-received"
                  className={({ isActive }) =>
                    `px-4 py-2 text-sm font-medium rounded-md transition-colors ${
                      isActive
                        ? "bg-primary text-primary-foreground"
                        : "text-foreground hover:bg-muted"
                    }`
                  }
                >
                  Cadeaux reçus
                </NavLink>
                <NavLink
                  to="/gifts-given"
                  className={({ isActive }) =>
                    `px-4 py-2 text-sm font-medium rounded-md transition-colors ${
                      isActive
                        ? "bg-primary text-primary-foreground"
                        : "text-foreground hover:bg-muted"
                    }`
                  }
                >
                  Cadeaux offerts
                </NavLink>
                <NavLink
                  to="/contacts"
                  className={({ isActive }) =>
                    `px-4 py-2 text-sm font-medium rounded-md transition-colors ${
                      isActive
                        ? "bg-primary text-primary-foreground"
                        : "text-foreground hover:bg-muted"
                    }`
                  }
                >
                  Contacts
                </NavLink>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button
                      variant="ghost"
                      className="relative h-10 w-10 rounded-full"
                    >
                      <Avatar>
                        <AvatarFallback>{getInitials()}</AvatarFallback>
                      </Avatar>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem onClick={handleSignOut}>
                      <LogOut className="mr-2 h-4 w-4" />
                      Se déconnecter
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </>
            ) : (
              <>
                <Button variant="ghost" onClick={() => navigate("/login")}>
                  Connexion
                </Button>
                <Button onClick={() => navigate("/signup")}>S'inscrire</Button>
              </>
            )}
          </nav>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsOpen(!isOpen)}
              aria-label="Toggle menu"
            >
              <Menu className="h-6 w-6" />
            </Button>
          </div>
        </div>
      </div>

      {/* Mobile Navigation */}
      {isOpen && (
        <div className="md:hidden border-t">
          <div className="container mx-auto px-4 py-2 space-y-1">
            {isAuthenticated ? (
              <>
                <NavLink
                  to="/dashboard"
                  className={({ isActive }) =>
                    `block px-3 py-2 rounded-md text-base font-medium ${
                      isActive
                        ? "bg-primary text-primary-foreground"
                        : "hover:bg-muted"
                    }`
                  }
                  onClick={() => setIsOpen(false)}
                >
                  Tableau de bord
                </NavLink>
                <NavLink
                  to="/gifts-received"
                  className={({ isActive }) =>
                    `block px-3 py-2 rounded-md text-base font-medium ${
                      isActive
                        ? "bg-primary text-primary-foreground"
                        : "hover:bg-muted"
                    }`
                  }
                  onClick={() => setIsOpen(false)}
                >
                  Cadeaux reçus
                </NavLink>
                <NavLink
                  to="/gifts-given"
                  className={({ isActive }) =>
                    `block px-3 py-2 rounded-md text-base font-medium ${
                      isActive
                        ? "bg-primary text-primary-foreground"
                        : "hover:bg-muted"
                    }`
                  }
                  onClick={() => setIsOpen(false)}
                >
                  Cadeaux offerts
                </NavLink>
                <NavLink
                  to="/contacts"
                  className={({ isActive }) =>
                    `block px-3 py-2 rounded-md text-base font-medium ${
                      isActive
                        ? "bg-primary text-primary-foreground"
                        : "hover:bg-muted"
                    }`
                  }
                  onClick={() => setIsOpen(false)}
                >
                  Contacts
                </NavLink>
                <Button
                  variant="ghost"
                  className="w-full justify-start"
                  onClick={() => {
                    handleSignOut();
                    setIsOpen(false);
                  }}
                >
                  <LogOut className="mr-2 h-4 w-4" />
                  Se déconnecter
                </Button>
              </>
            ) : (
              <>
                <Button
                  variant="ghost"
                  className="w-full justify-start"
                  onClick={() => {
                    navigate("/login");
                    setIsOpen(false);
                  }}
                >
                  Connexion
                </Button>
                <Button
                  className="w-full justify-start"
                  onClick={() => {
                    navigate("/signup");
                    setIsOpen(false);
                  }}
                >
                  S'inscrire
                </Button>
              </>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
