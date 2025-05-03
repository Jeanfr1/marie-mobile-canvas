import { useState, useEffect } from "react";
import { useAuth } from "@/lib/auth-context";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Gift, Users, Calendar, Bell, ArrowRight } from "lucide-react";

interface Feature {
  id: string;
  title: string;
  description: string;
  icon: React.ReactNode;
  path: string;
}

// Define features to be showcased progressively
const features: Feature[] = [
  {
    id: "gifts_received",
    title: "Track Gifts You've Received",
    description:
      "Keep a record of gifts you've received, who they're from, and when you got them.",
    icon: <Gift className="h-10 w-10 text-primary" />,
    path: "/gifts-received",
  },
  {
    id: "contacts",
    title: "Manage Your Contacts",
    description:
      "Add friends and family to your contacts to remember their preferences and important dates.",
    icon: <Users className="h-10 w-10 text-primary" />,
    path: "/contacts",
  },
  {
    id: "events",
    title: "Never Miss Important Dates",
    description:
      "Set up reminders for birthdays, anniversaries, and other special occasions.",
    icon: <Calendar className="h-10 w-10 text-primary" />,
    path: "/dashboard",
  },
  {
    id: "notifications",
    title: "Stay Updated with Notifications",
    description:
      "Configure notification settings to receive reminders about upcoming events.",
    icon: <Bell className="h-10 w-10 text-primary" />,
    path: "/dashboard",
  },
];

export function FeatureDisclosure() {
  const { user } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const [currentFeature, setCurrentFeature] = useState<Feature | null>(null);
  const [showNextTime, setShowNextTime] = useState(true);

  useEffect(() => {
    if (!user) return;

    const userId = user.username;
    const userDataKey = `userData_${userId}`;
    const userData = JSON.parse(localStorage.getItem(userDataKey) || "{}");

    // Check user activity metrics
    const loginCount = userData.loginCount || 0;
    const seenFeatures = userData.seenFeatures || [];
    const shouldShowFeatures = userData.showFeatures !== false;

    // Increment login count
    userData.loginCount = loginCount + 1;
    localStorage.setItem(userDataKey, JSON.stringify(userData));

    // Only proceed if user wants to see features
    if (!shouldShowFeatures) return;

    // Find the next feature to show based on login count and seenFeatures
    const loginThresholds = [1, 3, 5, 7]; // Show a feature on these login counts

    if (loginThresholds.includes(loginCount)) {
      const featureIndex = loginThresholds.indexOf(loginCount);
      if (featureIndex < features.length) {
        const nextFeature = features[featureIndex];

        // Check if user has already seen this feature
        if (!seenFeatures.includes(nextFeature.id)) {
          setCurrentFeature(nextFeature);
          setIsOpen(true);

          // Mark feature as seen
          userData.seenFeatures = [...seenFeatures, nextFeature.id];
          localStorage.setItem(userDataKey, JSON.stringify(userData));
        }
      }
    }
  }, [user]);

  const handleClose = () => {
    setIsOpen(false);
  };

  const handleNavigate = () => {
    if (currentFeature) {
      window.location.href = currentFeature.path;
    }
    setIsOpen(false);
  };

  const handleToggleNextTime = () => {
    setShowNextTime(!showNextTime);

    if (user) {
      const userId = user.username;
      const userDataKey = `userData_${userId}`;
      const userData = JSON.parse(localStorage.getItem(userDataKey) || "{}");

      userData.showFeatures = !showNextTime;
      localStorage.setItem(userDataKey, JSON.stringify(userData));
    }
  };

  if (!currentFeature) {
    return null;
  }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-xl flex items-center gap-2">
            <span className="flex-shrink-0">{currentFeature.icon}</span>
            <span>{currentFeature.title}</span>
          </DialogTitle>
          <DialogDescription className="pt-2">
            {currentFeature.description}
          </DialogDescription>
        </DialogHeader>

        <div className="flex items-center space-x-2 pt-4">
          <input
            type="checkbox"
            id="show-features"
            checked={showNextTime}
            onChange={handleToggleNextTime}
            className="rounded border-gray-300 text-primary focus:ring-primary"
          />
          <label
            htmlFor="show-features"
            className="text-sm text-muted-foreground"
          >
            Show me more features in the future
          </label>
        </div>

        <DialogFooter className="flex sm:flex-row sm:justify-between mt-6">
          <Button variant="outline" onClick={handleClose}>
            Maybe later
          </Button>
          <Button onClick={handleNavigate}>
            Try it now
            <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
