import { FontAwesome } from "@expo/vector-icons";
import { Box, Button, Image, Text } from "native-base";
import { showMessage } from "react-native-flash-message";
import { useQuery } from "react-query";
import ChecklistImage from "../assets/checklist-todo.png";
import { API } from "../config/api";

function DetailList({ route, navigation }) {
  let { listId, listBgColor, categoryBgColor, categoryName } = route.params;

  let { data: list, refetch: listRefetch } = useQuery(
    "listDetailCaches",
    async () => {
      let listResponse = await API.get(`/List/${listId}`);
      // console.log("response list detail", listResponse.data);
      return listResponse.data;
    }
  );

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
      // console.log(err);
      showMessage({
        message: "Gagal mengubah status todo!",
        type: "danger",
      });
    }
  }

  return (
    <Box display="flex" flex={1} alignItems="center" bg="white">
      <Box
        // intinya dia ngambil dari data todo color kita find ngecompare index sama index item terus di modulus banyaknya todoColor
        // object keys itu ngambil banyaknya length terus di - 1 biar modulus 4, jadi loop balik ke index awal lagi
        bg={listBgColor}
        w={"90%"}
        p={10}
        borderRadius={10}
        display="flex"
        flexDirection="row"
        mx={5}
        my={5}
      >
        <Box flex={2}>
          <Text
            fontWeight="bold"
            fontSize={20}
            textDecorationLine={list?.is_done == 0 ? "none" : "line-through"}
          >
            {list?.name}
          </Text>
          <Text
            color="muted.500"
            flex={1}
            textDecorationLine={list?.is_done == 0 ? "none" : "line-through"}
          >
            {list?.description}
          </Text>
          <Text color="muted.500" display="flex" alignItems="center">
            <FontAwesome
              name="calendar"
              size={15}
              color="muted.500"
              style={{ marginRight: 5 }}
            />
            {milisToDate(list?.date)}
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
              bg={list?.is_done ? "white" : "muted.200"}
              borderRadius={"100%"}
              _hover={{ backgroundColor: "muted.300" }}
              _pressed={{ backgroundColor: "muted.400" }}
              mt={2}
              w={50}
              h={50}
              onPress={(e) => handleUpdateIsDone(e, list?._id, list?.is_done)}
            >
              {list?.is_done ? (
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
    </Box>
  );
}

export default DetailList;
