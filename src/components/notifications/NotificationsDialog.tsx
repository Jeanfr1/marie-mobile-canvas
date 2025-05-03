import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Bell, Mail, MessageSquare } from "lucide-react";
import { toast } from "@/components/ui/sonner";

interface NotificationsDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const NotificationsDialog = ({ open, onOpenChange }: NotificationsDialogProps) => {
  const [email, setEmail] = useState("");
  const [emailEnabled, setEmailEnabled] = useState(true);
  const [pushEnabled, setPushEnabled] = useState(false);
  const [smsEnabled, setSmsEnabled] = useState(false);
  const [phone, setPhone] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [remindDays, setRemindDays] = useState("7");

  const handleSubmit = () => {
    // Validate form
    if (emailEnabled && !email.trim()) {
      toast.error("Veuillez entrer une adresse e-mail");
      return;
    }

    if (smsEnabled && !phone.trim()) {
      toast.error("Veuillez entrer un numéro de téléphone");
      return;
    }

    setIsSubmitting(true);

    // Simulate saving notification preferences
    setTimeout(() => {
      setIsSubmitting(false);
      toast.success("Préférences de notification enregistrées", {
        description: "Vous recevrez désormais des rappels pour les événements à venir et les remerciements en attente"
      });
      onOpenChange(false);
    }, 1000);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Bell className="h-5 w-5 text-primary" />
            Configurer les notifications
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6 py-3">
          <div className="space-y-4">
            <h4 className="font-medium">Méthodes de notification</h4>

            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Mail className="h-4 w-4 text-primary" />
                <Label htmlFor="email-notifications" className="cursor-pointer">Notifications par e-mail</Label>
              </div>
              <Switch
                id="email-notifications"
                checked={emailEnabled}
                onCheckedChange={setEmailEnabled}
              />
            </div>

            {emailEnabled && (
              <div className="pl-6">
                <Input
                  type="email"
                  placeholder="Votre adresse e-mail"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
            )}

            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Bell className="h-4 w-4 text-primary" />
                <Label htmlFor="push-notifications" className="cursor-pointer">Notifications push</Label>
              </div>
              <Switch
                id="push-notifications"
                checked={pushEnabled}
                onCheckedChange={setPushEnabled}
              />
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <MessageSquare className="h-4 w-4 text-primary" />
                <Label htmlFor="sms-notifications" className="cursor-pointer">Notifications SMS</Label>
              </div>
              <Switch
                id="sms-notifications"
                checked={smsEnabled}
                onCheckedChange={setSmsEnabled}
              />
            </div>

            {smsEnabled && (
              <div className="pl-6">
                <Input
                  type="tel"
                  placeholder="Votre numéro de téléphone"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                />
              </div>
            )}
          </div>

          <div className="space-y-4">
            <h4 className="font-medium">Paramètres de rappel</h4>

            <div className="grid grid-cols-2 items-center gap-4">
              <Label htmlFor="remind-days">Me rappeler</Label>
              <div className="flex items-center">
                <Input
                  id="remind-days"
                  type="number"
                  min="1"
                  max="30"
                  value={remindDays}
                  onChange={(e) => setRemindDays(e.target.value)}
                  className="w-20 mr-2"
                />
                <span>jours avant</span>
              </div>
            </div>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Annuler
          </Button>
          <Button
            onClick={handleSubmit}
            disabled={isSubmitting || (emailEnabled && !email) || (smsEnabled && !phone)}
          >
            {isSubmitting ? "Enregistrement..." : "Enregistrer les préférences"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
