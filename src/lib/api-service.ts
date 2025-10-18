import { get, post, put, del } from "aws-amplify/api";

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
  getCurrentUser: () => get({ apiName, path: "/users" }),
  updateUser: (userData: Partial<User>) =>
    put({ apiName, path: "/users", options: { body: userData } }),
};

// Gifts endpoints
export const giftsApi = {
  getGifts: (params?: {
    type?: "given" | "received";
    contactId?: string;
    eventId?: string;
  }) =>
    get({
      apiName,
      path: "/gifts",
      options: { queryParams: params },
    }),
  createGift: (gift: Omit<Gift, "giftId">) =>
    post({ apiName, path: "/gifts", options: { body: gift } }),
  updateGift: (giftId: string, gift: Partial<Gift>) =>
    put({ apiName, path: `/gifts/${giftId}`, options: { body: gift } }),
  deleteGift: (giftId: string) => del({ apiName, path: `/gifts/${giftId}` }),
};

// Contacts endpoints
export const contactsApi = {
  getContacts: () => get({ apiName, path: "/contacts" }),
  createContact: (contact: Omit<Contact, "contactId">) =>
    post({ apiName, path: "/contacts", options: { body: contact } }),
  updateContact: (contactId: string, contact: Partial<Contact>) =>
    put({
      apiName,
      path: `/contacts/${contactId}`,
      options: { body: contact },
    }),
  deleteContact: (contactId: string) =>
    del({ apiName, path: `/contacts/${contactId}` }),
};

// Events endpoints
export const eventsApi = {
  getEvents: (params?: { startDate?: string; endDate?: string }) =>
    get({
      apiName,
      path: "/events",
      options: { queryParams: params },
    }),
  createEvent: (event: Omit<Event, "eventId">) =>
    post({ apiName, path: "/events", options: { body: event } }),
  updateEvent: (eventId: string, event: Partial<Event>) =>
    put({ apiName, path: `/events/${eventId}`, options: { body: event } }),
  deleteEvent: (eventId: string) =>
    del({ apiName, path: `/events/${eventId}` }),
};

// Image upload endpoints
export const imagesApi = {
  getUploadUrl: (contentType: string, filename: string) =>
    post({
      apiName,
      path: "/images/upload-url",
      options: {
        body: { contentType, filename },
      },
    }),
};

// Notifications endpoints
export const notificationsApi = {
  getNotifications: () => get({ apiName, path: "/notifications" }),
};
