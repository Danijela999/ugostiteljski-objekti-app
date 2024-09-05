import { Image, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { Platform } from "react-native";

import React from "react";
import { colors } from "../utils/colors";
import { fonts } from "../utils/fonts";
import { useNavigation } from "@react-navigation/native";
const HomeScreen = () => {
  const navigation = useNavigation();

  const handleLogin = () => {
    navigation.navigate("LOGIN");
  };

  const handleSignup = () => {
    navigation.navigate("SIGNUP");
  };
  return (
    <View style={styles.container}>
      <Image source={require("../assets/logo.png")} style={styles.logo} />
      <Image
        source={require("../assets/main.png")}
        style={styles.bannerImage}
      />
      <Text style={styles.title}>StoRez</Text>
      <Text style={styles.subTitle}>
        Brzo i lako rezervisi mesto u svom omiljenom restoranu pomocu aplikacije
        StoRez!
      </Text>
      <View style={styles.buttonContainer}>
        <TouchableOpacity
          style={[
            styles.loginButtonWrapper,
            // ,{ backgroundColor: colors.primary },
          ]}
          onPress={handleLogin}
        >
          <Text style={styles.loginButtonText}>Prijavi se</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.loginButtonWrapper, { backgroundColor: colors.white }]}
          onPress={handleSignup}
        >
          <Text style={styles.signupButtonText}>Registruj se</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default HomeScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.white,
    alignItems: "center",
  },
  logo: {
    width: 150,
    height: 150,
    marginVertical: 10,
  },
  bannerImage: {
    height: 250,
    width: 250,
  },
  title: {
    fontSize: 40,
    fontFamily: "",
    paddingHorizontal: 20,
    textAlign: "center",
    color: colors.primary,
    marginTop: 40,
  },
  subTitle: {
    fontSize: 18,
    paddingHorizontal: 20,
    textAlign: "center",
    color: colors.secondary,
    marginVertical: 20,
  },
  buttonContainer: {
    marginTop: 20,
    flexDirection: "row",
    borderWidth: 2,
    borderColor: colors.primary,
    width: "80%",
    height: 60,
    borderRadius: 100,
  },
  loginButtonWrapper: {
    justifyContent: "center",
    alignItems: "center",
    width: "50%",
    backgroundColor: colors.zelena,
    borderRadius: 98,
  },
  loginButtonText: {
    color: colors.white,
    fontSize: 18,
  },
  signupButtonText: {
    fontSize: 18,
  },
});
