import { NavigationContainer } from "@react-navigation/native";
import { useFonts } from "expo-font";
import { extendTheme, NativeBaseProvider } from "native-base";
import React from "react";
import { QueryClient, QueryClientProvider } from "react-query";
import Container from "./Container";
import { UserContextProvider } from "./context/userContext";

export default function App() {
  const [fontsLoaded] = useFonts({
    AvenirLTStdBlack: require("./assets/fonts/AvenirLTStd-Black.otf"),
    AvenirLTStdBook: require("./assets/fonts/AvenirLTStd-Book.otf"),
  });

  const config = {
    useSystemColorMode: false,
    initialColorMode: "light",
  };

  const fontConfig = {
    AvenirLTStd: {
      400: {
        normal: "AvenirLTStdBook",
        bold: "AvenirLTStdBlack",
      },
    },
  };

  const theme = extendTheme({
    config,
    fontConfig,
    fonts: {
      heading: "AvenirLTStdBlack",
      body: "AvenirLTStdBook",
      mono: "AvenirLTStdBook",
    },
  });

  if (!fontsLoaded) {
    return <></>;
  }

  const client = new QueryClient();

  return (
    <NavigationContainer>
      <QueryClientProvider client={client}>
        <NativeBaseProvider theme={theme}>
          <UserContextProvider>
            <Container />
          </UserContextProvider>
        </NativeBaseProvider>
      </QueryClientProvider>
    </NavigationContainer>
  );
}