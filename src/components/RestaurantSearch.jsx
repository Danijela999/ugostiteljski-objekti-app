import React from "react";
import { View, Image, StyleSheet, TouchableOpacity } from "react-native";
import { Text } from "react-native-paper";
import { colors } from "../utils/colors";

const RestaurantSearch = ({ navigation, restaurant, image, time }) => {
  const handlePress = (item) => {
    navigation.navigate("RESERVATION", { item });
  };

  return (
    <View style={styles.container}>
      <Image source={{ uri: image }} style={styles.image} />
      <View style={styles.detailsContainer}>
        <Text style={styles.restaurantName}>{restaurant.name}</Text>
        <Text style={styles.time}>{time}</Text>
        <TouchableOpacity
          mode="contained"
          style={styles.closeButton}
          onPress={() => handlePress(restaurant)}
        >
          <Text style={styles.buttonText}>Rezerviši</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
  },
  image: {
    width: "40%",
    height: 100,
    resizeMode: "cover",
  },
  imageModal: {
    width: 300,
    height: 300,
    marginBottom: 20,
  },
  detailsContainer: {
    flex: 1,
    padding: 10,
  },
  restaurantName: {
    fontSize: 18,
    fontWeight: "bold",
  },
  time: {
    fontSize: 14,
    color: "gray",
    marginVertical: 5,
  },
  closeButton: {
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: colors.zelena,
    borderRadius: 100,
    marginTop: 10,
  },
  buttonText: {
    color: colors.white,
    fontSize: 16,
    textAlign: "center",
    padding: 10,
  },
});

export default RestaurantSearch;
