import React, { useContext, useEffect, useState } from "react";
import {
  FlatList,
  StyleSheet,
  Dimensions,
  View,
  Text,
  TouchableOpacity,
  Alert,
} from "react-native";
import { Card, Button } from "react-native-paper";
import { colors } from "../utils/colors";
import * as Location from "expo-location";
import { AuthContext } from "../context/AuthContext";
import Spinner from "react-native-loading-spinner-overlay/lib";

const screenWidth = Dimensions.get("window").width;

const AllRestaurants = ({ navigation }) => {
  const [restaurantsNearby, setRestaurantsNearby] = useState([]);
  const [newRestaurants, setNewRestaurants] = useState([]);
  const { getAllRestaurantsByCoordinates, getAllRestaurants } =
    useContext(AuthContext);
  const [location, setLocation] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const handlePress = (item) => {
    navigation.navigate("RESERVATION", { item });
  };

  useEffect(() => {
    const fetchLocationAndRestaurants = async () => {
      setIsLoading(true);
      try {
        let { status } = await Location.requestForegroundPermissionsAsync();
        if (status !== "granted") {
          console.log("Dozvola za pristup lokaciji nije odobrena");
          Alert.alert("Greška", "Dozvola za pristup lokaciji nije odobrena");
          setIsLoading(false);
          return;
        }

        let location = await Location.getCurrentPositionAsync({});
        setLocation(location.coords);

        const latitude = location.coords.latitude;
        const longitude = location.coords.longitude;

        const restaurantsNearby = await getAllRestaurantsByCoordinates(
          latitude,
          longitude
        );
        const restaurantsNew = await getAllRestaurants();
        setRestaurantsNearby(restaurantsNearby.data);
        setNewRestaurants(restaurantsNew.data);
      } catch (error) {
        Alert.alert(
          "Greška",
          "Greška pri dobijanju lokacije ili učitavanju restorana"
        );

        console.log(
          "Greška pri dobijanju lokacije ili učitavanju restorana:",
          error
        );
      } finally {
        setIsLoading(false);
      }
    };

    fetchLocationAndRestaurants();
  }, []);

  const renderHorizontalScroll = (data) => (
    <FlatList
      horizontal
      showsHorizontalScrollIndicator={false}
      data={data}
      renderItem={({ item }) => (
        <TouchableOpacity onPress={() => handlePress(item)}>
          <Card style={styles.card}>
            <Card.Cover
              source={{uri: item.imageUrl}}
              style={styles.image}
            />
            <Card.Content>
              <Text style={styles.title}>{item.name}</Text>
              <Text style={styles.description}>{item.description}</Text>
            </Card.Content>
          </Card>
        </TouchableOpacity>
      )}
      keyExtractor={(item, index) => index.toString()}
    />
  );

  return (
    <View style={styles.container}>
      <Spinner visible={isLoading} />
      <Text style={styles.header}>Restorani u blizini</Text>
      {renderHorizontalScroll(restaurantsNearby)}

      <Text style={styles.header}>Novi restorani</Text>
      {renderHorizontalScroll(newRestaurants)}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
    marginTop: 0,
  },
  detailButton: {
    justifyContent: "center",
    alignItems: "center",
    marginLeft: "15%",
    width: "70%",
    backgroundColor: colors.zelena,
    borderRadius: 100,
  },
  cardTitle: {
    fontSize: 26,
    paddingTop: 10,
    fontWeight: "bold",
    textAlign: "center",
  },
  profileButton: {
    marginBottom: 20,
    backgroundColor: "#6200ea",
  },
  profileButtonLabel: {
    fontSize: 18,
    fontWeight: "bold",
    color: "white",
  },
  header: {
    fontSize: 20,
    fontWeight: "bold",
    marginTop: 8,
    marginBottom: 8,
  },
  card: {
    width: screenWidth / 3,
    height: 230,
    marginRight: 10,
  },
  image: {
    height: 130,
    width: "100%",
  },
  title: {
    fontSize: 16,
    fontWeight: "bold",
    textAlign: "center",
    marginTop: 5,
  },
  description: {
    fontSize: 14,
    textAlign: "center",
    marginTop: 2,
  },
  searchButton: {
    marginTop: 15,
    padding: 10,
    backgroundColor: colors.zelena,
    borderRadius: 5,
    alignItems: "center",
  },
  searchButtonText: {
    fontSize: 16,
    fontWeight: "bold",
    color: "white",
  },
});

export default AllRestaurants;
