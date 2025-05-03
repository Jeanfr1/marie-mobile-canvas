import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Gift, Search, Image, Heart } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { AddGiftDialog } from "@/components/gifts/AddGiftDialog";
import { GiftDetailsDialog } from "@/components/gifts/GiftDetailsDialog";
import { GiftFilters } from "@/components/gifts/GiftFilters";
import { SendThanksDialog } from "@/components/gifts/SendThanksDialog";
import { toast } from "@/components/ui/sonner";
import { ContextualHelp } from "@/components/helpers/ContextualHelp";
import { useAuth } from "@/lib/auth-context";

export interface GiftItem {
  id: number;
  name: string;
  from: string;
  date: string;
  occasion: string;
  thanked: boolean;
  image?: string | null;
  cost?: number;
  to?: string; // Added for compatibility with given gifts
}

// Create a global event system for dashboard updates
export const dispatchGlobalEvent = (eventName: string, data?: any) => {
  const event = new CustomEvent(eventName, { detail: data });
  window.dispatchEvent(event);
};

const GiftsReceived = () => {
  const { user } = useAuth();
  const [selectedGift, setSelectedGift] = useState<GiftItem | null>(null);
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);
  const [isThanksOpen, setIsThanksOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const [gifts, setGifts] = useState<GiftItem[]>([
    {
      id: 1,
      name: "Écouteurs sans fil",
      from: "Mike Johnson",
      date: "2025-03-15",
      occasion: "Anniversaire",
      thanked: true,
      image:
        "https://images.unsplash.com/photo-1618160702438-9b02ab6515c9?w=300&h=200&fit=crop",
    },
    {
      id: 2,
      name: "Ensemble de bougies parfumées",
      from: "Lisa Smith",
      date: "2025-03-25",
      occasion: "Pendaison de crémaillère",
      thanked: true,
      image:
        "https://images.unsplash.com/photo-1582562124811-c09040d0a901?w=300&h=200&fit=crop",
    },
    {
      id: 3,
      name: "Machine à café",
      from: "John & Sarah",
      date: "2025-04-10",
      occasion: "Mariage",
      thanked: false,
      image:
        "https://images.unsplash.com/photo-1721322800607-8c38375eef04?w=300&h=200&fit=crop",
    },
    {
      id: 4,
      name: "Collection de livres",
      from: "David Williams",
      date: "2025-04-18",
      occasion: "Juste comme ça",
      thanked: false,
      image:
        "https://images.unsplash.com/photo-1472396961693-142e6e269027?w=300&h=200&fit=crop",
    },
  ]);

  // State for tracking first-time user or empty state
  const [isFirstTimeView, setIsFirstTimeView] = useState(true);

  // When component mounts, load gifts from localStorage if available
  useEffect(() => {
    if (!user) return;

    const userId = user.username;
    const userDataKey = `userData_${userId}`;
    const userData = JSON.parse(localStorage.getItem(userDataKey) || "{}");

    // Check if user has visited this page before
    const hasVisitedGiftsReceived = userData.visitedGiftsReceived || false;

    if (!hasVisitedGiftsReceived) {
      setIsFirstTimeView(true);
      // Mark as visited
      userData.visitedGiftsReceived = true;
      localStorage.setItem(userDataKey, JSON.stringify(userData));
    } else {
      setIsFirstTimeView(false);
    }

    // Load user's received gifts
    const receivedGifts = userData.receivedGifts || [];
    if (receivedGifts.length > 0) {
      setGifts(receivedGifts);
    } else {
      // Initialize with empty array for new users
      setGifts([]);
    }
  }, [user]);

  // When gifts change, save to localStorage and update dashboard
  useEffect(() => {
    if (!user) return;

    const userId = user.username;
    const userDataKey = `userData_${userId}`;
    const userData = JSON.parse(localStorage.getItem(userDataKey) || "{}");

    userData.receivedGifts = gifts;
    localStorage.setItem(userDataKey, JSON.stringify(userData));

    // Update dashboard stats
    dispatchGlobalEvent("gifts-updated", {
      type: "received",
      count: gifts.length,
    });
  }, [gifts, user]);

  const handleViewDetails = (gift: GiftItem) => {
    setSelectedGift(gift);
    setIsDetailsOpen(true);
  };

  const handleSendThanks = (gift: GiftItem) => {
    setSelectedGift(gift);
    setIsThanksOpen(true);
  };

  const handleMarkAsThanked = (giftId: number) => {
    setGifts(
      gifts.map((gift) =>
        gift.id === giftId ? { ...gift, thanked: true } : gift
      )
    );

    toast.success("Cadeau marqué comme remercié !", {
      description:
        "Vous avez remercié avec succès la personne qui vous a offert ce cadeau.",
    });
  };

  const handleAddGift = (newGift: GiftItem) => {
    const giftWithId = {
      ...newGift,
      id: Date.now(), // Ensure unique ID
    };

    setGifts((prevGifts) => [...prevGifts, giftWithId]);
    setIsFirstTimeView(false);

    toast.success("New gift added!", {
      description: `${newGift.name} from ${newGift.from} has been added to your gifts.`,
    });
  };

  // Filter gifts based on search query
  const filteredGifts = gifts.filter((gift) => {
    if (!searchQuery.trim()) return true;

    const query = searchQuery.toLowerCase();
    return (
      gift.name.toLowerCase().includes(query) ||
      gift.from.toLowerCase().includes(query) ||
      gift.occasion.toLowerCase().includes(query)
    );
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Gifts Received</h1>
          <p className="text-muted-foreground mt-1">
            Track and manage gifts you've received
          </p>
        </div>
        <AddGiftDialog type="received" onGiftAdded={handleAddGift} />
      </div>

      {isFirstTimeView && (
        <ContextualHelp
          title="Track Your Received Gifts"
          description="Keep a record of all gifts you receive. Add details, photos, and track thank you notes."
          steps={[
            "Click 'Add Gift' to record a new gift you've received",
            "Add details like who it's from, when you received it, and for what occasion",
            "Upload a photo to remember what it looks like",
            "Mark when you've sent a thank you note",
          ]}
          helpKey="gifts_received_first_time"
          forceShow={true}
        />
      )}

      <div className="flex flex-col sm:flex-row gap-4 justify-between">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search gifts, people..."
            className="pl-9"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <GiftFilters />
      </div>

      {filteredGifts.length === 0 ? (
        <div className="text-center py-10">
          <Gift className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
          <h3 className="text-lg font-medium">No gifts found</h3>
          <p className="text-muted-foreground">
            {searchQuery
              ? "Try adjusting your search or filters"
              : "Click the 'Add Gift' button to add your first gift"}
          </p>
          {!searchQuery && (
            <Button
              onClick={() =>
                document.getElementById("add-gift-button")?.click()
              }
              className="mt-4"
            >
              Add Your First Gift
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
                          De: {gift.from}
                        </p>
                      </div>
                      <Badge variant={gift.thanked ? "secondary" : "outline"}>
                        {gift.thanked ? "Remercié" : "Remerciement en attente"}
                      </Badge>
                    </div>
                  </CardHeader>

                  <CardContent>
                    <div className="space-y-4">
                      <div className="grid grid-cols-2 gap-2 text-sm">
                        <div>
                          <p className="text-muted-foreground">
                            Date de réception:
                          </p>
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
                        {!gift.thanked && (
                          <Button
                            size="sm"
                            className="flex-1 gap-1"
                            onClick={() => handleSendThanks(gift)}
                          >
                            <Heart className="h-4 w-4" />
                            Envoyer un remerciement
                          </Button>
                        )}
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
            type="received"
          />

          <SendThanksDialog
            isOpen={isThanksOpen}
            onClose={() => setIsThanksOpen(false)}
            gift={selectedGift}
            onSendThanks={handleMarkAsThanked}
          />
        </>
      )}
    </div>
  );
};

export default GiftsReceived;
