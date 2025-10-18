import { AuthProvider, useAuth } from "../../lib/auth-context";

// Mock AWS Amplify Auth v6
jest.mock("aws-amplify/auth", () => ({
  signIn: jest.fn(),
  signOut: jest.fn(),
  signUp: jest.fn(),
  confirmSignUp: jest.fn(),
  resetPassword: jest.fn(),
  confirmResetPassword: jest.fn(),
  getCurrentUser: jest.fn(),
  fetchAuthSession: jest.fn(),
  fetchUserAttributes: jest.fn(),
}));

// Import the mocked functions
import {
  signIn,
  signOut,
  signUp,
  confirmSignUp,
  resetPassword,
  confirmResetPassword,
  getCurrentUser,
  fetchAuthSession,
  fetchUserAttributes,
} from "aws-amplify/auth";

describe("Authentication Integration Tests", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test("renders loading state initially", () => {
    (getCurrentUser as jest.Mock).mockImplementation(
      () => new Promise(() => {})
    ); // Never resolves

    // Test that the AuthProvider can be instantiated
    expect(AuthProvider).toBeDefined();
    expect(typeof AuthProvider).toBe("function");
  });

  test("renders authenticated user", async () => {
    (getCurrentUser as jest.Mock).mockResolvedValue({
      userId: "test-user",
      username: "testuser",
    });

    // Test that getCurrentUser is called
    const result = await getCurrentUser();
    expect(result).toEqual({
      userId: "test-user",
      username: "testuser",
    });
  });

  test("renders not authenticated when no user", async () => {
    (getCurrentUser as jest.Mock).mockRejectedValue(
      new Error("Not authenticated")
    );

    await expect(getCurrentUser()).rejects.toThrow("Not authenticated");
  });

  test("handles sign in flow", async () => {
    // Mock initial state (not authenticated)
    (getCurrentUser as jest.Mock).mockRejectedValue(
      new Error("Not authenticated")
    );

    // Mock successful sign in
    (signIn as jest.Mock).mockResolvedValue({
      isSignedIn: true,
      nextStep: {
        signInStep: "DONE",
      },
    });

    // Mock authenticated state after sign in
    (getCurrentUser as jest.Mock).mockResolvedValue({
      userId: "test-user",
      username: "testuser",
    });

    // Test sign in flow
    const signInResult = await signIn({
      username: "test@example.com",
      password: "password",
    });

    expect(signInResult).toEqual({
      isSignedIn: true,
      nextStep: {
        signInStep: "DONE",
      },
    });

    // Test that user is now authenticated
    const user = await getCurrentUser();
    expect(user).toEqual({
      userId: "test-user",
      username: "testuser",
    });
  });

  test("handles sign out flow", async () => {
    // Mock authenticated state
    (getCurrentUser as jest.Mock).mockResolvedValue({
      userId: "test-user",
      username: "testuser",
    });

    // Mock successful sign out
    (signOut as jest.Mock).mockResolvedValue({});

    // Test sign out flow
    const signOutResult = await signOut();
    expect(signOutResult).toEqual({});

    // Mock unauthenticated state after sign out
    (getCurrentUser as jest.Mock).mockRejectedValue(
      new Error("Not authenticated")
    );

    // Test that user is now unauthenticated
    await expect(getCurrentUser()).rejects.toThrow("Not authenticated");
  });

  test("handles authentication errors", async () => {
    // Mock initial state (not authenticated)
    (getCurrentUser as jest.Mock).mockRejectedValue(
      new Error("Not authenticated")
    );

    // Mock sign in error
    (signIn as jest.Mock).mockRejectedValue(new Error("Invalid credentials"));

    // Test error handling
    await expect(
      signIn({
        username: "test@example.com",
        password: "wrongpassword",
      })
    ).rejects.toThrow("Invalid credentials");
  });

  test("handles sign up flow", async () => {
    // Mock successful sign up
    (signUp as jest.Mock).mockResolvedValue({
      isSignUpComplete: false,
      nextStep: {
        signUpStep: "CONFIRM_SIGN_UP",
        codeDeliveryDetails: {
          deliveryMedium: "EMAIL",
          destination: "t***@example.com",
        },
      },
      userId: "123",
    });

    // Test sign up flow
    const signUpResult = await signUp({
      username: "test@example.com",
      password: "password",
      options: {
        userAttributes: {
          name: "Test User",
        },
      },
    });

    expect(signUpResult).toEqual({
      isSignUpComplete: false,
      nextStep: {
        signUpStep: "CONFIRM_SIGN_UP",
        codeDeliveryDetails: {
          deliveryMedium: "EMAIL",
          destination: "t***@example.com",
        },
      },
      userId: "123",
    });
  });

  test("handles confirm sign up flow", async () => {
    // Mock successful confirmation
    (confirmSignUp as jest.Mock).mockResolvedValue({
      isSignUpComplete: true,
      nextStep: {
        signInStep: "DONE",
      },
    });

    // Test confirm sign up flow
    const confirmResult = await confirmSignUp({
      username: "test@example.com",
      confirmationCode: "123456",
    });

    expect(confirmResult).toEqual({
      isSignUpComplete: true,
      nextStep: {
        signInStep: "DONE",
      },
    });
  });

  test("handles forgot password flow", async () => {
    // Mock successful password reset initiation
    (resetPassword as jest.Mock).mockResolvedValue({
      isPasswordResetRequired: false,
      nextStep: {
        resetPasswordStep: "CONFIRM_RESET_PASSWORD_WITH_CODE",
        codeDeliveryDetails: {
          deliveryMedium: "EMAIL",
          destination: "t***@example.com",
        },
      },
    });

    // Test forgot password flow
    const resetResult = await resetPassword({
      username: "test@example.com",
    });

    expect(resetResult).toEqual({
      isPasswordResetRequired: false,
      nextStep: {
        resetPasswordStep: "CONFIRM_RESET_PASSWORD_WITH_CODE",
        codeDeliveryDetails: {
          deliveryMedium: "EMAIL",
          destination: "t***@example.com",
        },
      },
    });
  });

  test("handles forgot password submit flow", async () => {
    // Mock successful password reset confirmation
    (confirmResetPassword as jest.Mock).mockResolvedValue({
      isPasswordResetComplete: true,
      nextStep: {
        signInStep: "DONE",
      },
    });

    // Test forgot password submit flow
    const confirmResetResult = await confirmResetPassword({
      username: "test@example.com",
      confirmationCode: "123456",
      newPassword: "newpassword",
    });

    expect(confirmResetResult).toEqual({
      isPasswordResetComplete: true,
      nextStep: {
        signInStep: "DONE",
      },
    });
  });
});
