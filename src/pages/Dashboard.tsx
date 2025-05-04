import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Gift,
  Users,
  Calendar,
  Bell,
  Eye,
  Plus,
  Sparkles,
  Cake,
} from "lucide-react";
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
import { BirthdayGiftPrompt } from "@/components/gifts/BirthdayGiftPrompt";
import { differenceInDays, addYears, parseISO } from "date-fns";

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

interface Contact {
  id: number;
  name: string;
  relationship: string;
  giftsReceived: number;
  giftsGiven: number;
  upcoming: string | null;
  interests: string[];
  birthday?: string;
}

const Dashboard = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [isAddEventOpen, setIsAddEventOpen] = useState(false);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const [isBirthdayPromptOpen, setIsBirthdayPromptOpen] = useState(false);
  const [contactWithBirthday, setContactWithBirthday] =
    useState<Contact | null>(null);

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

  // Add a new useEffect to check for upcoming birthdays
  useEffect(() => {
    if (!user) return;

    const checkForUpcomingBirthdays = () => {
      const userId = user.username;
      const userDataKey = `userData_${userId}`;
      const userData = JSON.parse(localStorage.getItem(userDataKey) || "{}");
      const contacts = userData.contacts || [];

      // Get contacts with birthdays
      const contactsWithBirthdays = contacts.filter(
        (contact: Contact) => contact.birthday
      );

      if (contactsWithBirthdays.length === 0) return;

      const today = new Date();

      // Find contacts with birthdays in the next 14 days
      const upcomingBirthdays = contactsWithBirthdays
        .map((contact: Contact) => {
          const birthDate = parseISO(contact.birthday);

          // Get this year's birthday
          const thisYearBirthday = new Date(
            today.getFullYear(),
            birthDate.getMonth(),
            birthDate.getDate()
          );

          // If birthday has passed this year, calculate for next year
          const targetBirthday =
            thisYearBirthday < today
              ? addYears(thisYearBirthday, 1)
              : thisYearBirthday;

          const daysUntilBirthday = differenceInDays(targetBirthday, today);

          return {
            ...contact,
            daysUntilBirthday,
          };
        })
        .filter(
          (contact: any) =>
            contact.daysUntilBirthday <= 14 && contact.daysUntilBirthday >= 0
        )
        .sort((a: any, b: any) => a.daysUntilBirthday - b.daysUntilBirthday);

      // If we have upcoming birthdays, show the first one
      if (upcomingBirthdays.length > 0) {
        // Check if we've already shown this birthday notification
        const notifiedBirthdays = JSON.parse(
          localStorage.getItem(`${userDataKey}_notifiedBirthdays`) || "[]"
        );

        // Find the first birthday that hasn't been notified about
        const birthdayToNotify = upcomingBirthdays.find(
          (contact: any) =>
            !notifiedBirthdays.includes(`${contact.id}_${today.getFullYear()}`)
        );

        if (birthdayToNotify) {
          setContactWithBirthday(birthdayToNotify);
          setIsBirthdayPromptOpen(true);

          // Mark this birthday as notified for this year
          notifiedBirthdays.push(
            `${birthdayToNotify.id}_${today.getFullYear()}`
          );
          localStorage.setItem(
            `${userDataKey}_notifiedBirthdays`,
            JSON.stringify(notifiedBirthdays)
          );
        }
      }
    };

    // Check for birthdays on component mount
    checkForUpcomingBirthdays();

    // Also set up a daily check
    const checkInterval = setInterval(
      checkForUpcomingBirthdays,
      24 * 60 * 60 * 1000
    );

    return () => {
      clearInterval(checkInterval);
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

  // Add upcoming birthdays to dashboard cards
  const renderUpcomingBirthdays = () => {
    if (!user) return null;

    const userId = user.username;
    const userDataKey = `userData_${userId}`;
    const userData = JSON.parse(localStorage.getItem(userDataKey) || "{}");
    const contacts = userData.contacts || [];

    // Get contacts with birthdays
    const contactsWithBirthdays = contacts.filter(
      (contact: Contact) => contact.birthday
    );

    if (contactsWithBirthdays.length === 0) return null;

    const today = new Date();

    // Find contacts with birthdays in the next 30 days
    const upcomingBirthdays = contactsWithBirthdays
      .map((contact: Contact) => {
        const birthDate = parseISO(contact.birthday);

        // Get this year's birthday
        const thisYearBirthday = new Date(
          today.getFullYear(),
          birthDate.getMonth(),
          birthDate.getDate()
        );

        // If birthday has passed this year, calculate for next year
        const targetBirthday =
          thisYearBirthday < today
            ? addYears(thisYearBirthday, 1)
            : thisYearBirthday;

        const daysUntilBirthday = differenceInDays(targetBirthday, today);

        return {
          ...contact,
          daysUntilBirthday,
        };
      })
      .filter(
        (contact: any) =>
          contact.daysUntilBirthday <= 30 && contact.daysUntilBirthday >= 0
      )
      .sort((a: any, b: any) => a.daysUntilBirthday - b.daysUntilBirthday)
      .slice(0, 3); // Show max 3 upcoming birthdays

    if (upcomingBirthdays.length === 0) return null;

    return (
      <Card className="col-span-1 md:col-span-2 lg:col-span-4 hover:shadow-md transition-shadow duration-300">
        <CardHeader className="pb-2">
          <div className="flex justify-between items-center">
            <CardTitle className="text-lg font-medium">
              Anniversaires à venir
            </CardTitle>
            <Cake className="h-5 w-5 text-pink-500" />
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {upcomingBirthdays.map((contact: any) => (
              <div
                key={contact.id}
                className="flex items-center justify-between border-b pb-2"
              >
                <div>
                  <div className="font-medium">{contact.name}</div>
                  <div className="text-sm text-muted-foreground">
                    {contact.daysUntilBirthday === 0
                      ? "Aujourd'hui !"
                      : contact.daysUntilBirthday === 1
                      ? "Demain"
                      : `Dans ${contact.daysUntilBirthday} jours`}
                  </div>
                </div>
                <Button
                  size="sm"
                  onClick={() => {
                    setContactWithBirthday(contact);
                    setIsBirthdayPromptOpen(true);
                  }}
                  className="gap-1"
                >
                  <Gift className="h-4 w-4" />
                  Offrir un cadeau
                </Button>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  };

  if (isNewUser) {
    return (
      <div className="space-y-8">
        <section className="text-center py-10">
          <div className="max-w-3xl mx-auto space-y-6">
            <h1 className="text-4xl font-bold tracking-tight text-gray-900 sm:text-5xl bg-clip-text text-transparent bg-gradient-to-r from-primary to-secondary">
              Bienvenue sur Gift Tracker
            </h1>
            <p className="text-xl text-muted-foreground">
              Commençons à suivre vos cadeaux, contacts et dates importantes
            </p>
          </div>
        </section>

        <ContextualHelp
          title="Premiers pas"
          description="Bienvenue sur Gift Tracker ! Voici comment commencer :"
          steps={[
            "Ajoutez les cadeaux que vous avez reçus pour les suivre",
            "Créez votre liste de contacts avec vos amis et votre famille",
            "Configurez des rappels d'événements pour les dates importantes",
            "Explorez toutes les fonctionnalités pour gérer votre expérience d'offre de cadeaux",
          ]}
          helpKey="dashboard_new_user"
          forceShow={true}
        />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <EmptyState
            title="Suivez vos cadeaux"
            description="Commencez par ajouter les cadeaux que vous avez reçus ou donnés pour les suivre"
            icon={Gift}
            actionLabel="Ajouter votre premier cadeau"
            onAction={handleAddGift}
          />

          <EmptyState
            title="Ajoutez vos contacts"
            description="Ajoutez des personnes à votre liste de contacts pour vous souvenir de leurs préférences"
            icon={Users}
            actionLabel="Ajouter votre premier contact"
            onAction={handleAddContact}
          />

          <EmptyState
            title="Configurez des rappels"
            description="Ne manquez jamais une date importante en ajoutant des événements et des rappels"
            icon={Calendar}
            actionLabel="Ajouter votre premier événement"
            onAction={handleAddEvent}
          />

          <EmptyState
            title="Démarrer avec Gift Tracker"
            description="Découvrez toutes les fonctionnalités pour gérer votre expérience d'offre de cadeaux"
            icon={Sparkles}
            actionLabel="Voir les idées de cadeaux"
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
            Tableau de bord des cadeaux
          </h1>
          <p className="text-xl text-muted-foreground">
            Suivez vos cadeaux, gérez vos contacts et ne manquez jamais une date
            importante
          </p>
        </div>
      </section>

      {stats.giftsReceived === 0 && stats.giftsGiven === 0 && (
        <ContextualHelp
          title="Ajoutez votre premier cadeau"
          description="Vous n'avez pas encore ajouté de cadeaux. Commencez à suivre les cadeaux en cliquant sur ces cartes."
          helpKey="dashboard_empty_gifts"
          forceShow={true}
        />
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="hover:shadow-md transition-shadow duration-300">
          <CardHeader className="pb-2">
            <div className="flex justify-between items-center">
              <CardTitle className="text-lg font-medium">
                Cadeaux reçus
              </CardTitle>
              <Gift className="h-5 w-5 text-primary" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{stats.giftsReceived}</div>
            <p className="text-sm text-muted-foreground">
              Cadeaux que vous avez reçus
            </p>
            <Button
              variant="link"
              className="px-0 mt-2"
              onClick={handleViewAllGifts}
            >
              Voir tout
              <Eye className="h-4 w-4 ml-1" />
            </Button>
          </CardContent>
        </Card>

        <Card className="hover:shadow-md transition-shadow duration-300">
          <CardHeader className="pb-2">
            <div className="flex justify-between items-center">
              <CardTitle className="text-lg font-medium">
                Cadeaux offerts
              </CardTitle>
              <Gift className="h-5 w-5 text-primary" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{stats.giftsGiven}</div>
            <p className="text-sm text-muted-foreground">
              Cadeaux que vous avez offerts
            </p>
            <Button
              variant="link"
              className="px-0 mt-2"
              onClick={() => navigate("/gifts-given")}
            >
              Voir tout
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
            <p className="text-sm text-muted-foreground">
              Personnes que vous suivez
            </p>
            <Button
              variant="link"
              className="px-0 mt-2"
              onClick={() => navigate("/contacts")}
            >
              Gérer les contacts
              <Eye className="h-4 w-4 ml-1" />
            </Button>
          </CardContent>
        </Card>

        <Card className="hover:shadow-md transition-shadow duration-300">
          <CardHeader className="pb-2">
            <div className="flex justify-between items-center">
              <CardTitle className="text-lg font-medium">
                Événements à venir
              </CardTitle>
              <Calendar className="h-5 w-5 text-primary" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{stats.upcomingEvents}</div>
            <p className="text-sm text-muted-foreground">
              Événements dans votre calendrier
            </p>
            <Button
              variant="link"
              className="px-0 mt-2"
              onClick={handleAddEvent}
            >
              Ajouter un événement
              <Plus className="h-4 w-4 ml-1" />
            </Button>
          </CardContent>
        </Card>

        {renderUpcomingBirthdays()}
      </div>

      {stats.upcomingEvents === 0 && (
        <ContextualHelp
          title="Ajouter des dates importantes"
          description="Ajoutez des anniversaires, des célébrations et d'autres dates importantes pour recevoir des rappels."
          steps={[
            "Cliquez sur 'Ajouter un événement' pour créer un nouveau rappel",
            "Entrez les détails et la date de l'événement",
            "Vous verrez les événements à venir ici et serez notifié avant leur arrivée",
          ]}
          helpKey="dashboard_empty_events"
          showDelay={2000}
        />
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <div className="flex justify-between items-center">
              <CardTitle>Cadeaux récents</CardTitle>
              <Button
                variant="outline"
                size="sm"
                onClick={() => navigate("/gifts-received")}
              >
                Voir tout
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
                        De: {gift.from}
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
                      {gift.status === "Thank you sent"
                        ? "Remercié"
                        : "En attente"}
                    </Badge>
                  </li>
                ))}
              </ul>
            ) : (
              <div className="text-center p-6">
                <Gift className="mx-auto h-10 w-10 text-muted-foreground/50 mb-3" />
                <h3 className="text-lg font-medium mb-1">
                  Pas encore de cadeaux
                </h3>
                <p className="text-sm text-muted-foreground mb-3">
                  Vos cadeaux reçus apparaîtront ici
                </p>
                <Button onClick={() => navigate("/gifts-received")}>
                  Ajouter un cadeau
                </Button>
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <div className="flex justify-between items-center">
              <CardTitle>Événements à venir</CardTitle>
              <Button variant="outline" size="sm" onClick={handleAddEvent}>
                Ajouter un événement
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
                      {event.daysLeft} {event.daysLeft === 1 ? "jour" : "jours"}{" "}
                      restant
                    </Badge>
                  </li>
                ))}
              </ul>
            ) : (
              <div className="text-center p-6">
                <Calendar className="mx-auto h-10 w-10 text-muted-foreground/50 mb-3" />
                <h3 className="text-lg font-medium mb-1">
                  Pas encore d'événements
                </h3>
                <p className="text-sm text-muted-foreground mb-3">
                  Suivez les dates importantes et recevez des rappels
                </p>
                <Button onClick={handleAddEvent}>Ajouter un événement</Button>
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
          Configurer les paramètres de notification
        </Button>
      </div>

      {isAddEventOpen && (
        <AddEventDialog
          open={isAddEventOpen}
          onOpenChange={(open) => setIsAddEventOpen(open)}
          onEventAdded={handleEventAdded}
        />
      )}

      {isNotificationsOpen && (
        <NotificationsDialog
          open={isNotificationsOpen}
          onOpenChange={(open) => setIsNotificationsOpen(open)}
        />
      )}

      {contactWithBirthday && (
        <BirthdayGiftPrompt
          isOpen={isBirthdayPromptOpen}
          onClose={() => setIsBirthdayPromptOpen(false)}
          contact={contactWithBirthday}
        />
      )}
    </div>
  );
};

export default Dashboard;
