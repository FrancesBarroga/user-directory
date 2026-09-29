import axios from "axios";
import { describe, it, expect, afterEach, vi } from "vitest";
import { fetchUsers } from "../../actions/Users";

vi.mock("axios");

describe("fetchUsers", () => {
  afterEach(() => {
    vi.clearAllMocks();
  });

  it("returns the response when the request succeeds", async () => {
    const mockResponse = {
      data: [
        { id: 1, name: "Leanne Graham" },
        { id: 2, name: "Ervin Howell" },
      ],
    };

    axios.get.mockResolvedValue(mockResponse);

    const result = await fetchUsers();

    expect(axios.get).toHaveBeenCalledWith(
      "https://jsonplaceholder.typicode.com/users",
    );
    expect(result).toBe(mockResponse);
  });

  it("throws error.response when the request fails with a response", async () => {
    const responseError = {
      status: 500,
      data: {
        message: "Internal Server Error",
      },
    };

    axios.get.mockRejectedValue({
      response: responseError,
    });

    await expect(fetchUsers()).rejects.toBe(responseError);
  });

  it("throws the original error when there is no response", async () => {
    const error = new Error("Network Error");

    axios.get.mockRejectedValue(error);

    await expect(fetchUsers()).rejects.toBe(error);
  });
});
