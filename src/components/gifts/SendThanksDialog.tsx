import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "@/components/ui/sonner";
import { Send, Heart } from "lucide-react";

interface SendThanksDialogProps {
  isOpen: boolean;
  onClose: () => void;
  gift: {
    id: number;
    name: string;
    from: string;
  };
  onSendThanks: (giftId: number) => void;
}

export const SendThanksDialog = ({
  isOpen,
  onClose,
  gift,
  onSendThanks,
}: SendThanksDialogProps) => {
  const [message, setMessage] = useState("");
  const [subject, setSubject] = useState(
    `Merci pour le cadeau "${gift?.name}"`
  );
  const [isSending, setIsSending] = useState(false);

  const handleSend = () => {
    setIsSending(true);

    // Simulate sending the thank you message
    setTimeout(() => {
      setIsSending(false);
      onSendThanks(gift.id);
      toast.success("Note de remerciement envoyée avec succès !", {
        description: `Votre message à ${gift.from} a été envoyé.`,
      });
      onClose();
    }, 1000);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Heart className="h-5 w-5 text-rose-500" />
            Envoyer une note de remerciement
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4 py-3">
          <div className="space-y-2">
            <Label htmlFor="recipient">À</Label>
            <Input id="recipient" value={gift?.from || ""} disabled />
          </div>

          <div className="space-y-2">
            <Label htmlFor="subject">Sujet</Label>
            <Input
              id="subject"
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="message">Message</Label>
            <Textarea
              id="message"
              placeholder="Écrivez votre message de remerciement ici..."
              className="min-h-[120px]"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
            />
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Annuler
          </Button>
          <Button
            onClick={handleSend}
            disabled={!message.trim() || isSending}
            className="gap-2"
          >
            {isSending ? "Envoi en cours..." : "Envoyer le remerciement"}
            <Send className="h-4 w-4" />
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
