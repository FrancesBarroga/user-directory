import * as React from "react";
import { useEffect, useReducer } from "react";
import { ChevronDownIcon, ChevronUpIcon } from "@heroicons/react/16/solid";
import { fetchUsers } from "../actions/Users";
import { roleMapping } from "../actions/constants";

const initialState = {
  userList: [],
  user: {},
  showUserDetails: false,
  selectedUser: "",
};

const componentReducer = (state, action) => {
  switch (action.type) {
    case "update":
      return {
        ...state,
        ...action.fields,
      };
    default:
      throw new Error("Invalid action type");
  }
};

function UserList() {
  const [localState, localDispatch] = useReducer(
    componentReducer,
    initialState,
  );

  const { userList, user, showUserDetails, selectedUser } = localState;

  useEffect(() => {
    fetchUsers().then((response) => {
      const users = response.data;
      const usersWithRoles = users.map((user) => ({
        ...user,
        role: roleMapping[user.id] || "None",
      }));
      localDispatch({
        type: "update",
        fields: {
          userList: usersWithRoles,
        },
      });
    });
  }, []);

  return (
    <div>
      <div class="table-auto">
        <thead>
          <tr>
            <th>Name</th>
            <th>Email</th>
            <th>Role</th>
          </tr>
        </thead>
        <tbody>
          {userList.map((user) => (
            <>
              <tr>
                <td>
                  <div class="m-4">{user.name}</div>
                </td>
                <td>
                  <div>{user.email}</div>
                </td>
                <td>
                  <div>{user.role}</div>
                </td>
                <td>
                  <button
                    class="ml-3"
                    onClick={() => {
                      localDispatch({
                        type: "update",
                        fields: {
                          showUserDetails: !showUserDetails,
                          selectedUser: selectedUser === "" ? user.id : "",
                        },
                      });
                    }}
                  >
                    {showUserDetails && user.id === selectedUser ? (
                      <ChevronUpIcon width={20} />
                    ) : (
                      <ChevronDownIcon width={20} />
                    )}
                  </button>
                </td>
              </tr>
              {showUserDetails && user.id === selectedUser ? (
                <div class="m-4">
                  <div>Phone: {user.phone}</div>
                  <div>Comapany: {user.company.name}</div>
                  <div>
                    Address: {user.address.suite}, {user.address.street},{" "}
                    {user.address.city}
                  </div>
                </div>
              ) : (
                <></>
              )}
            </>
          ))}
        </tbody>
      </div>
    </div>
  );
}
export default UserList;
