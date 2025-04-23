
import { useState } from "react";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Plus } from "lucide-react";

interface AddGiftDialogProps {
  type: 'received' | 'given';
}

export const AddGiftDialog = ({ type }: AddGiftDialogProps) => {
  const [isOpen, setIsOpen] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Here we would normally handle the form submission
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
            <Input id="gift-name" placeholder="Enter gift name" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="person">{type === 'received' ? 'From' : 'To'}</Label>
            <Input id="person" placeholder={`Enter ${type === 'received' ? 'giver' : 'recipient'} name`} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="occasion">Occasion</Label>
            <Input id="occasion" placeholder="Enter occasion" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="date">Date</Label>
            <Input id="date" type="date" />
          </div>
          {type === 'given' && (
            <div className="space-y-2">
              <Label htmlFor="cost">Cost</Label>
              <Input id="cost" type="number" placeholder="Enter cost" />
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
