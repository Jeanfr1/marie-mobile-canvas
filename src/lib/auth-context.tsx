import {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";
import {
  fetchAuthSession,
  fetchUserAttributes,
  getCurrentUser,
} from "aws-amplify/auth";
import {
  AuthSignInOutput,
  signIn,
  signOut,
  signUp,
  confirmSignUp,
  resetPassword,
  confirmResetPassword,
} from "aws-amplify/auth";

interface AuthContextType {
  user: any | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  authError: string | null;
  signIn: (username: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
  signUp: (username: string, password: string, email: string) => Promise<void>;
  confirmSignUp: (username: string, code: string) => Promise<void>;
  forgotPassword: (username: string) => Promise<void>;
  forgotPasswordSubmit: (
    username: string,
    code: string,
    newPassword: string
  ) => Promise<void>;
  clearAuthError: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Helper function to format error messages
const formatAuthError = (error: any): string => {
  console.error("Auth error details:", error);

  if (error.name === "NotAuthorizedException") {
    return "Incorrect username or password";
  }

  if (error.name === "UserNotFoundException") {
    return "User does not exist";
  }

  if (error.name === "UserNotConfirmedException") {
    return "User is not confirmed. Please check your email for verification code";
  }

  if (error.name === "NetworkError" || error.message?.includes("network")) {
    return "Network error. Please check your internet connection";
  }

  return error.message || "An authentication error occurred";
};

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<any | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [authError, setAuthError] = useState<string | null>(null);

  useEffect(() => {
    checkAuth();
  }, []);

  async function checkAuth() {
    try {
      console.log("Checking current authenticated user...");
      setIsLoading(true);

      // Get the current authenticated user
      const currentUser = await getCurrentUser();

      // Get session info
      const session = await fetchAuthSession();

      // Get user attributes
      const attributes = await fetchUserAttributes();

      console.log("User authenticated successfully", {
        currentUser,
        attributes,
      });
      setUser({ ...currentUser, attributes });
    } catch (error) {
      console.log("No authenticated user found", error);
      setUser(null);
    } finally {
      setIsLoading(false);
    }
  }

  const clearAuthError = () => {
    setAuthError(null);
  };

  const signInUser = async (username: string, password: string) => {
    try {
      clearAuthError();
      console.log(`Attempting to sign in user: ${username}`);
      setIsLoading(true);

      const result = await signIn({
        username,
        password,
        options: {
          authFlowType: "USER_PASSWORD_AUTH",
        },
      });

      console.log("Sign in result:", result);

      if (result.isSignedIn) {
        console.log("Sign in successful");
        await checkAuth(); // Refresh user data
      } else if (result.nextStep) {
        console.log("Additional steps required:", result.nextStep);
        // Handle additional steps if needed (MFA, etc.)
        switch (result.nextStep.signInStep) {
          case "CONFIRM_SIGN_UP":
            throw new Error(
              "User is not confirmed. Please check your email for verification code."
            );
          case "RESET_PASSWORD":
            throw new Error(
              "Password reset required. Please reset your password."
            );
          default:
            throw new Error(
              `Additional step required: ${result.nextStep.signInStep}`
            );
        }
      }
    } catch (error: any) {
      console.error("Sign in error:", error);
      const errorMessage = formatAuthError(error);
      setAuthError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const signOutUser = async () => {
    try {
      clearAuthError();
      console.log("Signing out...");
      setIsLoading(true);
      await signOut();
      console.log("Sign out successful");
      setUser(null);
    } catch (error: any) {
      console.error("Sign out error:", error);
      const errorMessage = formatAuthError(error);
      setAuthError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const signUpUser = async (
    username: string,
    password: string,
    email: string
  ) => {
    try {
      clearAuthError();
      console.log(`Attempting to sign up user: ${username}`);
      setIsLoading(true);
      const { isSignUpComplete, userId, nextStep } = await signUp({
        username,
        password,
        options: {
          userAttributes: {
            email,
          },
          authFlowType: "USER_PASSWORD_AUTH",
        },
      });

      console.log("Sign up result:", { isSignUpComplete, userId, nextStep });

      if (!isSignUpComplete) {
        console.log("Additional steps required for sign up:", nextStep);
      }

      console.log("Sign up successful, confirmation needed");
    } catch (error: any) {
      console.error("Sign up error:", error);
      const errorMessage = formatAuthError(error);
      setAuthError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const confirmSignUpUser = async (username: string, code: string) => {
    try {
      clearAuthError();
      console.log(`Confirming sign up for user: ${username}`);
      setIsLoading(true);
      const { isSignUpComplete } = await confirmSignUp({
        username,
        confirmationCode: code,
      });

      if (isSignUpComplete) {
        console.log("Confirm sign up successful");
      } else {
        throw new Error(
          "Sign up confirmation not complete. Additional steps may be required."
        );
      }
    } catch (error: any) {
      console.error("Confirm sign up error:", error);
      const errorMessage = formatAuthError(error);
      setAuthError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const forgotPasswordUser = async (username: string) => {
    try {
      clearAuthError();
      console.log(`Sending password reset for user: ${username}`);
      setIsLoading(true);
      await resetPassword({ username });
      console.log("Password reset request successful");
    } catch (error: any) {
      console.error("Forgot password error:", error);
      const errorMessage = formatAuthError(error);
      setAuthError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const forgotPasswordSubmitUser = async (
    username: string,
    code: string,
    newPassword: string
  ) => {
    try {
      clearAuthError();
      console.log(`Submitting new password for user: ${username}`);
      setIsLoading(true);

      const { isPasswordReset } = await confirmResetPassword({
        username,
        confirmationCode: code,
        newPassword,
      });

      if (isPasswordReset) {
        console.log("Password reset successful");
      } else {
        throw new Error(
          "Password reset not complete. Additional steps may be required."
        );
      }
    } catch (error: any) {
      console.error("Forgot password submit error:", error);
      const errorMessage = formatAuthError(error);
      setAuthError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const value = {
    user,
    isAuthenticated: !!user,
    isLoading,
    authError,
    signIn: signInUser,
    signOut: signOutUser,
    signUp: signUpUser,
    confirmSignUp: confirmSignUpUser,
    forgotPassword: forgotPasswordUser,
    forgotPasswordSubmit: forgotPasswordSubmitUser,
    clearAuthError,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
