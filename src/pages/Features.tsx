
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Activity, MessageSquare, Users, Calendar } from "lucide-react"

const Features = () => {
  const features = [
    {
      icon: <Activity className="w-6 h-6 text-primary" />,
      title: "Real-time Analytics",
      description: "Track your performance with detailed analytics and insights",
      badge: "Pro"
    },
    {
      icon: <MessageSquare className="w-6 h-6 text-primary" />,
      title: "Smart Messaging",
      description: "Connect with your team using our advanced messaging system",
    },
    {
      icon: <Users className="w-6 h-6 text-primary" />,
      title: "Team Collaboration",
      description: "Work together seamlessly with powerful collaboration tools",
    },
    {
      icon: <Calendar className="w-6 h-6 text-primary" />,
      title: "Smart Scheduling",
      description: "Automate your calendar and never miss an important meeting",
      badge: "New"
    }
  ]

  return (
    <div className="container mx-auto py-12">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold tracking-tight mb-4">
          Powerful Features for Modern Teams
        </h1>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
          Discover all the innovative features that make Marie the perfect solution for your team.
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
