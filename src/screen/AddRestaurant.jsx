import React, { useContext, useEffect, useState } from "react";
import {
  View,
  StyleSheet,
  Alert,
  Image,
  FlatList,
  TouchableOpacity,
} from "react-native";
import {
  Button,
  Card,
  Checkbox,
  Provider as PaperProvider,
  Text,
  TextInput,
} from "react-native-paper";
import MapView, { Marker, UrlTile } from "react-native-maps";
import axios from "axios";
import { colors } from "../utils/colors";
import { AuthContext } from "../context/AuthContext";
import Spinner from "react-native-loading-spinner-overlay/lib";
import * as ImagePicker from "expo-image-picker";
import { Picker } from "@react-native-picker/picker";

export default function AddRestaurant() {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [address, setAddress] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [startTime, setStartTime] = useState(0);
  const [endTime, setEndTime] = useState(0);

  const [categories, setCategories] = useState([]);
  const [positions, setPositions] = useState([]);
  const [position, setPosition] = useState(null);
  const [isPositionPickerFocused, setIsPositionPickerFocused] = useState(false);

  const [numberOfTables, setNumberOfTables] = useState("");
  const [numberOfChairs, setNumberOfChairs] = useState("");

  const [tableData, setTableData] = useState([]);

  const { isLoading, addRestaurant, getCategories, getPositions, addImage } =
    useContext(AuthContext);

  const [region, setRegion] = useState({
    latitude: 44.787197,
    longitude: 20.457273,
    latitudeDelta: 0.0922,
    longitudeDelta: 0.0421,
  });
  const [marker, setMarker] = useState(null);
  const [page, setPage] = useState(1);
  const [isLoadingMap, setLoadingMap] = useState(false);
  const [selectedImage, setSelectedImage] = useState("");

  useEffect(() => {
    const getCategoriesAndPositions = async () => {
      const categories = await getCategories();
      const newCategories = categories.data.map((category) => ({
        ...category,
        checked: false,
        minutes: "",
      }));
      const positions = await getPositions();
      setCategories(newCategories);
      setPositions(positions.data);
    };

    getCategoriesAndPositions();
  }, []);

  const handleMapPress = (e) => {
    setMarker(e.nativeEvent.coordinate);
  };

  const searchAddress = () => {
    setLoadingMap(true);
    const url = `https://nominatim.openstreetmap.org/search?format=json&q=${address}`;
    axios
      .get(url)
      .then((response) => {
        if (response.data.length > 0) {
          const location = response.data[0];
          const { lat, lon } = location;
          setRegion({
            ...region,
            latitude: parseFloat(lat),
            longitude: parseFloat(lon),
          });
          setMarker({
            latitude: parseFloat(lat),
            longitude: parseFloat(lon),
          });
          setLoadingMap(false);
        } else {
          setLoadingMap(false);
          Alert.alert("Error", "Adresa nije pronadjena");
        }
      })
      .catch((error) => {
        setLoadingMap(false);
        console.error("Error fetching location:", error);
      });
  };

  const nextPage = () => {
    if (page === 1) {
      if (address === "" || name === "" || description === "") {
        Alert.alert("Greška", "Molimo popunite sva polja.");
        return;
      } else {
        setPage(page + 1);
      }
    } else if (page === 2) {
      if (startTime === 0 || endTime === 0 || selectedImage === "") {
        Alert.alert("Greška", "Molimo popunite sva polja.");
        return;
      } else {
        setPage(page + 1);
      }
    }
  };

  const backPage = () => {
    setPage(page - 1);
  };

  const addTable = () => {
    if (numberOfTables === "" || numberOfChairs === "" || position === "") {
      Alert.alert("Greška", "Molimo popunite sva polja.");
      return;
    }

    const newEntry = {
      tables: numberOfTables,
      chairs: numberOfChairs,
      position: position,
    };

    setTableData([...tableData, newEntry]);

    setNumberOfTables("");
    setNumberOfChairs("");
  };

  const handleDelete = (index) => {
    const newData = tableData.filter((_, i) => i !== index);
    setTableData(newData);
  };

  const renderItem = ({ item, index }) => (
    <View style={styles.tableRow}>
      <Text style={styles.tableCell}>{item.tables}</Text>
      <Text style={styles.tableCell}>{item.chairs}</Text>
      <Text style={styles.tableCell}>{item.position.name}</Text>
      <TouchableOpacity
        style={styles.deleteButton}
        onPress={() => handleDelete(index)}
      >
        <Text style={styles.deleteButtonText}>Obriši</Text>
      </TouchableOpacity>
    </View>
  );

  const pickImage = async () => {
    let permissionResult =
      await ImagePicker.requestMediaLibraryPermissionsAsync();

    if (permissionResult.granted === false) {
      Alert.alert(
        "Dozvola je neophodna",
        "Potrebna je dozvola za pristup galeriji kako biste dodali sliku."
      );
      return;
    }

    let pickerResult = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      quality: 1,
    });

    if (!pickerResult.canceled) {
      setSelectedImage(pickerResult.assets[0].uri);

      const response = await addImage(pickerResult.assets[0].uri);
      const photoUrl = response.data.Location;
      setImageUrl(photoUrl);
    }
  };

  const handlePositionChange = (itemValue, itemIndex) => {
    const selected = positions.find((position) => position.id === itemValue);
    setPosition(selected);
  };

  const handleCheckboxChange = (id) => {
    const updatedCategories = categories.map((category) => {
      if (category.id === id) {
        return { ...category, checked: !category.checked };
      }
      return category;
    });
    setCategories(updatedCategories);
  };

  const handleMinutesChange = (id, minutes) => {
    const updatedCategories = categories.map((category) => {
      if (category.id === id) {
        return { ...category, minutes };
      }
      return category;
    });
    setCategories(updatedCategories);
  };

  const setRetaurantData = async () => {
    if (tableData.length === 0) {
      Alert.alert("Greška", "Molimo popunite sva polja.");
      return;
    }
    const { latitude, longitude } = marker;
    const params = {
      name,
      address,
      latitude,
      longitude,
      description,
      startTime,
      endTime,
      categories,
      tableData,
      imageUrl,
    };

    const res = await addRestaurant(params);
    if (res) {
      Alert.alert("Info", "Restoran je uspesno dodat!");
      setName("");
      setAddress("");
      setImageUrl("");
      setNumberOfChairs("");
      setPage(1);
      setPosition("");
      setEndTime(0);
      setStartTime(0);
      setDescription("");
    } else {
      Alert.alert("Greska", "Doslo je do greske");
    }
  };

  return (
    <PaperProvider>
      <Spinner visible={isLoading} />
      {page == 1 && (
        <View style={styles.container}>
          <Spinner visible={isLoadingMap} />
          <Card style={styles.card}>
            <Card.Title title="Dodavanje" titleStyle={styles.cardTitle} />
            <Card.Content>
              <TextInput
                style={styles.input}
                label="Unesite adresu"
                value={address}
                onChangeText={setAddress}
                theme={{
                  colors: {
                    text: colors.zelena,
                    placeholder: colors.zelena,
                    primary: colors.zelena,
                    underlineColor: "transparent",
                    background: "transparent",
                  },
                }}
              />
              <Button
                mode="contained"
                style={styles.buttonRestaurant}
                onPress={searchAddress}
              >
                Pretrazite adresu
              </Button>
            </Card.Content>
          </Card>
          <MapView style={styles.map} region={region} onPress={handleMapPress}>
            <UrlTile
              urlTemplate="http://c.tile.openstreetmap.org/{z}/{x}/{y}.png"
              maximumZ={19}
            />
            {marker && <Marker coordinate={marker} />}
          </MapView>
          <Card style={styles.card}>
            <Card.Content>
              <TextInput
                style={styles.input}
                label="Naziv ugostiteljskog objekta"
                value={name}
                onChangeText={setName}
                theme={{
                  colors: {
                    text: colors.zelena,
                    placeholder: colors.zelena,
                    primary: colors.zelena,
                    underlineColor: "transparent",
                    background: "transparent",
                  },
                }}
              />

              <TextInput
                style={styles.input}
                label="Opis ugostiteljskog objekta"
                value={description}
                onChangeText={setDescription}
                theme={{
                  colors: {
                    text: colors.zelena,
                    placeholder: colors.zelena,
                    primary: colors.zelena,
                    underlineColor: "transparent",
                    background: "transparent",
                  },
                }}
              />
              <Button
                mode="contained"
                style={styles.buttonRestaurant}
                onPress={() => {
                  nextPage();
                }}
              >
                Dalje
              </Button>
            </Card.Content>
          </Card>
        </View>
      )}
      {page == 2 && (
        <View style={styles.container}>
          <Text style={styles.subtitle}>Radno vreme</Text>
          <View style={styles.radnoVremeContainer}>
            <TextInput
              style={styles.inputRadnoVreme}
              label="Pocetak"
              keyboardType="numeric"
              value={startTime}
              onChangeText={setStartTime}
              theme={{
                colors: {
                  text: colors.zelena,
                  placeholder: colors.zelena,
                  primary: colors.zelena,
                  underlineColor: "transparent",
                  background: "transparent",
                },
              }}
            />
            <TextInput
              style={styles.inputRadnoVreme}
              label="Kraj"
              keyboardType="numeric"
              value={endTime}
              onChangeText={setEndTime}
              theme={{
                colors: {
                  text: colors.zelena,
                  placeholder: colors.zelena,
                  primary: colors.zelena,
                  underlineColor: "transparent",
                  background: "transparent",
                },
              }}
            />
          </View>
          <Button
            mode="contained"
            onPress={pickImage}
            style={styles.buttonImage}
          >
            Dodaj sliku restorana
          </Button>
          {selectedImage && (
            <Image
              source={{ uri: selectedImage }}
              style={styles.imageRestaurant}
            />
          )}
          <Text style={styles.subtitle}>Odabir kategorije</Text>
          {categories.map((category) => (
            <View style={styles.row} key={category.id}>
              <Text style={styles.labelCategory}>{category.name}</Text>
              <Checkbox
                status={category.checked ? "checked" : "unchecked"}
                onPress={() => handleCheckboxChange(category.id)}
                color={colors.zelena}
              />
              <TextInput
                style={styles.inputCategory}
                placeholder={`Minuti ${category.name.toLowerCase()}`}
                keyboardType="numeric"
                value={category.minutes}
                onChangeText={(text) => handleMinutesChange(category.id, text)}
                editable={category.checked}
              />
            </View>
          ))}
          <View style={styles.rowButton}>
            <Button
              mode="contained"
              style={styles.buttonRestaurantNext}
              onPress={() => {
                backPage();
              }}
            >
              Nazad
            </Button>
            <Button
              mode="contained"
              style={styles.buttonRestaurantNext}
              onPress={() => {
                nextPage();
              }}
            >
              Dalje
            </Button>
          </View>
        </View>
      )}
      {page == 3 && (
        <View style={styles.container}>
          <Card style={styles.card}>
            <Card.Content>
              <Text style={styles.subtitle}>Odabir pozicije</Text>
              <View style={styles.pickerContainer}>
                <Picker
                  selectedValue={position ? position.id : null}
                  style={styles.picker}
                  onValueChange={handlePositionChange}
                  onFocus={() => setIsPositionPickerFocused(true)}
                  onBlur={() => setIsPositionPickerFocused(false)}
                >
                  {!isPositionPickerFocused && (
                    <Picker.Item label="Pozicija" value="" />
                  )}
                  {positions.map((position) => (
                    <Picker.Item
                      key={position.id}
                      label={position.name}
                      value={position.id}
                    />
                  ))}
                </Picker>
              </View>
              {position && (
                <View style={styles.rowPosition}>
                  <TextInput
                    style={styles.inputPosition}
                    placeholder="Broj stolova"
                    keyboardType="numeric"
                    value={numberOfTables}
                    onChangeText={(text) => setNumberOfTables(text)}
                  />
                  <TextInput
                    style={styles.inputPosition}
                    placeholder="Broj stolica"
                    keyboardType="numeric"
                    value={numberOfChairs}
                    onChangeText={(text) => setNumberOfChairs(text)}
                  />
                </View>
              )}
              {position && (
                <Button
                  mode="contained"
                  style={styles.buttonAdd}
                  onPress={() => {
                    addTable();
                  }}
                >
                  Dodaj
                </Button>
              )}
              {tableData.length > 0 && (
                <View style={styles.table}>
                  <View style={styles.tableHeader}>
                    <Text style={styles.tableHeaderCell}>Broj stolova</Text>
                    <Text style={styles.tableHeaderCell}>Broj stolica</Text>
                    <Text style={styles.tableHeaderCell}>Pozicija</Text>
                    <Text
                      tyle={[styles.tableHeaderCell, styles.actionHeaderCell]}
                    >
                      Akcija
                    </Text>
                  </View>
                  <FlatList
                    data={tableData}
                    renderItem={renderItem}
                    keyExtractor={(item, index) => index.toString()}
                  />
                </View>
              )}
            </Card.Content>
          </Card>
          <View style={styles.rowButton}>
            <Button
              mode="contained"
              style={styles.buttonRestaurantNext}
              onPress={() => {
                backPage();
              }}
            >
              Nazad
            </Button>
            <Button
              mode="contained"
              style={styles.buttonRestaurantNext}
              onPress={setRetaurantData}
              // onPress={() => {
              //   addRestaurant(
              //     name,
              //     description,
              //     address,
              //     marker.latitude,
              //     marker.longitude,
              //     startTime,
              //     endTime
              //   );
              // }}
            >
              Dodaj restoran
            </Button>
          </View>
        </View>
      )}
    </PaperProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  card: {
    marginBottom: 0,
  },
  cardTitle: {
    fontSize: 26,
    paddingTop: 10,
    fontWeight: "bold",
    textAlign: "center",
  },
  map: {
    flex: 1,
  },
  input: {
    marginLeft: 15,
    marginTop: 10,
    marginBottom: 10,
    width: "90%",
    paddingLeft: 5,
    fontSize: 14,
    backgroundColor: colors.mint,
  },
  buttonRestaurant: {
    justifyContent: "center",
    alignItems: "center",
    color: "white",
    backgroundColor: colors.zelena,
    borderRadius: 100,
    marginLeft: "15%",
    marginTop: 10,
    width: "70%",
  },
  rowButton: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
    width: "100%",
  },
  buttonRestaurantNext: {
    justifyContent: "center",
    alignItems: "center",
    color: "white",
    backgroundColor: colors.zelena,
    borderRadius: 100,
    marginLeft: "5%",
    marginTop: 10,
    width: "42.5%",
  },
  radnoVremeContainer: {
    flexDirection: "row",
    alignItems: "center",
    height: 50,
  },
  inputRadnoVreme: {
    marginLeft: 15,
    marginTop: 10,
    marginBottom: 0,
    paddingLeft: 5,
    width: "42.5%",
    fontSize: 14,
    backgroundColor: colors.mint,
  },
  subtitle: {
    marginLeft: 15,
    marginTop: 5,
    marginBottom: 5,
    fontSize: 16,
    fontWeight: "bold",
    color: colors.zelena,
  },
  buttonImage: {
    justifyContent: "center",
    alignItems: "center",
    color: "white",
    backgroundColor: colors.zelena,
    borderRadius: 100,
    marginLeft: "15%",
    marginBottom: 10,
    marginTop: 20,
    width: "70%",
  },
  imageRestaurant: {
    width: "80%",
    height: 150,
    marginTop: 10,
    marginBottom: 10,
    marginLeft: "10%",
    borderRadius: 10,
    resizeMode: "cover",
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10, // Razmak između redova
    marginLeft: 30,
    width: "100%",
  },
  inputCategory: {
    flex: 1,
    marginRight: "20%",
    height: 30,
    width: 60,
    backgroundColor: "#f0f0f0",
  },
  labelCategory: {
    width: "17%",
    fontSize: 16,
  },
  pickerContainer: {
    borderWidth: 1,
    borderColor: colors.zelena,
    borderRadius: 5,
    marginBottom: 15,
  },
  rowPosition: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10, // Razmak između redova
    width: "100%",
  },
  inputPosition: {
    marginLeft: 15,
    marginTop: 10,
    marginBottom: 0,
    width: "43%",
    fontSize: 14,
    backgroundColor: colors.mint,
  },
  buttonAdd: {
    justifyContent: "center",
    alignItems: "center",
    color: "white",
    backgroundColor: colors.zelena,
    borderRadius: 100,
    marginLeft: "15%",
    marginTop: 10,
    width: "70%",
  },
  table: {
    marginTop: 20,
    borderTopWidth: 1,
    borderTopColor: "#ddd",
  },
  tableHeader: {
    flexDirection: "row",
    backgroundColor: colors.mint,
    paddingTop: 10,
    paddingBottom: 10,
    paddingRight: 10,
    paddingLeft: 10,
  },
  tableHeaderCell: {
    flex: 1,
    fontWeight: "bold",
    textAlign: "left",
  },
  tableRow: {
    flexDirection: "row",
    paddingTop: 10,
    paddingBottom: 10,
    paddingLeft: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#ddd",
  },
  tableCell: {
    flex: 1,
    textAlign: "left",
  },
  actionHeaderCell: {
    flex: 0.4,
    paddingTop: 10,
    paddingBottom: 10,
    paddingRight: 10,
  },
  deleteButton: {
    backgroundColor: colors.zelena,
    flex: 0.4,
    borderRadius: 5,
    padding: 5,
    alignItems: "center",
    justifyContent: "center",
  },
  deleteButtonText: {
    color: "#fff",
    fontSize: 12,
    fontWeight: "bold",
    textAlign: "center",
  },
});
