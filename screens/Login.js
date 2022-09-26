import AsyncStorage from "@react-native-async-storage/async-storage";
import { Box, Button, Image, Input, Text } from "native-base";
import { useContext, useState } from "react";
import { showMessage } from "react-native-flash-message";
import { useMutation } from "react-query";
import WaysTODOAuthImage from "../assets/waystodo-auth.png";
import { API, setAuthorization } from "../config/api";
import { UserContext } from "../context/userContext";

function Login({ navigation }) {
  const [state, dispatch] = useContext(UserContext);
  const [dataLogin, setDataLogin] = useState({
    email: "",
    password: "",
  });

  function handleChangeText(name, value) {
    setDataLogin({
      ...dataLogin,
      [name]: value,
    });
  }

  const handleSubmit = useMutation(async (e) => {
    e.preventDefault();
    try {
      const response = await API.post("/auth/login", dataLogin);
      AsyncStorage.setItem("token", response.data.token);
      // console.log(response.data);
      const payload = response.data;
      showMessage({
        message: "Login berhasil!",
        type: "success",
      });
      dispatch({
        type: "LOGIN_SUCCESS",
        payload,
      });
      // harus di set biar ganteng
      setAuthorization(response.data.token);
      //Login berhasil cus navigate ke home 😁
      navigation.navigate("Main");
    } catch (err) {
      showMessage({
        message: "Email / password salah!",
        type: "danger",
      });
    }
  });

  return (
    <Box display="flex" flex={1} alignItems="center" bg="white">
      <Image
        source={WaysTODOAuthImage}
        width={275}
        height={275}
        resizeMode="contain"
        alt={WaysTODOAuthImage}
      />
      <Box display="flex" w={"90%"}>
        <Text fontWeight="bold" fontSize={30}>
          Login
        </Text>
        <Box display="flex" w={"100%"} mt={5} alignItems="center">
          <Input
            w={"100%"}
            bg="muted.200"
            placeholder="Email"
            py={3}
            keyboardType={"email-address"}
            fontSize={15}
            borderRadius="sm"
            borderColor="muted.500"
            onChangeText={(value) => handleChangeText("email", value)}
          />
          <Input
            w={"100%"}
            bg="muted.200"
            placeholder="Password"
            py={3}
            mt={5}
            fontSize={15}
            secureTextEntry={true}
            borderRadius="sm"
            borderColor="muted.500"
            onChangeText={(value) => handleChangeText("password", value)}
          />
          <Button
            w={"100%"}
            mt={5}
            bg="error.500"
            _hover={{ backgroundColor: "error.600" }}
            py={3}
            _text={{
              fontSize: "md",
              fontWeight: "bold",
            }}
            onPress={(e) => handleSubmit.mutate(e)}
          >
            Login
          </Button>
          <Text mt={3}>
            New users?
            <Text
              color="danger.500"
              fontWeight="bold"
              mx={2}
              onPress={() => navigation.navigate("Register")}
            >
              Register
            </Text>
          </Text>
        </Box>
      </Box>
    </Box>
  );
}

export default Login;
