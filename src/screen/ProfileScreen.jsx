import React, { useState } from "react";
import {
  View,
  StyleSheet,
  Image,
  TouchableOpacity,
  ScrollView,
  Alert,
} from "react-native";
import {
  Text,
  Button,
  Card,
  Modal,
  Portal,
  Provider as PaperProvider,
  TextInput,
} from "react-native-paper";
import DateTimePicker from "@react-native-community/datetimepicker";
import Icon from "react-native-vector-icons/MaterialIcons";

import { colors } from "../utils/colors";
import { Picker } from "@react-native-picker/picker";
import RestaurantCard from "../components/RestaurantCard";

const profileInfo = {
  image: require("../assets/profile.png"),
  title: "Zdravo Danijela!",
  name: "Danijela Grbović",
  mail: "danijela.grbovic@gmail.com",
};

const restaurantInfo = [
  {
    image: require("../assets/smokvica.jpg"),
    title: "Smokvica",
    time: "15.08.2024. 09:00 - 10:00",
    position: "Bašta",
    category: "Doručak",
    guestCount: 6,
  },
  {
    image: require("../assets/bela_reka.jpg"),
    title: "Bela Reka",
    time: "15.08.2024. 19:00 - 22:00",
    position: "Terasa",
    category: "Večera",
    guestCount: 2,
  },
  {
    image: require("../assets/smokvica.jpg"),
    title: "Smokvica",
    time: "16.08.2024. 10:00 - 11:00",
    position: "Bašta",
    category: "Doručak",
    guestCount: 6,
  },
];

const ProfileScreen = () => {
  const [visible, setVisible] = useState(false);
  const showModal = () => setVisible(true);
  const hideModal = () => setVisible(false);

  return (
    <PaperProvider>
      <View style={styles.container}>
        <Card style={styles.card}>
          <Card.Title title={profileInfo.title} titleStyle={styles.cardTitle} />
          <Card.Content>
            <Text style={styles.name}>{profileInfo.name}</Text>
            <Button
              mode="contained"
              onPress={showModal}
              style={styles.detailButton}
            >
              Prikaži detalje
            </Button>
          </Card.Content>
        </Card>
        <Card style={styles.card}>
          <Card.Title
            title="Aktivne rezervacije"
            titleStyle={styles.cardTitle}
          />
          <Card.Content>
            {restaurantInfo.map((restaurant, index) => (
              <RestaurantCard
                key={index} // ili još bolje, koristite jedinstveni ID ako postoji: key={restaurant.id}
                imageUrl={restaurant.image}
                restaurantName={restaurant.title}
                time={restaurant.time}
                position={restaurant.position}
                category={restaurant.category}
                guestCount={restaurant.guestCount}
              />
            ))}
          </Card.Content>
        </Card>
        <Portal>
          <Modal
            visible={visible}
            onDismiss={hideModal}
            contentContainerStyle={styles.modalContainer}
          >
            <Image source={profileInfo.image} style={styles.image} />
            <Text style={styles.modalTitle}>{profileInfo.name}</Text>
            <Text style={styles.modalDescription}>{profileInfo.mail}</Text>
            <Button mode="contained" style={styles.closeButton}>
              Promeni lozinku
            </Button>
            <Button
              mode="contained"
              onPress={hideModal}
              style={styles.closeButton}
            >
              Zatvori
            </Button>
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
    marginTop: 50,
    backgroundColor: "#f5f5f5",
  },
  card: {
    marginBottom: 20,
  },
  cardTitle: {
    fontSize: 26,
    paddingTop: 10,
    fontWeight: "bold",
    textAlign: "center",
  },
  label: {
    fontSize: 18,
    marginBottom: 10,
  },
  dateGuestContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 15,
  },
  dateInputContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  input: {
    flex: 1,
    maxWidth: 120,
    marginRight: 10,
    fontSize: 14,
    backgroundColor: colors.mint,
  },
  calendarButton: {
    backgroundColor: colors.zelena,
    padding: 10,
    borderRadius: 100,
    justifyContent: "center",
    alignItems: "center",
  },
  guestInput: {
    flex: 1,
    maxWidth: 110,
    marginLeft: 5,
    fontSize: 14,
    backgroundColor: colors.mint,
  },
  pickerContainer: {
    borderWidth: 1,
    borderColor: colors.zelena,
    borderRadius: 5,
    marginBottom: 15,
  },
  picker: {
    height: 50,
  },
  reservationButton: {
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: colors.zelena,
    borderRadius: 100,
    marginLeft: "15%",
    width: "70%",
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
  image: {
    width: 300,
    height: 300,
    marginBottom: 20,
    borderRadius: 300,
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
    marginTop: 10,
  },
  timeSlotContainer: {
    flexDirection: "row",
    marginTop: 20,
  },
  timeSlot: {
    width: 95,
    height: 50,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 10,
    borderRadius: 100,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  timeSlotText: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
  },
});

export default ProfileScreen;
