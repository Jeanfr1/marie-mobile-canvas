import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { GiftItem } from "@/pages/GiftsReceived";

interface GiftDetailsDialogProps {
  isOpen: boolean;
  onClose: () => void;
  gift: GiftItem;
  type: "received" | "given";
}

export const GiftDetailsDialog = ({
  isOpen,
  onClose,
  gift,
  type,
}: GiftDetailsDialogProps) => {
  return (
    <Dialog
      open={isOpen}
      onOpenChange={(open) => {
        if (!open) onClose();
      }}
    >
      <DialogContent className="sm:max-w-[425px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Détails du cadeau</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div className="space-y-2">
            {gift.image && (
              <div className="relative w-full h-48 rounded-lg overflow-hidden">
                <img
                  src={gift.image}
                  alt={gift.name}
                  className="w-full h-full object-cover"
                />
              </div>
            )}
            <h3 className="font-semibold">{gift.name}</h3>
            <p className="text-sm text-muted-foreground">
              {type === "received"
                ? `De: ${gift.from}`
                : `Pour: ${gift.to || "Inconnu"}`}
            </p>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <p className="text-muted-foreground text-xs sm:text-sm">
                  Date:
                </p>
                <p className="text-sm break-words">{gift.date}</p>
              </div>
              <div>
                <p className="text-muted-foreground text-xs sm:text-sm">
                  Occasion:
                </p>
                <p className="text-sm break-words">{gift.occasion}</p>
              </div>
              {type === "given" && gift.cost !== undefined && (
                <div>
                  <p className="text-muted-foreground text-xs sm:text-sm">
                    Coût:
                  </p>
                  <p className="text-sm">
                    {typeof gift.cost === "number"
                      ? `${gift.cost}€`
                      : gift.cost}
                  </p>
                </div>
              )}
              {type === "received" && (
                <div>
                  <p className="text-muted-foreground text-xs sm:text-sm">
                    Remerciement:
                  </p>
                  <p className="text-sm">
                    {gift.thanked ? "Envoyé" : "En attente"}
                  </p>
                </div>
              )}
            </div>
          </div>
          <Button onClick={onClose} className="w-full">
            Fermer
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
