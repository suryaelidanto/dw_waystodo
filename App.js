import { extendTheme, NativeBaseProvider } from "native-base";
import React, { useEffect } from "react";
import Container from "./Container";
import { useFonts } from "expo-font";
import { NavigationContainer } from "@react-navigation/native";

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

  return (
    <NavigationContainer>
      <NativeBaseProvider theme={theme}>
        <Container />
      </NativeBaseProvider>
    </NavigationContainer>
  );
}

// Color Switch Component
// function ToggleDarkMode() {
//   const { colorMode, toggleColorMode } = useColorMode();
//   return (
//     <HStack space={2} alignItems="center">
//       <Text>Dark</Text>
//       <Switch
//         isChecked={colorMode === "light"}
//         onToggle={toggleColorMode}
//         aria-label={
//           colorMode === "light" ? "switch to dark mode" : "switch to light mode"
//         }
//       />
//       <Text>Light</Text>
//     </HStack>
//   );
// }
