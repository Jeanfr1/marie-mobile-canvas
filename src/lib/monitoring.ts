import { Amplify } from "aws-amplify";

// Error types
export enum ErrorType {
  API = "API_ERROR",
  AUTH = "AUTH_ERROR",
  NETWORK = "NETWORK_ERROR",
  VALIDATION = "VALIDATION_ERROR",
  UNKNOWN = "UNKNOWN_ERROR",
}

// Interface for error logging
interface ErrorLog {
  type: ErrorType;
  message: string;
  timestamp: string;
  userId?: string;
  metadata?: Record<string, any>;
}

// Interface for performance metrics
interface PerformanceMetric {
  name: string;
  duration: number;
  timestamp: string;
  userId?: string;
  metadata?: Record<string, any>;
}

class Monitoring {
  private static instance: Monitoring;
  private errorLogs: ErrorLog[] = [];
  private performanceMetrics: PerformanceMetric[] = [];

  private constructor() {}

  static getInstance(): Monitoring {
    if (!Monitoring.instance) {
      Monitoring.instance = new Monitoring();
    }
    return Monitoring.instance;
  }

  // Log errors
  async logError(
    type: ErrorType,
    message: string,
    metadata?: Record<string, any>
  ) {
    const errorLog: ErrorLog = {
      type,
      message,
      timestamp: new Date().toISOString(),
      metadata,
    };

    try {
      const user = await Amplify.Auth.currentAuthenticatedUser();
      errorLog.userId = user.username;
    } catch (e) {
      // User not authenticated
    }

    this.errorLogs.push(errorLog);
    console.error("Error logged:", errorLog);

    // Send to CloudWatch
    try {
      await this.sendToCloudWatch("Errors", errorLog);
    } catch (e) {
      console.error("Failed to send error to CloudWatch:", e);
    }
  }

  // Log performance metrics
  async logPerformance(
    name: string,
    duration: number,
    metadata?: Record<string, any>
  ) {
    const metric: PerformanceMetric = {
      name,
      duration,
      timestamp: new Date().toISOString(),
      metadata,
    };

    try {
      const user = await Amplify.Auth.currentAuthenticatedUser();
      metric.userId = user.username;
    } catch (e) {
      // User not authenticated
    }

    this.performanceMetrics.push(metric);
    console.log("Performance metric logged:", metric);

    // Send to CloudWatch
    try {
      await this.sendToCloudWatch("Performance", metric);
    } catch (e) {
      console.error("Failed to send metric to CloudWatch:", e);
    }
  }

  // Send data to CloudWatch
  private async sendToCloudWatch(
    logType: "Errors" | "Performance",
    data: ErrorLog | PerformanceMetric
  ) {
    try {
      await fetch(`${process.env.NEXT_PUBLIC_API_ENDPOINT}/monitoring`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          logType,
          data,
        }),
      });
    } catch (e) {
      console.error("Failed to send data to CloudWatch:", e);
    }
  }

  // Get error logs
  getErrorLogs(): ErrorLog[] {
    return this.errorLogs;
  }

  // Get performance metrics
  getPerformanceMetrics(): PerformanceMetric[] {
    return this.performanceMetrics;
  }

  // Clear logs
  clearLogs() {
    this.errorLogs = [];
    this.performanceMetrics = [];
  }
}

export const monitoring = Monitoring.getInstance();

// Performance monitoring decorator
export function measurePerformance() {
  return function (
    target: any,
    propertyKey: string,
    descriptor: PropertyDescriptor
  ) {
    const originalMethod = descriptor.value;

    descriptor.value = async function (...args: any[]) {
      const start = performance.now();
      try {
        const result = await originalMethod.apply(this, args);
        const duration = performance.now() - start;
        await monitoring.logPerformance(propertyKey, duration, {
          args: args.map((arg) =>
            typeof arg === "object" ? JSON.stringify(arg) : arg
          ),
        });
        return result;
      } catch (error) {
        const duration = performance.now() - start;
        await monitoring.logPerformance(propertyKey, duration, {
          error: error.message,
          args: args.map((arg) =>
            typeof arg === "object" ? JSON.stringify(arg) : arg
          ),
        });
        throw error;
      }
    };

    return descriptor;
  };
}

// Error handling decorator
export function handleError(errorType: ErrorType = ErrorType.UNKNOWN) {
  return function (
    target: any,
    propertyKey: string,
    descriptor: PropertyDescriptor
  ) {
    const originalMethod = descriptor.value;

    descriptor.value = async function (...args: any[]) {
      try {
        return await originalMethod.apply(this, args);
      } catch (error) {
        await monitoring.logError(errorType, error.message, {
          method: propertyKey,
          args: args.map((arg) =>
            typeof arg === "object" ? JSON.stringify(arg) : arg
          ),
        });
        throw error;
      }
    };

    return descriptor;
  };
}
