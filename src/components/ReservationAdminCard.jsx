import React, { useState } from "react";
import { View, StyleSheet, Image } from "react-native";
import { Text, Button, Portal, Modal } from "react-native-paper";
import { colors } from "../utils/colors";

const ReservationAdminCard = ({
  title,
  imageUrl,
  restaurantName,
  email,
  time,
  position,
  category,
  guestCount,
}) => {
  const [visible, setVisible] = useState(false);
  const showModal = () => setVisible(true);
  const hideModal = () => setVisible(false);

  return (
    <View style={styles.container}>
      <Image source={imageUrl} style={styles.image} />
      <View style={styles.detailsContainer}>
        <Text style={styles.reservationTitle}>{title}</Text>
        <Text style={styles.textReservation}>{restaurantName}</Text>
        <Text style={styles.textReservation}>{time}</Text>
        <Button mode="contained" style={styles.closeButton} onPress={showModal}>
          Prikaži detalje
        </Button>
      </View>
      <Portal>
        <Modal
          visible={visible}
          onDismiss={hideModal}
          contentContainerStyle={styles.modalContainer}
        >
          <Image source={imageUrl} style={styles.imageModal} />
          <Text style={styles.modalTitle}>{title}</Text>
          <Text style={styles.modalDescription}>
            Naziv restorana: {restaurantName}
          </Text>
          <Text style={styles.modalDescription}>email: {email}</Text>
          <Text style={styles.modalDescription}>Vreme: {time}</Text>
          <Text style={styles.modalDescription}>
            Broj gostiju: {guestCount}
          </Text>
          <Text style={styles.modalDescription}>Pozicija: {position}</Text>
          <Text style={styles.modalDescription}>Kategorija: {category}</Text>

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
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
  },
  detailsContainer: {
    flex: 1,
    padding: 10,
  },
  image: {
    width: "40%",
    height: 100,
    resizeMode: "cover",
  },
  imageModal: {
    width: 250,
    height: 250,
    marginBottom: 10,
  },
  reservationTitle: {
    fontSize: 18,
    fontWeight: "bold",
  },
  textReservation: {
    fontSize: 14,
    color: "gray",
    marginVertical: 2,
  },
  closeButton: {
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: colors.zelena,
    borderRadius: 100,
    marginTop: 5,
  },
  modalContainer: {
    backgroundColor: "white",
    padding: 15,
    borderRadius: 10,
    alignItems: "center",
  },
  modalTitle: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 10,
  },
  modalDescription: {
    fontSize: 14,
    textAlign: "center",
    marginBottom: 10,
  },
});

export default ReservationAdminCard;
