import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Gift, Search, Image } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { AddGiftDialog } from "@/components/gifts/AddGiftDialog";
import { GiftDetailsDialog } from "@/components/gifts/GiftDetailsDialog";
import { GiftFilters } from "@/components/gifts/GiftFilters";

const GiftsGiven = () => {
  const [selectedGift, setSelectedGift] = useState<any | null>(null);
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);

  const gifts = [
    { 
      id: 1, 
      name: "Smart Watch", 
      to: "Emma Roberts", 
      date: "2025-02-15", 
      occasion: "Birthday", 
      cost: "$199.99",
      image: "https://images.unsplash.com/photo-1466721591366-2d5fba72006d?w=300&h=200&fit=crop"
    },
    { 
      id: 2, 
      name: "Wine Gift Basket", 
      to: "Robert & Mary", 
      date: "2025-03-10", 
      occasion: "Anniversary", 
      cost: "$75.00",
      image: null
    },
    { 
      id: 3, 
      name: "Fitness Tracker", 
      to: "Chris Thompson", 
      date: "2025-04-05", 
      occasion: "Graduation", 
      cost: "$89.95",
      image: "https://images.unsplash.com/photo-1582562124811-c09040d0a901?w=300&h=200&fit=crop"
    },
    { 
      id: 4, 
      name: "Gift Card", 
      to: "Office Team", 
      date: "2025-04-16", 
      occasion: "Appreciation", 
      cost: "$200.00",
      image: null
    }
  ];

  const handleViewDetails = (gift: any) => {
    setSelectedGift(gift);
    setIsDetailsOpen(true);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Gifts Given</h1>
          <p className="text-muted-foreground mt-1">Track and manage gifts you've given to others</p>
        </div>
        <AddGiftDialog type="given" />
      </div>

      <div className="flex flex-col sm:flex-row gap-4 justify-between">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input 
            placeholder="Search gifts, recipients..." 
            className="pl-9"
          />
        </div>
        <GiftFilters />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {gifts.map(gift => (
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
                    <Gift className="h-12 w-12 text-muted-foreground" />
                  </div>
                )}
              </div>
              
              <div className="flex-1">
                <CardHeader className="pb-2">
                  <div className="flex justify-between items-start">
                    <div>
                      <CardTitle className="text-xl">{gift.name}</CardTitle>
                      <p className="text-muted-foreground text-sm">To: {gift.to}</p>
                    </div>
                    <Badge variant="secondary" className="bg-secondary/20 text-secondary border-secondary/30">
                      {gift.cost}
                    </Badge>
                  </div>
                </CardHeader>
                
                <CardContent>
                  <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-2 text-sm">
                      <div>
                        <p className="text-muted-foreground">Date Given:</p>
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
                      <Button 
                        variant="outline" 
                        size="sm" 
                        className="flex-1"
                        onClick={() => {
                          setSelectedGift(gift);
                          setIsEditMode(true);
                        }}
                      >
                        Edit
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </div>
            </div>
          </Card>
        ))}
      </div>

      {selectedGift && (
        <GiftDetailsDialog
          isOpen={isDetailsOpen}
          onClose={() => setIsDetailsOpen(false)}
          gift={selectedGift}
          type="given"
        />
      )}
    </div>
  );
};

export default GiftsGiven;
