import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { GiftItem } from "@/pages/GiftsReceived";

interface GiftDetailsDialogProps {
  isOpen: boolean;
  onClose: () => void;
  gift: GiftItem;
  type: 'received' | 'given';
}

export const GiftDetailsDialog = ({ isOpen, onClose, gift, type }: GiftDetailsDialogProps) => {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Gift Details</DialogTitle>
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
              {type === 'received' ? `From: ${gift.from}` : `To: ${gift.to}`}
            </p>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <p className="text-muted-foreground">Date:</p>
                <p>{gift.date}</p>
              </div>
              <div>
                <p className="text-muted-foreground">Occasion:</p>
                <p>{gift.occasion}</p>
              </div>
              {type === 'given' && gift.cost && (
                <div>
                  <p className="text-muted-foreground">Cost:</p>
                  <p>{gift.cost}</p>
                </div>
              )}
              {type === 'received' && (
                <div>
                  <p className="text-muted-foreground">Thank You Note:</p>
                  <p>{gift.thanked ? 'Sent' : 'Pending'}</p>
                </div>
              )}
            </div>
          </div>
          <Button onClick={onClose} className="w-full">Close</Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
