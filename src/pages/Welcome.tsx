import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Gift, Package, Calendar, User, Lock, ArrowRight } from "lucide-react";

export default function Welcome() {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero Section */}
      <section className="py-20 px-4 text-center">
        <div className="container mx-auto max-w-4xl">
          <Gift className="h-16 w-16 mx-auto text-primary mb-6" />
          <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-4">
            N'oubliez plus jamais un cadeau
          </h1>
          <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
            Suivez les cadeaux, gérez les événements et recevez des rappels pour
            les occasions importantes avec Gift Tracker, votre assistant
            personnel de gestion de cadeaux.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" onClick={() => navigate("/signup")}>
              Commencer
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
            <Button
              size="lg"
              variant="outline"
              onClick={() => navigate("/login")}
            >
              Connexion
            </Button>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-16 px-4 bg-muted/50">
        <div className="container mx-auto">
          <h2 className="text-3xl font-bold text-center mb-12">
            Fonctionnalités clés
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-card p-6 rounded-lg shadow-sm border flex flex-col items-center text-center">
              <Package className="h-10 w-10 text-primary mb-4" />
              <h3 className="text-xl font-semibold mb-2">
                Gestion des cadeaux
              </h3>
              <p className="text-muted-foreground">
                Gardez une trace des cadeaux donnés et reçus. Ne dupliquez
                jamais un cadeau et n'oubliez pas ce que vous avez offert
                auparavant.
              </p>
            </div>
            <div className="bg-card p-6 rounded-lg shadow-sm border flex flex-col items-center text-center">
              <Calendar className="h-10 w-10 text-primary mb-4" />
              <h3 className="text-xl font-semibold mb-2">
                Rappels d'événements
              </h3>
              <p className="text-muted-foreground">
                Définissez des rappels pour les anniversaires, les célébrations
                et les occasions spéciales afin d'être toujours préparé.
              </p>
            </div>
            <div className="bg-card p-6 rounded-lg shadow-sm border flex flex-col items-center text-center">
              <User className="h-10 w-10 text-primary mb-4" />
              <h3 className="text-xl font-semibold mb-2">
                Organisation des contacts
              </h3>
              <p className="text-muted-foreground">
                Organisez vos contacts et leurs préférences pour rendre l'offre
                de cadeaux plus facile et plus personnelle.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="py-16 px-4">
        <div className="container mx-auto max-w-3xl">
          <h2 className="text-3xl font-bold text-center mb-12">
            Comment ça marche
          </h2>
          <ol className="space-y-6">
            <li className="flex gap-4">
              <div className="flex-shrink-0 flex items-center justify-center w-10 h-10 rounded-full bg-primary text-primary-foreground font-bold">
                1
              </div>
              <div>
                <h3 className="text-xl font-semibold">Créez un compte</h3>
                <p className="text-muted-foreground">
                  Inscrivez-vous avec votre email pour commencer à utiliser Gift
                  Tracker.
                </p>
              </div>
            </li>
            <li className="flex gap-4">
              <div className="flex-shrink-0 flex items-center justify-center w-10 h-10 rounded-full bg-primary text-primary-foreground font-bold">
                2
              </div>
              <div>
                <h3 className="text-xl font-semibold">Ajoutez vos contacts</h3>
                <p className="text-muted-foreground">
                  Enregistrez les personnes importantes dans votre vie et leurs
                  dates spéciales.
                </p>
              </div>
            </li>
            <li className="flex gap-4">
              <div className="flex-shrink-0 flex items-center justify-center w-10 h-10 rounded-full bg-primary text-primary-foreground font-bold">
                3
              </div>
              <div>
                <h3 className="text-xl font-semibold">Suivez vos cadeaux</h3>
                <p className="text-muted-foreground">
                  Enregistrez les cadeaux que vous avez donnés et reçus pour
                  référence future.
                </p>
              </div>
            </li>
            <li className="flex gap-4">
              <div className="flex-shrink-0 flex items-center justify-center w-10 h-10 rounded-full bg-primary text-primary-foreground font-bold">
                4
              </div>
              <div>
                <h3 className="text-xl font-semibold">
                  Recevez des notifications
                </h3>
                <p className="text-muted-foreground">
                  Recevez des rappels opportuns avant les dates importantes.
                </p>
              </div>
            </li>
          </ol>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 px-4 bg-primary text-primary-foreground">
        <div className="container mx-auto text-center max-w-3xl">
          <Lock className="h-12 w-12 mx-auto mb-6" />
          <h2 className="text-3xl font-bold mb-4">
            Vos données sont sécurisées
          </h2>
          <p className="text-xl mb-8">
            Nous utilisons des pratiques de sécurité et de chiffrement conformes
            aux normes de l'industrie pour protéger vos informations.
          </p>
          <Button
            size="lg"
            variant="secondary"
            onClick={() => navigate("/signup")}
            className="font-semibold"
          >
            Créez votre compte gratuit
          </Button>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 px-4 border-t">
        <div className="container mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex items-center mb-4 md:mb-0">
              <Gift className="h-6 w-6 text-primary mr-2" />
              <span className="font-semibold">Gift Tracker</span>
            </div>
            <p className="text-sm text-muted-foreground">
              © {new Date().getFullYear()} Gift Tracker. Tous droits réservés.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
