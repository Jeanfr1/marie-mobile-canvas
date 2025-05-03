import {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";
import { Auth } from "aws-amplify";
import { CognitoUser } from "@aws-amplify/auth";

interface AuthContextType {
  user: CognitoUser | null;
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

  if (error.code === "NotAuthorizedException") {
    return "Incorrect username or password";
  }

  if (error.code === "UserNotFoundException") {
    return "User does not exist";
  }

  if (error.code === "UserNotConfirmedException") {
    return "User is not confirmed. Please check your email for verification code";
  }

  if (error.code === "NetworkError") {
    return "Network error. Please check your internet connection";
  }

  return error.message || "An authentication error occurred";
};

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<CognitoUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [authError, setAuthError] = useState<string | null>(null);

  useEffect(() => {
    checkUser();
  }, []);

  async function checkUser() {
    try {
      console.log("Checking current authenticated user...");
      const currentUser = await Auth.currentAuthenticatedUser();
      console.log("User authenticated successfully");
      setUser(currentUser);
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

  const signIn = async (username: string, password: string) => {
    try {
      clearAuthError();
      console.log(`Attempting to sign in user: ${username}`);
      setIsLoading(true);
      const user = await Auth.signIn(username, password);
      console.log("Sign in successful");
      setUser(user);
    } catch (error: any) {
      console.error("Sign in error:", error);
      const errorMessage = formatAuthError(error);
      setAuthError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const signOut = async () => {
    try {
      clearAuthError();
      console.log("Signing out...");
      setIsLoading(true);
      await Auth.signOut();
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

  const signUp = async (username: string, password: string, email: string) => {
    try {
      clearAuthError();
      console.log(`Attempting to sign up user: ${username}`);
      setIsLoading(true);
      await Auth.signUp({
        username,
        password,
        attributes: {
          email,
        },
      });
      console.log("Sign up successful");
    } catch (error: any) {
      console.error("Sign up error:", error);
      const errorMessage = formatAuthError(error);
      setAuthError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const confirmSignUp = async (username: string, code: string) => {
    try {
      clearAuthError();
      console.log(`Confirming sign up for user: ${username}`);
      setIsLoading(true);
      await Auth.confirmSignUp(username, code);
      console.log("Confirm sign up successful");
    } catch (error: any) {
      console.error("Confirm sign up error:", error);
      const errorMessage = formatAuthError(error);
      setAuthError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const forgotPassword = async (username: string) => {
    try {
      clearAuthError();
      console.log(`Sending password reset for user: ${username}`);
      setIsLoading(true);
      await Auth.forgotPassword(username);
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

  const forgotPasswordSubmit = async (
    username: string,
    code: string,
    newPassword: string
  ) => {
    try {
      clearAuthError();
      console.log(`Submitting new password for user: ${username}`);
      setIsLoading(true);
      await Auth.forgotPasswordSubmit(username, code, newPassword);
      console.log("Password reset successful");
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
    signIn,
    signOut,
    signUp,
    confirmSignUp,
    forgotPassword,
    forgotPasswordSubmit,
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
