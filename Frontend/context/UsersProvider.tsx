import React, { createContext, useContext, useState } from "react";
import axios from "axios";
import { useUrl } from "./UrlProvider";

const UsersContext = createContext<any>(null);

export const UsersProvider = ({ children }: any) => {
  const [users, setUsers] = useState([]);
  const [roles, setRoles] = useState([]);
  const { ipAddress, port } = useUrl();

  interface user {
    _id: string;
    personalInfo: {
      firstName: string;
      lastName: string;
      middleName: string;
      dateOfBirth: Date;
      gender: string;
      civilStatus: string;
      nationality: string;
    };
    contactInfo: {
      address: {
        houseNumber: number;
        street: string;
        barangay: string;
        city: string;
      };
      phoneNumbers: [string];
    };
    economicInfo: {
      employmentStatus: string;
      occupation: string;
    };
    credentials: {
      level: string;
      email: string;
      password: string;
    };
  }

  const getUsers = async () => {
    try {
      let url = `http://${ipAddress}:${port}/api/users/`;
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

  const filterUsers = async (role: string, user: string) => {
    try {
      let url = `http://${ipAddress}:${port}/api/users?`;

      if (role !== "All") {
        url += `level=${role}`;
      }

      if (user !== "") {
        url += `${role !== "All" ? "&" : ""}userName=${user}`;
      }

      let response = await axios.get(url);

      if (response.status === 200) {
        setUsers(response.data.users);
      } else {
        console.log(response.data.message);
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
