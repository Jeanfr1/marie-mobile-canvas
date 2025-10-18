import { get, post, put, del } from "aws-amplify/api";
import { useAuth } from "./auth-context";

const API_NAME = "GiftTrackerAPI";

// Define proper types for API options and responses
interface ApiOptions {
  headers?: Record<string, string>;
  queryParams?: Record<string, string>;
  body?: Record<string, unknown>;
  userId?: string;
}

interface ApiResponse {
  status?: number;
  data?: {
    message?: string;
    [key: string]: unknown;
  };
}

interface ApiError extends Error {
  response?: ApiResponse;
  request?: unknown;
}

/**
 * Helper function to make authenticated API calls with proper error handling
 * Ensures data ownership by adding userId to request when needed
 */
export async function apiCall<T = unknown>(
  path: string,
  method: "GET" | "POST" | "PUT" | "DELETE",
  options: ApiOptions = {}
): Promise<T> {
  try {
    // Add common options and headers
    const apiOptions: Record<string, unknown> = {
      headers: {
        "Content-Type": "application/json",
        ...options.headers,
      },
    };

    // Add query parameters if provided
    if (options.queryParams) {
      apiOptions.queryStringParameters = options.queryParams;
    }

    // Add body if provided for POST/PUT requests
    if ((method === "POST" || method === "PUT") && options.body) {
      // If userId is provided, add it to ensure data ownership validation in Lambda
      if (options.userId) {
        apiOptions.body = {
          ...options.body,
          userId: options.userId,
        };
      } else {
        apiOptions.body = options.body;
      }
    }

    // Make the API call
    let response: unknown;
    switch (method) {
      case "GET":
        response = await get({
          apiName: API_NAME,
          path,
          options: apiOptions,
        });
        break;
      case "POST":
        response = await post({
          apiName: API_NAME,
          path,
          options: apiOptions,
        });
        break;
      case "PUT":
        response = await put({
          apiName: API_NAME,
          path,
          options: apiOptions,
        });
        break;
      case "DELETE":
        response = await del({
          apiName: API_NAME,
          path,
          options: apiOptions,
        });
        break;
      default:
        throw new Error(`Unsupported method: ${method}`);
    }

    return response as T;
  } catch (error: unknown) {
    console.error(`API ${method} error for ${path}:`, error);

    const apiError = error as ApiError;

    // Handle specific error cases
    if (apiError.response) {
      // The request was made and the server responded with a status code
      // that falls out of the range of 2xx
      const status = apiError.response.status;
      const message =
        apiError.response.data?.message || "An unexpected error occurred";

      if (status === 403) {
        throw new Error("You don't have permission to access this resource");
      } else if (status === 401) {
        throw new Error("Please login to continue");
      } else {
        throw new Error(message);
      }
    } else if (apiError.request) {
      // The request was made but no response was received
      throw new Error(
        "No response received from server. Please check your connection."
      );
    } else {
      // Something happened in setting up the request that triggered an Error
      throw error;
    }
  }
}

/**
 * Custom hook for making API calls with the current user's context
 */
export function useApi() {
  const { user } = useAuth();

  return {
    get: async <T = unknown>(
      path: string,
      options: Omit<ApiOptions, "userId"> = {}
    ) => {
      return apiCall<T>(path, "GET", {
        ...options,
        userId: user?.username,
      });
    },

    post: async <T = unknown>(
      path: string,
      body: Record<string, unknown>,
      options: Omit<ApiOptions, "userId" | "body"> = {}
    ) => {
      return apiCall<T>(path, "POST", {
        ...options,
        body,
        userId: user?.username,
      });
    },

    put: async <T = unknown>(
      path: string,
      body: Record<string, unknown>,
      options: Omit<ApiOptions, "userId" | "body"> = {}
    ) => {
      return apiCall<T>(path, "PUT", {
        ...options,
        body,
        userId: user?.username,
      });
    },

    delete: async <T = unknown>(
      path: string,
      options: Omit<ApiOptions, "userId"> = {}
    ) => {
      return apiCall<T>(path, "DELETE", {
        ...options,
        userId: user?.username,
      });
    },
  };
}
