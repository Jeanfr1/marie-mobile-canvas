
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"

const About = () => {
  return (
    <div className="container mx-auto py-12">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold tracking-tight mb-4">About Marie</h1>
          <p className="text-lg text-muted-foreground">
            Building the future of team collaboration
          </p>
        </div>

        <Card className="mb-8">
          <CardContent className="p-6">
            <div className="prose prose-lg max-w-none">
              <p className="text-lg leading-relaxed mb-6">
                Marie is a modern, accessible, and performant web application designed to help teams work better together. Our platform combines powerful features with an intuitive interface to create the perfect environment for collaboration and productivity.
              </p>
              
              <p className="text-lg leading-relaxed mb-6">
                Founded in 2024, we've been working tirelessly to create tools that make work more efficient and enjoyable. Our team is passionate about delivering the best possible experience for our users.
              </p>

              <div className="grid md:grid-cols-3 gap-6 mt-8">
                <div className="text-center">
                  <h3 className="text-3xl font-bold text-primary mb-2">1M+</h3>
                  <p className="text-muted-foreground">Active Users</p>
                </div>
                <div className="text-center">
                  <h3 className="text-3xl font-bold text-primary mb-2">50+</h3>
                  <p className="text-muted-foreground">Countries</p>
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
            Contact Us
          </Button>
          <Button variant="outline" size="lg">
            Learn More
          </Button>
        </div>
      </div>
    </div>
  )
}

export default About
