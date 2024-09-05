import React, { useState } from "react";
import { View, Image, StyleSheet, Alert } from "react-native";
import { Text, Button, PaperProvider, Portal, Modal } from "react-native-paper";
import { colors } from "../utils/colors";

const RestaurantSearch = ({ navigation, restaurant, image, time }) => {
  const handlePress = (item) => {
    navigation.navigate("RESERVATION", { item });
  };

  return (
    <View style={styles.container}>
      <Image source={{uri: image}} style={styles.image} />
      <View style={styles.detailsContainer}>
        <Text style={styles.restaurantName}>{restaurant.name}</Text>
        <Text style={styles.time}>{time}</Text>
        <Button
          mode="contained"
          style={styles.closeButton}
          onPress={() => handlePress(restaurant)}
        >
          Rezervisi
        </Button>
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
    width: "40%", // Zauzima 40% širine
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
});

export default RestaurantSearch;
