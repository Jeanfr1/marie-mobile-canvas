import {
  userApi,
  giftsApi,
  contactsApi,
  eventsApi,
  imagesApi,
  notificationsApi,
} from "../../lib/api-service";

// Mock AWS Amplify API
jest.mock("aws-amplify/api", () => ({
  get: jest.fn(),
  post: jest.fn(),
  put: jest.fn(),
  del: jest.fn(),
}));

// Import the mocked functions
import { get, post, put, del } from "aws-amplify/api";

describe("API Service", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("User API", () => {
    test("getCurrentUser calls API correctly", async () => {
      const mockUser = { userId: "123", name: "Test User" };
      (get as jest.Mock).mockResolvedValue(mockUser);

      const result = await userApi.getCurrentUser();

      expect(get).toHaveBeenCalledWith({
        apiName: "GiftTrackerAPI",
        path: "/users",
      });
      expect(result).toEqual(mockUser);
    });

    test("updateUser calls API correctly", async () => {
      const userData = { name: "Updated User" };
      (put as jest.Mock).mockResolvedValue({ success: true });

      const result = await userApi.updateUser(userData);

      expect(put).toHaveBeenCalledWith({
        apiName: "GiftTrackerAPI",
        path: "/users",
        options: {
          body: userData,
        },
      });
      expect(result).toEqual({ success: true });
    });
  });

  describe("Gifts API", () => {
    test("getGifts without parameters", async () => {
      const mockGifts = [{ giftId: "1", name: "Test Gift" }];
      (get as jest.Mock).mockResolvedValue(mockGifts);

      const result = await giftsApi.getGifts();

      expect(get).toHaveBeenCalledWith({
        apiName: "GiftTrackerAPI",
        path: "/gifts",
        options: {
          queryParams: undefined,
        },
      });
      expect(result).toEqual(mockGifts);
    });

    test("getGifts with parameters", async () => {
      const params = { type: "given", contactId: "123" };
      (get as jest.Mock).mockResolvedValue([]);

      const result = await giftsApi.getGifts(params);

      expect(get).toHaveBeenCalledWith({
        apiName: "GiftTrackerAPI",
        path: "/gifts",
        options: {
          queryParams: params,
        },
      });
      expect(result).toEqual([]);
    });

    test("createGift calls API correctly", async () => {
      const gift = {
        name: "Test Gift",
        description: "A test gift",
        date: "2024-01-01",
        contactId: "123",
        eventId: "456",
        tags: ["birthday"],
      };
      (post as jest.Mock).mockResolvedValue({ ...gift, giftId: "789" });

      const result = await giftsApi.createGift(gift);

      expect(post).toHaveBeenCalledWith({
        apiName: "GiftTrackerAPI",
        path: "/gifts",
        options: {
          body: gift,
        },
      });
      expect(result).toEqual({ ...gift, giftId: "789" });
    });

    test("updateGift calls API correctly", async () => {
      const giftId = "123";
      const giftUpdate = { name: "Updated Gift" };
      (put as jest.Mock).mockResolvedValue({ success: true });

      const result = await giftsApi.updateGift(giftId, giftUpdate);

      expect(put).toHaveBeenCalledWith({
        apiName: "GiftTrackerAPI",
        path: `/gifts/${giftId}`,
        options: {
          body: giftUpdate,
        },
      });
      expect(result).toEqual({ success: true });
    });

    test("deleteGift calls API correctly", async () => {
      const giftId = "123";
      (del as jest.Mock).mockResolvedValue({ success: true });

      const result = await giftsApi.deleteGift(giftId);

      expect(del).toHaveBeenCalledWith({
        apiName: "GiftTrackerAPI",
        path: `/gifts/${giftId}`,
      });
      expect(result).toEqual({ success: true });
    });
  });

  describe("Contacts API", () => {
    test("getContacts calls API correctly", async () => {
      const mockContacts = [{ contactId: "1", name: "Test Contact" }];
      (get as jest.Mock).mockResolvedValue(mockContacts);

      const result = await contactsApi.getContacts();

      expect(get).toHaveBeenCalledWith({
        apiName: "GiftTrackerAPI",
        path: "/contacts",
      });
      expect(result).toEqual(mockContacts);
    });

    test("createContact calls API correctly", async () => {
      const contact = {
        name: "New Contact",
        email: "test@example.com",
        relationship: "Friend",
        important_dates: [],
      };
      (post as jest.Mock).mockResolvedValue({ ...contact, contactId: "789" });

      const result = await contactsApi.createContact(contact);

      expect(post).toHaveBeenCalledWith({
        apiName: "GiftTrackerAPI",
        path: "/contacts",
        options: {
          body: contact,
        },
      });
      expect(result).toEqual({ ...contact, contactId: "789" });
    });

    test("updateContact calls API correctly", async () => {
      const contactId = "123";
      const contactUpdate = { name: "Updated Contact" };
      (put as jest.Mock).mockResolvedValue({ success: true });

      const result = await contactsApi.updateContact(contactId, contactUpdate);

      expect(put).toHaveBeenCalledWith({
        apiName: "GiftTrackerAPI",
        path: `/contacts/${contactId}`,
        options: {
          body: contactUpdate,
        },
      });
      expect(result).toEqual({ success: true });
    });

    test("deleteContact calls API correctly", async () => {
      const contactId = "123";
      (del as jest.Mock).mockResolvedValue({ success: true });

      const result = await contactsApi.deleteContact(contactId);

      expect(del).toHaveBeenCalledWith({
        apiName: "GiftTrackerAPI",
        path: `/contacts/${contactId}`,
      });
      expect(result).toEqual({ success: true });
    });
  });

  describe("Events API", () => {
    test("getEvents without parameters", async () => {
      const mockEvents = [{ eventId: "1", name: "Test Event" }];
      (get as jest.Mock).mockResolvedValue(mockEvents);

      const result = await eventsApi.getEvents();

      expect(get).toHaveBeenCalledWith({
        apiName: "GiftTrackerAPI",
        path: "/events",
        options: {
          queryParams: undefined,
        },
      });
      expect(result).toEqual(mockEvents);
    });

    test("getEvents with parameters", async () => {
      const params = { startDate: "2024-01-01", endDate: "2024-12-31" };
      (get as jest.Mock).mockResolvedValue([]);

      const result = await eventsApi.getEvents(params);

      expect(get).toHaveBeenCalledWith({
        apiName: "GiftTrackerAPI",
        path: "/events",
        options: {
          queryParams: params,
        },
      });
      expect(result).toEqual([]);
    });

    test("createEvent calls API correctly", async () => {
      const event = {
        name: "Test Event",
        date: "2024-06-01",
        type: "Birthday",
        contactIds: ["123"],
        notes: "Test event",
      };
      (post as jest.Mock).mockResolvedValue({ ...event, eventId: "789" });

      const result = await eventsApi.createEvent(event);

      expect(post).toHaveBeenCalledWith({
        apiName: "GiftTrackerAPI",
        path: "/events",
        options: {
          body: event,
        },
      });
      expect(result).toEqual({ ...event, eventId: "789" });
    });

    test("updateEvent calls API correctly", async () => {
      const eventId = "123";
      const eventUpdate = { name: "Updated Event" };
      (put as jest.Mock).mockResolvedValue({ success: true });

      const result = await eventsApi.updateEvent(eventId, eventUpdate);

      expect(put).toHaveBeenCalledWith({
        apiName: "GiftTrackerAPI",
        path: `/events/${eventId}`,
        options: {
          body: eventUpdate,
        },
      });
      expect(result).toEqual({ success: true });
    });

    test("deleteEvent calls API correctly", async () => {
      const eventId = "123";
      (del as jest.Mock).mockResolvedValue({ success: true });

      const result = await eventsApi.deleteEvent(eventId);

      expect(del).toHaveBeenCalledWith({
        apiName: "GiftTrackerAPI",
        path: `/events/${eventId}`,
      });
      expect(result).toEqual({ success: true });
    });
  });

  describe("Images API", () => {
    test("getUploadUrl calls API correctly", async () => {
      const contentType = "image/jpeg";
      const filename = "test.jpg";
      const mockResponse = {
        uploadUrl: "https://s3.amazonaws.com/upload-url",
        imageUrl: "https://s3.amazonaws.com/image-url",
      };
      (post as jest.Mock).mockResolvedValue(mockResponse);

      const result = await imagesApi.getUploadUrl(contentType, filename);

      expect(post).toHaveBeenCalledWith({
        apiName: "GiftTrackerAPI",
        path: "/images/upload-url",
        options: {
          body: { contentType, filename },
        },
      });
      expect(result).toEqual(mockResponse);
    });
  });

  describe("Notifications API", () => {
    test("getNotifications calls API correctly", async () => {
      const mockNotifications = [
        {
          notificationId: "1",
          type: "birthday_reminder",
          message: "Birthday reminder",
          contactId: "123",
          eventId: "456",
          createdAt: "2024-01-01T00:00:00Z",
          read: false,
        },
      ];
      (get as jest.Mock).mockResolvedValue(mockNotifications);

      const result = await notificationsApi.getNotifications();

      expect(get).toHaveBeenCalledWith({
        apiName: "GiftTrackerAPI",
        path: "/notifications",
      });
      expect(result).toEqual(mockNotifications);
    });
  });
});
