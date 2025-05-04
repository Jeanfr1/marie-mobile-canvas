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

export interface GiftFiltersValues {
  dateFrom: string;
  dateTo: string;
  occasion: string;
}

interface GiftFiltersProps {
  onFilterChange: (filters: GiftFiltersValues) => void;
}

export const GiftFilters = ({ onFilterChange }: GiftFiltersProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [dateFrom, setDateFrom] = useState("");
  const [dateTo, setDateTo] = useState("");
  const [occasion, setOccasion] = useState("");

  const handleApplyFilters = (e: React.FormEvent) => {
    e.preventDefault();

    // Pass filter values to parent component
    onFilterChange({
      dateFrom,
      dateTo,
      occasion,
    });

    setIsOpen(false);
  };

  const handleReset = () => {
    setDateFrom("");
    setDateTo("");
    setOccasion("");

    // Apply the reset filters
    onFilterChange({
      dateFrom: "",
      dateTo: "",
      occasion: "",
    });
  };

  return (
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
      <SheetTrigger asChild>
        <Button variant="outline" className="flex items-center gap-2">
          <Filter size={16} />
          Filtrer
        </Button>
      </SheetTrigger>
      <SheetContent>
        <SheetHeader>
          <SheetTitle>Filtrer les cadeaux</SheetTitle>
        </SheetHeader>
        <div className="overflow-y-auto">
          <form onSubmit={handleApplyFilters} className="space-y-4 mt-4">
            <div className="space-y-2">
              <Label htmlFor="date-from">Date à partir de</Label>
              <Input
                type="date"
                id="date-from"
                value={dateFrom}
                onChange={(e) => setDateFrom(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="date-to">Date jusqu'à</Label>
              <Input
                type="date"
                id="date-to"
                value={dateTo}
                onChange={(e) => setDateTo(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="occasion">Occasion</Label>
              <Input
                id="occasion"
                placeholder="Filtrer par occasion"
                value={occasion}
                onChange={(e) => setOccasion(e.target.value)}
              />
            </div>
            <div className="flex space-x-2 pt-2">
              <Button
                type="button"
                variant="outline"
                className="flex-1"
                onClick={handleReset}
              >
                Réinitialiser
              </Button>
              <Button type="submit" className="flex-1">
                Appliquer
              </Button>
            </div>
          </form>
        </div>
      </SheetContent>
    </Sheet>
  );
};
