import * as React from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import Ionicons from "react-native-vector-icons/Ionicons";
import ProfileScreen from "./ProfileScreen";
import { colors } from "../utils/colors";
import AdministrationUsers from "./AdministrationUsers";

const Tab = createBottomTabNavigator();

export default function DashboarSupervizor() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconName;

          if (route.name === "Korisnici") {
            iconName = focused ? "settings" : "settings-outline";
          } else if (route.name === "Kategorije i pozicije") {
            iconName = focused ? "settings" : "settings-outline";
          } else if (route.name === "Profil") {
            iconName = focused ? "person" : "person-outline";
          }

          return <Ionicons name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: colors.zelena,
        tabBarInactiveTintColor: "gray",
      })}
    >
      <Tab.Screen name="Korisnici" component={AdministrationUsers} />
      <Tab.Screen
        name="Kategorije i pozicije"
        component={AdministrationUsers}
      />
      <Tab.Screen name="Profil" component={ProfileScreen} />
    </Tab.Navigator>
  );
}
