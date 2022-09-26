import { FontAwesome5, MaterialIcons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { useContext, useEffect, useState } from "react";
import FlashMessage from "react-native-flash-message";
import Spinner from "react-native-loading-spinner-overlay";
import { API, setAuthorization } from "./config/api";
import { UserContext } from "./context/userContext";
import AddCategory from "./screens/AddCategory";
import AddList from "./screens/AddList";
import DetailList from "./screens/DetailList";
import Home from "./screens/Home";
import Login from "./screens/Login";
import Register from "./screens/Register";
import Welcome from "./screens/Welcome";

function Container() {
  const NativeStack = createNativeStackNavigator();
  const Tab = createBottomTabNavigator();
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
          // console.log("response yang mau dijadiin payload ini bro", response);
          // console.log("ini data response harusnya", response);
          if (response.status >= 400) {
            return dispatch({
              type: "AUTH_ERROR",
            });
          }

          // console.log("ini data response pas berhasil", response);
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
          // console.log("ini state error", state);
        });
      setIsLoading(false);
    } catch (error) {
      // console.log(error);
      setIsLoading(false);
    }
  }

  async function isAsyncTokenExist() {
    await AsyncStorage.getItem("token");
    checkAuth();
  }

  useEffect(() => {
    isAsyncTokenExist();
  }, []);

  function BottomTab() {
    return (
      <Tab.Navigator
        screenOptions={({ route }) => ({
          tabBarLabel: () => {
            return null;
          },
          tabBarIcon: ({ focused, color, size }) => {
            let iconType;
            let iconName;
            let iconColor;
            if (route.name === "Home") {
              iconType = "fa5";
              iconName = "clipboard-list";
              iconColor = focused ? "#FF5555" : "#D9D9D9";
            }

            if (route.name === "AddList") {
              iconType = "material-icon";
              iconName = "playlist-add";
              iconColor = focused ? "#FF5555" : "#D9D9D9";
            }

            if (route.name === "AddCategory") {
              iconType = "material-icon";
              iconName = "category";
              iconColor = focused ? "#FF5555" : "#D9D9D9";
            }

            return iconType == "fa5" ? (
              <FontAwesome5 name={iconName} size={size} color={iconColor} />
            ) : (
              <MaterialIcons name={iconName} size={size} color={iconColor} />
            );
          },
        })}
      >
        <Tab.Screen
          name="Home"
          component={Home}
          options={{
            headerShown: false,
          }}
        />
        <Tab.Screen
          name="AddList"
          component={AddList}
          options={{
            headerShown: false,
          }}
        />
        <Tab.Screen
          name="AddCategory"
          component={AddCategory}
          options={{
            headerShown: false,
          }}
        />
      </Tab.Navigator>
    );
  }

  return (
    <>
      {isLoading ? (
        <Spinner visible={isLoading} />
      ) : state.isLogin ? (
        <>
          <NativeStack.Navigator initialRouteName="Main">
            <NativeStack.Screen
              name="Main"
              component={BottomTab}
              options={{
                headerShown: false,
              }}
            />
            <NativeStack.Screen name="DetailList" component={DetailList} />
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
          </NativeStack.Navigator>
        </>
      )}
      <FlashMessage position="top" />
    </>
  );
}

export default Container;
