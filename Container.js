import { createNativeStackNavigator } from "@react-navigation/native-stack";
import Welcome from "./screens/Welcome";
import Login from "./screens/Login";
import Register from "./screens/Register";
import FlashMessage from "react-native-flash-message";

const NativeStack = createNativeStackNavigator();

function Container() {
  return (
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
      <FlashMessage position="top" />
    </>
  );
}

export default Container;
