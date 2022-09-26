import AsyncStorage from "@react-native-async-storage/async-storage";
import { createContext, useReducer } from "react";

export const UserContext = createContext();

const initialState = {
  isLogin: false,
  isAdmin: false,
  data: {},
};

function reducer(state, action) {
  const { type, payload } = action;

  switch (type) {
    case "AUTH_SUCCESS":
    case "LOGIN_SUCCESS":
      // buat mastiin aja si, sebenernya dihapus gpp
      AsyncStorage.setItem("token", payload?.token);
      return {
        isLogin: true,
        isAdmin: payload?.user?.role[0] === "admin" ? true : false,
        data: payload,
      };
    case "AUTH_ERROR":
    case "LOGOUT_SUCCESS":
      AsyncStorage.removeItem("token");
      return {
        isLogin: false,
        isAdmin: false,
        data: {},
      };
    default:
      throw new Error();
  }
}

export function UserContextProvider({ children }) {
  const [state, dispatch] = useReducer(reducer, initialState);

  return (
    <UserContext.Provider value={[state, dispatch]}>
      {children}
    </UserContext.Provider>
  );
}
