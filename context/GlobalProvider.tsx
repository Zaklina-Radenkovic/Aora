import { createContext, useContext, useEffect, useState } from "react";

import { getCurrentUser } from "../lib/appwrite";

export interface User {
  $id: string;
  username: string;
  email: string;
  avatar: string;
}

interface GlobalContextType {
  isLoggedIn: boolean;
  setIsLoggedIn: React.Dispatch<React.SetStateAction<boolean>>;
  user: User | null;
  setUser: React.Dispatch<React.SetStateAction<null | User>>;
  isLoading: boolean;
  newPostCreated: boolean;
  setNewPostCreated: React.Dispatch<React.SetStateAction<boolean>>;
}

const defaultContextValues: GlobalContextType = {
  isLoggedIn: false,
  setIsLoggedIn: () => {},
  user: null,
  setUser: () => {},
  isLoading: true,
  newPostCreated: false,
  setNewPostCreated: () => {},
};

const GlobalContext = createContext<GlobalContextType | undefined>(
  defaultContextValues
);

const GlobalProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const [newPostCreated, setNewPostCreated] = useState(false);

  const isUser = (res: any): res is User => {
    return (
      res &&
      typeof res.$id === "string" &&
      typeof res.username === "string" &&
      typeof res.email === "string" &&
      typeof res.avatar === "string"
    );
  };

  useEffect(() => {
    getCurrentUser()
      .then((res) => {
        if (isUser(res)) {
          setIsLoggedIn(true);

          setUser(res);
        } else {
          setIsLoggedIn(false);
          setUser(null);
        }
      })
      .catch((error) => {
        console.log(error);
      })
      .finally(() => {
        setIsLoading(false);
      });
  }, []);

  return (
    <GlobalContext.Provider
      value={{
        isLoggedIn,
        setIsLoggedIn,
        user,
        setUser,
        isLoading,
        newPostCreated,
        setNewPostCreated,
      }}
    >
      {children}
    </GlobalContext.Provider>
  );
};

export const useGlobalContext = () => {
  const context = useContext(GlobalContext);
  if (!context) {
    throw new Error("useGlobalContext must be used within a GlobalProvider");
  }
  return context;
};
export default GlobalProvider;
