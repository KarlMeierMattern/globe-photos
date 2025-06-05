// Jest unit test

import { render, screen, fireEvent } from "@testing-library/react";
import Form from "@/components/Form";
import "@testing-library/jest-dom";

beforeAll(() => {
  // Simple localStorage mock
  const localStorageMock = (function () {
    let store: Record<string, string> = {};
    return {
      getItem(key: string) {
        return store[key] || null;
      },
      setItem(key: string, value: string) {
        store[key] = value.toString();
      },
      clear() {
        store = {};
      },
      removeItem(key: string) {
        delete store[key];
      },
    };
  })();
  Object.defineProperty(globalThis, "localStorage", {
    value: localStorageMock,
  });
});

describe("Form", () => {
  beforeEach(() => {
    // Clear localStorage
    localStorage.clear();
  });

  // Test form validation
  test("validates required fields", () => {
    render(<Form modalIcon={false} setModalIcon={() => {}} />);
    const submitButton = screen.getByText("Add");
    fireEvent.click(submitButton);

    // check for errors
    expect(screen.getByText("Name is required")).toBeInTheDocument();
    expect(screen.getByText("Description is required")).toBeInTheDocument();
    expect(
      screen.getByText("Longitude is required and must be a number")
    ).toBeInTheDocument();
    expect(
      screen.getByText("Latitude is required and must be a number")
    ).toBeInTheDocument();
    expect(
      screen.getByText("At least one image is required")
    ).toBeInTheDocument();
  });

  // Test file processing
  test("handles file upload", () => {
    render(<Form modalIcon={false} setModalIcon={() => {}} />);
    const file = new File(["test"], "test.png", { type: "image/png" });
    const input = screen.getByLabelText(/Choose Image/i);
    fireEvent.change(input, { target: { files: [file] } });
    expect(screen.getByText("test.png")).toBeInTheDocument();
  });

  // Test localStorage merging
  test("merges submissions with same coordinates", async () => {
    render(<Form modalIcon={false} setModalIcon={() => {}} />);

    // First submission
    fireEvent.change(screen.getByPlaceholderText("Paris..."), {
      target: { value: "Paris" },
    });
    fireEvent.change(screen.getByPlaceholderText("Paris in summer..."), {
      target: { value: "Beautiful summer day" },
    });
    fireEvent.change(screen.getByPlaceholderText(/latitude/i), {
      target: { value: "48.8566" },
    });
    fireEvent.change(screen.getByPlaceholderText(/longitude/i), {
      target: { value: "2.3522" },
    });

    const file1 = new File(["test1"], "test1.png", { type: "image/png" });
    const input = screen.getByLabelText(/Choose Image/i);
    fireEvent.change(input, { target: { files: [file1] } });

    fireEvent.click(screen.getByText("Add"));

    // Wait for the form to be submitted
    await screen.findByText("Form submitted successfully");

    // Re-render the form for the second submission
    render(<Form modalIcon={false} setModalIcon={() => {}} />);

    // Second submission with same coordinates
    fireEvent.change(screen.getByPlaceholderText("Paris..."), {
      target: { value: "Paris again" },
    });
    fireEvent.change(screen.getByPlaceholderText("Paris in summer..."), {
      target: { value: "Another beautiful day" },
    });
    fireEvent.change(screen.getByPlaceholderText(/latitude/i), {
      target: { value: "48.8566" },
    });
    fireEvent.change(screen.getByPlaceholderText(/longitude/i), {
      target: { value: "2.3522" },
    });

    const input2 = screen.getByLabelText(/Choose Image/i);
    const file2 = new File(["test2"], "test2.png", { type: "image/png" });
    fireEvent.change(input2, { target: { files: [file2] } });

    fireEvent.click(screen.getByText("Add"));

    // Wait for the form to be submitted
    await screen.findByText("Form submitted successfully");

    // Verify localStorage
    const storedData = JSON.parse(localStorage.getItem("formData") || "[]");
    expect(storedData.length).toBe(1); // Should be merged
    expect(storedData[0].files.length).toBe(2); // Should have both files
    expect(storedData[0].locationName).toBe("paris again"); // Should use latest submission
  });
});

// Used for component-level unit tests
// Can use JSX/TSX syntax
// Runs in Node environment
