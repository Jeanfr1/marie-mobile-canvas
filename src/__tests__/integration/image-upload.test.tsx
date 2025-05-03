import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { AuthProvider } from "../../lib/auth-context";
import * as imagesApi from "../../lib/api-service";
import React from "react";

// Mock component for demonstration (replace with your actual component)
function ImageUpload({ onUpload }: { onUpload: (url: string) => void }) {
  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    // Get pre-signed URL
    const { uploadUrl, imageUrl } = await imagesApi.imagesApi.getUploadUrl(
      file.type,
      file.name
    );
    // Upload to S3
    await fetch(uploadUrl, {
      method: "PUT",
      body: file,
      headers: { "Content-Type": file.type },
    });
    onUpload(imageUrl);
  };
  return (
    <input
      type="file"
      accept="image/*"
      aria-label="Upload Image"
      onChange={handleFileChange}
    />
  );
}

describe("Image Upload Flow", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test("uploads an image and updates the UI", async () => {
    // Mock getUploadUrl
    const mockUploadUrl = "https://mock-s3-url.com/upload";
    const mockImageUrl = "https://mock-s3-url.com/image.jpg";
    jest.spyOn(imagesApi.imagesApi, "getUploadUrl").mockResolvedValue({
      uploadUrl: mockUploadUrl,
      imageUrl: mockImageUrl,
    });
    // Mock fetch for S3 upload
    global.fetch = jest.fn().mockResolvedValue({ ok: true });

    // Mock onUpload callback
    const onUpload = jest.fn();

    render(
      <AuthProvider>
        <ImageUpload onUpload={onUpload} />
      </AuthProvider>
    );

    // Simulate user selecting a file
    const file = new File(["dummy content"], "test.jpg", {
      type: "image/jpeg",
    });
    const input = screen.getByLabelText("Upload Image");
    await userEvent.upload(input, file);

    // Wait for upload logic to complete
    await waitFor(() => {
      expect(imagesApi.imagesApi.getUploadUrl).toHaveBeenCalledWith(
        "image/jpeg",
        "test.jpg"
      );
      expect(global.fetch).toHaveBeenCalledWith(
        mockUploadUrl,
        expect.objectContaining({
          method: "PUT",
          body: file,
          headers: { "Content-Type": "image/jpeg" },
        })
      );
      expect(onUpload).toHaveBeenCalledWith(mockImageUrl);
    });
  });

  test("handles upload error gracefully", async () => {
    jest.spyOn(imagesApi.imagesApi, "getUploadUrl").mockResolvedValue({
      uploadUrl: "https://mock-s3-url.com/upload",
      imageUrl: "https://mock-s3-url.com/image.jpg",
    });
    global.fetch = jest.fn().mockResolvedValue({ ok: false });
    const onUpload = jest.fn();
    render(
      <AuthProvider>
        <ImageUpload onUpload={onUpload} />
      </AuthProvider>
    );
    const file = new File(["dummy content"], "test.jpg", {
      type: "image/jpeg",
    });
    const input = screen.getByLabelText("Upload Image");
    await userEvent.upload(input, file);
    // You can add error UI handling here if your component supports it
    await waitFor(() => {
      expect(onUpload).not.toHaveBeenCalled();
    });
  });
});
