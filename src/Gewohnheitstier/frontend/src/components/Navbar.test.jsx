// client/src/components/Navbar.test.jsx
import React from "react";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { BrowserRouter } from "react-router-dom";
import Navbar from "./Navbar";

describe("Navbar", () => {
  test("renders navigation links and logout button", () => {
    const mockLogout = jest.fn();

    render(
      <BrowserRouter>
        <Navbar onLogout={mockLogout} />
      </BrowserRouter>
    );

    // Check links
    expect(screen.getByText("Übersicht")).toBeInTheDocument();
    expect(screen.getByText("Hinzufügen")).toBeInTheDocument();

    // Logout only visible on larger screens due to CSS, but still in DOM
    expect(screen.getByText("Logout")).toBeInTheDocument();
  });

  test("calls onLogout when Logout button is clicked", async () => {
    const mockLogout = jest.fn();
    const user = userEvent.setup();

    render(
      <BrowserRouter>
        <Navbar onLogout={mockLogout} />
      </BrowserRouter>
    );

    const logoutButton = screen.getByText("Logout");
    await user.click(logoutButton);

    expect(mockLogout).toHaveBeenCalledTimes(1);
  });
});
