import * as React from "react";
import { useEffect, useReducer, useState } from "react";
import { ChevronDownIcon, ChevronUpIcon } from "@heroicons/react/16/solid";
import { fetchUsers } from "../actions/Users";
import { roleMapping } from "../actions/constants";

const initialState = {
  userList: [],
  filteredUserList: [],
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

  const { userList, user, showUserDetails, selectedUser, filteredUserList } =
    localState;

  useEffect(() => {
    fetchUsers()
      .then((response) => {
        const users = response.data;
        const usersWithRoles = users.map((user) => ({
          ...user,
          role: roleMapping[user.id] || "None",
        }));
        localDispatch({
          type: "update",
          fields: {
            userList: usersWithRoles,
            filteredUserList: usersWithRoles,
          },
        });
      })
      .catch((err) => setError(err.message));
  }, []);

  const [searchQuery, setSearchQuery] = useState("");
  const [selectedRole, setSelectedRole] = useState("");
  const [error, setError] = useState(null);

  useEffect(() => {
    const filteredUsers = userList.filter((user) => {
      const matchesSearch = user.name
        .toLowerCase()
        .includes(searchQuery.toLowerCase());
      const matchesRole = selectedRole === "" || user.role === selectedRole;
      return matchesSearch && matchesRole;
    });

    if (selectedRole !== "") {
      localDispatch({
        type: "update",
        fields: {
          filteredUserList: filteredUsers,
        },
      });
    } else if (searchQuery !== "") {
      localDispatch({
        type: "update",
        fields: {
          filteredUserList: filteredUsers,
        },
      });
    } else {
      localDispatch({
        type: "update",
        fields: {
          filteredUserList: userList,
        },
      });
    }
  }, [searchQuery, selectedRole]);

  const handleRoleChange = (event) => {
    setSelectedRole(event.target.value);
  };

  if (error !== "") {
    <div>There was a problem louding the users.</div>;
  }

  return (
    <div>
      <div class="mb-4 text-center">User Directory</div>
      <div class="flex">
        <div>
          Search:{" "}
          <input
            type="text"
            placeholder="Search by name or role..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <div class="ml-4">
          Filter:
          <select
            id="role-select"
            value={selectedRole}
            onChange={handleRoleChange}
            style={{
              padding: "5px 10px",
              borderRadius: "4px",
              marginBottom: "20px",
            }}
          >
            <option value="">All Roles</option>
            <option value="Engineer">Engineer</option>
            <option value="Designer">Designer</option>
            <option value="Product Manager">Product Manager</option>
            <option value="QA Engineer">QA Engineer</option>
          </select>
        </div>
      </div>

      <div class="table-auto">
        <thead>
          <tr>
            <th>Name</th>
            <th>Email</th>
            <th>Role</th>
          </tr>
        </thead>
        {filteredUserList.length !== 0 ? (
          <tbody>
            {filteredUserList.map((user) => (
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
        ) : (
          <div>User not found</div>
        )}
      </div>
    </div>
  );
}
export default UserList;
