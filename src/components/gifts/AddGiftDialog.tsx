
import { useState } from "react";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Plus } from "lucide-react";
import { toast } from "@/components/ui/sonner";

interface Gift {
  id: number;
  name: string;
  from: string;
  date: string;
  occasion: string;
  thanked: boolean;
  image?: string | null;
  cost?: number;
}

interface AddGiftDialogProps {
  type: 'received' | 'given';
  onGiftAdded?: (gift: Gift) => void;
}

export const AddGiftDialog = ({ type, onGiftAdded }: AddGiftDialogProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [giftName, setGiftName] = useState("");
  const [person, setPerson] = useState("");
  const [occasion, setOccasion] = useState("");
  const [date, setDate] = useState("");
  const [cost, setCost] = useState<string>("");

  const resetForm = () => {
    setGiftName("");
    setPerson("");
    setOccasion("");
    setDate("");
    setCost("");
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Basic validation
    if (!giftName.trim() || !person.trim() || !date || !occasion.trim()) {
      toast.error("Please fill in all required fields");
      return;
    }
    
    const newGift: Gift = {
      id: Date.now(), // Use timestamp as a simple unique ID
      name: giftName,
      from: type === 'received' ? person : 'Me',
      date: date,
      occasion: occasion,
      thanked: false,
      image: null, // No image by default
    };

    if (type === 'given') {
      newGift.cost = cost ? Number(cost) : undefined;
    }
    
    // Pass the new gift to parent component
    if (onGiftAdded) {
      onGiftAdded(newGift);
    }
    
    toast.success(`Gift ${type === 'received' ? 'received' : 'given'} added successfully!`);
    resetForm();
    setIsOpen(false);
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button className="flex items-center gap-2">
          <Plus size={16} />
          Add New Gift
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Add New Gift {type === 'received' ? 'Received' : 'Given'}</DialogTitle>
          <DialogDescription>
            Enter the details of the gift you've {type === 'received' ? 'received' : 'given'}.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="gift-name">Gift Name</Label>
            <Input 
              id="gift-name" 
              placeholder="Enter gift name"
              value={giftName}
              onChange={(e) => setGiftName(e.target.value)}
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="person">{type === 'received' ? 'From' : 'To'}</Label>
            <Input 
              id="person" 
              placeholder={`Enter ${type === 'received' ? 'giver' : 'recipient'} name`}
              value={person}
              onChange={(e) => setPerson(e.target.value)}
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="occasion">Occasion</Label>
            <Input 
              id="occasion" 
              placeholder="Enter occasion"
              value={occasion}
              onChange={(e) => setOccasion(e.target.value)}
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="date">Date</Label>
            <Input 
              id="date" 
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              required
            />
          </div>
          {type === 'given' && (
            <div className="space-y-2">
              <Label htmlFor="cost">Cost</Label>
              <Input 
                id="cost" 
                type="number" 
                placeholder="Enter cost"
                value={cost}
                onChange={(e) => setCost(e.target.value)}
              />
            </div>
          )}
          <DialogFooter>
            <Button type="submit">Save Gift</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};
