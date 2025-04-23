
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Activity, MessageSquare, Users } from "lucide-react";

const Index = () => {
  return (
    <div className="space-y-12">
      <section className="text-center py-20">
        <div className="max-w-3xl mx-auto space-y-6">
          <h1 className="text-5xl font-bold tracking-tight text-gray-900 sm:text-6xl bg-clip-text text-transparent bg-gradient-to-r from-primary to-primary/60">
            Welcome to Marie
          </h1>
          <p className="text-xl text-muted-foreground">
            A modern, accessible, and performant application for teams who want to work smarter
          </p>
          <div className="flex justify-center gap-4">
            <Button size="lg">Get Started</Button>
            <Button size="lg" variant="outline">Learn More</Button>
          </div>
        </div>
      </section>

      <div className="grid md:grid-cols-3 gap-6 mt-12">
        <Card className="group hover:shadow-lg transition-all duration-200">
          <CardHeader>
            <div className="p-3 bg-primary/10 rounded-lg w-fit mb-4 group-hover:bg-primary/20 transition-colors">
              <Activity className="w-6 h-6 text-primary" />
            </div>
            <CardTitle>Modern Design</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">
              Clean and intuitive interface built with the latest web technologies
            </p>
          </CardContent>
        </Card>

        <Card className="group hover:shadow-lg transition-all duration-200">
          <CardHeader>
            <div className="p-3 bg-primary/10 rounded-lg w-fit mb-4 group-hover:bg-primary/20 transition-colors">
              <Users className="w-6 h-6 text-primary" />
            </div>
            <CardTitle>Team Collaboration</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">
              Perfect experience for team collaboration across all devices
            </p>
          </CardContent>
        </Card>

        <Card className="group hover:shadow-lg transition-all duration-200">
          <CardHeader>
            <div className="p-3 bg-primary/10 rounded-lg w-fit mb-4 group-hover:bg-primary/20 transition-colors">
              <MessageSquare className="w-6 h-6 text-primary" />
            </div>
            <CardTitle>Smart Communication</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">
              Built with advanced communication features for seamless interaction
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Index;
