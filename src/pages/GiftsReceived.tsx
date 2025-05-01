
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
  const [selectedGift, setSelectedGift] = useState<GiftItem | null>(null);
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);
  const [isThanksOpen, setIsThanksOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  
  const [gifts, setGifts] = useState<GiftItem[]>([
    { 
      id: 1, 
      name: "Wireless Headphones", 
      from: "Mike Johnson", 
      date: "2025-03-15", 
      occasion: "Birthday", 
      thanked: true,
      image: "https://images.unsplash.com/photo-1618160702438-9b02ab6515c9?w=300&h=200&fit=crop"
    },
    { 
      id: 2, 
      name: "Scented Candle Set", 
      from: "Lisa Smith", 
      date: "2025-03-25", 
      occasion: "Housewarming", 
      thanked: true,
      image: "https://images.unsplash.com/photo-1582562124811-c09040d0a901?w=300&h=200&fit=crop"
    },
    { 
      id: 3, 
      name: "Coffee Maker", 
      from: "John & Sarah", 
      date: "2025-04-10", 
      occasion: "Wedding", 
      thanked: false,
      image: "https://images.unsplash.com/photo-1721322800607-8c38375eef04?w=300&h=200&fit=crop"
    },
    { 
      id: 4, 
      name: "Book Collection", 
      from: "David Williams", 
      date: "2025-04-18", 
      occasion: "Just Because", 
      thanked: false,
      image: "https://images.unsplash.com/photo-1472396961693-142e6e269027?w=300&h=200&fit=crop"
    }
  ]);

  // When component mounts, load gifts from localStorage if available
  useEffect(() => {
    const savedGifts = localStorage.getItem('receivedGifts');
    if (savedGifts) {
      setGifts(JSON.parse(savedGifts));
    }
  }, []);

  // When gifts change, save to localStorage and update dashboard
  useEffect(() => {
    localStorage.setItem('receivedGifts', JSON.stringify(gifts));
    // Update dashboard stats
    dispatchGlobalEvent('gifts-updated', { type: 'received', count: gifts.length });
  }, [gifts]);

  const handleViewDetails = (gift: GiftItem) => {
    setSelectedGift(gift);
    setIsDetailsOpen(true);
  };
  
  const handleSendThanks = (gift: GiftItem) => {
    setSelectedGift(gift);
    setIsThanksOpen(true);
  };
  
  const handleMarkAsThanked = (giftId: number) => {
    setGifts(gifts.map(gift => 
      gift.id === giftId ? { ...gift, thanked: true } : gift
    ));
    
    toast.success("Gift marked as thanked!", {
      description: "You've successfully thanked the gift giver."
    });
  };

  const handleAddGift = (newGift: GiftItem) => {
    setGifts(prevGifts => [...prevGifts, newGift]);
    
    toast.success("New gift added!", {
      description: `${newGift.name} from ${newGift.from} has been added to your gifts.`
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
          <p className="text-muted-foreground mt-1">Track and manage gifts you've been given</p>
        </div>
        <AddGiftDialog type="received" onGiftAdded={handleAddGift} />
      </div>

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
          <p className="text-muted-foreground">Try adjusting your search or filters</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {filteredGifts.map(gift => (
            <Card key={gift.id} className="overflow-hidden hover:shadow-md transition-shadow duration-300">
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
                        <p className="text-muted-foreground text-sm">From: {gift.from}</p>
                      </div>
                      <Badge variant={gift.thanked ? "secondary" : "outline"}>
                        {gift.thanked ? "Thanked" : "Thank You Pending"}
                      </Badge>
                    </div>
                  </CardHeader>
                  
                  <CardContent>
                    <div className="space-y-4">
                      <div className="grid grid-cols-2 gap-2 text-sm">
                        <div>
                          <p className="text-muted-foreground">Date Received:</p>
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
                          View Details
                        </Button>
                        {!gift.thanked && (
                          <Button 
                            size="sm" 
                            className="flex-1 gap-1"
                            onClick={() => handleSendThanks(gift)}
                          >
                            <Heart className="h-4 w-4" />
                            Send Thanks
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
