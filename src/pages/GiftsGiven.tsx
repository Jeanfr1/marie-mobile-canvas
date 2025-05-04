import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Gift, Search, Image } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { AddGiftDialog } from "@/components/gifts/AddGiftDialog";
import { GiftDetailsDialog } from "@/components/gifts/GiftDetailsDialog";
import { GiftFilters, GiftFiltersValues } from "@/components/gifts/GiftFilters";
import { EditGiftDialog } from "@/components/gifts/EditGiftDialog";
import { GiftItem } from "@/pages/GiftsReceived";
import { dispatchGlobalEvent } from "@/pages/GiftsReceived";
import { toast } from "@/components/ui/sonner";
import { useAuth } from "@/lib/auth-context";
import {
  parse,
  isValid,
  compareDesc,
  isAfter,
  isBefore,
  format,
} from "date-fns";

// Extended GiftItem interface for given gifts (with required 'to' property)
interface GivenGiftItem extends GiftItem {
  to: string;
}

// Helper function to parse date strings to Date objects
const parseGiftDate = (dateString: string): Date => {
  // Try to parse the date in YYYY-MM-DD format
  const parsed = parse(dateString, "yyyy-MM-dd", new Date());

  // Return the parsed date if valid, otherwise return a fallback date
  return isValid(parsed) ? parsed : new Date(0); // fallback to epoch time if invalid
};

const GiftsGiven = () => {
  const { user } = useAuth();
  const [selectedGift, setSelectedGift] = useState<GivenGiftItem | null>(null);
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [isFirstTimeView, setIsFirstTimeView] = useState(true);
  const [filters, setFilters] = useState<GiftFiltersValues>({
    dateFrom: "",
    dateTo: "",
    occasion: "",
  });

  const [gifts, setGifts] = useState<GivenGiftItem[]>([]);

  // When component mounts, load gifts from localStorage if available
  useEffect(() => {
    if (!user) return;

    const userId = user.username;
    const userDataKey = `userData_${userId}`;
    const userData = JSON.parse(localStorage.getItem(userDataKey) || "{}");

    // Load user's given gifts
    const givenGifts = userData.givenGifts || [];
    if (givenGifts.length > 0) {
      setGifts(givenGifts);
    }
  }, [user]);

  // When gifts change, save to localStorage and update dashboard
  useEffect(() => {
    if (!user) return;

    const userId = user.username;
    const userDataKey = `userData_${userId}`;
    const userData = JSON.parse(localStorage.getItem(userDataKey) || "{}");

    userData.givenGifts = gifts;
    localStorage.setItem(userDataKey, JSON.stringify(userData));

    // Update dashboard stats
    dispatchGlobalEvent("gifts-updated", {
      type: "given",
      count: gifts.length,
    });
  }, [gifts, user]);

  const handleViewDetails = (gift: GivenGiftItem) => {
    setSelectedGift(gift);
    setIsDetailsOpen(true);
  };

  const handleEdit = (gift: GivenGiftItem) => {
    setSelectedGift(gift);
    setIsEditOpen(true);
  };

  const handleAddGift = (newGift: GiftItem) => {
    try {
      const giftWithId = {
        ...newGift,
        id: Date.now(), // Ensure unique ID
      };

      setGifts((prevGifts) => [...prevGifts, giftWithId]);
      setIsFirstTimeView(false);

      // Update localStorage right away
      if (user) {
        const userId = user.username;
        const userDataKey = `userData_${userId}`;
        const userData = JSON.parse(localStorage.getItem(userDataKey) || "{}");
        const currentGifts = userData.givenGifts || [];
        userData.givenGifts = [...currentGifts, giftWithId];
        localStorage.setItem(userDataKey, JSON.stringify(userData));

        // Update dashboard stats
        dispatchGlobalEvent("gifts-updated", {
          type: "given",
          count: currentGifts.length + 1,
        });
      }

      toast.success("Nouveau cadeau ajouté !", {
        description: `${newGift.name} pour ${
          (newGift as GivenGiftItem).to
        } a été ajouté à vos cadeaux.`,
      });
    } catch (error) {
      console.error("Error adding gift:", error);
      toast.error("Une erreur s'est produite lors de l'ajout du cadeau");
    }
  };

  const handleFilterChange = (newFilters: GiftFiltersValues) => {
    setFilters(newFilters);
  };

  // Filter gifts based on search query and filters
  const filteredGifts = gifts
    .filter((gift) => {
      // Text search filter
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase();
        const textMatch =
          gift.name.toLowerCase().includes(query) ||
          gift.to.toLowerCase().includes(query) ||
          gift.occasion.toLowerCase().includes(query);

        if (!textMatch) return false;
      }

      // Date range filter
      if (filters.dateFrom) {
        const fromDate = parse(filters.dateFrom, "yyyy-MM-dd", new Date());
        const giftDate = parseGiftDate(gift.date);
        if (isValid(fromDate) && isBefore(giftDate, fromDate)) {
          return false;
        }
      }

      if (filters.dateTo) {
        const toDate = parse(filters.dateTo, "yyyy-MM-dd", new Date());
        const giftDate = parseGiftDate(gift.date);
        if (isValid(toDate) && isAfter(giftDate, toDate)) {
          return false;
        }
      }

      // Occasion filter
      if (
        filters.occasion &&
        !gift.occasion.toLowerCase().includes(filters.occasion.toLowerCase())
      ) {
        return false;
      }

      return true;
    })
    // Sort gifts by date (most recent first)
    .sort((a, b) => {
      const dateA = parseGiftDate(a.date);
      const dateB = parseGiftDate(b.date);
      return compareDesc(dateA, dateB); // compareDesc for descending order (newest first)
    });

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Cadeaux Offerts</h1>
          <p className="text-muted-foreground mt-1">
            Suivez et gérez les cadeaux que vous avez offerts
          </p>
        </div>
        <AddGiftDialog type="given" onGiftAdded={handleAddGift} />
      </div>

      <div className="flex flex-col sm:flex-row gap-4 justify-between">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Rechercher cadeaux, destinataires..."
            className="pl-9"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <GiftFilters onFilterChange={handleFilterChange} />
      </div>

      {/* Show active filters if any are set */}
      {(filters.dateFrom || filters.dateTo || filters.occasion) && (
        <div className="bg-muted rounded-md p-3 text-sm">
          <p className="font-medium mb-1">Filtres actifs:</p>
          <div className="flex flex-wrap gap-2">
            {filters.dateFrom && (
              <Badge variant="outline">À partir de: {filters.dateFrom}</Badge>
            )}
            {filters.dateTo && (
              <Badge variant="outline">Jusqu'à: {filters.dateTo}</Badge>
            )}
            {filters.occasion && (
              <Badge variant="outline">Occasion: {filters.occasion}</Badge>
            )}
          </div>
        </div>
      )}

      {filteredGifts.length === 0 ? (
        <div className="text-center py-10">
          <Gift className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
          <h3 className="text-lg font-medium">Aucun cadeau trouvé</h3>
          <p className="text-muted-foreground">
            {searchQuery ||
            filters.dateFrom ||
            filters.dateTo ||
            filters.occasion
              ? "Essayez d'ajuster votre recherche ou vos filtres"
              : "Cliquez sur le bouton 'Ajouter un cadeau' pour ajouter votre premier cadeau"}
          </p>
          {!searchQuery &&
            !filters.dateFrom &&
            !filters.dateTo &&
            !filters.occasion && (
              <Button
                onClick={() =>
                  document.getElementById("add-gift-button")?.click()
                }
                className="mt-4"
              >
                Ajouter votre premier cadeau
              </Button>
            )}
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {filteredGifts.map((gift) => (
            <Card
              key={gift.id}
              className="overflow-hidden hover:shadow-md transition-shadow duration-300"
            >
              <div className="flex flex-col sm:flex-row h-full">
                <div className="w-full sm:w-1/3 h-48 sm:h-auto bg-muted relative overflow-hidden">
                  {gift.image ? (
                    <img
                      src={gift.image}
                      alt={gift.name}
                      className="w-full h-full object-cover transition-transform hover:scale-105 duration-300"
                    />
                  ) : (
                    <div className="flex items-center justify-center h-full bg-gray-100">
                      <Image className="h-12 w-12 text-muted-foreground" />
                    </div>
                  )}
                </div>

                <div className="flex-1">
                  <CardHeader className="pb-2">
                    <div className="flex justify-between items-start">
                      <div>
                        <CardTitle className="text-xl">{gift.name}</CardTitle>
                        <p className="text-muted-foreground text-sm">
                          Pour: {gift.to}
                        </p>
                      </div>
                      <Badge
                        variant="secondary"
                        className="bg-secondary/20 text-secondary border-secondary/30"
                      >
                        {gift.cost}€
                      </Badge>
                    </div>
                  </CardHeader>

                  <CardContent>
                    <div className="space-y-4">
                      <div className="grid grid-cols-2 gap-2 text-sm">
                        <div>
                          <p className="text-muted-foreground">Date d'offre:</p>
                          <p className="font-medium">{gift.date}</p>
                        </div>
                        <div>
                          <p className="text-muted-foreground">Occasion:</p>
                          <p className="font-medium">{gift.occasion}</p>
                        </div>
                      </div>

                      <div className="flex gap-2 pt-2">
                        <Button
                          variant="outline"
                          size="sm"
                          className="flex-1"
                          onClick={() => handleViewDetails(gift)}
                        >
                          Voir les détails
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          className="flex-1"
                          onClick={() => handleEdit(gift)}
                        >
                          Modifier
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}

      {selectedGift && (
        <>
          <GiftDetailsDialog
            isOpen={isDetailsOpen}
            onClose={() => setIsDetailsOpen(false)}
            gift={selectedGift}
            type="given"
          />

          <EditGiftDialog
            isOpen={isEditOpen}
            onClose={() => setIsEditOpen(false)}
            gift={selectedGift}
          />
        </>
      )}
    </div>
  );
};

export default GiftsGiven;
