import { createNativeStackNavigator } from "@react-navigation/native-stack";
import Welcome from "./screens/Welcome";
import Login from "./screens/Login";
import Register from "./screens/Register";

const NativeStack = createNativeStackNavigator();

function Container() {
  return (
    <NativeStack.Navigator initialRouteName="Welcome">
      <NativeStack.Screen
        name="Welcome"
        component={Welcome}
        options={{
          headerShown: false,
        }}
      />
      <NativeStack.Screen name="Login" component={Login} />
      <NativeStack.Screen name="Register" component={Register} />
    </NativeStack.Navigator>
  );
}

export default Container;
