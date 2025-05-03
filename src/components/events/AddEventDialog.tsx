import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Calendar as CalendarIcon } from "lucide-react";
import { format } from "date-fns";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { toast } from "@/components/ui/sonner";
import { DialogDescription } from "@/components/ui/dialog";

interface AddEventDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onEventAdded?: (eventData: { name: string; date: Date }) => void;
}

export const AddEventDialog = ({
  open,
  onOpenChange,
  onEventAdded,
}: AddEventDialogProps) => {
  const [eventName, setEventName] = useState("");
  const [date, setDate] = useState<Date | undefined>(undefined);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = () => {
    if (!eventName.trim() || !date) {
      toast.error("Veuillez remplir tous les champs");
      return;
    }

    setIsSubmitting(true);

    // Simulate adding the event
    setTimeout(() => {
      setIsSubmitting(false);

      // Notify parent component about the new event
      if (onEventAdded && date) {
        onEventAdded({ name: eventName, date });
      }

      toast.success("Événement ajouté avec succès", {
        description: `${eventName} programmé pour le ${format(date, "PPP")}`,
      });

      // Reset form and close dialog
      setEventName("");
      setDate(undefined);
      onOpenChange(false);
    }, 1000);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <CalendarIcon className="h-5 w-5 text-primary" />
            Ajouter un nouvel événement
          </DialogTitle>
          <DialogDescription>
            Ajoutez un nouvel événement pour suivre les dates importantes et ne
            jamais manquer une célébration.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-3">
          <div className="grid gap-2">
            <Label htmlFor="event-name">Nom de l'événement</Label>
            <Input
              id="event-name"
              placeholder="Entrez le nom de l'événement"
              value={eventName}
              onChange={(e) => setEventName(e.target.value)}
            />
          </div>

          <div className="grid gap-2">
            <Label>Date</Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant={"outline"}
                  className={cn(
                    "w-full justify-start text-left font-normal",
                    !date && "text-muted-foreground"
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {date ? format(date, "PPP") : <span>Choisir une date</span>}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  mode="single"
                  selected={date}
                  onSelect={setDate}
                  initialFocus
                />
              </PopoverContent>
            </Popover>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Annuler
          </Button>
          <Button
            onClick={handleSubmit}
            disabled={isSubmitting || !eventName.trim() || !date}
          >
            {isSubmitting ? "Ajout en cours..." : "Ajouter l'événement"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
