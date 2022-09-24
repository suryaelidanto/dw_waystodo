import AsyncStorage from "@react-native-async-storage/async-storage";
import { Box, Button, Image, Menu, Text } from "native-base";
import { useContext, useState } from "react";
import { showMessage } from "react-native-flash-message";
import { useQuery } from "react-query";
import { API } from "../config/api";
import { UserContext } from "../context/userContext";
import ChecklistImage from "../assets/checklist-todo.png";
import DefaultProfile from "../assets/default-profile.jpg";
import { FontAwesome } from "@expo/vector-icons";

function Home({ navigation }) {
  const [state, dispatch] = useContext(UserContext);
  const [shouldOverlapWithTrigger] = useState(false);
  const todoColor = [
    {
      index: 0,
      bgColor: "primary.200",
    },
    {
      index: 1,
      bgColor: "green.200",
    },
    {
      index: 2,
      bgColor: "danger.200",
    },
    {
      index: 3,
      bgColor: "warning.200",
    },
    {
      index: 4,
      bgColor: "purple.200",
    },
  ];

  const categoryColor = [
    {
      index: 0,
      bgColor: "danger.500",
    },
    {
      index: 1,
      bgColor: "purple.500",
    },
    {
      index: 2,
      bgColor: "green.500",
    },
    {
      index: 3,
      bgColor: "primary.500",
    },
    {
      index: 4,
      bgColor: "warning.500",
    },
  ];

  let { data: list, refetch: refetchList } = useQuery(
    "listCaches",
    async () => {
      let listResponse = await API.get("/List");
      console.log("response list", listResponse.data);
      return listResponse.data;
    }
  );

  let { data: category } = useQuery("categoryCaches", async () => {
    let categoryResponse = await API.get("/Category");
    console.log("category list", categoryResponse.data);
    return categoryResponse.data;
  });

  // intinya buat cut kalimat, kalau dia lebih dari max character, ya potong terus tambahin ...
  function cutSentence(sentence, maxCharacter) {
    return sentence.length > maxCharacter
      ? sentence.substring(0, maxCharacter) + "..."
      : sentence;
  }

  // intinya buat ngubah milisecond ke date, lebih gampang pake milis bre, ngga usah nyimpen data date 😂
  function milisToDate(milis) {
    let date = new Date(milis);
    let convertMonth = (month) => {
      switch (month) {
        case 0:
          return "Januari";
        case 1:
          return "Februari";
        case 2:
          return "Maret";
        case 3:
          return "April";
        case 4:
          return "Mei";
        case 5:
          return "Juni";
        case 6:
          return "Juli";
        case 7:
          return "Agustus";
        case 8:
          return "September";
        case 9:
          return "Oktober";
        case 10:
          return "November";
        case 11:
          return "Desember";
      }
    };
    return `${date.getDate()} ${convertMonth(
      date.getMonth()
    )} ${date.getFullYear()}`;
  }

  function handleLogout() {
    AsyncStorage.removeItem("token");
    dispatch({
      type: "LOGOUT_SUCCESS",
    });
    console.log(state);
    showMessage({
      message: "Logout berhasil!",
      type: "success",
    });
    navigation.navigate("Welcome");
  }

  async function handleUpdateIsDone(e, id_todo, current_status) {
    e.preventDefault();
    try {
      // intinya update kebalikannya dari id todo yang dilempar di parameter
      await API.patch(
        `/List/${id_todo}`,
        { is_done: current_status == 0 ? 1 : 0 },
        { validateStatus: () => true }
      );
      refetchList();
    } catch (err) {
      showMessage({
        message: "Gagal mengubah status todo!",
        type: "danger",
      });
    }
  }

  return (
    <Box display="flex" flex={1} alignItems="center" bg="white">
      <Box display="flex" flexDirection="row" w={"85%"} my={10}>
        <Box flex={1} justifyContent="center" mx={2}>
          <Text fontWeight="bold" fontSize={30}>
            Hi {state?.data?.user?.firstName}
          </Text>
          <Text fontSize={15} color="error.500">
            {list && Object.keys(list).length} Lists
          </Text>
        </Box>
        <Box flex={1} justifyContent="center" alignItems="flex-end" mx={2}>
          <Menu
            w="160"
            shouldOverlapWithTrigger={shouldOverlapWithTrigger} // @ts-ignore
            placement={"bottom right"}
            trigger={(triggerProps) => {
              return (
                <Button variant="ghost" {...triggerProps}>
                  <Image
                    source={DefaultProfile}
                    w={50}
                    h={50}
                    borderRadius="100%"
                    borderWidth="2px"
                    borderColor="error.500"
                  />
                </Button>
              );
            }}
          >
            <Menu.Item onPress={handleLogout}>Logout</Menu.Item>
          </Menu>
        </Box>
      </Box>

      {/* list todo */}
      <Box w={"90%"}>
        {list?.map((item, i) => {
          return (
            <Box
              // intinya dia ngambil dari data todo color kita find ngecompare index sama index item terus di modulus banyaknya todoColor
              // object keys itu ngambil banyaknya length terus di - 1 biar modulus 4, jadi loop balik ke index awal lagi
              bg={
                todoColor?.find(
                  (item) =>
                    item.index === i % (Object.keys(todoColor).length - 1)
                ).bgColor
              }
              w={"100%"}
              borderRadius={10}
              display="flex"
              flexDirection="row"
              px={5}
              py={5}
              key={i}
              my={2}
            >
              <Box flex={2}>
                <Text fontWeight="bold" fontSize={20}>
                  {cutSentence(item.name, 15)}
                </Text>
                <Text color="muted.500" flex={1}>
                  {cutSentence(item.description, 20)}
                </Text>
                <Text color="muted.500" display="flex" alignItems="center">
                  <FontAwesome
                    name="calendar"
                    size={15}
                    color="muted.500"
                    style={{ marginRight: 5 }}
                  />
                  {milisToDate(item.date)}
                </Text>
              </Box>
              <Box flex={1}>
                <Box
                  p={1}
                  borderRadius={10}
                  display="flex"
                  alignItems="center"
                  justifyContent="center"
                  // intinya dia ngambil dari data todo color kita find ngecompare index sama index item terus di modulus banyaknya todoColor
                  // object keys itu ngambil banyaknya length terus di - 1 biar modulus 4, jadi loop balik ke index awal lagi
                  bg={
                    categoryColor?.find(
                      (item) =>
                        item.index ===
                        i % (Object.keys(categoryColor).length - 1)
                    ).bgColor
                  }
                >
                  <Text color="white" fontWeight="bold">
                    {/* intinya nyari id category yang sama terus return namenya aja kalau ketemu jadi pake find */}
                    {
                      category?.find(
                        (itemCategory) => itemCategory._id === item.category_id
                      ).name
                    }
                  </Text>
                </Box>
                <Box
                  flex={1}
                  display="flex"
                  alignItems="center"
                  justifyContent="center"
                >
                  {/* intinya buat ngatur buttonnya udah di klik belum, kalau udah ada checklistnya kalau belum ilangin */}
                  <Button
                    bg={item.is_done ? "white" : "muted.200"}
                    borderRadius={"100%"}
                    _hover={{ backgroundColor: "muted.300" }}
                    _pressed={{ backgroundColor: "muted.400" }}
                    mt={2}
                    w={50}
                    h={50}
                    onPress={(e) =>
                      handleUpdateIsDone(e, item._id, item.is_done)
                    }
                  >
                    {item.is_done ? (
                      <Image
                        source={ChecklistImage}
                        w={50}
                        h={50}
                        resizeMode="contain"
                      />
                    ) : (
                      <></>
                    )}
                  </Button>
                </Box>
              </Box>
            </Box>
          );
        })}
      </Box>
    </Box>
  );
}

export default Home;
