
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Gift, Search, Filter, Plus, Image } from "lucide-react";
import { Badge } from "@/components/ui/badge";

const GiftsReceived = () => {
  // Mock data for gifts received
  const gifts = [
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
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Gifts Received</h1>
          <p className="text-muted-foreground mt-1">Track and manage gifts you've been given</p>
        </div>
        <Button className="flex items-center gap-2">
          <Plus size={16} />
          Add New Gift
        </Button>
      </div>

      <div className="flex flex-col sm:flex-row gap-4 justify-between">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input 
            placeholder="Search gifts, people..." 
            className="pl-9"
          />
        </div>
        <Button variant="outline" className="flex items-center gap-2 self-start">
          <Filter size={16} />
          Filter
        </Button>
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
                      <Button variant="outline" size="sm" className="flex-1">
                        View Details
                      </Button>
                      {!gift.thanked && (
                        <Button size="sm" className="flex-1">
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
    </div>
  );
};

export default GiftsReceived;
