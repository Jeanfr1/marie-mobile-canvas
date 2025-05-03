import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Gift, Users, Calendar, Bell, Eye, Plus, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { AddEventDialog } from "@/components/events/AddEventDialog";
import { NotificationsDialog } from "@/components/notifications/NotificationsDialog";
import { EmptyState } from "@/components/empty-states/EmptyState";
import { useAuth } from "@/lib/auth-context";
import { ContextualHelp } from "@/components/helpers/ContextualHelp";
import { FeatureDisclosure } from "@/components/helpers/FeatureDisclosure";

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
  const { user } = useAuth();
  const [isAddEventOpen, setIsAddEventOpen] = useState(false);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);

  // State for tracking dashboard statistics
  const [stats, setStats] = useState<DashboardStats>({
    giftsReceived: 0,
    giftsGiven: 0,
    contacts: 0,
    upcomingEvents: 0,
  });

  // State for recent gifts and upcoming events
  const [recentGifts, setRecentGifts] = useState<Gift[]>([]);
  const [upcomingEvents, setUpcomingEvents] = useState<Event[]>([]);
  const [isNewUser, setIsNewUser] = useState(true);

  // Load data from localStorage when component mounts
  useEffect(() => {
    if (!user) return;

    const userId = user.username;
    const userDataKey = `userData_${userId}`;

    // Try to load user data
    const savedUserData = localStorage.getItem(userDataKey);

    if (savedUserData) {
      // User has existing data
      const userData = JSON.parse(savedUserData);
      setIsNewUser(false);

      // Load received gifts count
      const receivedGifts = userData.receivedGifts || [];
      const givenGifts = userData.givenGifts || [];
      const contacts = userData.contacts || [];
      const events = userData.events || [];

      // Update stats with actual counts
      setStats({
        giftsReceived: receivedGifts.length,
        giftsGiven: givenGifts.length,
        contacts: contacts.length,
        upcomingEvents: events.length,
      });

      // Update recent gifts list if there are received gifts
      if (receivedGifts.length > 0) {
        const formattedGifts = receivedGifts
          .slice(-3) // Get last 3 gifts
          .map((gift: any) => ({
            id: gift.id,
            name: gift.name,
            from: gift.from,
            date: gift.date,
            status: gift.thanked ? "Thank you sent" : "Pending",
          }));

        setRecentGifts(formattedGifts);
      }

      // Update upcoming events
      if (events.length > 0) {
        const today = new Date();
        const formattedEvents = events
          .map((event: any) => {
            const eventDate = new Date(event.date);
            const daysLeft = Math.ceil(
              (eventDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24)
            );
            return {
              id: event.id,
              name: event.name,
              date: eventDate.toISOString().split("T")[0],
              daysLeft: daysLeft > 0 ? daysLeft : 0,
            };
          })
          .filter((event: any) => event.daysLeft >= 0)
          .sort((a: any, b: any) => a.daysLeft - b.daysLeft)
          .slice(0, 3);

        setUpcomingEvents(formattedEvents);
      }
    } else {
      // New user with no data
      setIsNewUser(true);

      // Initialize empty user data
      const newUserData = {
        receivedGifts: [],
        givenGifts: [],
        contacts: [],
        events: [],
      };

      // Save empty data structure
      localStorage.setItem(userDataKey, JSON.stringify(newUserData));
    }

    // Listen for gift updates
    const handleGiftsUpdated = (event: CustomEvent) => {
      const { type, count } = event.detail;

      if (type === "received") {
        setStats((prev) => ({ ...prev, giftsReceived: count }));

        // Also update recent gifts if available
        const userData = JSON.parse(localStorage.getItem(userDataKey) || "{}");
        if (userData.receivedGifts) {
          const allGifts = userData.receivedGifts;
          const recentOnes = allGifts.slice(-3).map((gift: any) => ({
            id: gift.id,
            name: gift.name,
            from: gift.from,
            date: gift.date,
            status: gift.thanked ? "Thank you sent" : "Pending",
          }));
          setRecentGifts(recentOnes);
        }
      } else if (type === "given") {
        setStats((prev) => ({ ...prev, giftsGiven: count }));
      }
    };

    window.addEventListener(
      "gifts-updated",
      handleGiftsUpdated as EventListener
    );

    // Clean up event listener when component unmounts
    return () => {
      window.removeEventListener(
        "gifts-updated",
        handleGiftsUpdated as EventListener
      );
    };
  }, [user]);

  // Handle adding a new event
  const handleAddEvent = () => {
    setIsAddEventOpen(true);
  };

  // Event handler for when a new event is added
  const handleEventAdded = (newEvent: { name: string; date: Date }) => {
    if (!user) return;

    const userId = user.username;
    const userDataKey = `userData_${userId}`;

    const today = new Date();
    const eventDate = new Date(newEvent.date);
    const daysLeft = Math.ceil(
      (eventDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24)
    );

    const event = {
      id: Date.now(),
      name: newEvent.name,
      date: newEvent.date.toISOString(),
      daysLeft,
    };

    // Update events state
    setUpcomingEvents((prev) => {
      const updated = [...prev, event].sort((a, b) => a.daysLeft - b.daysLeft);
      // Keep only the most recent events if there are more than 3
      return updated.slice(0, 3);
    });

    // Update stats
    setStats((prev) => ({
      ...prev,
      upcomingEvents: prev.upcomingEvents + 1,
    }));

    // Save events to localStorage for persistence
    const savedUserData = localStorage.getItem(userDataKey);
    const userData = savedUserData ? JSON.parse(savedUserData) : {};
    const existingEvents = userData.events || [];
    userData.events = [...existingEvents, event];

    localStorage.setItem(userDataKey, JSON.stringify(userData));

    // No longer a new user
    setIsNewUser(false);
  };

  const handleViewAllGifts = () => {
    navigate("/gifts-received");
  };

  const handleAddContact = () => {
    navigate("/contacts");
  };

  const handleAddGift = () => {
    navigate("/gifts-received");
  };

  const handleSetupNotifications = () => {
    setIsNotificationsOpen(true);
  };

  if (isNewUser) {
    return (
      <div className="space-y-8">
        <section className="text-center py-10">
          <div className="max-w-3xl mx-auto space-y-6">
            <h1 className="text-4xl font-bold tracking-tight text-gray-900 sm:text-5xl bg-clip-text text-transparent bg-gradient-to-r from-primary to-secondary">
              Welcome to Gift Tracker
            </h1>
            <p className="text-xl text-muted-foreground">
              Let's start tracking your gifts, contacts, and important dates
            </p>
          </div>
        </section>

        <ContextualHelp
          title="Getting Started"
          description="Welcome to Gift Tracker! Here's how to get started:"
          steps={[
            "Add gifts you've received to keep track of them",
            "Create your contact list with friends and family",
            "Set up event reminders for important dates",
            "Explore all the features to manage your gift-giving experience",
          ]}
          helpKey="dashboard_new_user"
          forceShow={true}
        />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <EmptyState
            title="Track your gifts"
            description="Start by adding gifts you've received or given to keep track of them"
            icon={Gift}
            actionLabel="Add your first gift"
            onAction={handleAddGift}
          />

          <EmptyState
            title="Add your contacts"
            description="Add people to your contact list to remember their preferences"
            icon={Users}
            actionLabel="Add your first contact"
            onAction={handleAddContact}
          />

          <EmptyState
            title="Set up reminders"
            description="Never miss an important date by adding events and reminders"
            icon={Calendar}
            actionLabel="Add your first event"
            onAction={handleAddEvent}
          />

          <EmptyState
            title="Get started with Gift Tracker"
            description="Discover all the features to manage your gift-giving experience"
            icon={Sparkles}
            actionLabel="See gift ideas"
            onAction={() => navigate("/gifts-given")}
          />
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <FeatureDisclosure />

      <section className="text-center py-10">
        <div className="max-w-3xl mx-auto space-y-6">
          <h1 className="text-4xl font-bold tracking-tight text-gray-900 sm:text-5xl bg-clip-text text-transparent bg-gradient-to-r from-primary to-secondary">
            Gift Dashboard
          </h1>
          <p className="text-xl text-muted-foreground">
            Track your gifts, manage contacts and never miss an important date
          </p>
        </div>
      </section>

      {stats.giftsReceived === 0 && stats.giftsGiven === 0 && (
        <ContextualHelp
          title="Add Your First Gift"
          description="You haven't added any gifts yet. Start tracking gifts by clicking on these cards."
          helpKey="dashboard_empty_gifts"
          forceShow={true}
        />
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="hover:shadow-md transition-shadow duration-300">
          <CardHeader className="pb-2">
            <div className="flex justify-between items-center">
              <CardTitle className="text-lg font-medium">
                Gifts Received
              </CardTitle>
              <Gift className="h-5 w-5 text-primary" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{stats.giftsReceived}</div>
            <p className="text-sm text-muted-foreground">
              Gifts you've received
            </p>
            <Button
              variant="link"
              className="px-0 mt-2"
              onClick={handleViewAllGifts}
            >
              View all
              <Eye className="h-4 w-4 ml-1" />
            </Button>
          </CardContent>
        </Card>

        <Card className="hover:shadow-md transition-shadow duration-300">
          <CardHeader className="pb-2">
            <div className="flex justify-between items-center">
              <CardTitle className="text-lg font-medium">Gifts Given</CardTitle>
              <Gift className="h-5 w-5 text-primary" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{stats.giftsGiven}</div>
            <p className="text-sm text-muted-foreground">Gifts you've given</p>
            <Button
              variant="link"
              className="px-0 mt-2"
              onClick={() => navigate("/gifts-given")}
            >
              View all
              <Eye className="h-4 w-4 ml-1" />
            </Button>
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
            <p className="text-sm text-muted-foreground">People you track</p>
            <Button
              variant="link"
              className="px-0 mt-2"
              onClick={() => navigate("/contacts")}
            >
              Manage contacts
              <Eye className="h-4 w-4 ml-1" />
            </Button>
          </CardContent>
        </Card>

        <Card className="hover:shadow-md transition-shadow duration-300">
          <CardHeader className="pb-2">
            <div className="flex justify-between items-center">
              <CardTitle className="text-lg font-medium">
                Upcoming Events
              </CardTitle>
              <Calendar className="h-5 w-5 text-primary" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{stats.upcomingEvents}</div>
            <p className="text-sm text-muted-foreground">
              Events in your calendar
            </p>
            <Button
              variant="link"
              className="px-0 mt-2"
              onClick={handleAddEvent}
            >
              Add event
              <Plus className="h-4 w-4 ml-1" />
            </Button>
          </CardContent>
        </Card>
      </div>

      {stats.upcomingEvents === 0 && (
        <ContextualHelp
          title="Add Important Dates"
          description="Add birthdays, anniversaries, and other important dates to get reminders."
          steps={[
            "Click 'Add Event' to create a new reminder",
            "Enter the event details and date",
            "You'll see upcoming events here and get notified before they arrive",
          ]}
          helpKey="dashboard_empty_events"
          showDelay={2000}
        />
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <div className="flex justify-between items-center">
              <CardTitle>Recent Gifts</CardTitle>
              <Button
                variant="outline"
                size="sm"
                onClick={() => navigate("/gifts-received")}
              >
                View all
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            {recentGifts.length > 0 ? (
              <ul className="space-y-4">
                {recentGifts.map((gift) => (
                  <li
                    key={gift.id}
                    className="flex justify-between items-start pb-3 border-b last:border-0"
                  >
                    <div>
                      <p className="font-medium">{gift.name}</p>
                      <p className="text-sm text-muted-foreground">
                        From: {gift.from}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {new Date(gift.date).toLocaleDateString()}
                      </p>
                    </div>
                    <Badge
                      variant={
                        gift.status === "Thank you sent" ? "outline" : "default"
                      }
                    >
                      {gift.status}
                    </Badge>
                  </li>
                ))}
              </ul>
            ) : (
              <div className="text-center p-6">
                <Gift className="mx-auto h-10 w-10 text-muted-foreground/50 mb-3" />
                <h3 className="text-lg font-medium mb-1">No gifts yet</h3>
                <p className="text-sm text-muted-foreground mb-3">
                  Your received gifts will appear here
                </p>
                <Button onClick={() => navigate("/gifts-received")}>
                  Add a gift
                </Button>
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <div className="flex justify-between items-center">
              <CardTitle>Upcoming Events</CardTitle>
              <Button variant="outline" size="sm" onClick={handleAddEvent}>
                Add Event
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            {upcomingEvents.length > 0 ? (
              <ul className="space-y-4">
                {upcomingEvents.map((event) => (
                  <li
                    key={event.id}
                    className="flex justify-between items-start pb-3 border-b last:border-0"
                  >
                    <div>
                      <p className="font-medium">{event.name}</p>
                      <p className="text-xs text-muted-foreground">
                        {new Date(event.date).toLocaleDateString()}
                      </p>
                    </div>
                    <Badge
                      variant={event.daysLeft <= 7 ? "destructive" : "outline"}
                    >
                      {event.daysLeft} {event.daysLeft === 1 ? "day" : "days"}{" "}
                      left
                    </Badge>
                  </li>
                ))}
              </ul>
            ) : (
              <div className="text-center p-6">
                <Calendar className="mx-auto h-10 w-10 text-muted-foreground/50 mb-3" />
                <h3 className="text-lg font-medium mb-1">No events yet</h3>
                <p className="text-sm text-muted-foreground mb-3">
                  Track important dates and get reminders
                </p>
                <Button onClick={handleAddEvent}>Add an event</Button>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      <div className="mt-12 flex justify-center">
        <Button
          variant="outline"
          onClick={handleSetupNotifications}
          className="flex items-center gap-2"
        >
          <Bell className="h-4 w-4" />
          Configure Notification Settings
        </Button>
      </div>

      {isAddEventOpen && (
        <AddEventDialog
          isOpen={isAddEventOpen}
          onClose={() => setIsAddEventOpen(false)}
          onAddEvent={handleEventAdded}
        />
      )}

      {isNotificationsOpen && (
        <NotificationsDialog
          isOpen={isNotificationsOpen}
          onClose={() => setIsNotificationsOpen(false)}
        />
      )}
    </div>
  );
};

export default Dashboard;
