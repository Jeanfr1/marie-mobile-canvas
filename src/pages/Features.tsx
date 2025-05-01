
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Activity, MessageSquare, Users, Calendar } from "lucide-react"

const Features = () => {
  const features = [
    {
      icon: <Activity className="w-6 h-6 text-primary" />,
      title: "Analyses en temps réel",
      description: "Suivez vos performances avec des analyses et des insights détaillés",
      badge: "Pro"
    },
    {
      icon: <MessageSquare className="w-6 h-6 text-primary" />,
      title: "Messagerie intelligente",
      description: "Connectez-vous avec votre équipe grâce à notre système de messagerie avancé",
    },
    {
      icon: <Users className="w-6 h-6 text-primary" />,
      title: "Collaboration d'équipe",
      description: "Travaillez ensemble sans effort avec des outils de collaboration puissants",
    },
    {
      icon: <Calendar className="w-6 h-6 text-primary" />,
      title: "Planification intelligente",
      description: "Automatisez votre calendrier et ne manquez jamais une réunion importante",
      badge: "Nouveau"
    }
  ]

  return (
    <div className="container mx-auto py-12">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold tracking-tight mb-4">
          Fonctionnalités puissantes pour les équipes modernes
        </h1>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
          Découvrez toutes les fonctionnalités innovantes qui font de Marie la solution parfaite pour votre équipe.
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        {features.map((feature, index) => (
          <Card key={index} className="group hover:shadow-lg transition-shadow duration-200">
            <CardHeader>
              <div className="flex items-center justify-between mb-2">
                <div className="p-2 bg-primary/10 rounded-lg">{feature.icon}</div>
                {feature.badge && (
                  <Badge variant="secondary" className="font-semibold">
                    {feature.badge}
                  </Badge>
                )}
              </div>
              <CardTitle className="text-xl mb-2 group-hover:text-primary transition-colors">
                {feature.title}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">{feature.description}</p>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}

export default Features
