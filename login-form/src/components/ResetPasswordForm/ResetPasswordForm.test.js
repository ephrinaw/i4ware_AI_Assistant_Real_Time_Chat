import React from "react";
import { render, fireEvent } from "@testing-library/react";
import ResetPasswordForm from "./ResetPasswordForm";

describe("ResetPasswordForm component", () => {
  test("renders without errors", () => {
    render(<ResetPasswordForm />);
  });
});

describe("ResetPasswordForm", () => {
  test("renders without errors", () => {
    render(<ResetPasswordForm />);
  });

  test("calls onSubmit when form is submitted", () => {
    const mockSubmit = jest.fn();
    const { getByLabelText, getByText, getByRole } = render(
      <ResetPasswordForm onSubmit={mockSubmit} />
    );

    const newPasswordInput = getByLabelText("New Password");
    fireEvent.change(newPasswordInput, { target: { value: "new password" } });

    const confirmNewPasswordInput = getByLabelText("Confirm Password");
    fireEvent.change(confirmNewPasswordInput, {
      target: { value: "new password" },
    });

    const form = getByRole("form");
    fireEvent.submit(form);

    expect(mockSubmit).toHaveBeenCalledWith(
      expect.anything(),
      expect.objectContaining({
        email: expect.anything(),
        password: expect.anything(),
        confirmPassword: expect.anything(),
      })
    );
  });
});

describe("ResetPasswordForm validation", () => {
  test("displays error message when password is too short", () => {
    const { getByLabelText, getByText } = render(<ResetPasswordForm />);
    const passwordInput = getByLabelText("New Password");
    fireEvent.change(passwordInput, { target: { value: "short" } });
    const form = getByRole("form");
    fireEvent.submit(form);
    expect(
      getByText("Password must be at least 8 characters")
    ).toBeInTheDocument();
  });

  test("displays error message when password and confirm password do not match", () => {
    const { getByLabelText, getByText } = render(<ResetPasswordForm />);
    const passwordInput = getByLabelText("New Password");
    fireEvent.change(passwordInput, { target: { value: "password1" } });
    const confirmPasswordInput = getByLabelText("Confirm Password");
    fireEvent.change(confirmPasswordInput, { target: { value: "password2" } });
    const form = getByRole("form");
    fireEvent.submit(form);
    expect(getByText("Passwords do not match")).toBeInTheDocument();
  });

  test("displays error message when server returns an error", async () => {
    const mockSubmit = jest
      .fn()
      .mockRejectedValueOnce(new Error("Server error"));
    const { getByLabelText, getByText, getByRole } = render(
      <ResetPasswordForm onSubmit={mockSubmit} />
    );

    const passwordInput = getByLabelText("New Password");
    fireEvent.change(passwordInput, { target: { value: "new password" } });
    const confirmPasswordInput = getByLabelText("Confirm Password");
    fireEvent.change(confirmPasswordInput, {
      target: { value: "new password" },
    });

    const form = getByRole("form");
    fireEvent.submit(form);

    expect(getByText("Server error")).toBeInTheDocument();
  });

  test("clears error message when user corrects error", async () => {
    const mockSubmit = jest
      .fn()
      .mockRejectedValueOnce(new Error("Server error"));
    const { getByLabelText, getByText, getByRole, queryByText } = render(
      <ResetPasswordForm onSubmit={mockSubmit} />
    );

    const passwordInput = getByLabelText("New Password");
    fireEvent.change(passwordInput, { target: { value: "new password" } });
    const confirmPasswordInput = getByLabelText("Confirm Password");
    fireEvent.change(confirmPasswordInput, {
      target: { value: "new password" },
    });

    const form = getByRole("form");
    fireEvent.submit(form);
    expect(getByText("Server error")).toBeInTheDocument();

    fireEvent.change(passwordInput, {
      target: { value: "new password12345678" },
    });
    fireEvent.submit(form);
    expect(queryByText("Server error")).toBeNull();
  });
});
