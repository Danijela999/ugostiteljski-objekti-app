import React, { useState } from "react";
import { View, StyleSheet, ScrollView, TouchableOpacity } from "react-native";
import {
  Card,
  Modal,
  Text,
  Portal,
  Provider as PaperProvider,
} from "react-native-paper";
import { colors } from "../utils/colors";
import RestaurantCard from "../components/RestaurantCard";
import HistoryReservationCard from "../components/HistoryReservations";

const activeReservationInfo = [
  {
    image: require("../assets/smokvica.jpg"),
    restaurantName: "Bela reka",
    time: "15.08.2024. 09:00 - 10:00",
    position: "Bašta",
    category: "Doručak",
    guestCount: 6,
  },
  {
    image: require("../assets/bela_reka.jpg"),
    restaurantName: "Pavone Trattoria",
    time: "15.08.2024. 09:00 - 10:00",
    position: "Bašta",
    category: "Doručak",
    guestCount: 6,
  },
  {
    image: require("../assets/bela_reka.jpg"),
    restaurantName: "Pavone Trattoria",
    time: "15.08.2024. 09:00 - 10:00",
    position: "Bašta",
    category: "Doručak",
    guestCount: 6,
  },
  {
    image: require("../assets/bela_reka.jpg"),
    restaurantName: "Pavone Trattoria",
    time: "15.08.2024. 09:00 - 10:00",
    position: "Bašta",
    category: "Doručak",
    guestCount: 6,
  },
  {
    image: require("../assets/bela_reka.jpg"),
    restaurantName: "Pavone Trattoria",
    time: "15.08.2024. 09:00 - 10:00",
    position: "Bašta",
    category: "Doručak",
    guestCount: 6,
  },
  {
    image: require("../assets/bela_reka.jpg"),
    restaurantName: "Pavone Trattoria",
    time: "15.08.2024. 09:00 - 10:00",
    position: "Bašta",
    category: "Doručak",
    guestCount: 6,
  },
];

const historyReservationInfo = [
  {
    image: require("../assets/smokvica.jpg"),
    restaurantName: "Bela reka",
    time: "15.08.2024. 09:00 - 10:00",
    position: "Bašta",
    category: "Doručak",
    guestCount: 6,
  },
  {
    image: require("../assets/bela_reka.jpg"),
    restaurantName: "Pavone Trattoria",
    time: "15.08.2024. 09:00 - 10:00",
    position: "Bašta",
    category: "Doručak",
    guestCount: 6,
  },
  {
    image: require("../assets/bela_reka.jpg"),
    restaurantName: "Pavone Trattoria",
    time: "15.08.2024. 09:00 - 10:00",
    position: "Bašta",
    category: "Doručak",
    guestCount: 6,
  },
  {
    image: require("../assets/bela_reka.jpg"),
    restaurantName: "Pavone Trattoria",
    time: "15.08.2024. 09:00 - 10:00",
    position: "Bašta",
    category: "Doručak",
    guestCount: 6,
  },
  {
    image: require("../assets/bela_reka.jpg"),
    restaurantName: "Pavone Trattoria",
    time: "15.08.2024. 09:00 - 10:00",
    position: "Bašta",
    category: "Doručak",
    guestCount: 6,
  },
  {
    image: require("../assets/bela_reka.jpg"),
    restaurantName: "Pavone Trattoria",
    time: "15.08.2024. 09:00 - 10:00",
    position: "Bašta",
    category: "Doručak",
    guestCount: 6,
  },
];

const AllReservationsScreenUser = () => {
  const [visible, setVisible] = useState(false);
  const showModal = () => setVisible(true);
  const hideModal = () => setVisible(false);
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
                <RestaurantCard
                  key={index}
                  imageUrl={reservation.image}
                  restaurantName={reservation.restaurantName}
                  time={reservation.time}
                  position={reservation.position}
                  guestCount={reservation.guestCount}
                />
              ))}
            </ScrollView>
          </Card.Content>
        </Card>
        <Card style={styles.card2}>
          <Card.Title
            title="Istorija rezervacija"
            titleStyle={styles.cardTitle}
          />
          <Card.Content>
            <TouchableOpacity
              mode="contained"
              style={styles.detailButton}
              onPress={showModal}
            >
              <Text style={styles.buttonText}>Prikaži</Text>
            </TouchableOpacity>
          </Card.Content>
        </Card>
        <Portal>
          <Modal
            visible={visible}
            onDismiss={hideModal}
            contentContainerStyle={styles.modalContainer}
          >
            <Text style={styles.modalTitle}>Sve rezervacije</Text>
            <ScrollView style={styles.scrollContainerModal}>
              {historyReservationInfo.map((reservation, index) => (
                <HistoryReservationCard
                  key={index}
                  imageUrl={reservation.image}
                  restaurantName={reservation.restaurantName}
                  time={reservation.time}
                />
              ))}
            </ScrollView>
            <TouchableOpacity
              mode="contained"
              onPress={hideModal}
              style={styles.closeButton}
            >
              <Text style={styles.buttonText}>Zatvori</Text>
            </TouchableOpacity>
          </Modal>
        </Portal>
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
    paddingBottom: 30,
    height: "70%",
  },
  card2: {
    marginTop: "5%",
    height: "25%",
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
    maxHeight: 500,
    height: "90%",
  },
  scrollContainerModal: {
    maxHeight: 500,
    width: "100%",
    height: "70%",
    paddingBottom: 10,
  },
  buttonText: {
    color: colors.white,
    fontSize: 16,
    textAlign: "center",
    padding: 10,
  },
  detailButton: {
    justifyContent: "center",
    alignItems: "center",
    marginTop: 20,
    marginLeft: "20%",
    width: "60%",
    backgroundColor: colors.zelena,
    borderRadius: 100,
  },
  modalTitle: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 10,
  },
  modalDescription: {
    fontSize: 16,
    textAlign: "center",
    marginBottom: 10,
  },
  modalHours: {
    fontSize: 16,
    marginBottom: 20,
  },
  closeButton: {
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: colors.zelena,
    borderRadius: 100,
    width: "50%",
    marginTop: 10,
  },
});

export default AllReservationsScreenUser;
