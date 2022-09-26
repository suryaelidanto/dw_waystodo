import { Box, Button, Input, Select, Text, TextArea } from "native-base";
import { useState } from "react";
import { showMessage } from "react-native-flash-message";
import { useMutation, useQuery } from "react-query";
import { API } from "../config/api";

function AddCategory({ navigation }) {
  const [dataList, setDataList] = useState({
    name: "",
    date: "",
    description: "",
    category_id: "",
    is_done: 0,
  });

  let { data: category, refetch: categoryRefetch } = useQuery(
    "categoryCaches",
    async () => {
      let categoryResponse = await API.get("/Category");
      // console.log("category list", categoryResponse.data);
      return categoryResponse.data;
    }
  );

  function handleChangeText(name, value) {
    name == "date"
      ? setDataList({
          ...dataList,
          [name]: value.replace(/[^0-9]/g, ""),
        })
      : setDataList({
          ...dataList,
          [name]: value,
        });
    // console.log("ini punya", name, "valuenya", value);
    // console.log("dataList", dataList);
  }

  const handleSubmit = useMutation(async (e) => {
    e.preventDefault();
    try {
      if (dataList.name.trim() == "" || dataList.name.trim() == null) {
        return showMessage({
          message: "List name tidak boleh kosong!",
          type: "danger",
        });
      }
      if (dataList.date == null || dataList.date == "") {
        return showMessage({
          message: "List date tidak boleh kosong!",
          type: "danger",
        });
      }
      if (dataList.description == "" || dataList.description == null) {
        return showMessage({
          message: "List description tidak boleh kosong!",
          type: "danger",
        });
      }
      if (dataList.category_id == "" || dataList.category_id == null) {
        return showMessage({
          message: "List category id tidak boleh kosong!",
          type: "danger",
        });
      }
      const listData = {
        name: dataList.name,
        date: parseInt(dataList.date),
        description: dataList.description,
        category_id: dataList.category_id,
        is_done: 0,
      };
      const response = await API.post("/List", listData);
      // console.log("berhasil menambahkan", response.data);
      showMessage({
        message: "List berhasil ditambahkan!",
        type: "success",
      });
      setDataList({
        name: "",
        date: "",
        description: "",
        category_id: "",
        is_done: 0,
      });
    } catch (err) {
      showMessage({
        message: "Gagal menambahkan list!",
        type: "danger",
      });
    }
  });

  return (
    <Box
      display="flex"
      flex={1}
      bg="white"
      px={3}
      py={5}
      w={"100%"}
      alignItems="center"
    >
      <Box display="flex" w={"90%"} mt={5}>
        <Text fontWeight="bold" fontSize={30}>
          Add List
        </Text>
        <Box display="flex" w={"100%"} mt={5}>
          <Input
            w={"100%"}
            bg="muted.200"
            placeholder="Name"
            py={3}
            my={2}
            value={dataList.name}
            fontSize={15}
            borderRadius="sm"
            borderColor="muted.500"
            onChangeText={(value) => handleChangeText("name", value)}
          />
          <Select
            defaultValue={dataList.category_id}
            placeholder="Pilih category..."
            w={"100%"}
            h={50}
            bg="muted.200"
            py={3}
            my={2}
            fontSize={15}
            borderRadius="sm"
            borderColor="muted.500"
            _selectedItem={{
              bg: "muted.500",
            }}
            mt={1}
            onValueChange={(value) => handleChangeText("category_id", value)}
          >
            {category?.map((item, i) => (
              <Select.Item label={item.name} value={item._id} key={i} />
            ))}
          </Select>
          <Input
            w={"100%"}
            bg="muted.200"
            placeholder="Date (miliseconds)"
            type="number"
            keyboardType="numeric"
            py={3}
            my={2}
            value={dataList.date}
            fontSize={15}
            borderRadius="sm"
            borderColor="muted.500"
            onChangeText={(value) => handleChangeText("date", value)}
          />
          <TextArea
            w={"100%"}
            h={100}
            bg="muted.200"
            placeholder="Description"
            py={3}
            my={2}
            value={dataList.description}
            fontSize={15}
            borderRadius="sm"
            borderColor="muted.500"
            onChangeText={(value) => handleChangeText("description", value)}
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
            Add List
          </Button>
        </Box>
      </Box>
    </Box>
  );
}

export default AddCategory;
