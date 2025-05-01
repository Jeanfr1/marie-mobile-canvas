
import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { CalendarIcon, Image as ImageIcon } from "lucide-react";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { Calendar } from "@/components/ui/calendar";

interface EditGiftDialogProps {
  isOpen: boolean;
  onClose: () => void;
  gift: {
    id: number;
    name: string;
    to: string;
    date: string;
    occasion: string;
    cost: string;
    image: string | null;
  };
}

export const EditGiftDialog = ({ isOpen, onClose, gift }: EditGiftDialogProps) => {
  const [giftData, setGiftData] = useState({
    name: gift.name,
    to: gift.to,
    date: gift.date,
    occasion: gift.occasion,
    cost: gift.cost.replace("$", ""),
    image: gift.image
  });
  
  const [date, setDate] = useState<Date | undefined>(
    gift.date ? new Date(gift.date) : undefined
  );
  
  const { toast } = useToast();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setGiftData(prev => ({ ...prev, [name]: value }));
  };

  const handleSave = () => {
    // Here you would typically save to your backend
    // For now, we'll just show a success toast
    toast({
      title: "Gift Updated",
      description: `Successfully updated ${giftData.name}`,
    });
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Edit Gift</DialogTitle>
        </DialogHeader>
        
        <div className="grid gap-4 py-4">
          <div className="grid gap-2">
            <Label htmlFor="name">Gift Name</Label>
            <Input
              id="name"
              name="name"
              value={giftData.name}
              onChange={handleChange}
            />
          </div>
          
          <div className="grid gap-2">
            <Label htmlFor="recipient">Recipient</Label>
            <Input
              id="recipient"
              name="to"
              value={giftData.to}
              onChange={handleChange}
            />
          </div>
          
          <div className="grid gap-2">
            <Label htmlFor="date">Date Given</Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className={cn(
                    "w-full justify-start text-left font-normal",
                    !date && "text-muted-foreground"
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {date ? format(date, "PPP") : "Pick a date"}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0">
                <Calendar
                  mode="single"
                  selected={date}
                  onSelect={(newDate) => {
                    setDate(newDate);
                    if (newDate) {
                      setGiftData(prev => ({ 
                        ...prev, 
                        date: format(newDate, "yyyy-MM-dd") 
                      }));
                    }
                  }}
                  initialFocus
                />
              </PopoverContent>
            </Popover>
          </div>
          
          <div className="grid gap-2">
            <Label htmlFor="occasion">Occasion</Label>
            <Input
              id="occasion"
              name="occasion"
              value={giftData.occasion}
              onChange={handleChange}
            />
          </div>
          
          <div className="grid gap-2">
            <Label htmlFor="cost">Cost ($)</Label>
            <Input
              id="cost"
              name="cost"
              value={giftData.cost}
              onChange={handleChange}
              type="text"
              inputMode="decimal"
            />
          </div>
          
          <div className="grid gap-2">
            <Label htmlFor="image">Image URL (optional)</Label>
            <Input
              id="image"
              name="image"
              value={giftData.image || ""}
              onChange={handleChange}
              placeholder="https://example.com/image.jpg"
            />
          </div>
        </div>
        
        <div className="flex justify-end space-x-2">
          <Button variant="outline" onClick={onClose}>Cancel</Button>
          <Button onClick={handleSave}>Save Changes</Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
