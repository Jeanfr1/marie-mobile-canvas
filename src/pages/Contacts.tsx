
import { useState } from "react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, Filter, Plus, Users, Gift, Calendar, X } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogTrigger } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { toast } from "@/components/ui/sonner";
import { useForm } from "react-hook-form";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Drawer, DrawerContent, DrawerHeader, DrawerTitle, DrawerTrigger, DrawerFooter } from "@/components/ui/drawer";

const Contacts = () => {
  // States for dialogs and drawers
  const [isAddContactOpen, setIsAddContactOpen] = useState(false);
  const [isEditContactOpen, setIsEditContactOpen] = useState(false);
  const [isViewGiftsOpen, setIsViewGiftsOpen] = useState(false);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [selectedContact, setSelectedContact] = useState<any | null>(null);
  
  // Search and filter states
  const [searchQuery, setSearchQuery] = useState("");
  const [relationshipFilter, setRelationshipFilter] = useState<string | null>(null);
  
  // Mock data for contacts
  const [contacts, setContacts] = useState([
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
  ]);

  // Mock data for gifts
  const mockGifts = [
    { id: 1, name: "Book - The Alchemist", date: "2023-12-25", occasion: "Christmas", type: "Given" },
    { id: 2, name: "Cooking Class", date: "2023-10-15", occasion: "Birthday", type: "Received" },
    { id: 3, name: "Gardening Tools", date: "2024-01-01", occasion: "New Year", type: "Given" }
  ];

  // Filter contacts based on search query and relationship filter
  const filteredContacts = contacts.filter(contact => {
    // Apply search filter
    const matchesSearch = contact.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          contact.interests.some(interest => interest.toLowerCase().includes(searchQuery.toLowerCase()));
    
    // Apply relationship filter
    const matchesRelationship = relationshipFilter === null || contact.relationship === relationshipFilter;
    
    return matchesSearch && matchesRelationship;
  });

  // Handle add new contact
  const handleAddContact = (data: any) => {
    const newContact = {
      id: contacts.length + 1,
      name: data.name,
      relationship: data.relationship,
      giftsReceived: 0,
      giftsGiven: 0,
      upcoming: null,
      interests: data.interests.split(",").map((item: string) => item.trim())
    };
    
    setContacts([...contacts, newContact]);
    setIsAddContactOpen(false);
    toast.success("Contact added successfully!");
  };

  // Handle edit contact
  const handleEditContact = (data: any) => {
    if (!selectedContact) return;
    
    const updatedContacts = contacts.map(contact => {
      if (contact.id === selectedContact.id) {
        return {
          ...contact,
          name: data.name,
          relationship: data.relationship,
          interests: data.interests.split(",").map((item: string) => item.trim())
        };
      }
      return contact;
    });
    
    setContacts(updatedContacts);
    setIsEditContactOpen(false);
    toast.success("Contact updated successfully!");
  };

  // Set up forms
  const addContactForm = useForm({
    defaultValues: {
      name: "",
      relationship: "Friend",
      interests: ""
    }
  });

  const editContactForm = useForm({
    defaultValues: {
      name: selectedContact?.name || "",
      relationship: selectedContact?.relationship || "Friend",
      interests: selectedContact ? selectedContact.interests.join(", ") : ""
    }
  });

  // Reset edit form when selected contact changes
  const openEditDialog = (contact: any) => {
    setSelectedContact(contact);
    editContactForm.reset({
      name: contact.name,
      relationship: contact.relationship,
      interests: contact.interests.join(", ")
    });
    setIsEditContactOpen(true);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Contacts</h1>
          <p className="text-muted-foreground mt-1">Manage your gift-giving network</p>
        </div>
        <Dialog open={isAddContactOpen} onOpenChange={setIsAddContactOpen}>
          <DialogTrigger asChild>
            <Button className="flex items-center gap-2">
              <Plus size={16} />
              Add Contact
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add New Contact</DialogTitle>
            </DialogHeader>
            <Form {...addContactForm}>
              <form onSubmit={addContactForm.handleSubmit(handleAddContact)} className="space-y-4">
                <FormField
                  control={addContactForm.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Name</FormLabel>
                      <FormControl>
                        <Input placeholder="Enter contact name" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={addContactForm.control}
                  name="relationship"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Relationship</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select relationship" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="Family">Family</SelectItem>
                          <SelectItem value="Friend">Friend</SelectItem>
                          <SelectItem value="Colleague">Colleague</SelectItem>
                          <SelectItem value="Other">Other</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={addContactForm.control}
                  name="interests"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Interests (comma separated)</FormLabel>
                      <FormControl>
                        <Input placeholder="Books, Coffee, Travel..." {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <DialogFooter>
                  <Button variant="outline" type="button" onClick={() => setIsAddContactOpen(false)}>Cancel</Button>
                  <Button type="submit">Add Contact</Button>
                </DialogFooter>
              </form>
            </Form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="flex flex-col sm:flex-row gap-4 justify-between">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input 
            placeholder="Search contacts..." 
            className="pl-9"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          {searchQuery && (
            <Button 
              variant="ghost" 
              size="icon" 
              className="absolute right-0 top-0 h-full"
              onClick={() => setSearchQuery("")}
            >
              <X className="h-4 w-4" />
            </Button>
          )}
        </div>
        
        <Dialog open={isFilterOpen} onOpenChange={setIsFilterOpen}>
          <DialogTrigger asChild>
            <Button variant="outline" className="flex items-center gap-2 self-start">
              <Filter size={16} />
              Filter
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Filter Contacts</DialogTitle>
            </DialogHeader>
            <div className="py-4">
              <h4 className="text-sm font-medium mb-3">Relationship</h4>
              <RadioGroup 
                value={relationshipFilter || ""} 
                onValueChange={(value) => setRelationshipFilter(value === "" ? null : value)}
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="" id="all" />
                  <label htmlFor="all" className="text-sm">All</label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="Family" id="family" />
                  <label htmlFor="family" className="text-sm">Family</label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="Friend" id="friend" />
                  <label htmlFor="friend" className="text-sm">Friend</label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="Colleague" id="colleague" />
                  <label htmlFor="colleague" className="text-sm">Colleague</label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="Other" id="other" />
                  <label htmlFor="other" className="text-sm">Other</label>
                </div>
              </RadioGroup>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => {
                setRelationshipFilter(null);
              }}>Reset</Button>
              <Button onClick={() => setIsFilterOpen(false)}>Apply</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid gap-4">
        {filteredContacts.map(contact => (
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
                  <Drawer open={isViewGiftsOpen && selectedContact?.id === contact.id} onOpenChange={(open) => {
                    if (open) {
                      setSelectedContact(contact);
                    }
                    setIsViewGiftsOpen(open);
                  }}>
                    <DrawerTrigger asChild>
                      <Button variant="outline" size="sm" onClick={() => setSelectedContact(contact)}>View Gifts</Button>
                    </DrawerTrigger>
                    <DrawerContent>
                      <DrawerHeader>
                        <DrawerTitle>Gifts for {selectedContact?.name}</DrawerTitle>
                      </DrawerHeader>
                      <div className="px-4 py-2">
                        {mockGifts.length > 0 ? (
                          <div className="divide-y">
                            {mockGifts.map(gift => (
                              <div key={gift.id} className="py-3 flex items-center justify-between">
                                <div>
                                  <p className="font-medium">{gift.name}</p>
                                  <p className="text-sm text-muted-foreground">{gift.occasion} • {new Date(gift.date).toLocaleDateString()}</p>
                                </div>
                                <Badge variant={gift.type === "Given" ? "default" : "secondary"}>
                                  {gift.type}
                                </Badge>
                              </div>
                            ))}
                          </div>
                        ) : (
                          <p className="text-center text-muted-foreground py-8">No gifts exchanged yet</p>
                        )}
                      </div>
                      <DrawerFooter>
                        <Button variant="outline" onClick={() => setIsViewGiftsOpen(false)}>Close</Button>
                      </DrawerFooter>
                    </DrawerContent>
                  </Drawer>
                  <Dialog open={isEditContactOpen && selectedContact?.id === contact.id} onOpenChange={(open) => {
                    if (!open) setIsEditContactOpen(false);
                  }}>
                    <DialogTrigger asChild>
                      <Button variant="outline" size="sm" onClick={() => openEditDialog(contact)}>Edit</Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>Edit Contact</DialogTitle>
                      </DialogHeader>
                      <Form {...editContactForm}>
                        <form onSubmit={editContactForm.handleSubmit(handleEditContact)} className="space-y-4">
                          <FormField
                            control={editContactForm.control}
                            name="name"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Name</FormLabel>
                                <FormControl>
                                  <Input placeholder="Enter contact name" {...field} />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          
                          <FormField
                            control={editContactForm.control}
                            name="relationship"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Relationship</FormLabel>
                                <Select onValueChange={field.onChange} defaultValue={field.value}>
                                  <FormControl>
                                    <SelectTrigger>
                                      <SelectValue placeholder="Select relationship" />
                                    </SelectTrigger>
                                  </FormControl>
                                  <SelectContent>
                                    <SelectItem value="Family">Family</SelectItem>
                                    <SelectItem value="Friend">Friend</SelectItem>
                                    <SelectItem value="Colleague">Colleague</SelectItem>
                                    <SelectItem value="Other">Other</SelectItem>
                                  </SelectContent>
                                </Select>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          
                          <FormField
                            control={editContactForm.control}
                            name="interests"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Interests (comma separated)</FormLabel>
                                <FormControl>
                                  <Input placeholder="Books, Coffee, Travel..." {...field} />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          
                          <DialogFooter>
                            <Button variant="outline" type="button" onClick={() => setIsEditContactOpen(false)}>Cancel</Button>
                            <Button type="submit">Save Changes</Button>
                          </DialogFooter>
                        </form>
                      </Form>
                    </DialogContent>
                  </Dialog>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
        
        {filteredContacts.length === 0 && (
          <Card className="p-6">
            <div className="text-center py-8">
              <div className="mx-auto w-12 h-12 rounded-full bg-muted flex items-center justify-center mb-3">
                <Users className="h-6 w-6 text-muted-foreground" />
              </div>
              <h3 className="text-lg font-medium">No contacts found</h3>
              <p className="text-muted-foreground mt-1">Try adjusting your search or filters</p>
              <Button 
                variant="outline" 
                className="mt-4"
                onClick={() => {
                  setSearchQuery("");
                  setRelationshipFilter(null);
                }}
              >
                Clear filters
              </Button>
            </div>
          </Card>
        )}
      </div>
    </div>
  );
};

export default Contacts;
