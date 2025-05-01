
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
      toast.error("Please enter an email address");
      return;
    }
    
    if (smsEnabled && !phone.trim()) {
      toast.error("Please enter a phone number");
      return;
    }
    
    setIsSubmitting(true);
    
    // Simulate saving notification preferences
    setTimeout(() => {
      setIsSubmitting(false);
      toast.success("Notification preferences saved", {
        description: "You'll now receive reminders for upcoming events and pending thank you notes"
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
            Set Up Notifications
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-6 py-3">
          <div className="space-y-4">
            <h4 className="font-medium">Notification Methods</h4>
            
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Mail className="h-4 w-4 text-primary" />
                <Label htmlFor="email-notifications" className="cursor-pointer">Email Notifications</Label>
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
                  placeholder="Your email address" 
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
            )}
            
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Bell className="h-4 w-4 text-primary" />
                <Label htmlFor="push-notifications" className="cursor-pointer">Push Notifications</Label>
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
                <Label htmlFor="sms-notifications" className="cursor-pointer">SMS Notifications</Label>
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
                  placeholder="Your phone number" 
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                />
              </div>
            )}
          </div>
          
          <div className="space-y-4">
            <h4 className="font-medium">Reminder Settings</h4>
            
            <div className="grid grid-cols-2 items-center gap-4">
              <Label htmlFor="remind-days">Remind me</Label>
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
                <span>days before</span>
              </div>
            </div>
          </div>
        </div>
        
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button 
            onClick={handleSubmit} 
            disabled={isSubmitting || (emailEnabled && !email) || (smsEnabled && !phone)}
          >
            {isSubmitting ? "Saving..." : "Save Preferences"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
