import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, waitFor, fireEvent } from "@testing-library/react";
import "@testing-library/jest-dom/vitest";
import { mockUsers } from "../../actions/constants";

import UserList from "../../UserList";
import { fetchUsers } from "../../actions/Users";

vi.mock("../../actions/Users", () => ({
  fetchUsers: vi.fn(),
}));

vi.mock("@heroicons/react/16/solid", () => ({
  ChevronDownIcon: () => <span data-testid="chevron-down" />,
  ChevronUpIcon: () => <span data-testid="chevron-up" />,
}));

describe("UserList", () => {
  beforeEach(() => {
    vi.clearAllMocks();

    fetchUsers.mockResolvedValue({
      data: mockUsers,
    });
  });

  it("renders the User Directory", () => {
    render(<UserList />);

    expect(screen.getByText("User Directory")).toBeInTheDocument();
    expect(
      screen.getByPlaceholderText("Search by name or role..."),
    ).toBeInTheDocument();
    expect(screen.getByRole("combobox")).toBeInTheDocument();
  });

  it("fetches and displays users", async () => {
    render(<UserList />);

    await waitFor(() => {
      expect(screen.getByText("Leanne Graham")).toBeInTheDocument();
      expect(screen.getByText("Ervin Howell")).toBeInTheDocument();
    });

    expect(fetchUsers).toHaveBeenCalledTimes(1);
  });

  it("displays user email and role", async () => {
    render(<UserList />);

    await waitFor(() => {
      expect(screen.getByText("leanne@example.com")).toBeInTheDocument();
      expect(screen.getByText("ervin@example.com")).toBeInTheDocument();
    });
  });

  it("filters users by name", async () => {
    render(<UserList />);

    await waitFor(() => {
      expect(screen.getByText("Leanne Graham")).toBeInTheDocument();
    });

    const searchInput = screen.getByPlaceholderText(
      "Search by name or role...",
    );

    fireEvent.change(searchInput, {
      target: { value: "Leanne" },
    });

    expect(screen.getByText("Leanne Graham")).toBeInTheDocument();
    expect(screen.queryByText("Ervin Howell")).not.toBeInTheDocument();
  });

  it("shows User not found when search has no results", async () => {
    render(<UserList />);

    await waitFor(() => {
      expect(screen.getByText("Leanne Graham")).toBeInTheDocument();
    });

    const searchInput = screen.getByPlaceholderText(
      "Search by name or role...",
    );

    fireEvent.change(searchInput, {
      target: { value: "Does Not Exist" },
    });

    expect(screen.getByText("User not found")).toBeInTheDocument();
  });

  it("filters users by role", async () => {
    render(<UserList />);

    await waitFor(() => {
      expect(screen.getByText("Leanne Graham")).toBeInTheDocument();
    });

    const roleSelect = screen.getByRole("combobox");

    fireEvent.change(roleSelect, {
      target: { value: "Engineer" },
    });

    expect(screen.getByText("Leanne Graham")).toBeInTheDocument();
    expect(screen.queryByText("Ervin Howell")).not.toBeInTheDocument();
  });

  it("can filter by both search and role", async () => {
    render(<UserList />);

    await waitFor(() => {
      expect(screen.getByText("Leanne Graham")).toBeInTheDocument();
    });

    const searchInput = screen.getByPlaceholderText(
      "Search by name or role...",
    );

    const roleSelect = screen.getByRole("combobox");

    fireEvent.change(searchInput, {
      target: { value: "Leanne" },
    });

    fireEvent.change(roleSelect, {
      target: { value: "Engineer" },
    });

    expect(screen.getByText("Leanne Graham")).toBeInTheDocument();
    expect(screen.queryByText("Ervin Howell")).not.toBeInTheDocument();
  });

  it("shows user details when the expand button is clicked", async () => {
    render(<UserList />);

    await waitFor(() => {
      expect(screen.getByText("Leanne Graham")).toBeInTheDocument();
    });

    const buttons = screen.getAllByRole("button");

    fireEvent.click(buttons[0]);

    expect(screen.getByText("Phone: 123-456-789")).toBeInTheDocument();
    expect(screen.getByText("Comapany: Romaguera-Crona")).toBeInTheDocument();

    expect(
      screen.getByText("Address: Apt. 123, Main Street, Gwenborough"),
    ).toBeInTheDocument();
  });

  it("hides user details when the expand button is clicked again", async () => {
    render(<UserList />);

    await waitFor(() => {
      expect(screen.getByText("Leanne Graham")).toBeInTheDocument();
    });

    const buttons = screen.getAllByRole("button");

    fireEvent.click(buttons[0]);

    expect(screen.getByText("Phone: 123-456-789")).toBeInTheDocument();

    fireEvent.click(buttons[0]);

    expect(screen.queryByText("Phone: 123-456-789")).not.toBeInTheDocument();
  });

  it("handles fetchUsers failure", async () => {
    fetchUsers.mockRejectedValue(new Error("Network Error"));

    render(<UserList />);

    await waitFor(() => {
      expect(fetchUsers).toHaveBeenCalledTimes(1);
    });
  });
});
