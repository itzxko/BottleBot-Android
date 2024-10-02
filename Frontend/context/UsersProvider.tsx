import React, { createContext, useContext, useState } from "react";
import axios from "axios";

const UsersContext = createContext<any>(null);

export const UsersProvider = ({ children }: any) => {
  const [users, setUsers] = useState([]);
  const [roles, setRoles] = useState([]);

  const getUsers = async () => {
    try {
      let url = "http://192.168.1.104:8080/api/users/";
      let response = await axios.get(url);

      if (response.status === 200) {
        setUsers(response.data.users);
        setRoles(
          Array.from(
            new Set(
              response.data.users.map((user: any) => user.credentials.level)
            )
          )
        );
      } else {
        console.log(response.data.message);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const filterUsers = async (role: string) => {
    try {
      if (role === "All") {
        getUsers();
      } else {
        let url = `http://192.168.254.139:8080/api/users?level=${role}`;

        let response = await axios.get(url);

        if (response.status === 200) {
          setUsers(response.data.users);
        } else {
          console.log(response.data.message);
        }
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <UsersContext.Provider
      value={{ users, setUsers, roles, getUsers, filterUsers }}
    >
      {children}
    </UsersContext.Provider>
  );
};

export const useUsers = () => useContext(UsersContext);
