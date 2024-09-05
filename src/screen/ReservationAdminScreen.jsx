import React, { useState } from "react";
import {
  View,
  StyleSheet,
  Image,
  ScrollView, // Dodato za vertikalni skrol
} from "react-native";
import {
  Text,
  Button,
  Card,
  Modal,
  Portal,
  Provider as PaperProvider,
} from "react-native-paper";
import { colors } from "../utils/colors";
import ReservationAdminCard from "../components/ReservationAdminCard";

const activeReservationInfo = [
  {
    title: "Danijela Grbovic",
    image: require("../assets/smokvica.jpg"),
    restaurantName: "Bela reka",
    email: "danijela.grbovic@gmail.com",
    time: "15.08.2024. 09:00 - 10:00",
    position: "Bašta",
    category: "Doručak",
    guestCount: 6,
  },
  {
    title: "Danijela Grbovic",
    image: require("../assets/smokvica.jpg"),
    restaurantName: "Bela reka",
    email: "danijela.grbovic@gmail.com",
    time: "15.08.2024. 19:00 - 22:00",
    position: "Terasa",
    category: "Večera",
    guestCount: 2,
  },
  {
    title: "Danijela Grbovic",
    image: require("../assets/smokvica.jpg"),
    restaurantName: "Bela reka",
    email: "danijela.grbovic@gmail.com",
    time: "16.08.2024. 10:00 - 11:00",
    position: "Bašta",
    category: "Doručak",
    guestCount: 6,
  },
  {
    title: "Danijela Grbovic",
    email: "danijela.grbovic@gmail.com",
    image: require("../assets/bela_reka.jpg"),
    restaurantName: "Pavone Trattoria",
    time: "15.08.2024. 09:00 - 10:00",
    position: "Bašta",
    category: "Doručak",
    guestCount: 6,
  },
];

const ReservationAdminScreen = () => {
  return (
    <PaperProvider>
      <View style={styles.container}>
        <Card style={styles.card}>
          <Card.Title
            title="Aktivne rezervacije"
            titleStyle={styles.cardTitle}
          />
          <Card.Content>
            <ScrollView style={styles.scrollContainer}>
              {activeReservationInfo.map((reservation, index) => (
                <ReservationAdminCard
                  key={index}
                  title={reservation.title}
                  imageUrl={reservation.image}
                  restaurantName={reservation.restaurantName}
                  email={reservation.email}
                  time={reservation.time}
                  position={reservation.position}
                  category={reservation.category}
                  guestCount={reservation.guestCount}
                />
              ))}
            </ScrollView>
          </Card.Content>
        </Card>
      </View>
    </PaperProvider>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
    backgroundColor: "#f5f5f5",
  },
  card: {
    marginBottom: 10,
  },
  cardTitle: {
    fontSize: 26,
    paddingTop: 10,
    fontWeight: "bold",
    textAlign: "center",
  },
  name: {
    fontSize: 18,
    color: "gray",
    textAlign: "center",
    marginBottom: 10,
  },
  detailButton: {
    justifyContent: "center",
    alignItems: "center",
    marginLeft: "15%",
    width: "70%",
    backgroundColor: colors.zelena,
    borderRadius: 100,
  },
  modalContainer: {
    backgroundColor: "white",
    padding: 20,
    borderRadius: 10,
    alignItems: "center",
  },
  scrollContainer: {
    maxHeight: 700,
  },
});

export default ReservationAdminScreen;
