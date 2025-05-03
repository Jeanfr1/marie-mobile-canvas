import { HelpCircle, X } from "lucide-react";
import { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";

interface ContextualHelpProps {
  title: string;
  description: string;
  steps?: string[];
  helpKey: string;
  showDelay?: number;
  forceShow?: boolean;
}

export function ContextualHelp({
  title,
  description,
  steps,
  helpKey,
  showDelay = 1000,
  forceShow = false,
}: ContextualHelpProps) {
  const [isVisible, setIsVisible] = useState(false);
  const [showHelpButton, setShowHelpButton] = useState(false);

  useEffect(() => {
    const hasSeenHelp = localStorage.getItem(`help_seen_${helpKey}`);

    if (forceShow || !hasSeenHelp) {
      // Show the help button immediately
      setShowHelpButton(true);

      // Show the help after a delay
      const timer = setTimeout(() => {
        setIsVisible(true);
      }, showDelay);

      return () => clearTimeout(timer);
    }
  }, [helpKey, showDelay, forceShow]);

  const handleDismiss = () => {
    setIsVisible(false);
    localStorage.setItem(`help_seen_${helpKey}`, "true");
  };

  const handleShowHelp = () => {
    setIsVisible(true);
  };

  if (!showHelpButton && !isVisible) {
    return null;
  }

  return (
    <>
      {!isVisible && showHelpButton && (
        <Button
          variant="ghost"
          size="icon"
          className="rounded-full absolute top-4 right-4 z-50"
          onClick={handleShowHelp}
        >
          <HelpCircle className="h-5 w-5 text-primary" />
        </Button>
      )}

      {isVisible && (
        <Card className="shadow-lg border-primary/20 w-full max-w-md mx-auto mt-4">
          <CardHeader className="pb-2">
            <div className="flex justify-between items-start">
              <div>
                <CardTitle className="text-lg text-primary">{title}</CardTitle>
                <CardDescription>{description}</CardDescription>
              </div>
              <Button variant="ghost" size="icon" onClick={handleDismiss}>
                <X className="h-4 w-4" />
              </Button>
            </div>
          </CardHeader>

          {steps && steps.length > 0 && (
            <CardContent>
              <ol className="space-y-2 list-decimal list-inside text-sm">
                {steps.map((step, index) => (
                  <li key={index} className="text-muted-foreground">
                    {step}
                  </li>
                ))}
              </ol>
            </CardContent>
          )}

          <CardFooter>
            <Button variant="outline" size="sm" onClick={handleDismiss}>
              Got it, thanks!
            </Button>
          </CardFooter>
        </Card>
      )}
    </>
  );
}
