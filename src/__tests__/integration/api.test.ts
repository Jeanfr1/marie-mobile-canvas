import { API } from "aws-amplify";
import {
  giftsApi,
  contactsApi,
  eventsApi,
  userApi,
  notificationsApi,
} from "../../lib/api-service";

// Mock AWS Amplify API
jest.mock("aws-amplify");

describe("API Integration Tests", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("Gifts API", () => {
    test("getGifts", async () => {
      const mockGifts = [
        {
          giftId: "1",
          name: "Test Gift",
          description: "Test Description",
          type: "given",
          date: "2024-03-20",
          contactId: "123",
          eventId: "456",
          tags: ["birthday", "special"],
        },
      ];

      (API.get as jest.Mock).mockResolvedValueOnce(mockGifts);

      const result = await giftsApi.getGifts();
      expect(result).toEqual(mockGifts);
      expect(API.get).toHaveBeenCalledWith("GiftTrackerAPI", "/gifts", {
        queryStringParameters: undefined,
      });
    });

    test("createGift", async () => {
      const newGift = {
        name: "New Gift",
        description: "New Description",
        type: "received",
        date: "2024-03-21",
        contactId: "789",
        eventId: "012",
        tags: ["christmas"],
      };

      const mockResponse = { ...newGift, giftId: "2" };
      (API.post as jest.Mock).mockResolvedValueOnce(mockResponse);

      const result = await giftsApi.createGift(newGift);
      expect(result).toEqual(mockResponse);
      expect(API.post).toHaveBeenCalledWith("GiftTrackerAPI", "/gifts", {
        body: newGift,
      });
    });
  });

  describe("Contacts API", () => {
    test("getContacts", async () => {
      const mockContacts = [
        {
          contactId: "123",
          name: "John Doe",
          email: "john@example.com",
          relationship: "Friend",
          important_dates: [{ date: "2024-05-15", occasion: "Birthday" }],
        },
      ];

      (API.get as jest.Mock).mockResolvedValueOnce(mockContacts);

      const result = await contactsApi.getContacts();
      expect(result).toEqual(mockContacts);
      expect(API.get).toHaveBeenCalledWith("GiftTrackerAPI", "/contacts", {});
    });
  });

  describe("Events API", () => {
    test("getEvents", async () => {
      const mockEvents = [
        {
          eventId: "456",
          name: "Birthday Party",
          date: "2024-05-15",
          type: "Birthday",
          contactIds: ["123"],
          notes: "Special celebration",
        },
      ];

      (API.get as jest.Mock).mockResolvedValueOnce(mockEvents);

      const result = await eventsApi.getEvents();
      expect(result).toEqual(mockEvents);
      expect(API.get).toHaveBeenCalledWith("GiftTrackerAPI", "/events", {
        queryStringParameters: undefined,
      });
    });
  });

  describe("User API", () => {
    test("getCurrentUser", async () => {
      const mockUser = {
        userId: "user123",
        name: "Test User",
        email: "test@example.com",
        preferences: {
          notifications: true,
          theme: "light",
        },
      };

      (API.get as jest.Mock).mockResolvedValueOnce(mockUser);

      const result = await userApi.getCurrentUser();
      expect(result).toEqual(mockUser);
      expect(API.get).toHaveBeenCalledWith("GiftTrackerAPI", "/users", {});
    });
  });

  describe("Notifications API", () => {
    test("getNotifications", async () => {
      const mockNotifications = [
        {
          notificationId: "notif1",
          userId: "user123",
          message: "Event coming up!",
          eventId: "event456",
          createdAt: "2024-05-01T12:00:00Z",
          read: false,
        },
      ];

      (API.get as jest.Mock).mockResolvedValueOnce(mockNotifications);

      const result = await notificationsApi.getNotifications();
      expect(result).toEqual(mockNotifications);
      expect(API.get).toHaveBeenCalledWith(
        "GiftTrackerAPI",
        "/notifications",
        {}
      );
    });
  });

  describe("Error Handling", () => {
    test("handles API errors gracefully", async () => {
      const errorMessage = "Network Error";
      (API.get as jest.Mock).mockRejectedValueOnce(new Error(errorMessage));

      await expect(giftsApi.getGifts()).rejects.toThrow(errorMessage);
    });
  });
});
