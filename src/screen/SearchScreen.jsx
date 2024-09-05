import React, { useContext, useState } from "react";
import { View, StyleSheet, ScrollView } from "react-native";
import {
  Text,
  Button,
  Card,
  Provider as PaperProvider,
  TextInput,
} from "react-native-paper";

import { colors } from "../utils/colors";
import RestaurantSearch from "../components/RestaurantSearch";
import { AuthContext } from "../context/AuthContext";
import Spinner from "react-native-loading-spinner-overlay/lib";

const SearchScreen = ({ navigation }) => {
  const [restaurantSearch, setRestaurantSearch] = useState(null);
  const [restaurants, setRestaurants] = useState([]);
  const [isVisible, setVisible] = useState(false);
  const { getAllRestaurantsByName, isLoading } = useContext(AuthContext);
  const searchRestaurants = async () => {
    const restaurants = await getAllRestaurantsByName(restaurantSearch);
    setRestaurants(restaurants.data);
    setVisible(true);
  };

  return (
    <PaperProvider>
      <Spinner visible={isLoading} />
      <View style={styles.container}>
        <Text style={styles.label}>
          Istraži restorane i ugostiteljske objekte:
        </Text>
        <TextInput
          style={styles.input}
          placeholder="Naziv ugostiteljskog objekta"
          placeholderTextColor="#999"
          value={restaurantSearch}
          onChangeText={(text) => setRestaurantSearch(text)}
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
          onPress={searchRestaurants}
          style={styles.detailButton}
        >
          Pretraži
        </Button>
        {isVisible && (
          <Card style={styles.card}>
            <Card.Title title="Restorani" titleStyle={styles.cardTitle} />
            <Card.Content>
              <ScrollView style={styles.scrollContainer}>
                {restaurants.length > 0 &&
                  restaurants.map((restaurant, index) => (
                    <RestaurantSearch
                      navigation={navigation}
                      key={index}
                      image={restaurant.imageUrl}
                      time={
                        "Radno vreme: " +
                        restaurant.startTime +
                        ":00 - " +
                        restaurant.endTime +
                        ":00"
                      }
                      restaurant={restaurant}
                    />
                  ))}
              </ScrollView>
            </Card.Content>
          </Card>
        )}
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
  scrollContainer: {
    maxHeight: 380,
    paddingVertical: 10,
  },
  label: {
    fontSize: 18,
    color: "#333",
    marginBottom: 10,
  },
  detailButton: {
    justifyContent: "center",
    alignItems: "center",
    marginTop: 10,
    marginLeft: "20%",
    width: "60%",
    backgroundColor: colors.zelena,
    borderRadius: 100,
  },
  input: {
    height: 50,
    borderColor: "#ddd",
    borderWidth: 1,
    borderRadius: 10,
    paddingHorizontal: 15,
    backgroundColor: "#fff",
    fontSize: 16,
    color: "#333",
    shadowColor: "#000",
    borderBottomColor: colors.zelena,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 3,
  },
  card: {
    marginTop: 10,
  },
  cardTitle: {
    fontSize: 26,
    paddingTop: 10,
    fontWeight: "bold",
    textAlign: "center",
  },
});

export default SearchScreen;
