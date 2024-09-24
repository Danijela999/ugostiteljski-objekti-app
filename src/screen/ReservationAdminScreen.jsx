import React, { useContext, useEffect, useState } from "react";
import { View, StyleSheet, ScrollView, Alert } from "react-native";
import { Card, Provider as PaperProvider } from "react-native-paper";
import { colors } from "../utils/colors";
import ReservationAdminCard from "../components/ReservationAdminCard";
import Spinner from "react-native-loading-spinner-overlay/lib";
import { AuthContext } from "../context/AuthContext";

const ReservationAdminScreen = () => {
  const [isLoading, setIsLoading] = useState(false);

  const { getActiveReservationsPerRestaurant } = useContext(AuthContext);
  const [allReservations, setAllReservations] = useState([]);
  useEffect(() => {
    const getReservations = async () => {
      setIsLoading(true);
      try {
        const allReservations = await getActiveReservationsPerRestaurant();
        setAllReservations(allReservations.data);
      } catch (error) {
        Alert.alert("Greška", "Greška prilikom učitavanja rezervacija");
        console.log("Greška prilikom učitavanja rezervacija", error);
      } finally {
        setIsLoading(false);
      }
    };

    getReservations();
  }, []);
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
              {allReservations.length > 0 &&
                allReservations.map((reservation, index) => (
                  <ReservationAdminCard
                    key={index}
                    title={`${reservation.firstName} ${reservation.lastName}`}
                    imageUrl={reservation.image}
                    restaurantName={reservation.name}
                    email={reservation.email}
                    time={`${reservation.dateOnly}, ${reservation.startTime} - ${reservation.endTime}`}
                    position={reservation.position}
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
    maxHeight: 600,
    height: "90%",
  },
});

export default ReservationAdminScreen;
