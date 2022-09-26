import { AntDesign, FontAwesome } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import {
  Box,
  Button, Center, FlatList, Image, Input, Menu, Modal, Select, Text
} from "native-base";
import { useContext, useEffect, useState } from "react";
import { showMessage } from "react-native-flash-message";
import { useQuery } from "react-query";
import ChecklistImage from "../assets/checklist-todo.png";
import DefaultProfile from "../assets/default-profile.jpg";
import { API } from "../config/api";
import { UserContext } from "../context/userContext";

function Home({ navigation }) {
  const [state, dispatch] = useContext(UserContext);
  const [showModalFilter, setShowModalFilter] = useState(false);
  const [shouldOverlapWithTrigger] = useState(false);
  const [dataFilter, setDataFilter] = useState({
    search: "",
    date: "",
    category: "",
    status: "",
  });

  const [tempDataFilter, setTempDataFilter] = useState({
    date: "",
    category: "",
    status: "",
  });

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

  let { data: list, refetch: listRefetch } = useQuery(
    "listCaches",
    async () => {
      let listResponse = await API.get("/List");
      // console.log("response list", listResponse.data);
      return listResponse.data;
    }
  );

  let { data: category } = useQuery("categoryCaches", async () => {
    let categoryResponse = await API.get("/Category");
    // console.log("category list", categoryResponse.data);
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
    showMessage({
      message: "Logout berhasil!",
      type: "success",
    });
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
      listRefetch();
    } catch (err) {
      showMessage({
        message: "Gagal mengubah status todo!",
        type: "danger",
      });
    }
  }

  useEffect(() => {
    listRefetch();
  }, [list]);

  function TodoComponent(item, i) {
    // dipisah buat nyari bg color dari index intinya
    let listBgColor = todoColor?.find(
      (item) => item.index === i % (Object.keys(todoColor).length - 1)
    )?.bgColor;
    // dipisah buat nyari bg color dari index intinya
    let categoryBgColor = categoryColor?.find(
      (item) => item.index === i % (Object.keys(categoryColor).length - 1)
    )?.bgColor;
    // nyari categoryName
    let categoryName = category?.find(
      (itemCategory) => itemCategory._id === item.category_id
    )?.name;
    return (
      <Box
        // intinya dia ngambil dari data todo color kita find ngecompare index sama index item terus di modulus banyaknya todoColor
        // object keys itu ngambil banyaknya length terus di - 1 biar modulus 4, jadi loop balik ke index awal lagi
        bg={listBgColor}
        w={"100%"}
        borderRadius={10}
        display="flex"
        flexDirection="row"
        px={5}
        py={5}
        key={i}
        my={2}
        onClick={() =>
          navigation.navigate("DetailList", {
            listId: item._id,
            listBgColor,
            categoryBgColor,
            categoryName,
          })
        }
      >
        <Box flex={2}>
          <Text
            fontWeight="bold"
            fontSize={20}
            textDecorationLine={item.is_done == 0 ? "none" : "line-through"}
          >
            {cutSentence(item.name, 15)}
          </Text>
          <Text
            color="muted.500"
            flex={1}
            textDecorationLine={item.is_done == 0 ? "none" : "line-through"}
          >
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
            bg={categoryBgColor}
          >
            <Text color="white" fontWeight="bold">
              {/* intinya nyari id category yang sama terus return namenya aja kalau ketemu jadi pake find */}
              {categoryName}
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
              onPress={(e) => handleUpdateIsDone(e, item._id, item.is_done)}
            >
              {item.is_done ? (
                <Image
                  source={ChecklistImage}
                  w={50}
                  h={50}
                  resizeMode="contain"
                  alt={ChecklistImage}
                />
              ) : (
                <></>
              )}
            </Button>
          </Box>
        </Box>
      </Box>
    );
  }

  function handleChangeTextFilter(name, value) {
    // console.log("punya", name, "valuenya", value);
    setDataFilter({
      ...dataFilter,
      [name]: value,
    });
    // console.log("current data filter", dataFilter);
  }

  // buat sebelum save, sesudah save di lempar ke dataFilter
  function handleChangeTextTempFilter(name, value) {
    // console.log("temp name", name, "temp value", value);
    name == "date"
      ? setTempDataFilter({
          ...tempDataFilter,
          [name]: value.replace(/[^0-9]/g, ""),
        })
      : setTempDataFilter({
          ...tempDataFilter,
          [name]: value,
        });
  }

  // buat filter array, ambil dari github ini : https://gist.github.com/jherax/f11d669ba286f21b7a2dcff69621eb72
  // function filterArray(array, filters) {
  //   const filterKeys = Object.keys(filters);
  //   return array.filter((item) => {
  //     // validates all filter criteria
  //     return filterKeys.every((key) => {
  //       // ignores non-function predicates
  //       if (typeof filters[key] !== "function") return true;
  //       return filters[key](item[key]);
  //     });
  //   });
  // }

  // function filterList(listToFilter) {
  //   const filters = {
  //     name: name => name.toLowerCase() === dataFilter.search.toLowerCase(),
  //     // date: date => ['blue', 'black'].includes(color.toLowerCase()),
  //     // category: category => locations.find(x => ['JAPAN', 'USA'].includes(x.toUpperCase())),
  //     // status: status => details.length < 30 && details.width >= 70,
  //   };
  //   const filtered = filterArray(listToFilter, filters);
  //   // console.log("filtered bois", filtered);
  //   // console.log("dataFilter.search.toLowerCase()", dataFilter.search.toLowerCase());
  // }

  return (
    <Box display="flex" flex={1} alignItems="center" bg="white">
      <Box display="flex" flexDirection="row" w={"85%"} mt={10} mb={5}>
        {/* profile  */}
        <Box flex={1} justifyContent="center" mx={2}>
          <Text fontWeight="bold" fontSize={30}>
            Hi {state?.data?.user?.firstName}
          </Text>
          <Text fontSize={15} color="error.500">
            {list && Object.keys(list).length} Lists
          </Text>
        </Box>
        {/* end-profile */}
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
                    alt={DefaultProfile}
                  />
                </Button>
              );
            }}
          >
            <Menu.Item onPress={handleLogout}>Logout</Menu.Item>
          </Menu>
        </Box>
      </Box>
      {/* kolom filter */}
      <Box display="flex" w={"85%"} flexDirection="column">
        <Box display="flex" flexDirection="row" w={"100%"}>
          <Input
            w={"100%"}
            bg="muted.200"
            placeholder="Search List..."
            py={3}
            fontSize={15}
            borderRadius="sm"
            borderColor="muted.500"
            value={dataFilter.search}
            onChangeText={(value) => handleChangeTextFilter("search", value)}
          />
        </Box>
        <Box display="flex" flexDirection="column" w={"100%"}>
          <Button
            onPress={() => setShowModalFilter(true)}
            my={3}
            bg="error.500"
            _hover={{ backgroundColor: "error.600" }}
            _pressed={{ backgroundColor: "error.700" }}
          >
            <Text
              fontSize={15}
              fontWeight="bold"
              color="white"
              display="flex"
              flexDirection="row"
              justifyContent="center"
              alignItems="center"
            >
              <AntDesign name="filter" size={20} color="white" /> Filter
            </Text>
          </Button>
          <Center>
            <Modal
              isOpen={showModalFilter}
              onClose={() => {
                setTempDataFilter({
                  ...tempDataFilter,
                  category: "",
                  status: "",
                });
                setShowModalFilter(false);
              }}
            >
              <Modal.Content maxWidth="400px">
                <Modal.CloseButton />
                <Modal.Header>Filter</Modal.Header>
                <Modal.Body display="flex" flexDirection="column" w={"100%"}>
                  <Input
                    bg="muted.200"
                    placeholder="Date (miliseconds)"
                    h={50}
                    mt={2}
                    py={3}
                    flex={1}
                    fontSize={15}
                    borderRadius="sm"
                    defaultValue={dataFilter.date}
                    value={tempDataFilter.date}
                    borderColor="muted.500"
                    onChangeText={(value) =>
                      handleChangeTextTempFilter("date", value)
                    }
                  />
                  <Select
                    defaultValue={dataFilter.category}
                    placeholder="Category"
                    h={50}
                    mt={2}
                    py={3}
                    flex={1}
                    bg="muted.200"
                    fontSize={15}
                    borderRadius="sm"
                    borderColor="muted.500"
                    _selectedItem={{
                      bg: "muted.500",
                    }}
                    onValueChange={(value) =>
                      handleChangeTextTempFilter("category", value)
                    }
                  >
                    <Select.Item label={"Semua"} value={""} />
                    {category?.map((item, i) => (
                      <Select.Item label={item.name} value={item._id} key={i} />
                    ))}
                  </Select>
                  <Select
                    defaultValue={dataFilter.status}
                    placeholder="Status"
                    h={50}
                    bg="muted.200"
                    py={3}
                    mt={2}
                    flex={1}
                    fontSize={15}
                    borderRadius="sm"
                    borderColor="muted.500"
                    _selectedItem={{
                      bg: "muted.500",
                    }}
                    onValueChange={(value) =>
                      handleChangeTextTempFilter("status", value)
                    }
                  >
                    <Select.Item label={"Semua"} value={""} />
                    <Select.Item label={"Belum"} value={"0"} />
                    <Select.Item label={"Selesai"} value={"1"} />
                  </Select>
                </Modal.Body>
                <Modal.Footer>
                  <Button.Group space={2}>
                    <Button
                      variant="ghost"
                      colorScheme="blueGray"
                      onPress={() => {
                        setTempDataFilter({
                          ...tempDataFilter,
                          category: "",
                          status: "",
                        });
                        setShowModalFilter(false);
                      }}
                    >
                      Cancel
                    </Button>
                    <Button
                      onPress={() => {
                        setDataFilter({
                          ...dataFilter,
                          date: tempDataFilter.date,
                          category: tempDataFilter.category,
                          status: tempDataFilter.status,
                        });
                        setTempDataFilter({
                          ...tempDataFilter,
                          category: "",
                          status: "",
                        });
                        setShowModalFilter(false);
                      }}
                    >
                      Save
                    </Button>
                  </Button.Group>
                </Modal.Footer>
              </Modal.Content>
            </Modal>
          </Center>
        </Box>
      </Box>
      {/* end kolom filter */}
      {/* list todo */}
      <Box w={"85%"} display="flex" flex={1}>
        {list ? (
          <FlatList
            data={
              // hanya ketika semuanya kosong maka datanya apa adanya
              !dataFilter.search &&
              !dataFilter.category &&
              !dataFilter.date &&
              !dataFilter.status
                ? list
                : list.filter((item) => {
                    // filter search
                    if (dataFilter.search) {
                      return item.name
                        .toLowerCase()
                        .includes(dataFilter.search.toLowerCase());
                    }

                    // filter date
                    if (dataFilter.date) {
                      const itemDate = milisToDate(item.date).split(" ")[0];
                      const filterDate = milisToDate(
                        parseInt(dataFilter.date)
                      ).split(" ")[0];
                      // console.log("item date", itemDate);
                      // console.log("filter date", filterDate);
                      return itemDate == filterDate;
                    }

                    // filter category
                    if (dataFilter.category) {
                      let categoryId = category.find(
                        (itemCategory) => itemCategory._id === item.category_id
                      )._id;
                      return (
                        categoryId.toString() == dataFilter.category.toString()
                      );
                    }

                    // filter status
                    if (dataFilter.status) {
                      return (
                        item.is_done.toString() == dataFilter.status.toString()
                      );
                    }
                  })
              // filter neraka 😂😂😂😂😂😂😂😂😂😂
              // list.filter((item) => {
              //   if (
              //     // search
              //     dataFilter.search &&
              //     (dataFilter.status == "" || dataFilter.status == null) &&
              //     !dataFilter.category &&
              //     !dataFilter.date
              //   ) {
              //     return item.name
              //       .toLowerCase()
              //       .includes(dataFilter.search.toLowerCase());
              //   } else if (
              //     dataFilter.search &&
              //     (dataFilter.status != "" || dataFilter.status != null) &&
              //     !dataFilter.category &&
              //     !dataFilter.date
              //   ) {
              //     return (
              //       item.name
              //         .toLowerCase()
              //         .includes(dataFilter.search.toLowerCase()) &&
              //       item.is_done.toString() == dataFilter.status.toString()
              //     );
              //   } else if (
              //     dataFilter.search &&
              //     (dataFilter.status != "" || dataFilter.status != null) &&
              //     dataFilter.category &&
              //     !dataFilter.date
              //   ) {
              //     let categoryId = category.find(
              //       (itemCategory) => itemCategory._id === item.category_id
              //     )._id;
              //     return (
              //       item.name
              //         .toLowerCase()
              //         .includes(dataFilter.search.toLowerCase()) &&
              //       item.is_done.toString() ==
              //         dataFilter.status.toString() &&
              //       categoryId.toString() == dataFilter.category.toString()
              //     );
              //   } else if (
              //     // status
              //     !dataFilter.search &&
              //     (dataFilter.status != "" || dataFilter.status != null) &&
              //     !dataFilter.category &&
              //     !dataFilter.date
              //   ) {
              //     return (
              //       item.is_done.toString() == dataFilter.status.toString()
              //     );
              //   } else if (
              //     dataFilter.search &&
              //     (dataFilter.status != "" || dataFilter.status != null) &&
              //     !dataFilter.category &&
              //     !dataFilter.date
              //   ) {
              //     return (
              //       item.name
              //         .toLowerCase()
              //         .includes(dataFilter.search.toLowerCase()) &&
              //       item.is_done.toString() == dataFilter.status.toString()
              //     );
              //   } else if (
              //     dataFilter.search &&
              //     (dataFilter.status != "" || dataFilter.status != null) &&
              //     dataFilter.category &&
              //     !dataFilter.date
              //   ) {
              //     let categoryId = category.find(
              //       (itemCategory) => itemCategory._id === item.category_id
              //     )._id;
              //     return (
              //       item.name
              //         .toLowerCase()
              //         .includes(dataFilter.search.toLowerCase()) &&
              //       item.is_done.toString() ==
              //         dataFilter.status.toString() &&
              //       categoryId.toString() == dataFilter.category.toString()
              //     );
              //   } else if (
              //     !dataFilter.search &&
              //     (dataFilter.status == "" || dataFilter.status == null) &&
              //     dataFilter.category &&
              //     !dataFilter.date
              //   ) {
              //     // category
              //     let categoryId = category.find(
              //       (itemCategory) => itemCategory._id === item.category_id
              //     )._id;
              //     return (
              //       categoryId.toString() == dataFilter.category.toString()
              //     );
              //   } else if (
              //     !dataFilter.search &&
              //     (dataFilter.status != "" || dataFilter.status != null) &&
              //     dataFilter.category &&
              //     !dataFilter.date
              //   ) {
              //     let categoryId = category.find(
              //       (itemCategory) => itemCategory._id === item.category_id
              //     )._id;
              //     return (
              //       item.is_done.toString() ==
              //         dataFilter.status.toString() &&
              //       categoryId.toString() == dataFilter.category.toString()
              //     );
              //   } else if (
              //     dataFilter.search &&
              //     (dataFilter.status != "" || dataFilter.status != null) &&
              //     dataFilter.category &&
              //     !dataFilter.date
              //   ) {
              //     let categoryId = category.find(
              //       (itemCategory) => itemCategory._id === item.category_id
              //     )._id;
              //     return (
              //       item.name
              //         .toLowerCase()
              //         .includes(dataFilter.search.toLowerCase()) &&
              //       item.is_done.toString() ==
              //         dataFilter.status.toString() &&
              //       categoryId.toString() == dataFilter.category.toString()
              //     );
              //   }
              // })
            }
            renderItem={({ item, index }) => TodoComponent(item, index)}
            keyExtractor={(item) => item._id}
          />
        ) : (
          <></>
        )}
      </Box>
    </Box>
  );
}

export default Home;
