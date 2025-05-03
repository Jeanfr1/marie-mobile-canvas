import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "@/components/ui/sonner";
import { CalendarIcon, Image as ImageIcon, Upload } from "lucide-react";
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
    cost?: number | string;
    image?: string | null;
  };
}

export const EditGiftDialog = ({ isOpen, onClose, gift }: EditGiftDialogProps) => {
  const [giftData, setGiftData] = useState({
    name: gift.name || "",
    to: gift.to || "",
    date: gift.date || "",
    occasion: gift.occasion || "",
    cost: typeof gift.cost === "number"
      ? gift.cost.toString()
      : (gift.cost || "").toString().replace(/[^\d.,]/g, ""),
    image: gift.image || null
  });

  // Update form data when gift prop changes
  useEffect(() => {
    if (isOpen) {
      setGiftData({
        name: gift.name || "",
        to: gift.to || "",
        date: gift.date || "",
        occasion: gift.occasion || "",
        cost: typeof gift.cost === "number"
          ? gift.cost.toString()
          : (gift.cost || "").toString().replace(/[^\d.,]/g, ""),
        image: gift.image || null
      });

      setDate(gift.date ? new Date(gift.date) : undefined);
      setImagePreview(gift.image || null);
    }
  }, [gift, isOpen]);

  const [date, setDate] = useState<Date | undefined>(
    gift.date ? new Date(gift.date) : undefined
  );

  const [imagePreview, setImagePreview] = useState<string | null>(gift.image || null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setGiftData(prev => ({ ...prev, [name]: value }));
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Check file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      toast({
        title: "L'image est trop grande",
        description: "Veuillez sélectionner une image de moins de 5 Mo"
      });
      return;
    }

    // Create preview URL
    const reader = new FileReader();
    reader.onload = (event) => {
      const result = event.target?.result as string;
      setImagePreview(result);
      setGiftData(prev => ({ ...prev, image: result }));
    };
    reader.readAsDataURL(file);
  };

  const handleSave = () => {
    // Here you would typically save to your backend
    // For now, we'll just show a success toast
    toast({
      title: "Cadeau mis à jour",
      description: `${giftData.name} a été mis à jour avec succès`
    });
    onClose();
  };

  return (
    <Dialog
      open={isOpen}
      onOpenChange={(open) => {
        if (!open) onClose();
      }}
    >
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Modifier le cadeau</DialogTitle>
        </DialogHeader>

        <div className="grid gap-4 py-4">
          <div className="grid gap-2">
            <Label htmlFor="name">Nom du cadeau</Label>
            <Input
              id="name"
              name="name"
              value={giftData.name}
              onChange={handleChange}
            />
          </div>

          <div className="grid gap-2">
            <Label htmlFor="recipient">Destinataire</Label>
            <Input
              id="recipient"
              name="to"
              value={giftData.to}
              onChange={handleChange}
            />
          </div>

          <div className="grid gap-2">
            <Label htmlFor="date">Date d'offre</Label>
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
                  {date ? format(date, "PPP") : "Choisir une date"}
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
            <Label htmlFor="cost">Coût (€)</Label>
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
            <Label htmlFor="image">Image du cadeau</Label>
            <div className="flex flex-col space-y-2">
              {imagePreview ? (
                <div className="relative w-full h-40 rounded overflow-hidden border border-input">
                  <img
                    src={imagePreview}
                    alt="Aperçu du cadeau"
                    className="w-full h-full object-cover"
                  />
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    className="absolute top-2 right-2"
                    onClick={() => {
                      setImagePreview(null);
                      setGiftData(prev => ({ ...prev, image: null }));
                    }}
                  >
                    Supprimer
                  </Button>
                </div>
              ) : (
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 flex flex-col items-center justify-center space-y-2">
                  <ImageIcon className="h-8 w-8 text-muted-foreground" />
                  <div className="text-center">
                    <p className="text-sm text-muted-foreground">Télécharger une image de votre cadeau</p>
                    <p className="text-xs text-muted-foreground">PNG, JPG jusqu'à 5 Mo</p>
                  </div>
                  <label htmlFor="image-upload" className="cursor-pointer">
                    <div className="flex items-center space-x-2 bg-primary text-primary-foreground hover:bg-primary/90 h-9 rounded-md px-3 text-sm transition-colors">
                      <Upload size={14} />
                      <span>Choisir un fichier</span>
                    </div>
                    <Input
                      id="image-upload"
                      type="file"
                      accept="image/*"
                      className="sr-only"
                      onChange={handleImageChange}
                    />
                  </label>
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="flex justify-end space-x-2">
          <Button variant="outline" onClick={onClose}>Annuler</Button>
          <Button onClick={handleSave}>Enregistrer</Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
