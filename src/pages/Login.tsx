import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useAuth } from "@/lib/auth-context";
import { Gift, Wifi, WifiOff } from "lucide-react";

export default function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const { signIn, authError } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  // Get the redirect path from location state
  const from = location.state?.from?.pathname || "/dashboard";

  useEffect(() => {
    // Set up event listeners for online/offline status
    const handleOnline = () => {
      setIsOnline(true);
      setError(null);
    };

    const handleOffline = () => {
      setIsOnline(false);
      setError(
        "Vous êtes actuellement hors ligne. Veuillez vérifier votre connexion internet."
      );
    };

    window.addEventListener("online", handleOnline);
    window.addEventListener("offline", handleOffline);

    // Check if already online/offline
    setIsOnline(navigator.onLine);

    return () => {
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("offline", handleOffline);
    };
  }, []);

  // Update error if authError changes
  useEffect(() => {
    if (authError) {
      setError(authError);
    }
  }, [authError]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Check if online before attempting to sign in
    if (!isOnline) {
      setError(
        "Vous êtes actuellement hors ligne. Veuillez vérifier votre connexion internet."
      );
      return;
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(username)) {
      setError("Veuillez entrer une adresse email valide");
      return;
    }

    setError(null);
    setIsLoading(true);

    try {
      await signIn(username, password);
      console.log("Connexion réussie, redirection vers:", from);
      navigate(from);
    } catch (err) {
      console.error("Erreur de connexion:", err);
      setError(
        err instanceof Error
          ? err.message
          : "Échec de la connexion. Veuillez vérifier vos identifiants et réessayer."
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex min-h-[80vh] flex-col items-center justify-center px-4">
      <div className="mb-8 flex flex-col items-center text-center">
        <Gift className="h-12 w-12 text-primary mb-2" />
        <h1 className="text-3xl font-bold tracking-tight">Bienvenue</h1>
        <p className="text-muted-foreground mt-2">
          Connectez-vous à votre compte pour continuer
        </p>
        {/* Online/Offline indicator */}
        <div className="flex items-center mt-2">
          {isOnline ? (
            <Wifi className="h-4 w-4 text-green-500 mr-1" />
          ) : (
            <WifiOff className="h-4 w-4 text-red-500 mr-1" />
          )}
          <span
            className={
              isOnline ? "text-green-500 text-xs" : "text-red-500 text-xs"
            }
          >
            {isOnline ? "En ligne" : "Hors ligne"}
          </span>
        </div>
      </div>

      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>Connexion</CardTitle>
          <CardDescription>
            Entrez vos identifiants pour accéder à votre compte
          </CardDescription>
        </CardHeader>
        <form onSubmit={handleSubmit}>
          <CardContent className="space-y-4">
            {error && (
              <Alert variant="destructive">
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}
            <div className="space-y-2">
              <Label htmlFor="username">Email de connexion</Label>
              <Input
                id="username"
                type="email"
                placeholder="votre.email@exemple.com"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
                disabled={isLoading || !isOnline}
              />
            </div>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="password">Mot de passe</Label>
                <Button
                  variant="link"
                  className="p-0 h-auto text-xs"
                  type="button"
                  onClick={() => navigate("/forgot-password")}
                >
                  Mot de passe oublié?
                </Button>
              </div>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                disabled={isLoading || !isOnline}
              />
            </div>
          </CardContent>
          <CardFooter className="flex flex-col space-y-4">
            <Button
              type="submit"
              className="w-full"
              disabled={isLoading || !isOnline}
            >
              {isLoading ? "Connexion en cours..." : "Se connecter"}
            </Button>
            <p className="text-center text-sm text-muted-foreground">
              Vous n'avez pas de compte?{" "}
              <Button
                variant="link"
                className="p-0 h-auto"
                type="button"
                onClick={() => navigate("/signup")}
              >
                S'inscrire
              </Button>
            </p>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
}
