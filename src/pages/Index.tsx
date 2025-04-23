
/**
 * Home page component displaying the main content
 */
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";

const Index = () => {
  return (
    <div className="space-y-8">
      <section className="text-center max-w-3xl mx-auto space-y-4">
        <h1 className="text-4xl font-bold tracking-tight text-gray-900 sm:text-6xl">
          Welcome to Marie
        </h1>
        <p className="text-lg text-gray-600">
          A modern, accessible, and performant web application
        </p>
      </section>

      <div className="grid md:grid-cols-3 gap-6 mt-12">
        {features.map((feature, index) => (
          <Card key={index}>
            <CardHeader>
              <CardTitle>{feature.title}</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600">{feature.description}</p>
            </CardContent>
            <CardFooter>
              <Button variant="outline" className="w-full">
                Learn More
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  );
};

const features = [
  {
    title: "Modern Design",
    description: "Clean and intuitive interface built with the latest web technologies",
  },
  {
    title: "Responsive",
    description: "Perfect experience on all devices, from mobile to desktop",
  },
  {
    title: "Accessible",
    description: "Built with accessibility in mind, following WCAG 2.1 guidelines",
  },
];

export default Index;
