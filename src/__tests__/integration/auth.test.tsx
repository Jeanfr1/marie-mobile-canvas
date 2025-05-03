import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { AuthProvider, useAuth } from "../../lib/auth-context";
import { Amplify } from "aws-amplify";
import { awsConfig } from "../../config/aws-config";

// Mock AWS Amplify
jest.mock("aws-amplify");

describe("Authentication Integration Tests", () => {
  beforeEach(() => {
    // Reset all mocks before each test
    jest.clearAllMocks();

    // Configure Amplify with test configuration
    Amplify.configure({
      Auth: {
        region: awsConfig.region,
        userPoolId: awsConfig.userPoolId,
        userPoolWebClientId: awsConfig.userPoolWebClientId,
      },
    });
  });

  test("sign in flow", async () => {
    const mockSignIn = jest.fn().mockResolvedValue({
      username: "testuser",
      attributes: { email: "test@example.com" },
    });

    (Amplify.Auth.signIn as jest.Mock).mockImplementation(mockSignIn);

    const TestComponent = () => {
      const { signIn, isAuthenticated, user } = useAuth();

      return (
        <div>
          <button onClick={() => signIn("testuser", "password")}>
            Sign In
          </button>
          {isAuthenticated && <div>Authenticated</div>}
          {user && <div>User: {user.username}</div>}
        </div>
      );
    };

    render(
      <AuthProvider>
        <TestComponent />
      </AuthProvider>
    );

    const signInButton = screen.getByText("Sign In");
    fireEvent.click(signInButton);

    await waitFor(() => {
      expect(screen.getByText("Authenticated")).toBeInTheDocument();
      expect(screen.getByText("User: testuser")).toBeInTheDocument();
    });

    expect(mockSignIn).toHaveBeenCalledWith("testuser", "password");
  });

  test("sign out flow", async () => {
    const mockSignOut = jest.fn().mockResolvedValue(undefined);
    (Amplify.Auth.signOut as jest.Mock).mockImplementation(mockSignOut);

    const TestComponent = () => {
      const { signOut, isAuthenticated } = useAuth();

      return (
        <div>
          <button onClick={signOut}>Sign Out</button>
          {isAuthenticated && <div>Authenticated</div>}
        </div>
      );
    };

    render(
      <AuthProvider>
        <TestComponent />
      </AuthProvider>
    );

    const signOutButton = screen.getByText("Sign Out");
    fireEvent.click(signOutButton);

    await waitFor(() => {
      expect(screen.queryByText("Authenticated")).not.toBeInTheDocument();
    });

    expect(mockSignOut).toHaveBeenCalled();
  });

  test("sign up flow", async () => {
    const mockSignUp = jest.fn().mockResolvedValue({
      user: { username: "newuser" },
      userConfirmed: false,
    });

    (Amplify.Auth.signUp as jest.Mock).mockImplementation(mockSignUp);

    const TestComponent = () => {
      const { signUp } = useAuth();

      return (
        <button
          onClick={() => signUp("newuser", "password", "test@example.com")}
        >
          Sign Up
        </button>
      );
    };

    render(
      <AuthProvider>
        <TestComponent />
      </AuthProvider>
    );

    const signUpButton = screen.getByText("Sign Up");
    fireEvent.click(signUpButton);

    await waitFor(() => {
      expect(mockSignUp).toHaveBeenCalledWith({
        username: "newuser",
        password: "password",
        attributes: { email: "test@example.com" },
      });
    });
  });
});
