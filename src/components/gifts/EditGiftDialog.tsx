import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "@/components/ui/sonner";
import { CalendarIcon, Image as ImageIcon, Upload } from "lucide-react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { Calendar } from "@/components/ui/calendar";
import { uploadData, getUrl } from "aws-amplify/storage";

interface EditGiftDialogProps {
  isOpen: boolean;
  onClose: () => void;
  gift: {
    id: number;
    name: string;
    to?: string;
    from?: string;
    date: string;
    occasion: string;
    cost?: number | string;
    image?: string | null;
    thanked?: boolean;
  };
  type: "given" | "received";
  onSave: (gift: Record<string, unknown>) => void;
}

export const EditGiftDialog = ({
  isOpen,
  onClose,
  gift,
  type,
  onSave,
}: EditGiftDialogProps) => {
  const [giftData, setGiftData] = useState({
    name: gift.name || "",
    to: gift.to || "",
    from: gift.from || "",
    date: gift.date || "",
    occasion: gift.occasion || "",
    cost:
      typeof gift.cost === "number"
        ? gift.cost.toString()
        : (gift.cost || "").toString().replace(/[^\d.,]/g, ""),
    image: gift.image || null,
    thanked: gift.thanked || false,
    id: gift.id,
  });

  // Update form data when gift prop changes
  useEffect(() => {
    if (isOpen) {
      setGiftData({
        name: gift.name || "",
        to: gift.to || "",
        from: gift.from || "",
        date: gift.date || "",
        occasion: gift.occasion || "",
        cost:
          typeof gift.cost === "number"
            ? gift.cost.toString()
            : (gift.cost || "").toString().replace(/[^\d.,]/g, ""),
        image: gift.image || null,
        thanked: gift.thanked || false,
        id: gift.id,
      });

      setDate(gift.date ? new Date(gift.date) : undefined);
      setImagePreview(gift.image || null);
    }
  }, [gift, isOpen]);

  const [date, setDate] = useState<Date | undefined>(
    gift.date ? new Date(gift.date) : undefined
  );

  const [imagePreview, setImagePreview] = useState<string | null>(
    gift.image || null
  );

  const [uploadingImage, setUploadingImage] = useState(false);
  const [hasImageError, setHasImageError] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setGiftData((prev) => ({ ...prev, [name]: value }));
  };

  const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    console.log(
      "EditDialog: File selected:",
      file.name,
      "size:",
      file.size,
      "type:",
      file.type
    );

    setHasImageError(false);
    setImagePreview(null); // Reset preview while processing
    setGiftData((prev) => ({ ...prev, image: null })); // Reset image in gift data

    const MAX_DATA_URL_SIZE = 1 * 1024 * 1024; // 1MB

    if (file.size > 5 * 1024 * 1024) {
      // 5MB initial check
      toast.error("L'image est trop grande. Maximum 5 Mo.");
      setHasImageError(true);
      return;
    }

    setUploadingImage(true);
    console.log("EditDialog: Starting image processing...");

    const reader = new FileReader();
    let dataUrlForFallback = "";
    const readFileAsDataUrlPromise = new Promise<string>((resolve, reject) => {
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = (error) => reject(error);
    });
    reader.readAsDataURL(file);

    try {
      // Attempt S3 Upload First
      const fileName = `${Date.now()}-${file.name}`;
      console.log("EditDialog: Attempting S3 upload:", fileName);
      await uploadData({
        key: fileName,
        data: file,
        options: {
          contentType: file.type,
          progressCallback: (progress) => {
            console.log(
              `EditDialog: S3 Upload progress: ${progress.loaded}/${progress.total}`
            );
          },
        },
      });
      console.log("EditDialog: S3 upload successful for:", fileName);

      const s3ImageUrl = await getUrl({ key: fileName });
      console.log("EditDialog: S3 Public URL:", s3ImageUrl);
      setImagePreview(s3ImageUrl.toString());
      setGiftData((prev) => ({ ...prev, image: s3ImageUrl.toString() }));
      toast.success("Image mise à jour et téléversée vers le cloud!");
    } catch (s3Error) {
      console.error("EditDialog: S3 upload error:", s3Error);
      toast.error(
        "Échec du téléversement cloud. Tentative de sauvegarde locale."
      );

      try {
        dataUrlForFallback = await readFileAsDataUrlPromise;
        console.log(
          "EditDialog: Data URL for fallback, length:",
          dataUrlForFallback.length
        );

        if (dataUrlForFallback.length > MAX_DATA_URL_SIZE) {
          setImagePreview(null);
          setGiftData((prev) => ({ ...prev, image: null }));
          setHasImageError(true);
          toast.error(
            "Image trop grande pour la sauvegarde locale. Veuillez utiliser une image plus petite."
          );
          console.warn("EditDialog: S3 failed, data URL fallback too large.");
        } else {
          setImagePreview(dataUrlForFallback);
          setGiftData((prev) => ({ ...prev, image: dataUrlForFallback }));
          toast.warning(
            "Image sauvegardée localement (qualité potentiellement réduite)."
          );
          console.log("EditDialog: S3 failed, using data URL fallback.");
        }
      } catch (dataUrlGenerationError) {
        console.error(
          "EditDialog: Error generating data URL for fallback:",
          dataUrlGenerationError
        );
        setImagePreview(null);
        setGiftData((prev) => ({ ...prev, image: null }));
        setHasImageError(true);
        toast.error(
          "Échec du traitement local de l'image après l'erreur de téléversement cloud."
        );
      }
    } finally {
      setUploadingImage(false);
      console.log("EditDialog: Image processing finished.");
    }
  };

  const handleSave = () => {
    onSave({
      ...giftData,
      cost: giftData.cost
        ? parseFloat(giftData.cost.toString().replace(",", "."))
        : undefined,
      image: imagePreview,
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
      <DialogContent className="sm:max-w-[425px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Modifier le cadeau</DialogTitle>
        </DialogHeader>

        <div className="grid gap-4 py-4">
          <div className="grid gap-2">
            <Label htmlFor="name" className="text-sm">
              Nom du cadeau
            </Label>
            <Input
              id="name"
              name="name"
              value={giftData.name}
              onChange={handleChange}
            />
          </div>

          {type === "given" ? (
            <div className="grid gap-2">
              <Label htmlFor="recipient" className="text-sm">
                Destinataire
              </Label>
              <Input
                id="recipient"
                name="to"
                value={giftData.to}
                onChange={handleChange}
              />
            </div>
          ) : (
            <div className="grid gap-2">
              <Label htmlFor="from" className="text-sm">
                De la part de
              </Label>
              <Input
                id="from"
                name="from"
                value={giftData.from}
                onChange={handleChange}
              />
            </div>
          )}

          <div className="grid gap-2">
            <Label htmlFor="date" className="text-sm">
              Date
            </Label>
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
                      setGiftData((prev) => ({
                        ...prev,
                        date: format(newDate, "yyyy-MM-dd"),
                      }));
                    }
                  }}
                  initialFocus
                />
              </PopoverContent>
            </Popover>
          </div>

          <div className="grid gap-2">
            <Label htmlFor="occasion" className="text-sm">
              Occasion
            </Label>
            <Input
              id="occasion"
              name="occasion"
              value={giftData.occasion}
              onChange={handleChange}
            />
          </div>

          <div className="grid gap-2">
            <Label htmlFor="cost" className="text-sm">
              Coût (€)
            </Label>
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
            <Label htmlFor="image" className="text-sm">
              Image du cadeau
            </Label>
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
                    className="absolute top-2 right-2 text-xs"
                    onClick={() => {
                      setImagePreview(null);
                      setGiftData((prev) => ({ ...prev, image: null }));
                    }}
                  >
                    Supprimer
                  </Button>
                </div>
              ) : (
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 flex flex-col items-center justify-center space-y-2">
                  <ImageIcon className="h-8 w-8 text-muted-foreground" />
                  <div className="text-center">
                    <p className="text-xs sm:text-sm text-muted-foreground">
                      Télécharger une image de votre cadeau
                    </p>
                    <p className="text-xs text-muted-foreground">
                      PNG, JPG jusqu'à 5 Mo
                    </p>
                  </div>
                  <label htmlFor="image-upload" className="cursor-pointer">
                    <div className="flex items-center space-x-2 bg-primary text-primary-foreground hover:bg-primary/90 h-9 rounded-md px-3 text-sm transition-colors">
                      {uploadingImage ? (
                        <span>Téléchargement...</span>
                      ) : (
                        <>
                          <Upload size={14} />
                          <span>Choisir un fichier</span>
                        </>
                      )}
                    </div>
                    <Input
                      id="image-upload"
                      type="file"
                      accept="image/*"
                      className="sr-only"
                      onChange={handleImageChange}
                      disabled={
                        uploadingImage ||
                        (giftData && giftData.id === undefined)
                      }
                    />
                  </label>
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="flex justify-end space-x-2">
          <Button variant="outline" onClick={onClose}>
            Annuler
          </Button>
          <Button onClick={handleSave} disabled={uploadingImage}>
            Enregistrer
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
