import { giftsApi, contactsApi, eventsApi } from "../../lib/api-service";

// Mock AWS Amplify API
jest.mock("aws-amplify/api", () => ({
  get: jest.fn(),
  post: jest.fn(),
  put: jest.fn(),
  del: jest.fn(),
}));

// Import the mocked functions
import { get, post, put, del } from "aws-amplify/api";

describe("API Service Integration Tests", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("Gifts API Integration", () => {
    test("fetches gifts successfully", async () => {
      const mockGifts = [
        {
          giftId: "1",
          name: "Birthday Gift",
          description: "A special gift",
          type: "given" as const,
          date: "2024-05-15",
          contactId: "contact1",
          eventId: "event1",
          tags: ["birthday"],
        },
      ];
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

    test("fetches gifts with filters", async () => {
      const filters = { type: "received", contactId: "contact1" };
      (get as jest.Mock).mockResolvedValue([]);

      const result = await giftsApi.getGifts(filters);

      expect(get).toHaveBeenCalledWith({
        apiName: "GiftTrackerAPI",
        path: "/gifts",
        options: {
          queryParams: filters,
        },
      });
      expect(result).toEqual([]);
    });

    test("creates gift successfully", async () => {
      const newGift = {
        name: "Anniversary Gift",
        description: "A romantic gift",
        type: "given" as const,
        date: "2024-06-01",
        contactId: "contact1",
        eventId: "event1",
        tags: ["anniversary"],
      };
      const createdGift = { ...newGift, giftId: "2" };
      (post as jest.Mock).mockResolvedValue(createdGift);

      const result = await giftsApi.createGift(newGift);

      expect(post).toHaveBeenCalledWith({
        apiName: "GiftTrackerAPI",
        path: "/gifts",
        options: {
          body: newGift,
        },
      });
      expect(result).toEqual(createdGift);
    });

    test("updates gift successfully", async () => {
      const giftId = "1";
      const updateData = { name: "Updated Gift" };
      (put as jest.Mock).mockResolvedValue({ success: true });

      const result = await giftsApi.updateGift(giftId, updateData);

      expect(put).toHaveBeenCalledWith({
        apiName: "GiftTrackerAPI",
        path: `/gifts/${giftId}`,
        options: {
          body: updateData,
        },
      });
      expect(result).toEqual({ success: true });
    });

    test("deletes gift successfully", async () => {
      const giftId = "1";
      (del as jest.Mock).mockResolvedValue({ success: true });

      const result = await giftsApi.deleteGift(giftId);

      expect(del).toHaveBeenCalledWith({
        apiName: "GiftTrackerAPI",
        path: `/gifts/${giftId}`,
      });
      expect(result).toEqual({ success: true });
    });
  });

  describe("Contacts API Integration", () => {
    test("fetches contacts successfully", async () => {
      const mockContacts = [
        {
          contactId: "1",
          name: "John Doe",
          email: "john@example.com",
          relationship: "Friend",
          important_dates: [{ date: "2024-05-15", occasion: "Birthday" }],
        },
      ];
      (get as jest.Mock).mockResolvedValue(mockContacts);

      const result = await contactsApi.getContacts();

      expect(get).toHaveBeenCalledWith({
        apiName: "GiftTrackerAPI",
        path: "/contacts",
      });
      expect(result).toEqual(mockContacts);
    });

    test("creates contact successfully", async () => {
      const newContact = {
        name: "Jane Smith",
        email: "jane@example.com",
        relationship: "Family",
        important_dates: [],
      };
      const createdContact = { ...newContact, contactId: "2" };
      (post as jest.Mock).mockResolvedValue(createdContact);

      const result = await contactsApi.createContact(newContact);

      expect(post).toHaveBeenCalledWith({
        apiName: "GiftTrackerAPI",
        path: "/contacts",
        options: {
          body: newContact,
        },
      });
      expect(result).toEqual(createdContact);
    });
  });

  describe("Events API Integration", () => {
    test("fetches events successfully", async () => {
      const mockEvents = [
        {
          eventId: "1",
          name: "John's Birthday",
          date: "2024-05-15",
          type: "Birthday",
          contactIds: ["contact1"],
          notes: "Special celebration",
        },
      ];
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

    test("fetches events with date range", async () => {
      const dateRange = { startDate: "2024-01-01", endDate: "2024-12-31" };
      (get as jest.Mock).mockResolvedValue([]);

      const result = await eventsApi.getEvents(dateRange);

      expect(get).toHaveBeenCalledWith({
        apiName: "GiftTrackerAPI",
        path: "/events",
        options: {
          queryParams: dateRange,
        },
      });
      expect(result).toEqual([]);
    });

    test("creates event successfully", async () => {
      const newEvent = {
        name: "Anniversary Party",
        date: "2024-06-01",
        type: "Anniversary",
        contactIds: ["contact1"],
        notes: "Wedding anniversary",
      };
      const createdEvent = { ...newEvent, eventId: "2" };
      (post as jest.Mock).mockResolvedValue(createdEvent);

      const result = await eventsApi.createEvent(newEvent);

      expect(post).toHaveBeenCalledWith({
        apiName: "GiftTrackerAPI",
        path: "/events",
        options: {
          body: newEvent,
        },
      });
      expect(result).toEqual(createdEvent);
    });
  });

  describe("Error Handling", () => {
    test("handles API errors gracefully", async () => {
      const error = new Error("Network Error");
      (get as jest.Mock).mockRejectedValue(error);

      await expect(giftsApi.getGifts()).rejects.toThrow("Network Error");
    });

    test("handles server errors", async () => {
      const error = new Error("Server Error");
      error.response = {
        status: 500,
        data: { message: "Internal Server Error" },
      };
      (post as jest.Mock).mockRejectedValue(error);

      await expect(
        giftsApi.createGift({
          name: "Test Gift",
          description: "Test",
          type: "given",
          date: "2024-01-01",
          contactId: "1",
          eventId: "1",
          tags: [],
        })
      ).rejects.toThrow("Server Error");
    });
  });

  describe("API Consistency", () => {
    test("all APIs use consistent naming", () => {
      expect(giftsApi).toHaveProperty("getGifts");
      expect(giftsApi).toHaveProperty("createGift");
      expect(giftsApi).toHaveProperty("updateGift");
      expect(giftsApi).toHaveProperty("deleteGift");

      expect(contactsApi).toHaveProperty("getContacts");
      expect(contactsApi).toHaveProperty("createContact");
      expect(contactsApi).toHaveProperty("updateContact");
      expect(contactsApi).toHaveProperty("deleteContact");

      expect(eventsApi).toHaveProperty("getEvents");
      expect(eventsApi).toHaveProperty("createEvent");
      expect(eventsApi).toHaveProperty("updateEvent");
      expect(eventsApi).toHaveProperty("deleteEvent");
    });

    test("all APIs use consistent API name", async () => {
      (get as jest.Mock).mockResolvedValue([]);

      await giftsApi.getGifts();
      await contactsApi.getContacts();
      await eventsApi.getEvents();

      expect(get).toHaveBeenCalledTimes(3);
      expect(get).toHaveBeenCalledWith({
        apiName: "GiftTrackerAPI",
        path: "/gifts",
        options: {
          queryParams: undefined,
        },
      });
      expect(get).toHaveBeenCalledWith({
        apiName: "GiftTrackerAPI",
        path: "/contacts",
      });
      expect(get).toHaveBeenCalledWith({
        apiName: "GiftTrackerAPI",
        path: "/events",
        options: {
          queryParams: undefined,
        },
      });
    });
  });
});
