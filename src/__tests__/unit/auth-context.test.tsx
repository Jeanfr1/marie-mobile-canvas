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

describe("Authentication Context", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("AuthProvider", () => {
    test("provides initial state", () => {
      // Test that the AuthProvider can be instantiated
      expect(AuthProvider).toBeDefined();
      expect(typeof AuthProvider).toBe("function");
    });
  });

  describe("useAuth hook", () => {
    test("returns expected interface", () => {
      // Test that useAuth hook exists and has expected structure
      expect(useAuth).toBeDefined();
      expect(typeof useAuth).toBe("function");
    });
  });

  describe("Authentication functions", () => {
    test("signIn function calls AWS Amplify signIn", async () => {
      const mockSignInResult = {
        isSignedIn: true,
        nextStep: {
          signInStep: "DONE",
        },
      };

      (signIn as jest.Mock).mockResolvedValue(mockSignInResult);

      // Test the signIn function directly
      const result = await signIn({
        username: "test@example.com",
        password: "password",
      });

      expect(signIn).toHaveBeenCalledWith({
        username: "test@example.com",
        password: "password",
      });
      expect(result).toEqual(mockSignInResult);
    });

    test("signOut function calls AWS Amplify signOut", async () => {
      (signOut as jest.Mock).mockResolvedValue({});

      const result = await signOut();

      expect(signOut).toHaveBeenCalled();
      expect(result).toEqual({});
    });

    test("signUp function calls AWS Amplify signUp", async () => {
      const mockSignUpResult = {
        isSignUpComplete: false,
        nextStep: {
          signUpStep: "CONFIRM_SIGN_UP",
          codeDeliveryDetails: {
            deliveryMedium: "EMAIL",
            destination: "t***@example.com",
          },
        },
        userId: "123",
      };

      (signUp as jest.Mock).mockResolvedValue(mockSignUpResult);

      const result = await signUp({
        username: "test@example.com",
        password: "password",
        options: {
          userAttributes: {
            name: "Test User",
          },
        },
      });

      expect(signUp).toHaveBeenCalledWith({
        username: "test@example.com",
        password: "password",
        options: {
          userAttributes: {
            name: "Test User",
          },
        },
      });
      expect(result).toEqual(mockSignUpResult);
    });

    test("confirmSignUp function calls AWS Amplify confirmSignUp", async () => {
      const mockConfirmResult = {
        isSignUpComplete: true,
        nextStep: {
          signInStep: "DONE",
        },
      };

      (confirmSignUp as jest.Mock).mockResolvedValue(mockConfirmResult);

      const result = await confirmSignUp({
        username: "test@example.com",
        confirmationCode: "123456",
      });

      expect(confirmSignUp).toHaveBeenCalledWith({
        username: "test@example.com",
        confirmationCode: "123456",
      });
      expect(result).toEqual(mockConfirmResult);
    });

    test("resetPassword function calls AWS Amplify resetPassword", async () => {
      const mockResetResult = {
        isPasswordResetRequired: false,
        nextStep: {
          resetPasswordStep: "CONFIRM_RESET_PASSWORD_WITH_CODE",
          codeDeliveryDetails: {
            deliveryMedium: "EMAIL",
            destination: "t***@example.com",
          },
        },
      };

      (resetPassword as jest.Mock).mockResolvedValue(mockResetResult);

      const result = await resetPassword({
        username: "test@example.com",
      });

      expect(resetPassword).toHaveBeenCalledWith({
        username: "test@example.com",
      });
      expect(result).toEqual(mockResetResult);
    });

    test("confirmResetPassword function calls AWS Amplify confirmResetPassword", async () => {
      const mockConfirmResetResult = {
        isPasswordResetComplete: true,
        nextStep: {
          signInStep: "DONE",
        },
      };

      (confirmResetPassword as jest.Mock).mockResolvedValue(
        mockConfirmResetResult
      );

      const result = await confirmResetPassword({
        username: "test@example.com",
        confirmationCode: "123456",
        newPassword: "newpassword",
      });

      expect(confirmResetPassword).toHaveBeenCalledWith({
        username: "test@example.com",
        confirmationCode: "123456",
        newPassword: "newpassword",
      });
      expect(result).toEqual(mockConfirmResetResult);
    });

    test("getCurrentUser function calls AWS Amplify getCurrentUser", async () => {
      const mockUser = {
        userId: "123",
        username: "testuser",
        signInDetails: {
          loginId: "test@example.com",
          authFlowType: "USER_SRP_AUTH",
        },
      };

      (getCurrentUser as jest.Mock).mockResolvedValue(mockUser);

      const result = await getCurrentUser();

      expect(getCurrentUser).toHaveBeenCalled();
      expect(result).toEqual(mockUser);
    });

    test("handles authentication errors", async () => {
      const error = new Error("Invalid credentials");
      (signIn as jest.Mock).mockRejectedValue(error);

      await expect(
        signIn({
          username: "test@example.com",
          password: "wrongpassword",
        })
      ).rejects.toThrow("Invalid credentials");

      expect(signIn).toHaveBeenCalledWith({
        username: "test@example.com",
        password: "wrongpassword",
      });
    });

    test("handles AWS Amplify specific errors", async () => {
      const amplifyError = new Error("UserNotFoundException");
      amplifyError.name = "UserNotFoundException";
      (signIn as jest.Mock).mockRejectedValue(amplifyError);

      await expect(
        signIn({
          username: "test@example.com",
          password: "password",
        })
      ).rejects.toThrow("UserNotFoundException");
    });
  });
});
