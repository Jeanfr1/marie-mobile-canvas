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
            Never Forget a Gift Again
          </h1>
          <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
            Track gifts, manage events, and get reminders for important
            occasions with Gift Tracker, your personal gift management
            assistant.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" onClick={() => navigate("/signup")}>
              Get Started
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
            <Button
              size="lg"
              variant="outline"
              onClick={() => navigate("/login")}
            >
              Sign In
            </Button>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-16 px-4 bg-muted/50">
        <div className="container mx-auto">
          <h2 className="text-3xl font-bold text-center mb-12">Key Features</h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-card p-6 rounded-lg shadow-sm border flex flex-col items-center text-center">
              <Package className="h-10 w-10 text-primary mb-4" />
              <h3 className="text-xl font-semibold mb-2">Gift Management</h3>
              <p className="text-muted-foreground">
                Keep track of gifts given and received. Never duplicate a gift
                or forget what you've given before.
              </p>
            </div>
            <div className="bg-card p-6 rounded-lg shadow-sm border flex flex-col items-center text-center">
              <Calendar className="h-10 w-10 text-primary mb-4" />
              <h3 className="text-xl font-semibold mb-2">Event Reminders</h3>
              <p className="text-muted-foreground">
                Set reminders for birthdays, anniversaries, and special
                occasions so you're always prepared.
              </p>
            </div>
            <div className="bg-card p-6 rounded-lg shadow-sm border flex flex-col items-center text-center">
              <User className="h-10 w-10 text-primary mb-4" />
              <h3 className="text-xl font-semibold mb-2">
                Contact Organization
              </h3>
              <p className="text-muted-foreground">
                Organize your contacts and their preferences to make gift-giving
                easier and more personal.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="py-16 px-4">
        <div className="container mx-auto max-w-3xl">
          <h2 className="text-3xl font-bold text-center mb-12">How It Works</h2>
          <ol className="space-y-6">
            <li className="flex gap-4">
              <div className="flex-shrink-0 flex items-center justify-center w-10 h-10 rounded-full bg-primary text-primary-foreground font-bold">
                1
              </div>
              <div>
                <h3 className="text-xl font-semibold">Create an account</h3>
                <p className="text-muted-foreground">
                  Sign up with your email to get started with Gift Tracker.
                </p>
              </div>
            </li>
            <li className="flex gap-4">
              <div className="flex-shrink-0 flex items-center justify-center w-10 h-10 rounded-full bg-primary text-primary-foreground font-bold">
                2
              </div>
              <div>
                <h3 className="text-xl font-semibold">Add your contacts</h3>
                <p className="text-muted-foreground">
                  Input important people in your life and their special dates.
                </p>
              </div>
            </li>
            <li className="flex gap-4">
              <div className="flex-shrink-0 flex items-center justify-center w-10 h-10 rounded-full bg-primary text-primary-foreground font-bold">
                3
              </div>
              <div>
                <h3 className="text-xl font-semibold">Track your gifts</h3>
                <p className="text-muted-foreground">
                  Record gifts you've given and received for future reference.
                </p>
              </div>
            </li>
            <li className="flex gap-4">
              <div className="flex-shrink-0 flex items-center justify-center w-10 h-10 rounded-full bg-primary text-primary-foreground font-bold">
                4
              </div>
              <div>
                <h3 className="text-xl font-semibold">Get notified</h3>
                <p className="text-muted-foreground">
                  Receive timely reminders before important dates.
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
          <h2 className="text-3xl font-bold mb-4">Your Data is Secure</h2>
          <p className="text-xl mb-8">
            We use industry-standard encryption and security practices to keep
            your information safe.
          </p>
          <Button
            size="lg"
            variant="secondary"
            onClick={() => navigate("/signup")}
            className="font-semibold"
          >
            Create Your Free Account
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
              © {new Date().getFullYear()} Gift Tracker. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
