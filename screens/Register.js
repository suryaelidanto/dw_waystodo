import { Box, Button, Image, Input, Text } from "native-base";
import { useState } from "react";
import { showMessage } from "react-native-flash-message";
import { useMutation } from "react-query";
import WaysTODOAuthImage from "../assets/waystodo-auth.png";
import { API } from "../config/api";

function Register({ navigation }) {
  const [dataRegister, setDataRegister] = useState({
    email: "",
    firstName: "",
    password: "",
  });

  function handleChangeText(name, value) {
    setDataRegister({
      ...dataRegister,
      [name]: value,
    });
  }

  const handleSubmit = useMutation(async (e) => {
    e.preventDefault();
    try {
      // pengecekan pake trim
      if (
        dataRegister.email.trim() === "" ||
        dataRegister.email.trim() === null
      ) {
        return showMessage({
          message: "Register gagal!",
          description: "Email tidak boleh kosong!",
          type: "danger",
        });
      }

      if (
        dataRegister.firstName.trim() === "" ||
        dataRegister.firstName.trim() === null
      ) {
        return showMessage({
          message: "Register gagal!",
          description: "Nama tidak boleh kosong!",
          type: "danger",
        });
      }

      // jangan trim password, bisa aja ada orang yang mau pake spasi doang passwordnya
      if (dataRegister.password === "" || dataRegister.password === null) {
        return showMessage({
          message: "Register gagal!",
          description: "Password tidak boleh kosong!",
          type: "danger",
        });
      }

      // push data register pake trim biar ga disalahgunakan 😎
      const response = await API.post(
        "/auth/register",
        {
          email: dataRegister.email.trim(),
          firstName: dataRegister.firstName.trim(),
          password: dataRegister.password,
        },
        {
          validateStatus: () => true,
        }
      );

      if (response.status >= 400) {
        return showMessage({
          message: "Register gagal!",
          description: `${response.data.message}`,
          type: "danger",
        });
      }

      // console.log(response);

      showMessage({
        message: "Register berhasil! Silahkan Login 😁",
        type: "success",
      });

      // berhasil register, diarahin ke login
      navigation.navigate("Login");
    } catch (err) {
      // pake catch buat jaga2 aja, walaupun kayaknya ga bakal ke sini, udah pake validate status
      showMessage({
        message: "Register gagal!",
        description: `${err}`,
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
          Register
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
            value={dataRegister?.email}
          />
          <Input
            w={"100%"}
            bg="muted.200"
            placeholder="Name"
            py={3}
            mt={5}
            fontSize={15}
            borderRadius="sm"
            borderColor="muted.500"
            onChangeText={(value) => handleChangeText("firstName", value)}
            value={dataRegister?.firstName}
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
            value={dataRegister?.password}
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
            Register
          </Button>
          <Text mt={3}>
            Joined us before ?
            <Text
              color="danger.500"
              fontWeight="bold"
              mx={2}
              onPress={() => navigation.navigate("Login")}
            >
              Login
            </Text>
          </Text>
        </Box>
      </Box>
    </Box>
  );
}

export default Register;
