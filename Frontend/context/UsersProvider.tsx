import React, { createContext, useContext, useState } from "react";
import axios from "axios";
import { useUrl } from "./UrlProvider";

const UsersContext = createContext<any>(null);

export const UsersProvider = ({ children }: any) => {
  const [users, setUsers] = useState([]);
  const [roles, setRoles] = useState([]);
  const { ipAddress, port } = useUrl();
  const [totalPages, setTotalPages] = useState();

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

  const getActiveUsers = async (pageNumber: number, limit: number) => {
    try {
      let url = `http://${ipAddress}:${port}/api/users?status=active&page=${pageNumber}&limit=${limit}`;

      let response = await axios.get(url);

      if (response.data.success === true) {
        setUsers(response.data.users);
        setTotalPages(response.data.totalPages);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const getArchivedUsers = async (pageNumber: number, limit: number) => {
    try {
      let url = `http://${ipAddress}:${port}/api/users?status=archived&page=${pageNumber}&limit=${limit}`;

      let response = await axios.get(url);

      if (response.data.success === true) {
        setUsers(response.data.users);
        setTotalPages(response.data.totalPages);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const filterUsers = async (
    user: string,
    pageNumber: number,
    limit: number
  ) => {
    try {
      let url = `http://${ipAddress}:${port}/api/users?userName=${user}&page=${pageNumber}&limit=${limit}`;

      let response = await axios.get(url);

      if (response.data.success === true) {
        setUsers(response.data.users);
        setTotalPages(response.data.totalPages);
      } else {
        console.log(response.data.message);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const getUsers = async (pageNumber: number, limit: number) => {
    try {
      let url = `http://${ipAddress}:${port}/api/users?page=${pageNumber}&limit=${limit}`;

      let response = await axios.get(url);

      if (response.data.success === true) {
        setUsers(response.data.users);
        setTotalPages(response.data.totalPages);
      }
    } catch (error: any) {
      console.log(error);
    }
  };

  return (
    <UsersContext.Provider
      value={{
        users,
        setUsers,
        roles,
        getUsers,
        filterUsers,
        totalPages,
        getArchivedUsers,
        getActiveUsers,
      }}
    >
      {children}
    </UsersContext.Provider>
  );
};

export const useUsers = () => useContext(UsersContext);
