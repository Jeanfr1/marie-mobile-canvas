
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, Filter, Plus, Users, Gift, Calendar } from "lucide-react";
import { Badge } from "@/components/ui/badge";

const Contacts = () => {
  // Mock data for contacts
  const contacts = [
    { 
      id: 1, 
      name: "Sarah Johnson", 
      relationship: "Family", 
      giftsReceived: 5,
      giftsGiven: 4,
      upcoming: "Birthday - May 15",
      interests: ["Books", "Cooking", "Gardening"]
    },
    { 
      id: 2, 
      name: "Michael Smith", 
      relationship: "Friend", 
      giftsReceived: 2,
      giftsGiven: 3,
      upcoming: "Anniversary - June 10",
      interests: ["Tech", "Hiking", "Photography"]
    },
    { 
      id: 3, 
      name: "Emily Davis", 
      relationship: "Colleague", 
      giftsReceived: 1,
      giftsGiven: 2,
      upcoming: null,
      interests: ["Wine", "Travel", "Art"]
    },
    { 
      id: 4, 
      name: "David Wilson", 
      relationship: "Friend", 
      giftsReceived: 3,
      giftsGiven: 2,
      upcoming: "Birthday - June 22",
      interests: ["Sports", "Music", "Cooking"]
    }
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Contacts</h1>
          <p className="text-muted-foreground mt-1">Manage your gift-giving network</p>
        </div>
        <Button className="flex items-center gap-2">
          <Plus size={16} />
          Add Contact
        </Button>
      </div>

      <div className="flex flex-col sm:flex-row gap-4 justify-between">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input 
            placeholder="Search contacts..." 
            className="pl-9"
          />
        </div>
        <Button variant="outline" className="flex items-center gap-2 self-start">
          <Filter size={16} />
          Filter
        </Button>
      </div>

      <div className="grid gap-4">
        {contacts.map(contact => (
          <Card key={contact.id} className="hover:shadow-md transition-shadow duration-300">
            <CardContent className="p-6">
              <div className="flex flex-col md:flex-row justify-between gap-4">
                <div className="flex items-center gap-4">
                  <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
                    <Users className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold">{contact.name}</h3>
                    <Badge variant="outline" className="mt-1">
                      {contact.relationship}
                    </Badge>
                  </div>
                </div>
                
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mt-4 md:mt-0">
                  <div className="flex items-center gap-2">
                    <div className="h-8 w-8 rounded-full bg-secondary/10 flex items-center justify-center">
                      <Gift className="h-4 w-4 text-secondary" />
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground">Gift Exchange</p>
                      <p className="font-medium">{contact.giftsReceived} / {contact.giftsGiven}</p>
                    </div>
                  </div>
                  
                  {contact.upcoming && (
                    <div className="flex items-center gap-2">
                      <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center">
                        <Calendar className="h-4 w-4 text-primary" />
                      </div>
                      <div>
                        <p className="text-xs text-muted-foreground">Upcoming</p>
                        <p className="font-medium text-sm">{contact.upcoming}</p>
                      </div>
                    </div>
                  )}
                  
                  <div className="col-span-2 md:col-span-1 flex items-center gap-2">
                    <div className="flex flex-wrap gap-1">
                      {contact.interests.slice(0, 2).map((interest, idx) => (
                        <Badge key={idx} variant="secondary" className="bg-secondary/10 text-secondary border-secondary/30">
                          {interest}
                        </Badge>
                      ))}
                      {contact.interests.length > 2 && (
                        <Badge variant="outline">+{contact.interests.length - 2}</Badge>
                      )}
                    </div>
                  </div>
                </div>
                
                <div className="flex gap-2 mt-4 md:mt-0 justify-end">
                  <Button variant="outline" size="sm">View Gifts</Button>
                  <Button variant="outline" size="sm">Edit</Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default Contacts;
