import {
  monitoring,
  ErrorType,
  measurePerformance,
  handleError,
} from "../../lib/monitoring";

// Mock AWS Amplify v6
jest.mock("aws-amplify", () => ({
  Amplify: {
    configure: jest.fn(),
  },
}));

jest.mock("aws-amplify/auth", () => ({
  getCurrentUser: jest.fn(),
  fetchAuthSession: jest.fn(),
  fetchUserAttributes: jest.fn(),
}));

// Import the mocked functions
import { getCurrentUser } from "aws-amplify/auth";

describe("Monitoring", () => {
  beforeEach(() => {
    monitoring.clearLogs();
    jest.clearAllMocks();
  });

  describe("Error Logging", () => {
    test("logs error with type and message", async () => {
      const errorType = ErrorType.API;
      const message = "Test error message";

      await monitoring.logError(errorType, message);

      const errorLogs = monitoring.getErrorLogs();
      expect(errorLogs).toHaveLength(1);
      expect(errorLogs[0]).toMatchObject({
        type: errorType,
        message,
        timestamp: expect.any(String),
      });
    });

    test("logs error with metadata", async () => {
      const metadata = { userId: "123", action: "test" };

      await monitoring.logError(ErrorType.AUTH, "Auth error", metadata);

      const errorLogs = monitoring.getErrorLogs();
      expect(errorLogs[0].metadata).toEqual(metadata);
    });

    test("logs error with user context when authenticated", async () => {
      (getCurrentUser as jest.Mock).mockResolvedValue({ username: "testuser" });

      await monitoring.logError(ErrorType.NETWORK, "Network error");

      const errorLogs = monitoring.getErrorLogs();
      expect(errorLogs[0].userId).toBe("testuser");
    });

    test("handles authentication failure gracefully", async () => {
      (getCurrentUser as jest.Mock).mockRejectedValue(
        new Error("Not authenticated")
      );

      await monitoring.logError(ErrorType.VALIDATION, "Validation error");

      const errorLogs = monitoring.getErrorLogs();
      expect(errorLogs[0].userId).toBeUndefined();
    });
  });

  describe("Performance Logging", () => {
    test("logs performance metric", async () => {
      const name = "test-operation";
      const duration = 150;

      await monitoring.logPerformance(name, duration);

      const metrics = monitoring.getPerformanceMetrics();
      expect(metrics).toHaveLength(1);
      expect(metrics[0]).toMatchObject({
        name,
        duration,
        timestamp: expect.any(String),
      });
    });

    test("logs performance metric with metadata", async () => {
      const metadata = { operation: "test", size: 1024 };

      await monitoring.logPerformance("test-op", 200, metadata);

      const metrics = monitoring.getPerformanceMetrics();
      expect(metrics[0].metadata).toEqual(metadata);
    });
  });

  describe("Performance Decorator", () => {
    test("measures method execution time", async () => {
      class TestClass {
        @measurePerformance()
        async testMethod() {
          await new Promise((resolve) => setTimeout(resolve, 10));
          return "success";
        }
      }

      const instance = new TestClass();
      const result = await instance.testMethod();

      expect(result).toBe("success");

      const metrics = monitoring.getPerformanceMetrics();
      expect(metrics).toHaveLength(1);
      expect(metrics[0].name).toBe("testMethod");
      expect(metrics[0].duration).toBeGreaterThan(0);
    });

    test("logs performance even when method throws", async () => {
      class TestClass {
        @measurePerformance()
        async failingMethod() {
          throw new Error("Test error");
        }
      }

      const instance = new TestClass();

      await expect(instance.failingMethod()).rejects.toThrow("Test error");

      const metrics = monitoring.getPerformanceMetrics();
      expect(metrics).toHaveLength(1);
      expect(metrics[0].name).toBe("failingMethod");
      expect(metrics[0].metadata?.error).toBe("Test error");
    });
  });

  describe("Error Handling Decorator", () => {
    test("catches and logs errors", async () => {
      class TestClass {
        @handleError(ErrorType.API)
        async failingMethod() {
          throw new Error("API Error");
        }
      }

      const instance = new TestClass();

      await expect(instance.failingMethod()).rejects.toThrow("API Error");

      const errorLogs = monitoring.getErrorLogs();
      expect(errorLogs).toHaveLength(1);
      expect(errorLogs[0].type).toBe(ErrorType.API);
      expect(errorLogs[0].message).toBe("API Error");
    });

    test("preserves original error", async () => {
      class TestClass {
        @handleError(ErrorType.VALIDATION)
        async validationMethod() {
          throw new Error("Validation failed");
        }
      }

      const instance = new TestClass();

      await expect(instance.validationMethod()).rejects.toThrow(
        "Validation failed"
      );
    });
  });

  describe("Log Management", () => {
    test("clears all logs", async () => {
      await monitoring.logError(ErrorType.API, "Test error");
      await monitoring.logPerformance("test", 100);

      expect(monitoring.getErrorLogs()).toHaveLength(1);
      expect(monitoring.getPerformanceMetrics()).toHaveLength(1);

      monitoring.clearLogs();

      expect(monitoring.getErrorLogs()).toHaveLength(0);
      expect(monitoring.getPerformanceMetrics()).toHaveLength(0);
    });

    test("maintains separate error and performance logs", async () => {
      await monitoring.logError(ErrorType.API, "Error 1");
      await monitoring.logPerformance("Perf 1", 100);
      await monitoring.logError(ErrorType.AUTH, "Error 2");

      const errorLogs = monitoring.getErrorLogs();
      const perfMetrics = monitoring.getPerformanceMetrics();

      expect(errorLogs).toHaveLength(2);
      expect(perfMetrics).toHaveLength(1);
    });
  });

  describe("Singleton Pattern", () => {
    test("returns same instance", () => {
      const instance1 = monitoring;
      const instance2 = monitoring;
      expect(instance1).toBe(instance2);
    });
  });
});
