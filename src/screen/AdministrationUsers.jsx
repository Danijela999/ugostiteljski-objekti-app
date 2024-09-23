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
import { Checkbox } from "react-native-paper";

const AdministrationUsers = ({}) => {
  const [users, setUsers] = useState([]);
  const { getAllUsers, changeRoles } = useContext(AuthContext);
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

      <View style={styles.headerRow}>
        <Text style={styles.headerText}>Korisnik</Text>
        <Text style={styles.headerText}>Admin</Text>
      </View>

      <FlatList
        data={users}
        keyExtractor={(item) => item.email}
        renderItem={renderUserItem}
      />

      <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
        <Text style={styles.saveButtonText} labelStyle={{ fontSize: 18 }}>
          Sačuvaj
        </Text>
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
    paddingVertical: 15,
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
  saveButtonText: {
    color: colors.white,
    fontSize: 16,
    textAlign: "center",
  },
});

export default AdministrationUsers;
