import AsyncStorage from "@react-native-async-storage/async-storage";
import { useNavigation } from "@react-navigation/native";
import axios from "axios";
import React, { createContext, useEffect, useState } from "react";
import { BASE_URL } from "../config";
import { Alert } from "react-native";
export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [accessToken, setAccessToken] = useState(null);
  const [email, setEmail] = useState(null);
  const [refreshToken, setRefreshToken] = useState(null);
  const [userInfo, setUserInfo] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const navigation = useNavigation();

  useEffect(() => {
    const loadTokens = async () => {
      const storedAccessToken = await AsyncStorage.getItem("accessToken");
      const storedRefreshToken = await AsyncStorage.getItem("refreshToken");

      if (storedAccessToken && storedRefreshToken) {
        setAccessToken(storedAccessToken);
        setRefreshToken(storedRefreshToken);
      }
    };

    loadTokens();
  }, []);

  // Create axios instance
  const instance = axios.create({
    baseURL: `${BASE_URL}`,
    timeout: 5000,
  });

  const refreshAccessToken = async () => {
    try {
      const response = await instance.post(`/users/refresh`, {
        token: refreshToken,
      });
      const tokenData = response.data.data;
      const newAccessToken = tokenData.accessToken;

      setAccessToken(newAccessToken);
      await AsyncStorage.setItem("accessToken", newAccessToken);

      return newAccessToken;
    } catch (error) {
      console.error("Failed to refresh access token", error);
      logout();
    }
  };

  const makeAuthenticatedRequest = async (apiFunction) => {
    try {
      const response = await apiFunction(accessToken);
      return response;
    } catch (error) {
      if (error.response && error.response.status === 401) {
        const newAccessToken = await refreshAccessToken();
        if (newAccessToken) {
          return apiFunction(newAccessToken);
        }
      }

      throw error;
    }
  };

  const register = async (firstName, lastName, email, password) => {
    setIsLoading(true);
    try {
      const res = await instance.post(`/users/create`, {
        firstName,
        lastName,
        email,
        password,
      });
      let userInfo = res.data;
      setUserInfo(userInfo);
      await AsyncStorage.setItem("userInfo", JSON.stringify(userInfo));
      setIsLoading(false);
      navigation.navigate("LOGIN");
    } catch (error) {
      console.log(`register error ${error}`);
      setIsLoading(false);
    }
  };

  const login = async (email, password) => {
    setIsLoading(true);
    try {
      const res = await instance.post(`/users/login`, {
        email,
        password,
      });
      let userInfo = res.data;
      const userJson = userInfo.data;
      setAccessToken(userJson.accessToken);
      setRefreshToken(userJson.refreshToken);
      setEmail(userJson.email);
      await AsyncStorage.setItem("accessToken", userJson.accessToken);
      await AsyncStorage.setItem("refreshToken", userJson.refreshToken);
      await AsyncStorage.setItem("email", userJson.email);

      setUserInfo(userInfo);
      await AsyncStorage.setItem("userInfo", JSON.stringify(userInfo));
      setIsLoading(false);
      if (userJson.privilegeId == 3) {
        navigation.navigate("DASHBOARD_SUPERVIZOR");
      } else if (userJson.privilegeId == 2) {
        navigation.navigate("DASHBOARD_ADMIN");
      } else {
        navigation.navigate("DASHBOARD");
      }
    } catch (error) {
      console.log(`login error ${error}`);
      Alert.alert("Greška", "Pogrešno uneseno korisničko ime ili lozinka!");
      setIsLoading(false);
    }
  };

  const getAllUsers = async () => {
    setIsLoading(true);
    try {
      const res = await instance.get(`/users/`);
      let users = res.data;
      console.log(users);
      setIsLoading(false);
      return users;
    } catch (error) {
      console.log(`getAllUsers error ${error}`);
      Alert.alert("Greška", "Doslo je do greške!");
      setIsLoading(false);
    }
  };

  const getUsersRoleByEmail = async (email) => {
    setIsLoading(true);

    try {
      const res = await makeAuthenticatedRequest((token) =>
        instance.get(`/users/roles?email=${email}`, {
          headers: { Authorization: `${token}` },
        })
      );

      let users = res.data;

      console.log(users);

      setIsLoading(false);
      return users;
    } catch (error) {
      console.log(`getUsersRoleByEmail error ${error}`);
      setIsLoading(false);
    }
  };

  const changeRoles = async (params) => {
    setIsLoading(true);
    try {
      const res = await instance.put(`/users/roles`, params);
      setIsLoading(false);
      return true;
    } catch (error) {
      console.log(`getAllUsers error ${error}`);
      Alert.alert("Greška", "Doslo je do greške!");
      setIsLoading(false);
      return false;
    }
  };

  const addRestaurant = async (params) => {
    setIsLoading(true);
    console.log(params);
    const paramsNew = {
      ...params,
      email: email,
    };
    try {
      const res = await makeAuthenticatedRequest((token) =>
        instance.post(`/restaurants`, paramsNew, {
          headers: { Authorization: `${token}` },
        })
      );

      let restaurantInfo = res.data;
      console.log(restaurantInfo);
      setIsLoading(false);
      if (res.data.code === 201) {
        return true;
      } else {
        return false;
      }
    } catch (error) {
      console.log(`addRestaurant error ${error}`);
      setIsLoading(false);
      return false;
    }
  };

  const getAllRestaurantsByCoordinates = async (latitude, longitude) => {
    setIsLoading(true);

    try {
      const res = await makeAuthenticatedRequest((token) =>
        instance.get(
          `/restaurants/coordinates?latitude=${latitude}&longitude=${longitude}`,
          {
            headers: { Authorization: `${token}` },
          }
        )
      );

      let restaurantInfo = res.data;
      console.log(restaurantInfo);
      setIsLoading(false);
      return restaurantInfo;
    } catch (error) {
      console.log(`getAllRestaurantsByCoordinates error ${error}`);
      setIsLoading(false);
    }
  };

  const getAllRestaurants = async () => {
    setIsLoading(true);

    try {
      const res = await makeAuthenticatedRequest((token) =>
        instance.get(`/restaurants`, {
          headers: { Authorization: `${token}` },
        })
      );

      let restaurantInfo = res.data;
      setIsLoading(false);
      return restaurantInfo;
    } catch (error) {
      console.log(`getAllRestaurants error ${error}`);
      setIsLoading(false);
    }
  };

  const addImage = async (imageUri) => {
    setIsLoading(true);
    const now = new Date();

    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, "0");
    const day = String(now.getDate()).padStart(2, "0");
    const hours = String(now.getHours()).padStart(2, "0");
    const minutes = String(now.getMinutes()).padStart(2, "0");
    const seconds = String(now.getSeconds()).padStart(2, "0");

    const formattedDate = `${year}${month}${day}_${hours}${minutes}${seconds}`;

    const randomString = Math.random().toString(36).substring(2, 8);
    const fileName = `image_${formattedDate}_${randomString}.jpg`;

    const data = new FormData();
    data.append("file", {
      uri: imageUri,
      name: fileName,
      type: "image/jpeg",
    });

    try {
      const res = await makeAuthenticatedRequest((token) =>
        instance.post(`/images`, data, {
          headers: {
            Authorization: `${token}`,
            "Content-Type": "multipart/form-data",
          },
        })
      );

      let url = res.data;
      setIsLoading(false);
      return url;
    } catch (error) {
      console.log(JSON.stringify(error, null, 4));
      setIsLoading(false);
    }
  };

  const getCategories = async () => {
    setIsLoading(true);

    try {
      const res = await makeAuthenticatedRequest((token) =>
        instance.get(`/categories`, {
          headers: { Authorization: `${token}` },
        })
      );

      let categories = res.data;

      setIsLoading(false);
      return categories;
    } catch (error) {
      console.log(`getCategories error ${error}`);
      setIsLoading(false);
    }
  };

  const getPositions = async () => {
    setIsLoading(true);

    try {
      const res = await makeAuthenticatedRequest((token) =>
        instance.get(`/positions`, {
          headers: { Authorization: `${token}` },
        })
      );

      let positions = res.data;

      setIsLoading(false);
      return positions;
    } catch (error) {
      console.log(`getPositions error ${error}`);
      setIsLoading(false);
    }
  };

  const getPositionsByRestaurant = async (restaurantId) => {
    setIsLoading(true);

    try {
      const res = await makeAuthenticatedRequest((token) =>
        instance.get(`/positions/restaurant?restaurantId=${restaurantId}`, {
          headers: { Authorization: `${token}` },
        })
      );

      let positions = res.data;

      setIsLoading(false);
      return positions;
    } catch (error) {
      console.log(`getPositionsByRestaurant error ${error}`);
      setIsLoading(false);
    }
  };

  const changeProfilePhoto = async (photoUrl) => {
    setIsLoading(true);
    try {
      const res = await makeAuthenticatedRequest((token) =>
        instance.patch(
          `/users/change-profile-photo`,
          {
            email,
            photoUrl,
          },
          {
            headers: { Authorization: `${token}` },
          }
        )
      );

      setIsLoading(false);
    } catch (error) {
      console.log(`Change Profile photo error ${error}`);
      setIsLoading(false);
    }
  };
  const getUserByEmail = async () => {
    setIsLoading(true);
    try {
      const url = "/users/" + email;

      const res = await makeAuthenticatedRequest((token) =>
        instance.get(url, {
          headers: { Authorization: `${token}` },
        })
      );
      let user = res.data.data;
      console.log(user);

      setIsLoading(false);
      return user;
    } catch (error) {
      console.log(`getUserByEmail error ${error}`);
      setIsLoading(false);
    }
  };

  const changePasswordService = async (password) => {
    setIsLoading(true);
    try {
      const url = "/users/change-password";
      const res = await makeAuthenticatedRequest((token) =>
        instance.patch(
          url,
          {
            email,
            password,
          },
          {
            headers: { Authorization: `${token}` },
          }
        )
      );
      let { code } = res.data;
      if (code == 201) {
        setIsLoading(false);
        return true;
      }
      setIsLoading(false);
      return false;
    } catch (error) {
      console.log(`changePasswordService error ${error}`);
      setIsLoading(false);
    }
  };

  const getAllRestaurantsByName = async (name) => {
    setIsLoading(true);

    try {
      const res = await makeAuthenticatedRequest((token) =>
        instance.get(`/restaurants/name?name=${name}`, {
          headers: { Authorization: `${token}` },
        })
      );

      let restaurantInfo = res.data;

      setIsLoading(false);
      return restaurantInfo;
    } catch (error) {
      setIsLoading(false);
      Alert.alert("Greška", "Ne postoji ugostiteljski objekat sa tim imenom!");
    }
  };

  const getAvailableSlots = async (params) => {
    setIsLoading(true);

    const { date, guestCount, category, position, id } = params;
    const positionId = position.id;
    const categoryId = category.id;

    const dateOnly = date.toISOString().slice(0, 10);
    try {
      const res = await makeAuthenticatedRequest((token) =>
        instance.get(
          `reservations/slots?positionId=${positionId}&categoryId=${categoryId}&restaurantId=${id}&chairs=${guestCount}&dateReservation=${dateOnly}`,
          {
            headers: { Authorization: `${token}` },
          }
        )
      );

      const termins = res.data;
      setIsLoading(false);
      return termins;
    } catch (error) {
      setIsLoading(false);
      console.log(`getAvailableSlots error ${error}`);
    }
  };

  const getReservationsByUser = async () => {
    setIsLoading(true);

    try {
      const res = await makeAuthenticatedRequest((token) =>
        instance.get(`/reservations?email=${email}`, {
          headers: { Authorization: `${token}` },
        })
      );

      const reservations = res.data;
      setIsLoading(false);
      return reservations;
    } catch (error) {
      setIsLoading(false);
      console.log(`getReservationsByUser error ${error}`);
    }
  };

  const getActiveReservationsByUser = async () => {
    setIsLoading(true);

    try {
      const res = await makeAuthenticatedRequest((token) =>
        instance.get(`/reservations/active?email=${email}`, {
          headers: { Authorization: `${token}` },
        })
      );

      const reservations = res.data;
      console.log(reservations);
      setIsLoading(false);
      return reservations;
    } catch (error) {
      setIsLoading(false);
      console.log(`getReservationsByUser error ${error}`);
    }
  };

  const getActiveReservationsPerRestaurant = async () => {
    setIsLoading(true);

    try {
      const res = await makeAuthenticatedRequest((token) =>
        instance.get(`/reservations/restaurants/active?email=${email}`, {
          headers: { Authorization: `${token}` },
        })
      );

      const reservations = res.data;
      console.log(reservations);
      setIsLoading(false);
      return reservations;
    } catch (error) {
      setIsLoading(false);
      console.log(`getActiveReservationsPerRestaurant error ${error}`);
    }
  };

  const addReservations = async (params) => {
    setIsLoading(true);
    console.log(params);
    const paramsNew = {
      ...params,
      userId: email,
    };
    try {
      const res = await makeAuthenticatedRequest((token) =>
        instance.post(`/reservations`, paramsNew, {
          headers: { Authorization: `${token}` },
        })
      );

      console.log(res.data);

      setIsLoading(false);
      return true;
    } catch (error) {
      setIsLoading(false);
      Alert.alert("Greška", "Doslo je do greške!");
      console.log(`addReservations error ${error}`);
    }
  };

  const deleteReservations = async (params) => {
    setIsLoading(true);
    console.log(params);
    try {
      const res = await makeAuthenticatedRequest((token) =>
        instance.delete(`/reservations`, {
          headers: { Authorization: `${token}` },
          data: params,
        })
      );

      setIsLoading(false);
    } catch (error) {
      setIsLoading(false);
      Alert.alert("Greška", "Doslo je do greške!");
      console.log(`deleteReservations error ${error}`);
    }
  };

  const logout = async () => {
    setIsLoading(true);
    const params = {
      accessToken,
      refreshToken,
    };
    try {
      await makeAuthenticatedRequest((token) =>
        instance.delete(`users/logout`, {
          headers: { Authorization: `${token}` },
          data: params,
        })
      );

      await AsyncStorage.removeItem("userInfo");
      await AsyncStorage.removeItem("accessToken");
      await AsyncStorage.removeItem("refreshToken");
      await AsyncStorage.removeItem("email");
      setUserInfo({});
      setAccessToken(null);
      setRefreshToken(null);
      setEmail(null);
      setIsLoading(false);
      navigation.navigate("LOGIN");
    } catch (error) {
      console.log(`logout error ${error}`);
      setIsLoading(false);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        isLoading,
        register,
        login,
        getAllUsers,
        getUsersRoleByEmail,
        changeRoles,
        logout,
        addRestaurant,
        getAllRestaurantsByCoordinates,
        getAllRestaurantsByName,
        getAllRestaurants,
        getCategories,
        getPositions,
        getPositionsByRestaurant,
        addImage,
        changeProfilePhoto,
        getUserByEmail,
        changePasswordService,
        getAvailableSlots,
        getReservationsByUser,
        getActiveReservationsByUser,
        getActiveReservationsPerRestaurant,
        addReservations,
        deleteReservations,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
