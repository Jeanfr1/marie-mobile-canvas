
import { useState } from "react";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Plus, Upload, Image } from "lucide-react";
import { toast } from "@/components/ui/sonner";
import { GiftItem } from "@/pages/GiftsReceived"; 

interface AddGiftDialogProps {
  type: 'received' | 'given';
  onGiftAdded?: (gift: GiftItem) => void;
}

export const AddGiftDialog = ({ type, onGiftAdded }: AddGiftDialogProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [giftName, setGiftName] = useState("");
  const [person, setPerson] = useState("");
  const [occasion, setOccasion] = useState("");
  const [date, setDate] = useState("");
  const [cost, setCost] = useState<string>("");
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  const resetForm = () => {
    setGiftName("");
    setPerson("");
    setOccasion("");
    setDate("");
    setCost("");
    setImageFile(null);
    setImagePreview(null);
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Check file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      toast.error("L'image est trop volumineuse", { description: "Veuillez sélectionner une image de moins de 5 Mo" });
      return;
    }

    setImageFile(file);

    // Create preview URL
    const reader = new FileReader();
    reader.onload = (event) => {
      setImagePreview(event.target?.result as string);
    };
    reader.readAsDataURL(file);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Basic validation
    if (!giftName.trim() || !person.trim() || !date || !occasion.trim()) {
      toast.error("Veuillez remplir tous les champs obligatoires");
      return;
    }
    
    const newGift: GiftItem = {
      id: Date.now(), // Use timestamp as a simple unique ID
      name: giftName,
      from: type === 'received' ? person : 'Moi',
      date: date,
      occasion: occasion,
      thanked: false,
      image: imagePreview, // Use the image preview data URL
    };

    // For given gifts, add the recipient as 'to' and include cost if provided
    if (type === 'given') {
      (newGift as any).to = person;
      newGift.cost = cost ? parseFloat(cost) : undefined;
    }
    
    // Pass the new gift to parent component
    if (onGiftAdded) {
      onGiftAdded(newGift);
    }
    
    toast.success(`Cadeau ${type === 'received' ? 'reçu' : 'offert'} ajouté avec succès !`);
    resetForm();
    setIsOpen(false);
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button className="flex items-center gap-2">
          <Plus size={16} />
          Ajouter un nouveau cadeau
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Ajouter un nouveau cadeau {type === 'received' ? 'reçu' : 'offert'}</DialogTitle>
          <DialogDescription>
            Entrez les détails du cadeau que vous avez {type === 'received' ? 'reçu' : 'offert'}.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="gift-name">Nom du cadeau</Label>
            <Input 
              id="gift-name" 
              placeholder="Entrez le nom du cadeau"
              value={giftName}
              onChange={(e) => setGiftName(e.target.value)}
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="person">{type === 'received' ? 'De' : 'À'}</Label>
            <Input 
              id="person" 
              placeholder={`Entrez le nom ${type === 'received' ? 'du donateur' : 'du destinataire'}`}
              value={person}
              onChange={(e) => setPerson(e.target.value)}
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="occasion">Occasion</Label>
            <Input 
              id="occasion" 
              placeholder="Entrez l'occasion"
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
              <Label htmlFor="cost">Coût</Label>
              <Input 
                id="cost" 
                type="number" 
                placeholder="Entrez le coût"
                value={cost}
                onChange={(e) => setCost(e.target.value)}
              />
            </div>
          )}
          <div className="space-y-2">
            <Label htmlFor="image">Image du cadeau</Label>
            <div className="flex flex-col space-y-2">
              {imagePreview ? (
                <div className="relative w-full h-40 rounded overflow-hidden">
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
                      setImageFile(null);
                      setImagePreview(null);
                    }}
                  >
                    Supprimer
                  </Button>
                </div>
              ) : (
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 flex flex-col items-center justify-center space-y-2">
                  <Image className="h-8 w-8 text-muted-foreground" />
                  <div className="text-center">
                    <p className="text-sm text-muted-foreground">Téléchargez une image de votre cadeau</p>
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
          <DialogFooter>
            <Button type="submit">Enregistrer le cadeau</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};
