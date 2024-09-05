import React, { useContext, useEffect, useState } from "react";
import {
  View,
  StyleSheet,
  Image,
  TouchableOpacity,
  Alert,
  ScrollView,
  TextInput, // Dodato za vertikalni skrol
} from "react-native";
import {
  Text,
  Button,
  Card,
  Modal,
  Portal,
  Provider as PaperProvider,
} from "react-native-paper";
import SimpleLineIcons from "react-native-vector-icons/SimpleLineIcons";

import * as ImagePicker from "expo-image-picker";
import { AuthContext } from "../context/AuthContext";

import { colors } from "../utils/colors";
import Spinner from "react-native-loading-spinner-overlay/lib";

const ProfileScreen = () => {
  const {
    addImage,
    changeProfilePhoto,
    getUserByEmail,
    changePasswordService,
    isLoading,
  } = useContext(AuthContext);
  const [profileImage, setProfileImage] = useState(null);
  const [profileInfo, setPrfileInfo] = useState({
    first_name: "",
    email: "",
    img_url: "",
  });
  const [secureEntery, setSecureEntery] = useState(true);
  const [password, setPassword] = useState("");
  useEffect(() => {
    const getUserInformations = async () => {
      const userInfo = await getUserByEmail();
      const defaultImg = require("../assets/profile.png");
      setProfileImage(defaultImg);
      if (userInfo[0].img_url) {
        setProfileImage({ uri: userInfo[0].img_url });
      }
      setPrfileInfo(userInfo[0]);
      console.log(userInfo);
    };

    getUserInformations();
  }, []);

  const selectImage = async () => {
    Alert.alert(
      "Odaberite opciju",
      "Izaberite fotografiju iz galerije ili uslikajte novu",
      [
        {
          text: "Galerija",
          onPress: pickImageFromGallery,
        },
        {
          text: "Kamera",
          onPress: takePhoto,
        },
        {
          text: "Otkaži",
          style: "cancel",
        },
      ]
    );
  };

  const pickImageFromGallery = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled) {
      setProfileImage({ uri: result.assets[0].uri });
      saveImage(result.assets[0].uri);
    }
  };

  const takePhoto = async () => {
    let result = await ImagePicker.launchCameraAsync({
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled) {
      setProfileImage({ uri: result.assets[0].uri });
      saveImage(result.assets[0].uri);
    }
  };

  const saveImage = async (uri) => {
    const response = await addImage(uri);
    const photoUrl = response.data.Location;
    console.log("Sačuvana putanja slike:", response.data.Location, "putanjaaa");
    await changeProfilePhoto(photoUrl);
  };

  const changePassword = async () => {
    if (password === "") {
      Alert.alert("Info", "Sifra mora biti popunjena!");
      return;
    }
    const res = await changePasswordService(password);
    if (res) {
      Alert.alert("Info", "Sifra je uspesno promenjena!");
      setPassword("");
    } else {
      Alert.alert("Greska", "Doslo je do greske prilikom promene sifre");
      setPassword("");
    }
  };

  return (
    <PaperProvider>
      <Spinner visible={isLoading} />
      <View style={styles.container}>
        <Card style={styles.card}>
          <TouchableOpacity onPress={selectImage} style={styles.imageContainer}>
            <Image source={profileImage} style={styles.image} />
          </TouchableOpacity>
          <Card.Title
            title={"Zdravo " + profileInfo.first_name + "!"}
            titleStyle={styles.cardTitle}
          />
        </Card>
        <Text style={styles.textProfile}>
          Ime i prezime: {profileInfo.first_name} {profileInfo.last_name}
        </Text>
        <Text style={styles.textProfile}>Email: {profileInfo.email}</Text>

        <View style={styles.inputContainer}>
          <SimpleLineIcons name={"lock"} size={30} color={colors.secondary} />
          <TextInput
            style={styles.textInput}
            placeholder="Unesi novu lozinku"
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
        <Button
          mode="contained"
          onPress={changePassword}
          style={styles.detailButton}
          labelStyle={{ fontSize: 18 }}
        >
          Promeni lozinku
        </Button>
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
    marginBottom: 20,
    height: "50%",
  },
  cardTitle: {
    fontSize: 30,
    paddingTop: 5,
    marginTop: 25,
    paddingBottom: 30,
    fontWeight: "bold",
    textAlign: "center",
  },
  name: {
    fontSize: 18,
    color: "black",
    textAlign: "center",
    marginBottom: 10,
  },
  textProfile: {
    fontSize: 22,
    textAlign: "center",
    marginTop: 15,
  },
  detailButton: {
    justifyContent: "center",
    alignItems: "center",
    marginLeft: "10%",
    fontSize: 20,
    height: 50,
    width: "80%",
    marginTop: 20,
    backgroundColor: colors.zelena,
    borderRadius: 100,
  },
  imageContainer: {
    alignItems: "center",
    marginBottom: 20,
  },
  image: {
    width: 200,
    height: 200,
    borderRadius: 100,
    marginTop: 20,
  },
  inputContainer: {
    borderWidth: 1,
    borderColor: colors.secondary,
    borderRadius: 100,
    marginLeft: "10%",
    paddingHorizontal: 10,
    marginTop: 60,
    flexDirection: "row",
    alignItems: "center",
    padding: 2,
    marginVertical: 10,
    height: 50,
    width: "80%",
  },
  textInput: {
    flex: 1,
    paddingHorizontal: 10,
    fontWeight: "light",
  },
});

export default ProfileScreen;
