
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"

const About = () => {
  return (
    <div className="container mx-auto py-12">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold tracking-tight mb-4">À propos de Marie</h1>
          <p className="text-lg text-muted-foreground">
            Construire l'avenir de la collaboration d'équipe
          </p>
        </div>

        <Card className="mb-8">
          <CardContent className="p-6">
            <div className="prose prose-lg max-w-none">
              <p className="text-lg leading-relaxed mb-6">
                Marie est une application web moderne, accessible et performante, conçue pour aider les équipes à mieux travailler ensemble. Notre plateforme combine des fonctionnalités puissantes avec une interface intuitive pour créer l'environnement parfait pour la collaboration et la productivité.
              </p>
              
              <p className="text-lg leading-relaxed mb-6">
                Fondée en 2024, nous travaillons sans relâche pour créer des outils qui rendent le travail plus efficace et agréable. Notre équipe est passionnée par l'offre de la meilleure expérience possible pour nos utilisateurs.
              </p>

              <div className="grid md:grid-cols-3 gap-6 mt-8">
                <div className="text-center">
                  <h3 className="text-3xl font-bold text-primary mb-2">1M+</h3>
                  <p className="text-muted-foreground">Utilisateurs Actifs</p>
                </div>
                <div className="text-center">
                  <h3 className="text-3xl font-bold text-primary mb-2">50+</h3>
                  <p className="text-muted-foreground">Pays</p>
                </div>
                <div className="text-center">
                  <h3 className="text-3xl font-bold text-primary mb-2">24/7</h3>
                  <p className="text-muted-foreground">Support</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="text-center">
          <Button size="lg" className="mr-4">
            Contactez-nous
          </Button>
          <Button variant="outline" size="lg">
            En savoir plus
          </Button>
        </div>
      </div>
    </div>
  )
}

export default About
