import * as React from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import Ionicons from "react-native-vector-icons/Ionicons";
import ProfileScreen from "./ProfileScreen";
import { colors } from "../utils/colors";
import AddRestaurant from "./AddRestaurant";
import ReservationAdminScreen from "./ReservationAdminScreen";

const Tab = createBottomTabNavigator();

export default function DashboardAdmin() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconName;

          if (route.name === "Administracija ugostiteljskog objekta") {
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
        // headerShown: false

      })}
    >
      <Tab.Screen
        name="Administracija ugostiteljskog objekta"
        component={AddRestaurant}
      />
      <Tab.Screen name="Rezervacije" component={ReservationAdminScreen} />
      <Tab.Screen name="Profil" component={ProfileScreen} />
    </Tab.Navigator>
  );
}
