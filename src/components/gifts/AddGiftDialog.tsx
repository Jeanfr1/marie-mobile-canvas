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
import { uploadData, getUrl } from "aws-amplify/storage";

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
      const giftData: Record<string, unknown> = {
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
    setGiftImage(null); // Reset previous image attempts

    // Define a maximum size for data URLs (e.g., 1MB)
    const MAX_DATA_URL_SIZE = 1 * 1024 * 1024;

    // Check file size (max 5MB for initial selection)
    if (file.size > 5 * 1024 * 1024) {
      toast.error("L'image est trop grande. Maximum 5 Mo.");
      setHasImageError(true); // Mark as error so it's not included in giftData
      return;
    }

    setUploadingImage(true);
    console.log("Starting image processing...");

    // Prepare data URL generation (as a promise for fallback)
    const reader = new FileReader();
    let dataUrlForFallback = "";
    const readFileAsDataUrlPromise = new Promise<string>((resolve, reject) => {
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = (error) => reject(error);
    });
    reader.readAsDataURL(file); // Start reading the file for potential fallback

    try {
      // Attempt S3 Upload First
      const fileName = `${Date.now()}-${file.name}`;
      console.log("Attempting S3 upload with filename:", fileName);

      await uploadData({
        key: fileName,
        data: file,
        options: {
          contentType: file.type,
          progressCallback: (progress) => {
            console.log(
              `S3 Upload progress: ${progress.loaded}/${progress.total}`
            );
          },
        },
      });
      console.log("S3 upload successful for:", fileName);

      const s3ImageUrl = await getUrl({ key: fileName });
      console.log("S3 Public URL obtained:", s3ImageUrl);
      setGiftImage(s3ImageUrl.toString());
      toast.success("Image téléchargée avec succès vers le cloud!");
      // S3 success, giftImage is set with S3 URL
    } catch (s3Error) {
      console.error("S3 upload error:", s3Error);
      toast.error(
        "Échec du téléversement cloud. Tentative de sauvegarde locale."
      );

      // S3 failed, now try to use the data URL (if it was generated successfully)
      try {
        dataUrlForFallback = await readFileAsDataUrlPromise;
        console.log(
          "Data URL generated for fallback, length:",
          dataUrlForFallback.length
        );

        if (dataUrlForFallback.length > MAX_DATA_URL_SIZE) {
          setGiftImage(null);
          setHasImageError(true);
          toast.error(
            "Image trop grande pour la sauvegarde locale. Veuillez utiliser une image plus petite."
          );
          console.warn("S3 failed and data URL fallback is too large.");
        } else {
          setGiftImage(dataUrlForFallback);
          toast.warning(
            "Image sauvegardée localement (qualité potentiellement réduite)."
          );
          console.log("S3 failed, using data URL fallback for image preview.");
        }
      } catch (dataUrlGenerationError) {
        console.error(
          "Error generating data URL for fallback:",
          dataUrlGenerationError
        );
        setGiftImage(null);
        setHasImageError(true);
        toast.error(
          "Échec du traitement local de l'image après l'erreur de téléversement cloud."
        );
      }
    } finally {
      setUploadingImage(false);
      console.log("Image processing finished.");
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
