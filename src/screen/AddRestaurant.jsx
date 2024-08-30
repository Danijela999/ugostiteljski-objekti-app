import React, { useContext, useState } from "react";
import { View, StyleSheet, Alert } from "react-native";
import {
  Button,
  Card,
  Provider as PaperProvider,
  Text,
  TextInput,
} from "react-native-paper";
import MapView, { Marker, UrlTile } from "react-native-maps";
import axios from "axios";
import { colors } from "../utils/colors";
import { AuthContext } from "../context/AuthContext";

export default function AddRestaurant() {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [address, setAddress] = useState("");
  const [startTime, setStartTime] = useState(0);
  const [endTime, setEndTime] = useState(0);
  const { isLoading, addRestaurant } = useContext(AuthContext);

  const [region, setRegion] = useState({
    latitude: 44.787197,
    longitude: 20.457273,
    latitudeDelta: 0.0922,
    longitudeDelta: 0.0421,
  });
  const [marker, setMarker] = useState(null);

  const handleMapPress = (e) => {
    setMarker(e.nativeEvent.coordinate);
  };

  const searchAddress = () => {
    const url = `https://nominatim.openstreetmap.org/search?format=json&q=${address}`;
    axios
      .get(url)
      .then((response) => {
        if (response.data.length > 0) {
          const location = response.data[0];
          const { lat, lon } = location;
          setRegion({
            ...region,
            latitude: parseFloat(lat),
            longitude: parseFloat(lon),
          });
          setMarker({
            latitude: parseFloat(lat),
            longitude: parseFloat(lon),
          });
        } else {
          Alert.alert("Error", "Adresa nije pronadjena");
        }
      })
      .catch((error) => {
        console.error("Error fetching location:", error);
      });
  };

  return (
    <PaperProvider>
      <View style={styles.container}>
        <Card style={styles.card}>
          <Card.Title
            title="Dodavanje ugostiteljskog objekta"
            titleStyle={styles.cardTitle}
          />
          <Card.Content>
            <TextInput
              style={styles.input}
              label="Unesite adresu"
              value={address}
              onChangeText={setAddress}
              theme={{
                colors: {
                  text: colors.zelena,
                  placeholder: colors.zelena,
                  primary: colors.zelena,
                  underlineColor: "transparent",
                  background: "transparent",
                },
              }}
            />
            <Button
              mode="contained"
              style={styles.buttonRestaurant}
              onPress={searchAddress}
            >
              Pretrazite adresu
            </Button>
          </Card.Content>
        </Card>
        <MapView style={styles.map} region={region} onPress={handleMapPress}>
          <UrlTile
            urlTemplate="http://c.tile.openstreetmap.org/{z}/{x}/{y}.png"
            maximumZ={19}
          />
          {marker && <Marker coordinate={marker} />}
        </MapView>
        <Card style={styles.card}>
          <Card.Content>
            <TextInput
              style={styles.input}
              label="Naziv ugostiteljskog objekta"
              value={name}
              onChangeText={setName}
              theme={{
                colors: {
                  text: colors.zelena,
                  placeholder: colors.zelena,
                  primary: colors.zelena,
                  underlineColor: "transparent",
                  background: "transparent",
                },
              }}
            />

            <TextInput
              style={styles.input}
              label="Opis ugostiteljskog objekta"
              value={description}
              onChangeText={setDescription}
              theme={{
                colors: {
                  text: colors.zelena,
                  placeholder: colors.zelena,
                  primary: colors.zelena,
                  underlineColor: "transparent",
                  background: "transparent",
                },
              }}
            />
            <Text style={styles.subtitle}>Radno vreme</Text>
            <View style={styles.radnoVremeContainer}>
              <TextInput
                style={styles.inputRadnoVreme}
                label="Pocetak"
                keyboardType="numeric"
                value={startTime}
                onChangeText={setStartTime}
                theme={{
                  colors: {
                    text: colors.zelena,
                    placeholder: colors.zelena,
                    primary: colors.zelena,
                    underlineColor: "transparent",
                    background: "transparent",
                  },
                }}
              />
              <TextInput
                style={styles.inputRadnoVreme}
                label="Kraj"
                keyboardType="numeric"
                value={endTime}
                onChangeText={setEndTime}
                theme={{
                  colors: {
                    text: colors.zelena,
                    placeholder: colors.zelena,
                    primary: colors.zelena,
                    underlineColor: "transparent",
                    background: "transparent",
                  },
                }}
              />
            </View>

            <Button
              mode="contained"
              style={styles.buttonRestaurant}
              onPress={() => {
                addRestaurant(
                  name,
                  description,
                  address,
                  marker.latitude,
                  marker.longitude,
                  startTime,
                  endTime
                );
              }}
            >
              Dalje
            </Button>
          </Card.Content>
        </Card>
      </View>
    </PaperProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 30,
  },
  card: {
    marginBottom: 0,
  },
  cardTitle: {
    fontSize: 26,
    paddingTop: 10,
    fontWeight: "bold",
    textAlign: "center",
  },
  map: {
    flex: 1,
  },
  input: {
    marginLeft: 15,
    marginTop: 10,
    marginBottom: 10,
    width: "90%",
    paddingLeft: 5,
    fontSize: 14,
    backgroundColor: colors.mint,
  },
  buttonRestaurant: {
    justifyContent: "center",
    alignItems: "center",
    color: "white",
    backgroundColor: colors.zelena,
    borderRadius: 100,
    marginLeft: "15%",
    width: "70%",
  },
  radnoVremeContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  inputRadnoVreme: {
    marginLeft: 15,
    marginTop: 10,
    marginBottom: 10,
    paddingLeft: 5,
    width: "42.5%",
    fontSize: 14,
    backgroundColor: colors.mint,
  },
  subtitle: {
    marginLeft: 15,
    marginTop: 10,
    fontSize: 16,
    fontWeight: "bold",
    color: colors.zelena,
  },
});
