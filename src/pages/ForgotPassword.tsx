import { useState } from "react";
import { useNavigate } from "react-router-dom";
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
import { Gift } from "lucide-react";

export default function ForgotPassword() {
  const [username, setUsername] = useState("");
  const [code, setCode] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [sentCode, setSentCode] = useState(false);
  const { forgotPassword, forgotPasswordSubmit } = useAuth();
  const navigate = useNavigate();

  const handleSendCode = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setMessage(null);
    setIsLoading(true);

    try {
      await forgotPassword(username);
      setSentCode(true);
      setMessage("Code de vérification envoyé à votre email");
    } catch (err) {
      console.error("Erreur de mot de passe oublié:", err);
      setError(
        err instanceof Error
          ? err.message
          : "Échec de l'envoi du code de vérification. Veuillez réessayer."
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setMessage(null);

    // Validate password match
    if (newPassword !== confirmPassword) {
      setError("Les mots de passe ne correspondent pas");
      return;
    }

    setIsLoading(true);

    try {
      await forgotPasswordSubmit(username, code, newPassword);
      navigate("/login", {
        state: {
          message:
            "Mot de passe réinitialisé avec succès. Veuillez vous connecter avec votre nouveau mot de passe.",
        },
      });
    } catch (err) {
      console.error("Erreur de réinitialisation du mot de passe:", err);
      setError(
        err instanceof Error
          ? err.message
          : "Échec de la réinitialisation du mot de passe. Veuillez vérifier votre code et réessayer."
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex min-h-[80vh] flex-col items-center justify-center px-4">
      <div className="mb-8 flex flex-col items-center text-center">
        <Gift className="h-12 w-12 text-primary mb-2" />
        <h1 className="text-3xl font-bold tracking-tight">
          Réinitialiser le mot de passe
        </h1>
        <p className="text-muted-foreground mt-2">
          Nous vous aiderons à récupérer votre compte
        </p>
      </div>

      <Card className="w-full max-w-md">
        {!sentCode ? (
          <>
            <CardHeader>
              <CardTitle>Mot de passe oublié</CardTitle>
              <CardDescription>
                Entrez votre identifiant de connexion pour recevoir un code de
                vérification
              </CardDescription>
            </CardHeader>
            <form onSubmit={handleSendCode}>
              <CardContent className="space-y-4">
                {error && (
                  <Alert variant="destructive">
                    <AlertDescription>{error}</AlertDescription>
                  </Alert>
                )}
                {message && (
                  <Alert>
                    <AlertDescription>{message}</AlertDescription>
                  </Alert>
                )}
                <div className="space-y-2">
                  <Label htmlFor="username">Identifiant de connexion</Label>
                  <Input
                    id="username"
                    placeholder="Votre identifiant"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    required
                  />
                </div>
              </CardContent>
              <CardFooter className="flex flex-col space-y-4">
                <Button type="submit" className="w-full" disabled={isLoading}>
                  {isLoading
                    ? "Envoi du code..."
                    : "Envoyer le code de réinitialisation"}
                </Button>
                <p className="text-center text-sm text-muted-foreground">
                  Vous vous souvenez de votre mot de passe?{" "}
                  <Button
                    variant="link"
                    className="p-0 h-auto"
                    type="button"
                    onClick={() => navigate("/login")}
                  >
                    Se connecter
                  </Button>
                </p>
              </CardFooter>
            </form>
          </>
        ) : (
          <>
            <CardHeader>
              <CardTitle>Réinitialisez votre mot de passe</CardTitle>
              <CardDescription>
                Entrez le code de vérification et votre nouveau mot de passe
              </CardDescription>
            </CardHeader>
            <form onSubmit={handleResetPassword}>
              <CardContent className="space-y-4">
                {error && (
                  <Alert variant="destructive">
                    <AlertDescription>{error}</AlertDescription>
                  </Alert>
                )}
                {message && (
                  <Alert>
                    <AlertDescription>{message}</AlertDescription>
                  </Alert>
                )}
                <div className="space-y-2">
                  <Label htmlFor="code">Code de vérification</Label>
                  <Input
                    id="code"
                    value={code}
                    onChange={(e) => setCode(e.target.value)}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="newPassword">Nouveau mot de passe</Label>
                  <Input
                    id="newPassword"
                    type="password"
                    placeholder="••••••••"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    required
                  />
                  <p className="text-xs text-muted-foreground">
                    Minimum 8 caractères, incluant au moins une lettre
                    majuscule, une lettre minuscule et un chiffre
                  </p>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="confirmPassword">
                    Confirmer le nouveau mot de passe
                  </Label>
                  <Input
                    id="confirmPassword"
                    type="password"
                    placeholder="••••••••"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    required
                  />
                </div>
              </CardContent>
              <CardFooter className="flex flex-col space-y-4">
                <Button type="submit" className="w-full" disabled={isLoading}>
                  {isLoading
                    ? "Réinitialisation en cours..."
                    : "Réinitialiser le mot de passe"}
                </Button>
              </CardFooter>
            </form>
          </>
        )}
      </Card>
    </div>
  );
}
