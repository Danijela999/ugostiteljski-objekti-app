import * as React from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import Ionicons from "react-native-vector-icons/Ionicons";
import { View, Text } from "react-native";
import ProfileScreen from "./ProfileScreen";
import AllRestaurants from "./AllRestaurants";
import { colors } from "../utils/colors";
import SearchScreen from "./SearchScreen";
import AddRestaurant from "./AddRestaurant";
import ReservationAdminScreen from "./ReservationAdminScreen";

const Tab = createBottomTabNavigator();

export default function DashboardAdmin() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconName;

          if (route.name === "Dodaj ugostiteljski objekat") {
            iconName = focused ? "restaurant" : "restaurant-outline";
          } else if (route.name === "Profil") {
            iconName = focused ? "person" : "person-outline";
          } else if (route.name === "Rezervacije") {
            iconName = focused ? "calendar" : "calendar-outline";
          }

          return <Ionicons name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: colors.zelena,
        tabBarInactiveTintColor: "gray",
      })}
    >
      <Tab.Screen
        name="Dodaj ugostiteljski objekat"
        component={AddRestaurant}
      />
      <Tab.Screen name="Rezervacije" component={ReservationAdminScreen} />
      <Tab.Screen name="Profil" component={ProfileScreen} />
    </Tab.Navigator>
  );
}
