import { StyleSheet } from "react-native";
import React from "react";

import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { NavigationContainer } from "@react-navigation/native";
import HomeScreen from "./src/screen/HomeScreen";
import SignupScreen from "./src/screen/SignupScreen";
import LoginScreen from "./src/screen/LoginScreen";
import { AuthProvider } from "./src/context/AuthContext";
import AddRestaurant from "./src/screen/AddRestaurant";
import Dashboard from "./src/screen/Dashboard";
import CreateReservationScreen from "./src/screen/CreateReservationScreen";
import { PaperProvider } from "react-native-paper";
import ProfileScreen from "./src/screen/ProfileScreen";
import DashboardAdmin from "./src/screen/DashboardAdmin";

const Stack = createNativeStackNavigator();
const App = () => {
  return (
    <NavigationContainer>
      <PaperProvider>
        <AuthProvider>
          <Stack.Navigator
            screenOptions={{
              headerShown: false,
            }}
          >
            <Stack.Screen name={"HOME"} component={HomeScreen} />
            <Stack.Screen name={"DASHBOARD"} component={Dashboard} />
            <Stack.Screen name={"DASHBOARD_ADMIN"} component={DashboardAdmin} />
            <Stack.Screen name={"PROFILE"} component={ProfileScreen} />
            <Stack.Screen name={"LOGIN"} component={LoginScreen} />
            <Stack.Screen name={"MAP"} component={AddRestaurant} />
            <Stack.Screen
              name={"RESERVATION"}
              component={CreateReservationScreen}
            />
            <Stack.Screen name="SIGNUP" component={SignupScreen} />
          </Stack.Navigator>
        </AuthProvider>
      </PaperProvider>
    </NavigationContainer>
  );
};

export default App;

const styles = StyleSheet.create({});
