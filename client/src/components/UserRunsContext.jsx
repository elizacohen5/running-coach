import React, { createContext, useState, useContext, useEffect } from "react";
import { useUser } from "./UserContext";

const UserRunsContext = createContext();

export const useUserRuns = () => {
    return useContext(UserRunsContext);
  };

export const UserRunsProvider = ({ children }) => {
  const { user } = useUser();
  const [userRuns, setUserRuns] = useState([]);

  useEffect(() => {
    if (user) {
      fetch(`http://127.0.0.1:5555/runs/${user.id}`)
        .then((r) => r.json())
        .then((runsArray) => {
          setUserRuns(runsArray);
        })
        .catch((err) => console.log(err));
    }
  }, [user]);

  return (
    <UserRunsContext.Provider value={{ userRuns, setUserRuns }}>
      {children}
    </UserRunsContext.Provider>
  );
};
