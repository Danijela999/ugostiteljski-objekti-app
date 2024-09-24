import React, { useContext, useState } from "react";
import { View, Image, StyleSheet, Alert, TouchableOpacity } from "react-native";
import { Text, Portal, Modal } from "react-native-paper";
import { AuthContext } from "../context/AuthContext";
import { colors } from "../utils/colors";

const RestaurantCard = ({
  imageUrl,
  restaurantName,
  time,
  position,
  guestCount,
  restaurantId,
  tableId,
  email,
  startDateTime,
  onReservationDeleted,
}) => {
  const [visible, setVisible] = useState(false);
  const showModal = () => setVisible(true);
  const hideModal = () => setVisible(false);
  const { deleteReservations } = useContext(AuthContext);

  const deleteReservation = async () => {
    const params = {
      restaurantId,
      tableId,
      email,
      startDateTime,
    };

    await deleteReservations(params);
    Alert.alert("Info", "Rezervacija je uspešno obrisana.", [
      {
        text: "OK",
        onPress: () => {
          onReservationDeleted();
          setVisible(false);
        },
      },
    ]);
  };

  return (
    <View style={styles.container}>
      <Image source={{ uri: imageUrl }} style={styles.image} />
      <View style={styles.detailsContainer}>
        <Text style={styles.restaurantName}>{restaurantName}</Text>
        <Text style={styles.time}>{time}</Text>
        <TouchableOpacity
          mode="contained"
          style={styles.detailsButton}
          onPress={showModal}
        >
          <Text style={styles.buttonText}>Prikaži detalje</Text>
        </TouchableOpacity>
      </View>
      <Portal>
        <Modal
          visible={visible}
          onDismiss={hideModal}
          contentContainerStyle={styles.modalContainer}
        >
          <Image source={{ uri: imageUrl }} style={styles.imageModal} />
          <Text style={styles.modalTitle}>{restaurantName}</Text>
          <Text style={styles.modalDescription}>Vreme: {time}</Text>
          <Text style={styles.modalDescription}>
            Broj gostiju: {guestCount}
          </Text>
          <Text style={styles.modalDescription}>Pozicija: {position}</Text>

          <TouchableOpacity
            mode="contained"
            style={styles.closeButton}
            onPress={deleteReservation}
          >
            <Text style={styles.buttonText}>Obriši rezervaciju</Text>
          </TouchableOpacity>
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
    width: 250,
    height: 250,
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
    width: "50%",
  },
  detailsButton: {
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: colors.zelena,
    borderRadius: 100,
    marginTop: 5,
  },
  modalContainer: {
    backgroundColor: "white",
    padding: 20,
    borderRadius: 10,
    alignItems: "center",
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
  buttonText: {
    color: colors.white,
    fontSize: 16,
    textAlign: "center",
    padding: 10,
  },
});

export default RestaurantCard;
