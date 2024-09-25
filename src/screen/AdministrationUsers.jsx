import React, { useContext, useEffect, useState } from "react";
import {
  FlatList,
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  Alert,
} from "react-native";
import { colors } from "../utils/colors";
import { AuthContext } from "../context/AuthContext";
import Spinner from "react-native-loading-spinner-overlay/lib";
import { Checkbox, TextInput } from "react-native-paper";

const AdministrationUsers = ({}) => {
  const [users, setUsers] = useState([]);
  const { getAllUsers, getUsersRoleByEmail, changeRoles } =
    useContext(AuthContext);
  const [usersSearch, setUsersSearch] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [modifiedUsers, setModifiedUsers] = useState([]);

  useEffect(() => {
    const fetchUsers = async () => {
      setIsLoading(true);
      try {
        const response = await getAllUsers();
        setUsers(response.data);
      } catch (error) {
        Alert.alert("Greška", "Greška učitavanju korisnika");
        console.log("Greška učitavanju korisnika", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchUsers();
  }, []);

  const handleCheckboxChange = (email, isAdmin) => {
    setUsers((prevUsers) =>
      prevUsers.map((user) =>
        user.email === email ? { ...user, privilegeId: isAdmin ? 2 : 1 } : user
      )
    );

    setModifiedUsers((prevModifiedUsers) => {
      const userIndex = prevModifiedUsers.findIndex((u) => u.email === email);
      if (userIndex !== -1) {
        const updatedUsers = [...prevModifiedUsers];
        updatedUsers[userIndex] = { email, privilegeId: isAdmin ? 2 : 1 };
        return updatedUsers;
      } else {
        return [...prevModifiedUsers, { email, privilegeId: isAdmin ? 2 : 1 }];
      }
    });
  };

  const searchUsers = async () => {
    const users = await getUsersRoleByEmail(usersSearch);
    setUsers(users.data);
  };

  const handleSave = () => {
    console.log("Modified users:", modifiedUsers);
    const isChange = changeRoles({ users: [...modifiedUsers] });
    console.log(isChange);
    Alert.alert("Informacija", "Promene su uspešno sačuvane.");
  };

  const renderUserItem = ({ item }) => (
    <View style={styles.userRow}>
      <Text style={styles.userText}>{item.email}</Text>
      <Checkbox
        status={item.privilegeId === 2 ? "checked" : "unchecked"}
        onPress={() => handleCheckboxChange(item.email, item.privilegeId !== 2)}
        color={colors.zelena}
      />
    </View>
  );

  return (
    <View style={styles.container}>
      <Spinner visible={isLoading} />
      <TextInput
        style={styles.input}
        placeholder="Email"
        placeholderTextColor="#999"
        value={usersSearch}
        onChangeText={(text) => setUsersSearch(text)}
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
      <TouchableOpacity
        mode="contained"
        onPress={searchUsers}
        style={styles.detailButton}
      >
        <Text style={styles.buttonText}>Pretraži</Text>
      </TouchableOpacity>
      <View style={styles.headerRow}>
        <Text style={styles.headerText}>Korisnik</Text>
        <Text style={styles.headerText}>Admin</Text>
      </View>

      <View style={styles.listContainer}>
        <FlatList
          data={users}
          keyExtractor={(item) => item.email}
          renderItem={renderUserItem}
          showsVerticalScrollIndicator={false}
        />
      </View>
      <TouchableOpacity
        mode="contained"
        onPress={handleSave}
        style={styles.detailButton}
      >
        <Text style={styles.buttonText}>Sačuvaj</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
  },
  headerRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderColor: "#ddd",
    backgroundColor: "#f1f1f1",
  },
  headerText: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#333",
  },
  userRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderColor: "#ddd",
  },
  userText: {
    fontSize: 16,
    color: "#333",
  },
  saveButton: {
    justifyContent: "center",
    alignItems: "center",
    marginLeft: "20%",
    fontSize: 20,
    height: 45,
    width: "60%",
    marginTop: 10,
    backgroundColor: colors.zelena,
    borderRadius: 100,
  },
  saveButtonText: {
    color: colors.white,
    fontSize: 16,
    textAlign: "center",
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
  buttonText: {
    color: colors.white,
    fontSize: 16,
    textAlign: "center",
    padding: 10,
  },
  listContainer: {
    flex: 1,
    maxHeight: 400,
    height: "80%",
  },
});

export default AdministrationUsers;
