import { useState } from "react";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Filter } from "lucide-react";

export const GiftFilters = () => {
  const [isOpen, setIsOpen] = useState(false);

  const handleApplyFilters = (e: React.FormEvent) => {
    e.preventDefault();
    setIsOpen(false);
  };

  return (
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
      <SheetTrigger asChild>
        <Button variant="outline" className="flex items-center gap-2">
          <Filter size={16} />
          Filter
        </Button>
      </SheetTrigger>
      <SheetContent>
        <SheetHeader>
          <SheetTitle>Filter Gifts</SheetTitle>
        </SheetHeader>
        <div className="overflow-y-auto">
          <form onSubmit={handleApplyFilters} className="space-y-4 mt-4">
            <div className="space-y-2">
              <Label htmlFor="date-from">Date From</Label>
              <Input type="date" id="date-from" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="date-to">Date To</Label>
              <Input type="date" id="date-to" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="occasion">Occasion</Label>
              <Input id="occasion" placeholder="Filter by occasion" />
            </div>
            <Button type="submit" className="w-full">
              Apply Filters
            </Button>
          </form>
        </div>
      </SheetContent>
    </Sheet>
  );
};
