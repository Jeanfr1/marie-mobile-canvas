import { Button } from "@/components/ui/button";
import { LucideIcon } from "lucide-react";

interface EmptyStateProps {
  title: string;
  description: string;
  icon: LucideIcon;
  actionLabel?: string;
  onAction?: () => void;
}

export function EmptyState({
  title,
  description,
  icon: Icon,
  actionLabel,
  onAction,
}: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center p-8 text-center border rounded-lg bg-card min-h-[300px]">
      <div className="p-3 mb-4 rounded-full bg-primary/10">
        <Icon className="w-10 h-10 text-primary" />
      </div>
      <h3 className="mb-2 text-xl font-semibold">{title}</h3>
      <p className="max-w-sm mb-6 text-muted-foreground">{description}</p>
      {actionLabel && onAction && (
        <Button onClick={onAction}>{actionLabel}</Button>
      )}
    </div>
  );
}
