import * as React from "react";
import { useEffect, useReducer } from "react";
import { fetchUsers } from "../actions/Users";
import { roleMapping } from "../actions/constants";

const initialState = {
  userList: [],
  user: {},
  showUserDetails: false,
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

  const { userList, user, showUserDetails } = localState;

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
                  <div>{user.name}</div>
                </td>
                <td>
                  <div>{user.email}</div>
                </td>
                <td>
                  <div>{user.role}</div>
                </td>
              </tr>
            </>
          ))}
        </tbody>
      </div>
    </div>
  );
}
export default UserList;
