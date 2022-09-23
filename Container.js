import AsyncStorage from "@react-native-async-storage/async-storage";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { useContext, useEffect, useState } from "react";
import FlashMessage from "react-native-flash-message";
import Spinner from "react-native-loading-spinner-overlay";
import { API, setAuthorization } from "./config/api";
import { UserContext } from "./context/userContext";
import Home from "./screens/Home";
import Login from "./screens/Login";
import Register from "./screens/Register";
import Welcome from "./screens/Welcome";

function Container() {
  const NativeStack = createNativeStackNavigator();
  const [state, dispatch] = useContext(UserContext);
  const [isLoading, setIsLoading] = useState(true);

  async function checkAuth() {
    try {
      let token = await AsyncStorage.getItem("token");

      if (token) setAuthorization(token);

      await API.post("/auth/verify-token", {
        validateStatus: () => true,
      })
        .then((response) => {
          console.log("response yang mau dijadiin payload ini bro", response);
          console.log("ini data response harusnya", response);
          if (response.status >= 400) {
            return dispatch({
              type: "AUTH_ERROR",
            });
          }

          console.log("ini data response pas berhasil", response);
          const payload = response.data;
          dispatch({
            type: "AUTH_SUCCESS",
            payload,
          });
        })
        .catch((error) => {
          dispatch({
            type: "AUTH_ERROR",
          });
          console.log("ini state error", state);
        });
      setIsLoading(false);
    } catch (error) {
      console.log(error);
      setIsLoading(false);
    }
  }

  useEffect(() => {
    (async () => {
      if (await AsyncStorage.getItem("token")) return checkAuth();
      setIsLoading(false);
    })();
    console.log("ini state", state);
  }, [isLoading]);

  return (
    <>
      {isLoading ? (
        <Spinner visible={isLoading} />
      ) : state.isLogin ? (
        <>
          <NativeStack.Navigator initialRouteName="Home">
            <NativeStack.Screen
              name="Home"
              component={Home}
              options={{
                headerShown: false,
              }}
            />
          </NativeStack.Navigator>
        </>
      ) : (
        <>
          <NativeStack.Navigator initialRouteName="Welcome">
            <NativeStack.Screen
              name="Welcome"
              component={Welcome}
              options={{
                headerShown: false,
              }}
            />
            <NativeStack.Screen
              name="Login"
              component={Login}
              options={{
                headerShown: false,
              }}
            />
            <NativeStack.Screen
              name="Register"
              component={Register}
              options={{
                headerShown: false,
              }}
            />
            <NativeStack.Screen
              name="Home"
              component={Home}
              options={{
                headerShown: false,
              }}
            />
          </NativeStack.Navigator>
        </>
      )}
      <FlashMessage position="top" />
    </>
  );
}

export default Container;
