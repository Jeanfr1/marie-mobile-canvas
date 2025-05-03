import "@testing-library/jest-dom";
import { configure } from "@testing-library/react";

// Configure testing library
configure({
  testIdAttribute: "data-testid",
});

// Mock AWS Amplify Auth and API directly
jest.mock("aws-amplify", () => {
  const actual = jest.requireActual("aws-amplify");
  return {
    ...actual,
    Auth: {
      signIn: jest.fn(),
      signOut: jest.fn(),
      signUp: jest.fn(),
      currentAuthenticatedUser: jest.fn(),
      confirmSignUp: jest.fn(),
      forgotPassword: jest.fn(),
      forgotPasswordSubmit: jest.fn(),
    },
    API: {
      get: jest.fn(),
      post: jest.fn(),
      put: jest.fn(),
      del: jest.fn(),
    },
    Amplify: {
      configure: jest.fn(),
    },
  };
});

// Reset mocks before each test
beforeEach(() => {
  jest.clearAllMocks();
});

// Clean up after all tests
afterAll(() => {
  jest.resetModules();
});
