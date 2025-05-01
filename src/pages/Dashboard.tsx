
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Gift, Users, Calendar, Bell, Eye, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { AddEventDialog } from "@/components/events/AddEventDialog";
import { NotificationsDialog } from "@/components/notifications/NotificationsDialog";

// Define interfaces for our data types
interface DashboardStats {
  giftsReceived: number;
  giftsGiven: number;
  contacts: number;
  upcomingEvents: number;
}

interface Gift {
  id: number;
  name: string;
  from: string;
  date: string;
  status: string;
}

interface Event {
  id: number;
  name: string;
  date: string;
  daysLeft: number;
}

const Dashboard = () => {
  const navigate = useNavigate();
  const [isAddEventOpen, setIsAddEventOpen] = useState(false);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  
  // State for tracking dashboard statistics
  const [stats, setStats] = useState<DashboardStats>({
    giftsReceived: 24,
    giftsGiven: 18,
    contacts: 42,
    upcomingEvents: 3
  });

  // State for recent gifts and upcoming events
  const [recentGifts, setRecentGifts] = useState<Gift[]>([
    { id: 1, name: "Birthday Present", from: "Sarah", date: "2025-04-15", status: "Thank you sent" },
    { id: 2, name: "Anniversary Gift", from: "Michael", date: "2025-04-10", status: "Pending" },
    { id: 3, name: "Housewarming Gift", from: "Lisa", date: "2025-04-05", status: "Thank you sent" }
  ]);

  const [upcomingEvents, setUpcomingEvents] = useState<Event[]>([
    { id: 1, name: "Mom's Birthday", date: "2025-05-10", daysLeft: 14 },
    { id: 2, name: "Wedding Anniversary", date: "2025-06-15", daysLeft: 50 },
    { id: 3, name: "Friend's Graduation", date: "2025-05-25", daysLeft: 29 }
  ]);

  // Load data from localStorage when component mounts
  useEffect(() => {
    // Load received gifts count
    const savedReceivedGifts = localStorage.getItem('receivedGifts');
    const receivedGifts = savedReceivedGifts ? JSON.parse(savedReceivedGifts) : [];

    // Load given gifts count (if implemented)
    const savedGivenGifts = localStorage.getItem('givenGifts');
    const givenGifts = savedGivenGifts ? JSON.parse(savedGivenGifts) : [];

    // Load events count (if implemented)
    const savedEvents = localStorage.getItem('events');
    const events = savedEvents ? JSON.parse(savedEvents) : [];

    // Update stats with actual counts
    setStats(prevStats => ({
      ...prevStats,
      giftsReceived: receivedGifts.length || prevStats.giftsReceived,
      giftsGiven: givenGifts.length || prevStats.giftsGiven,
      upcomingEvents: events.length || prevStats.upcomingEvents
    }));

    // Update recent gifts list if there are received gifts
    if (receivedGifts.length > 0) {
      const formattedGifts = receivedGifts
        .slice(-3) // Get last 3 gifts
        .map((gift: any) => ({
          id: gift.id,
          name: gift.name,
          from: gift.from,
          date: gift.date,
          status: gift.thanked ? "Thank you sent" : "Pending"
        }));
      
      setRecentGifts(formattedGifts);
    }

    // Listen for gift updates
    const handleGiftsUpdated = (event: CustomEvent) => {
      const { type, count } = event.detail;
      
      if (type === 'received') {
        setStats(prev => ({ ...prev, giftsReceived: count }));
        
        // Also update recent gifts if available
        const savedGifts = localStorage.getItem('receivedGifts');
        if (savedGifts) {
          const allGifts = JSON.parse(savedGifts);
          const recentOnes = allGifts.slice(-3).map((gift: any) => ({
            id: gift.id,
            name: gift.name,
            from: gift.from,
            date: gift.date,
            status: gift.thanked ? "Thank you sent" : "Pending"
          }));
          setRecentGifts(recentOnes);
        }
      } else if (type === 'given') {
        setStats(prev => ({ ...prev, giftsGiven: count }));
      }
    };

    window.addEventListener('gifts-updated', handleGiftsUpdated as EventListener);

    // Clean up event listener when component unmounts
    return () => {
      window.removeEventListener('gifts-updated', handleGiftsUpdated as EventListener);
    };
  }, []);
  
  // Handle adding a new event
  const handleAddEvent = () => {
    setIsAddEventOpen(true);
  };
  
  // Event handler for when a new event is added
  const handleEventAdded = (newEvent: { name: string; date: Date }) => {
    const today = new Date();
    const eventDate = new Date(newEvent.date);
    const daysLeft = Math.ceil((eventDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
    
    const event = {
      id: upcomingEvents.length + 1,
      name: newEvent.name,
      date: newEvent.date.toISOString().split('T')[0],
      daysLeft
    };
    
    // Update events state
    setUpcomingEvents(prev => {
      const updated = [...prev, event].sort((a, b) => a.daysLeft - b.daysLeft);
      // Keep only the most recent events if there are more than 3
      return updated.slice(0, 3);
    });
    
    // Update stats
    setStats(prev => ({
      ...prev,
      upcomingEvents: prev.upcomingEvents + 1
    }));

    // Save events to localStorage for persistence
    const savedEvents = localStorage.getItem('events');
    const existingEvents = savedEvents ? JSON.parse(savedEvents) : [];
    const updatedEvents = [...existingEvents, {
      id: Date.now(),
      name: newEvent.name,
      date: newEvent.date.toISOString()
    }];
    localStorage.setItem('events', JSON.stringify(updatedEvents));
  };
  
  const handleViewAllGifts = () => {
    navigate("/gifts-received");
  };
  
  const handleSetupNotifications = () => {
    setIsNotificationsOpen(true);
  };
  
  return (
    <div className="space-y-8">
      <section className="text-center py-10">
        <div className="max-w-3xl mx-auto space-y-6">
          <h1 className="text-4xl font-bold tracking-tight text-gray-900 sm:text-5xl bg-clip-text text-transparent bg-gradient-to-r from-primary to-secondary">
            Gift Tracker Dashboard
          </h1>
          <p className="text-xl text-muted-foreground">
            Track your gifts, manage contacts, and never miss an important date
          </p>
        </div>
      </section>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="hover:shadow-md transition-shadow duration-300">
          <CardHeader className="pb-2">
            <div className="flex justify-between items-center">
              <CardTitle className="text-lg font-medium">Gifts Received</CardTitle>
              <Gift className="h-5 w-5 text-primary" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{stats.giftsReceived}</div>
            <p className="text-muted-foreground mt-1 text-sm">Total gifts tracked</p>
          </CardContent>
        </Card>

        <Card className="hover:shadow-md transition-shadow duration-300">
          <CardHeader className="pb-2">
            <div className="flex justify-between items-center">
              <CardTitle className="text-lg font-medium">Gifts Given</CardTitle>
              <Gift className="h-5 w-5 text-secondary" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{stats.giftsGiven}</div>
            <p className="text-muted-foreground mt-1 text-sm">Total gifts given</p>
          </CardContent>
        </Card>

        <Card className="hover:shadow-md transition-shadow duration-300">
          <CardHeader className="pb-2">
            <div className="flex justify-between items-center">
              <CardTitle className="text-lg font-medium">Contacts</CardTitle>
              <Users className="h-5 w-5 text-primary" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{stats.contacts}</div>
            <p className="text-muted-foreground mt-1 text-sm">People in your network</p>
          </CardContent>
        </Card>

        <Card className="hover:shadow-md transition-shadow duration-300">
          <CardHeader className="pb-2">
            <div className="flex justify-between items-center">
              <CardTitle className="text-lg font-medium">Coming Up</CardTitle>
              <Calendar className="h-5 w-5 text-secondary" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{stats.upcomingEvents}</div>
            <p className="text-muted-foreground mt-1 text-sm">Events this month</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>Recent Gifts</CardTitle>
              <Button 
                variant="outline" 
                size="sm"
                onClick={handleViewAllGifts}
                className="gap-2"
              >
                View All
                <Eye className="h-4 w-4" />
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentGifts.map(gift => (
                <div key={gift.id} className="flex items-center justify-between border-b pb-3">
                  <div>
                    <h4 className="font-medium">{gift.name}</h4>
                    <p className="text-sm text-muted-foreground">From: {gift.from} • {gift.date}</p>
                  </div>
                  <Badge variant={gift.status === "Pending" ? "outline" : "secondary"}>
                    {gift.status}
                  </Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>Upcoming Events</CardTitle>
              <Button 
                variant="outline" 
                size="sm" 
                onClick={handleAddEvent}
                className="gap-2"
              >
                Add Event
                <Plus className="h-4 w-4" />
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {upcomingEvents.map(event => (
                <div key={event.id} className="flex items-center justify-between border-b pb-3">
                  <div className="flex items-center gap-3">
                    <div className="bg-primary/10 p-2 rounded-full">
                      <Calendar className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <h4 className="font-medium">{event.name}</h4>
                      <p className="text-sm text-muted-foreground">{event.date}</p>
                    </div>
                  </div>
                  <Badge variant={event.daysLeft < 15 ? "destructive" : "outline"}>
                    {event.daysLeft} days left
                  </Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      <Card className="bg-gradient-to-r from-primary/5 to-secondary/5 border-none">
        <CardContent className="pt-6">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="bg-primary/20 p-3 rounded-full">
                <Bell className="h-6 w-6 text-primary" />
              </div>
              <div>
                <h3 className="text-lg font-semibold">Enable Reminders</h3>
                <p className="text-muted-foreground">Never miss an important date or thank you note</p>
              </div>
            </div>
            <Button 
              size="lg" 
              onClick={handleSetupNotifications}
              className="gap-2"
            >
              Set Up Notifications
              <Bell className="h-4 w-4" />
            </Button>
          </div>
        </CardContent>
      </Card>
      
      {/* Dialogs */}
      <AddEventDialog 
        open={isAddEventOpen} 
        onOpenChange={setIsAddEventOpen} 
        onEventAdded={handleEventAdded} 
      />
      <NotificationsDialog open={isNotificationsOpen} onOpenChange={setIsNotificationsOpen} />
    </div>
  );
};

export default Dashboard;
