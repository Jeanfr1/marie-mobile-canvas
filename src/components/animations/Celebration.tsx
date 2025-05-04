import { useEffect, useState } from "react";
import confetti from "canvas-confetti";

interface CelebrationProps {
  show: boolean;
  duration?: number;
  onComplete?: () => void;
}

export const Celebration = ({
  show,
  duration = 3000,
  onComplete,
}: CelebrationProps) => {
  const [isActive, setIsActive] = useState(false);

  useEffect(() => {
    if (show && !isActive) {
      setIsActive(true);

      // Create confetti explosion in the center
      const end = Date.now() + duration;

      // Initial burst
      const colors = [
        "#ff0000",
        "#ffa500",
        "#ffff00",
        "#008000",
        "#0000ff",
        "#4b0082",
        "#ee82ee",
      ];

      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 },
        colors: colors,
      });

      // Continuous small bursts during the duration
      const interval = setInterval(() => {
        if (Date.now() > end) {
          clearInterval(interval);
          setIsActive(false);
          if (onComplete) onComplete();
          return;
        }

        confetti({
          particleCount: 50,
          angle: Math.random() * 60 + 60,
          spread: 50,
          origin: { x: Math.random() },
          colors: colors,
        });

        confetti({
          particleCount: 50,
          angle: Math.random() * 60 + 240,
          spread: 50,
          origin: { x: Math.random() },
          colors: colors,
        });
      }, 250);

      return () => {
        clearInterval(interval);
      };
    }
  }, [show, duration, onComplete, isActive]);

  return null; // This component doesn't render any visible elements itself
};
