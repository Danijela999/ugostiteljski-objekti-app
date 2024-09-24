import React, { useContext, useEffect, useState } from "react";
import {
  View,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
} from "react-native";
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
import { AuthContext } from "../context/AuthContext";
import Spinner from "react-native-loading-spinner-overlay/lib";
import { eventEmitter } from "../eventEmitter";

const AllReservationsScreenUser = () => {
  const [visible, setVisible] = useState(false);
  const showModal = () => setVisible(true);
  const hideModal = () => setVisible(false);
  const [isLoading, setIsLoading] = useState(false);

  const { getReservationsByUser, getActiveReservationsByUser } =
    useContext(AuthContext);
  const [activeReservations, setActiveReservations] = useState([]);
  const [allReservations, setAllReservations] = useState([]);
  useEffect(() => {
    const getReservations = async () => {
      setIsLoading(true);
      try {
        const activeReservations = await getActiveReservationsByUser();
        setActiveReservations(activeReservations.data);
        const allReservations = await getReservationsByUser();
        setAllReservations(allReservations.data);
      } catch (error) {
        Alert.alert("Greška", "Greška prilikom učitavanja rezervacija");
        console.log("Greška prilikom učitavanja rezervacija", error);
      } finally {
        setIsLoading(false);
      }
    };

    getReservations();
    eventEmitter.on("reservationCreated", getReservations);

    return () => {
      eventEmitter.off("reservationCreated", getReservations);
    };
  }, []);

  const getReservationsChild = async () => {
    setIsLoading(true);
    try {
      const activeReservations = await getActiveReservationsByUser();
      setActiveReservations(activeReservations.data);
      const allReservations = await getReservationsByUser();
      setAllReservations(allReservations.data);
    } catch (error) {
      Alert.alert("Greška", "Greška prilikom učitavanja rezervacija");
      console.log("Greška prilikom učitavanja rezervacija", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <PaperProvider>
      <Spinner visible={isLoading} />
      <View style={styles.container}>
        <Card style={styles.card}>
          <Card.Title
            title="Aktivne rezervacije"
            titleStyle={styles.cardTitle}
          />
          <Card.Content>
            <ScrollView style={styles.scrollContainer}>
              {activeReservations.length > 0 &&
                activeReservations.map((reservation, index) => (
                  <RestaurantCard
                    key={index}
                    imageUrl={reservation.image}
                    restaurantName={reservation.name}
                    time={`${reservation.dateOnly}, ${reservation.startTime} - ${reservation.endTime}`}
                    position={reservation.position}
                    guestCount={reservation.guestCount}
                    restaurantId={reservation.restaurantId}
                    tableId={reservation.tableId}
                    email={reservation.email}
                    startDateTime={reservation.startDateTime}
                    onReservationDeleted={getReservationsChild}
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
              {allReservations.map((reservation, index) => (
                <HistoryReservationCard
                  key={index}
                  imageUrl={reservation.image}
                  restaurantName={reservation.name}
                  time={`${reservation.dateOnly}, ${reservation.startTime} - ${reservation.endTime}`}
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
