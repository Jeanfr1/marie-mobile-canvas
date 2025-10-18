import "@testing-library/jest-dom";
import { configure } from "@testing-library/react";

// Setup DOM environment for tests
import { JSDOM } from "jsdom";

const dom = new JSDOM("<!DOCTYPE html><html><body></body></html>", {
  url: "http://localhost",
  pretendToBeVisual: true,
  resources: "usable",
});

global.window = dom.window as unknown as Window & typeof globalThis;
global.document = dom.window.document;
global.navigator = dom.window.navigator;
global.HTMLElement = dom.window.HTMLElement;
global.Element = dom.window.Element;
global.Node = dom.window.Node;
global.Text = dom.window.Text;
global.DocumentFragment = dom.window.DocumentFragment;
global.Event = dom.window.Event;
global.MouseEvent = dom.window.MouseEvent;
global.KeyboardEvent = dom.window.KeyboardEvent;
global.FocusEvent = dom.window.FocusEvent;
global.InputEvent = dom.window.InputEvent;
global.FormData = dom.window.FormData;
global.File = dom.window.File;
global.FileReader = dom.window.FileReader;
global.Blob = dom.window.Blob;
global.URL = dom.window.URL;
global.URLSearchParams = dom.window.URLSearchParams;
global.fetch = dom.window.fetch;
global.Request = dom.window.Request;
global.Response = dom.window.Response;
global.Headers = dom.window.Headers;
global.AbortController = dom.window.AbortController;
global.AbortSignal = dom.window.AbortSignal;

// Configure testing library
configure({
  testIdAttribute: "data-testid",
});

// Mock AWS Amplify v6
jest.mock("aws-amplify", () => ({
  Amplify: {
    configure: jest.fn(),
  },
}));

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

// Mock AWS Amplify API v6
jest.mock("aws-amplify/api", () => ({
  get: jest.fn(),
  post: jest.fn(),
  put: jest.fn(),
  del: jest.fn(),
  head: jest.fn(),
  patch: jest.fn(),
  generateClient: jest.fn(),
  isCancelError: jest.fn(),
}));

// Mock AWS Amplify Storage v6
jest.mock("aws-amplify/storage", () => ({
  uploadData: jest.fn(),
  downloadData: jest.fn(),
  remove: jest.fn(),
  getUrl: jest.fn(),
  list: jest.fn(),
  getProperties: jest.fn(),
  copy: jest.fn(),
  isCancelError: jest.fn(),
}));

// Reset mocks before each test
beforeEach(() => {
  jest.clearAllMocks();
});

// Clean up after all tests
afterAll(() => {
  jest.resetModules();
});
