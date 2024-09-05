import {
  Image,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { Platform } from "react-native";

import React, { useContext, useState } from "react";
import { colors } from "../utils/colors";

import Ionicons from "react-native-vector-icons/Ionicons";
import SimpleLineIcons from "react-native-vector-icons/SimpleLineIcons";
import { useNavigation } from "@react-navigation/native";
import Spinner from "react-native-loading-spinner-overlay";
import { AuthContext } from "../context/AuthContext";

const SignupScreen = () => {
  const navigation = useNavigation();
  const [secureEntery, setSecureEntery] = useState(true);
  const [firstName, setFirstName] = useState(null);
  const [lastName, setLastName] = useState(null);
  const [email, setEmail] = useState(null);
  const [password, setPassword] = useState(null);
  const { isLoading, register } = useContext(AuthContext);
  const handleGoBack = () => {
    navigation.goBack();
  };

  const handleLogin = () => {
    navigation.navigate("LOGIN");
  };

  return (
    <View style={styles.container}>
      <Spinner visible={isLoading} />
      <TouchableOpacity style={styles.backButtonWrapper} onPress={handleGoBack}>
        <Ionicons
          name={"arrow-back-outline"}
          color={colors.primary}
          size={25}
        />
      </TouchableOpacity>
      <View style={styles.textContainer}>
        <Text style={styles.headingText}>Hajde da pocnemo!</Text>
      </View>
      {/* form  */}
      <View style={styles.formContainer}>
        <View style={styles.inputContainer}>
          <SimpleLineIcons name={"user"} size={30} color={colors.secondary} />
          <TextInput
            style={styles.textInput}
            placeholder="Unesi ime"
            placeholderTextColor={colors.secondary}
            // secureTextEntry={secureEntery}
            // keyboardType="phone-pad"
            value={firstName}
            onChangeText={(text) => setFirstName(text)}
          />
        </View>

        <View style={styles.inputContainer}>
          <SimpleLineIcons name={"user"} size={30} color={colors.secondary} />
          <TextInput
            style={styles.textInput}
            placeholder="Unesi prezime"
            placeholderTextColor={colors.secondary}
            // secureTextEntry={secureEntery}
            // keyboardType="phone-pad"
            value={lastName}
            onChangeText={(text) => setLastName(text)}
          />
        </View>

        <View style={styles.inputContainer}>
          <Ionicons name={"mail-outline"} size={30} color={colors.secondary} />
          <TextInput
            style={styles.textInput}
            placeholder="Unesi email adresu"
            placeholderTextColor={colors.secondary}
            keyboardType="email-address"
            value={email}
            onChangeText={(text) => setEmail(text)}
          />
        </View>
        <View style={styles.inputContainer}>
          <SimpleLineIcons name={"lock"} size={30} color={colors.secondary} />
          <TextInput
            style={styles.textInput}
            placeholder="Unesi lozinku"
            placeholderTextColor={colors.secondary}
            secureTextEntry={secureEntery}
            value={password}
            onChangeText={(text) => setPassword(text)}
          />
          <TouchableOpacity
            onPress={() => {
              setSecureEntery((prev) => !prev);
            }}
          >
            <SimpleLineIcons name={"eye"} size={20} color={colors.secondary} />
          </TouchableOpacity>
        </View>

        <TouchableOpacity style={styles.loginButtonWrapper}>
          <Text
            style={styles.loginText}
            onPress={() => {
              register(firstName, lastName, email, password);
            }}
          >
            Registruj se
          </Text>
        </TouchableOpacity>
        <View style={styles.footerContainer}>
          <Text style={styles.accountText}>Vec imas nalog!</Text>
          <TouchableOpacity onPress={handleLogin}>
            <Text style={styles.signupText}>Uloguj se</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

export default SignupScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.white,
    padding: 20,
  },
  backButtonWrapper: {
    height: 40,
    width: 40,
    backgroundColor: colors.gray,
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
  },
  textContainer: {
    marginVertical: 20,
  },
  headingText: {
    fontSize: 32,
    color: colors.primary,
  },
  formContainer: {
    marginTop: 20,
  },
  inputContainer: {
    borderWidth: 1,
    borderColor: colors.secondary,
    borderRadius: 100,
    paddingHorizontal: 20,
    flexDirection: "row",
    alignItems: "center",
    padding: 2,
    marginVertical: 10,
  },
  textInput: {
    flex: 1,
    paddingHorizontal: 10,
  },
  forgotPasswordText: {
    textAlign: "right",
    color: colors.primary,
    marginVertical: 10,
  },
  loginButtonWrapper: {
    backgroundColor: colors.zelena,
    borderRadius: 100,
    marginTop: 20,
  },
  loginText: {
    color: colors.white,
    fontSize: 20,
    textAlign: "center",
    padding: 10,
  },
  continueText: {
    textAlign: "center",
    marginVertical: 20,
    fontSize: 14,
    color: colors.primary,
  },
  googleButtonContainer: {
    flexDirection: "row",
    borderWidth: 2,
    borderColor: colors.primary,
    borderRadius: 100,
    justifyContent: "center",
    alignItems: "center",
    padding: 10,
    gap: 10,
  },
  googleImage: {
    height: 20,
    width: 20,
  },
  googleText: {
    fontSize: 20,
  },
  footerContainer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginVertical: 20,
    gap: 5,
  },
  accountText: {
    color: colors.primary,
  },
  signupText: {
    color: colors.primary,
  },
});
