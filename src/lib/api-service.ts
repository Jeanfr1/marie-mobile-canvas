import { API } from "aws-amplify";

const apiName = "GiftTrackerAPI";

export interface Gift {
  giftId: string;
  name: string;
  description: string;
  type: "given" | "received";
  date: string;
  contactId: string;
  eventId: string;
  imageUrl?: string;
  tags: string[];
  notes?: string;
}

export interface Contact {
  contactId: string;
  name: string;
  email?: string;
  relationship?: string;
  notes?: string;
  important_dates: Array<{
    date: string;
    occasion: string;
  }>;
}

export interface Event {
  eventId: string;
  name: string;
  date: string;
  type: string;
  contactIds: string[];
  notes?: string;
  reminder?: {
    enabled: boolean;
    daysBeforeEvent: number;
  };
}

export interface User {
  userId: string;
  name: string;
  email: string;
  preferences: {
    notifications: boolean;
    theme: string;
  };
}

// User endpoints
export const userApi = {
  getCurrentUser: () => API.get(apiName, "/users", {}),
  updateUser: (userData: Partial<User>) =>
    API.put(apiName, "/users", { body: userData }),
};

// Gifts endpoints
export const giftsApi = {
  getGifts: (params?: {
    type?: "given" | "received";
    contactId?: string;
    eventId?: string;
  }) => API.get(apiName, "/gifts", { queryStringParameters: params }),
  createGift: (gift: Omit<Gift, "giftId">) =>
    API.post(apiName, "/gifts", { body: gift }),
  updateGift: (giftId: string, gift: Partial<Gift>) =>
    API.put(apiName, `/gifts/${giftId}`, { body: gift }),
  deleteGift: (giftId: string) => API.del(apiName, `/gifts/${giftId}`, {}),
};

// Contacts endpoints
export const contactsApi = {
  getContacts: () => API.get(apiName, "/contacts", {}),
  createContact: (contact: Omit<Contact, "contactId">) =>
    API.post(apiName, "/contacts", { body: contact }),
  updateContact: (contactId: string, contact: Partial<Contact>) =>
    API.put(apiName, `/contacts/${contactId}`, { body: contact }),
  deleteContact: (contactId: string) =>
    API.del(apiName, `/contacts/${contactId}`, {}),
};

// Events endpoints
export const eventsApi = {
  getEvents: (params?: { startDate?: string; endDate?: string }) =>
    API.get(apiName, "/events", { queryStringParameters: params }),
  createEvent: (event: Omit<Event, "eventId">) =>
    API.post(apiName, "/events", { body: event }),
  updateEvent: (eventId: string, event: Partial<Event>) =>
    API.put(apiName, `/events/${eventId}`, { body: event }),
  deleteEvent: (eventId: string) => API.del(apiName, `/events/${eventId}`, {}),
};

// Image upload endpoints
export const imagesApi = {
  getUploadUrl: (contentType: string, filename: string) =>
    API.post(apiName, "/images/upload-url", {
      body: { contentType, filename },
    }),
};

// Notifications endpoints
export const notificationsApi = {
  getNotifications: () => API.get(apiName, "/notifications", {}),
};
