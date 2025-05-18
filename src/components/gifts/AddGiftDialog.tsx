import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Plus, Upload, Image } from "lucide-react";
import { toast } from "@/components/ui/sonner";
import { GiftItem } from "@/pages/GiftsReceived";
import { Storage } from "aws-amplify";

interface AddGiftDialogProps {
  type: "received" | "given";
  onGiftAdded?: (gift: GiftItem) => void;
  suggestedRecipient?: string | null;
}

export const AddGiftDialog = ({
  type,
  onGiftAdded,
  suggestedRecipient,
}: AddGiftDialogProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [giftName, setGiftName] = useState("");
  const [giftFrom, setGiftFrom] = useState("");
  const [giftTo, setGiftTo] = useState("");
  const [giftDate, setGiftDate] = useState("");
  const [giftOccasion, setGiftOccasion] = useState("");
  const [giftCost, setGiftCost] = useState("");
  const [giftImage, setGiftImage] = useState<string | null>(null);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [hasImageError, setHasImageError] = useState(false);

  // Set the suggested recipient if provided
  useEffect(() => {
    if (suggestedRecipient && type === "given") {
      setGiftTo(suggestedRecipient);

      // If suggested recipient is provided, automatically open the dialog
      if (suggestedRecipient && !isOpen) {
        setIsOpen(true);
        setGiftOccasion("Anniversaire"); // Set occasion to birthday
      }
    }
  }, [suggestedRecipient, type, isOpen]);

  const resetForm = () => {
    setGiftName("");
    setGiftFrom("");
    setGiftTo("");
    setGiftDate("");
    setGiftOccasion("");
    setGiftCost("");
    setGiftImage(null);
    setHasImageError(false);
  };

  const handleDialogChange = (open: boolean) => {
    if (!open) {
      resetForm();
    }
    setIsOpen(open);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Submit started");

    // Basic validation
    if (!giftName.trim()) {
      toast.error("Veuillez saisir le nom du cadeau");
      return;
    }

    if (type === "received" && !giftFrom.trim()) {
      toast.error("Veuillez saisir qui vous a offert ce cadeau");
      return;
    }

    if (type === "given" && !giftTo.trim()) {
      toast.error("Veuillez saisir à qui vous avez offert ce cadeau");
      return;
    }

    if (!giftDate) {
      toast.error("Veuillez saisir la date");
      return;
    }

    setIsSubmitting(true);
    console.log("Validation passed, submitting...");

    try {
      // Create gift object based on type
      const giftData: any = {
        name: giftName,
        date: giftDate,
        occasion: giftOccasion,
        // Only include the image if there was no error with it
        image: hasImageError ? null : giftImage,
      };

      console.log("Gift data prepared:", giftData);

      if (type === "received") {
        giftData.from = giftFrom;
        giftData.thanked = false;
      } else {
        giftData.to = giftTo;
        giftData.cost = giftCost ? parseFloat(giftCost) : 0;
      }

      // Call the callback function to add the gift
      if (onGiftAdded) {
        console.log("Calling onGiftAdded callback");
        onGiftAdded(giftData);
        console.log("Gift added successfully, resetting form");
        resetForm();
        setIsOpen(false);
      }
    } catch (error) {
      console.error("Error adding gift:", error);
      toast.error("Une erreur s'est produite lors de l'ajout du cadeau");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    console.log(
      "File selected for upload:",
      file.name,
      "size:",
      file.size,
      "type:",
      file.type
    );

    // Reset image error state
    setHasImageError(false);

    // Check file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      toast.error("L'image est trop grande. Maximum 5 Mo.");
      return;
    }

    try {
      setUploadingImage(true);
      console.log("Starting upload process...");

      // First, create a data URL as a fallback method
      const reader = new FileReader();
      let dataUrl = "";

      // Create a promise for the FileReader
      const readFileAsDataUrl = new Promise<string>((resolve, reject) => {
        reader.onload = () => {
          dataUrl = reader.result as string;
          resolve(dataUrl);
        };
        reader.onerror = () => {
          reject(new Error("Failed to read file as data URL"));
        };
      });

      reader.readAsDataURL(file);

      try {
        // Wait for the data URL to be created
        dataUrl = await readFileAsDataUrl;
        console.log("Data URL created as backup");

        try {
          // Try S3 upload
          const fileName = `${Date.now()}-${file.name}`;
          console.log("Attempting S3 upload with filename:", fileName);

          // Upload file to S3 using Amplify Storage
          const result = await Storage.put(fileName, file, {
            contentType: file.type,
            progressCallback: (progress) => {
              console.log(
                `Upload progress: ${progress.loaded}/${progress.total}`
              );
            },
          });
          console.log("S3 upload successful:", result);

          // Get the public URL of the uploaded image
          const imageUrl = await Storage.get(fileName);
          console.log("Public URL obtained:", imageUrl);

          // Update the state with the S3 URL
          setGiftImage(imageUrl.toString());
          console.log("Image URL set in state (S3)");
          toast.success("Image téléchargée avec succès!");
        } catch (s3Error) {
          console.error("S3 upload error:", s3Error);

          // Fallback to data URL if S3 upload fails
          console.log("Falling back to data URL");
          setGiftImage(dataUrl);
          console.log("Image URL set in state (data URL)");
          toast.warning(
            "Service de stockage indisponible - utilisation du stockage local"
          );
        }
      } catch (dataUrlError) {
        console.error("Error creating data URL:", dataUrlError);
        setHasImageError(true);
        toast.error("Impossible de lire l'image");
      }
    } catch (error) {
      console.error("General error during upload:", error);
      setHasImageError(true);
      toast.error("Erreur lors du téléchargement de l'image");
    } finally {
      setUploadingImage(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleDialogChange}>
      <DialogTrigger asChild>
        <Button id="add-gift-button" className="flex items-center gap-2">
          <Plus size={16} />
          {type === "received"
            ? "Ajouter un cadeau reçu"
            : "Ajouter un cadeau offert"}
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {type === "received"
              ? "Ajouter un cadeau reçu"
              : "Ajouter un cadeau offert"}
          </DialogTitle>
          <DialogDescription>
            {type === "received"
              ? "Enregistrez les détails d'un cadeau que vous avez reçu"
              : "Enregistrez les détails d'un cadeau que vous avez offert à quelqu'un"}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="gift-name">Nom du cadeau</Label>
            <Input
              id="gift-name"
              placeholder="Ex: Montre, Livre, etc."
              value={giftName}
              onChange={(e) => setGiftName(e.target.value)}
            />
          </div>

          {type === "received" ? (
            <div className="space-y-2">
              <Label htmlFor="gift-from">De la part de</Label>
              <Input
                id="gift-from"
                placeholder="Qui vous a offert ce cadeau?"
                value={giftFrom}
                onChange={(e) => setGiftFrom(e.target.value)}
              />
            </div>
          ) : (
            <div className="space-y-2">
              <Label htmlFor="gift-to">Destinataire</Label>
              <Input
                id="gift-to"
                placeholder="À qui avez-vous offert ce cadeau?"
                value={giftTo}
                onChange={(e) => setGiftTo(e.target.value)}
              />
            </div>
          )}

          <div className="space-y-2">
            <Label htmlFor="gift-date">Date</Label>
            <Input
              id="gift-date"
              type="date"
              value={giftDate}
              onChange={(e) => setGiftDate(e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="gift-occasion">Occasion</Label>
            <Input
              id="gift-occasion"
              placeholder="Ex: Anniversaire, Noël, etc."
              value={giftOccasion}
              onChange={(e) => setGiftOccasion(e.target.value)}
            />
          </div>

          {type === "given" && (
            <div className="space-y-2">
              <Label htmlFor="gift-cost">Coût (€)</Label>
              <Input
                id="gift-cost"
                type="number"
                placeholder="Optionnel"
                value={giftCost}
                onChange={(e) => setGiftCost(e.target.value)}
              />
            </div>
          )}

          <div className="space-y-2">
            <Label htmlFor="gift-image">Image (optionnel)</Label>
            <div className="flex items-center gap-3">
              <Label
                htmlFor="gift-image-upload"
                className="flex h-10 items-center justify-center rounded-md border border-input bg-transparent px-3 py-2 text-sm ring-offset-background hover:bg-accent hover:text-accent-foreground cursor-pointer"
              >
                {uploadingImage ? (
                  <span>Téléchargement...</span>
                ) : (
                  <>
                    <Upload className="h-4 w-4 mr-2" />
                    <span>Télécharger</span>
                  </>
                )}
                <input
                  id="gift-image-upload"
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={handleImageUpload}
                  disabled={uploadingImage || isSubmitting}
                />
              </Label>
              {giftImage && !hasImageError && (
                <div className="relative w-12 h-12 bg-muted rounded-md overflow-hidden">
                  <img
                    src={giftImage}
                    alt="Gift preview"
                    className="w-full h-full object-cover"
                  />
                </div>
              )}
              {hasImageError && (
                <span className="text-xs text-destructive">
                  Problème avec l'image, veuillez réessayer ou continuer sans
                  image
                </span>
              )}
            </div>
          </div>

          <DialogFooter>
            <Button type="submit" disabled={isSubmitting || uploadingImage}>
              {isSubmitting ? "Ajout en cours..." : "Ajouter le cadeau"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};
