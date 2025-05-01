
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Gift, Users, Calendar, Bell, Eye, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { AddEventDialog } from "@/components/events/AddEventDialog";
import { NotificationsDialog } from "@/components/notifications/NotificationsDialog";

const Dashboard = () => {
  const navigate = useNavigate();
  const [isAddEventOpen, setIsAddEventOpen] = useState(false);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);

  // Mock data for the dashboard
  const stats = {
    giftsReceived: 24,
    giftsGiven: 18,
    contacts: 42,
    upcomingEvents: 3
  };

  const recentGifts = [
    { id: 1, name: "Birthday Present", from: "Sarah", date: "2025-04-15", status: "Thank you sent" },
    { id: 2, name: "Anniversary Gift", from: "Michael", date: "2025-04-10", status: "Pending" },
    { id: 3, name: "Housewarming Gift", from: "Lisa", date: "2025-04-05", status: "Thank you sent" }
  ];

  const upcomingEvents = [
    { id: 1, name: "Mom's Birthday", date: "2025-05-10", daysLeft: 14 },
    { id: 2, name: "Wedding Anniversary", date: "2025-06-15", daysLeft: 50 },
    { id: 3, name: "Friend's Graduation", date: "2025-05-25", daysLeft: 29 }
  ];
  
  const handleViewAllGifts = () => {
    navigate("/gifts-received");
  };
  
  const handleAddEvent = () => {
    setIsAddEventOpen(true);
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
      <AddEventDialog open={isAddEventOpen} onOpenChange={setIsAddEventOpen} />
      <NotificationsDialog open={isNotificationsOpen} onOpenChange={setIsNotificationsOpen} />
    </div>
  );
};

export default Dashboard;
