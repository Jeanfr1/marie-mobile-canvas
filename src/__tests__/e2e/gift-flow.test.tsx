import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { AuthProvider } from "../../lib/auth-context";
import { Amplify, API } from "aws-amplify";
import { awsConfig } from "../../config/aws-config";

// Mock AWS Amplify
jest.mock("aws-amplify");

describe("Gift Management End-to-End Flow", () => {
  beforeAll(() => {
    // Configure Amplify
    Amplify.configure({
      Auth: {
        region: awsConfig.region,
        userPoolId: awsConfig.userPoolId,
        userPoolWebClientId: awsConfig.userPoolWebClientId,
      },
      API: {
        endpoints: [
          {
            name: "GiftTrackerAPI",
            endpoint: awsConfig.apiEndpoint,
          },
        ],
      },
    });
  });

  beforeEach(() => {
    jest.clearAllMocks();
  });

  test("complete gift management flow", async () => {
    // Mock successful authentication
    (Amplify.Auth.currentAuthenticatedUser as jest.Mock).mockResolvedValue({
      username: "testuser",
      attributes: { email: "test@example.com" },
    });

    // Mock API responses
    const mockContact = {
      contactId: "contact123",
      name: "John Doe",
      email: "john@example.com",
    };

    const mockEvent = {
      eventId: "event123",
      name: "Birthday Party",
      date: "2024-05-15",
    };

    const mockGift = {
      giftId: "gift123",
      name: "Test Gift",
      description: "A wonderful gift",
      type: "given",
      date: "2024-05-15",
      contactId: "contact123",
      eventId: "event123",
      tags: ["birthday"],
    };

    // Mock API calls
    (API.get as jest.Mock)
      .mockResolvedValueOnce([mockContact]) // getContacts
      .mockResolvedValueOnce([mockEvent]) // getEvents
      .mockResolvedValueOnce([mockGift]); // getGifts

    (API.post as jest.Mock).mockResolvedValueOnce({
      ...mockGift,
      giftId: "gift456",
    }); // createGift

    // Render the app with necessary providers
    render(
      <AuthProvider>
        <App />
      </AuthProvider>
    );

    // Wait for initial data load
    await waitFor(() => {
      expect(screen.getByText("John Doe")).toBeInTheDocument();
      expect(screen.getByText("Birthday Party")).toBeInTheDocument();
    });

    // Test adding a new gift
    const addGiftButton = screen.getByText("Add Gift");
    fireEvent.click(addGiftButton);

    // Fill in gift details
    const nameInput = screen.getByLabelText("Gift Name");
    const descriptionInput = screen.getByLabelText("Description");
    const contactSelect = screen.getByLabelText("Contact");
    const eventSelect = screen.getByLabelText("Event");

    fireEvent.change(nameInput, { target: { value: "New Test Gift" } });
    fireEvent.change(descriptionInput, {
      target: { value: "A new test gift description" },
    });
    fireEvent.change(contactSelect, { target: { value: "contact123" } });
    fireEvent.change(eventSelect, { target: { value: "event123" } });

    // Submit the form
    const submitButton = screen.getByText("Save Gift");
    fireEvent.click(submitButton);

    // Verify the gift was added
    await waitFor(() => {
      expect(API.post).toHaveBeenCalledWith("GiftTrackerAPI", "/gifts", {
        body: expect.objectContaining({
          name: "New Test Gift",
          description: "A new test gift description",
          contactId: "contact123",
          eventId: "event123",
        }),
      });
    });

    // Verify the new gift appears in the list
    expect(screen.getByText("New Test Gift")).toBeInTheDocument();
  });

  test("error handling in gift management flow", async () => {
    // Mock authentication error
    (Amplify.Auth.currentAuthenticatedUser as jest.Mock).mockRejectedValue(
      new Error("Not authenticated")
    );

    render(
      <AuthProvider>
        <App />
      </AuthProvider>
    );

    // Verify user is redirected to login
    await waitFor(() => {
      expect(screen.getByText("Please sign in")).toBeInTheDocument();
    });

    // Mock API error
    (API.get as jest.Mock).mockRejectedValue(
      new Error("Failed to fetch gifts")
    );

    // Verify error handling
    await waitFor(() => {
      expect(
        screen.getByText("Error: Failed to fetch gifts")
      ).toBeInTheDocument();
    });
  });
});
