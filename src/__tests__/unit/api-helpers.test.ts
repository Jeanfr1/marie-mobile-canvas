import { apiCall, useApi } from "../../lib/api-helpers";

// Mock AWS Amplify API
jest.mock("aws-amplify/api", () => ({
  get: jest.fn(),
  post: jest.fn(),
  put: jest.fn(),
  del: jest.fn(),
}));

// Import the mocked functions
import { get, post, put, del } from "aws-amplify/api";

// Mock auth context
jest.mock("../../lib/auth-context", () => ({
  useAuth: () => ({
    user: { userId: "test-user" },
    isAuthenticated: true,
  }),
}));

describe("API Helpers", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("apiCall function", () => {
    test("makes GET request successfully", async () => {
      const mockResponse = { data: "test data" };
      (get as jest.Mock).mockResolvedValue(mockResponse);

      const result = await apiCall("/test", "GET");

      expect(get).toHaveBeenCalledWith({
        apiName: "GiftTrackerAPI",
        path: "/test",
        options: {
          headers: {
            "Content-Type": "application/json",
          },
        },
      });
      expect(result).toEqual(mockResponse);
    });

    test("makes POST request with body", async () => {
      const mockResponse = { success: true };
      (post as jest.Mock).mockResolvedValue(mockResponse);

      const body = { name: "test" };
      const result = await apiCall("/test", "POST", { body });

      expect(post).toHaveBeenCalledWith({
        apiName: "GiftTrackerAPI",
        path: "/test",
        options: {
          body: {
            name: "test",
          },
          headers: {
            "Content-Type": "application/json",
          },
        },
      });
      expect(result).toEqual(mockResponse);
    });

    test("makes PUT request with body", async () => {
      const mockResponse = { updated: true };
      (put as jest.Mock).mockResolvedValue(mockResponse);

      const body = { id: "123", name: "updated" };
      const result = await apiCall("/test/123", "PUT", { body });

      expect(put).toHaveBeenCalledWith({
        apiName: "GiftTrackerAPI",
        path: "/test/123",
        options: {
          body: {
            id: "123",
            name: "updated",
          },
          headers: {
            "Content-Type": "application/json",
          },
        },
      });
      expect(result).toEqual(mockResponse);
    });

    test("makes DELETE request", async () => {
      const mockResponse = { deleted: true };
      (del as jest.Mock).mockResolvedValue(mockResponse);

      const result = await apiCall("/test/123", "DELETE");

      expect(del).toHaveBeenCalledWith({
        apiName: "GiftTrackerAPI",
        path: "/test/123",
        options: {
          headers: {
            "Content-Type": "application/json",
          },
        },
      });
      expect(result).toEqual(mockResponse);
    });

    test("handles query parameters", async () => {
      (get as jest.Mock).mockResolvedValue({ data: [] });

      const queryParams = { page: "1", limit: "10" };
      await apiCall("/test", "GET", { queryParams });

      expect(get).toHaveBeenCalledWith({
        apiName: "GiftTrackerAPI",
        path: "/test",
        options: {
          headers: {
            "Content-Type": "application/json",
          },
          queryStringParameters: {
            page: "1",
            limit: "10",
          },
        },
      });
    });

    test("handles custom headers", async () => {
      (get as jest.Mock).mockResolvedValue({ data: [] });

      const headers = { "Content-Type": "application/json" };
      await apiCall("/test", "GET", { headers });

      expect(get).toHaveBeenCalledWith({
        apiName: "GiftTrackerAPI",
        path: "/test",
        options: {
          headers: {
            "Content-Type": "application/json",
          },
        },
      });
    });

    test("handles API errors gracefully", async () => {
      const error = new Error("Network Error");
      (get as jest.Mock).mockRejectedValue(error);

      await expect(apiCall("/test", "GET")).rejects.toThrow("Network Error");
    });

    test("handles API errors with response data", async () => {
      const error = new Error("API Error");
      error.response = { status: 400, data: { message: "Bad Request" } };
      (get as jest.Mock).mockRejectedValue(error);

      await expect(apiCall("/test", "GET")).rejects.toThrow("Bad Request");
    });

    test("throws error for unsupported method", async () => {
      await expect(apiCall("/test", "PATCH")).rejects.toThrow(
        "Unsupported method: PATCH"
      );
    });
  });

  describe("useApi hook", () => {
    test("returns API methods", () => {
      const api = useApi();

      expect(typeof api.get).toBe("function");
      expect(typeof api.post).toBe("function");
      expect(typeof api.put).toBe("function");
      expect(typeof api.delete).toBe("function");
    });

    test("get method calls apiCall with GET", async () => {
      (get as jest.Mock).mockResolvedValue({ data: [] });

      const api = useApi();
      await api.get("/test");

      expect(get).toHaveBeenCalledWith({
        apiName: "GiftTrackerAPI",
        path: "/test",
        options: {
          headers: {
            "Content-Type": "application/json",
          },
        },
      });
    });

    test("post method calls apiCall with POST", async () => {
      (post as jest.Mock).mockResolvedValue({ success: true });

      const api = useApi();
      const body = { name: "test" };
      await api.post("/test", body);

      expect(post).toHaveBeenCalledWith({
        apiName: "GiftTrackerAPI",
        path: "/test",
        options: {
          body: {
            name: "test",
          },
          headers: {
            "Content-Type": "application/json",
          },
        },
      });
    });

    test("put method calls apiCall with PUT", async () => {
      (put as jest.Mock).mockResolvedValue({ updated: true });

      const api = useApi();
      const body = { id: "123", name: "updated" };
      await api.put("/test/123", body);

      expect(put).toHaveBeenCalledWith({
        apiName: "GiftTrackerAPI",
        path: "/test/123",
        options: {
          body: {
            id: "123",
            name: "updated",
          },
          headers: {
            "Content-Type": "application/json",
          },
        },
      });
    });

    test("delete method calls apiCall with DELETE", async () => {
      (del as jest.Mock).mockResolvedValue({ deleted: true });

      const api = useApi();
      await api.delete("/test/123");

      expect(del).toHaveBeenCalledWith({
        apiName: "GiftTrackerAPI",
        path: "/test/123",
        options: {
          headers: {
            "Content-Type": "application/json",
          },
        },
      });
    });
  });
});
