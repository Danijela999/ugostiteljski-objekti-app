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
  // Load tokens from AsyncStorage when the component mounts
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

      throw error; // If refresh fails or other errors occur, propagate them
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
      if (userJson.privilegeId == 2) {
        navigation.navigate("DASHBOARD_ADMIN");
      } else {
        navigation.navigate("DASHBOARD");
      }
    } catch (error) {
      console.log(`login error ${error}`);
      Alert.alert("Greska", "Doslo je do greske!");
      setIsLoading(false);
    }
  };

  const addRestaurant = async (
    params
  ) => {
    setIsLoading(true);
    console.log(params)
    const paramsNew = {
      ...params,
      email: email
    }
    try {
      const res = await makeAuthenticatedRequest((token) =>
        instance.post(
          `/restaurants`,
          paramsNew
          ,
          {
            headers: { Authorization: `${token}` },
          }
        )
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

    // Formatiranje datuma i vremena
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, "0"); // Dodavanje 1 jer su meseci 0-indeksirani
    const day = String(now.getDate()).padStart(2, "0");
    const hours = String(now.getHours()).padStart(2, "0");
    const minutes = String(now.getMinutes()).padStart(2, "0");
    const seconds = String(now.getSeconds()).padStart(2, "0");

    const formattedDate = `${year}${month}${day}_${hours}${minutes}${seconds}`;

    // Generisanje nasumičnog stringa
    const randomString = Math.random().toString(36).substring(2, 8);
    const fileName = `image_${formattedDate}_${randomString}.jpg`;

    const data = new FormData();
    data.append("file", {
      uri: imageUri,
      name: fileName,
      type: "image/jpeg",
    });
    //console.log(data);
    //console.log(JSON.stringify(data, null, 4));
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
      //  console.log("urllllllllllll",url);
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
      console.log(`getAllRestaurantsByCoordinates error ${error}`);
      setIsLoading(false);
    }
  };

  const changePasswordService = async (password) => {
    setIsLoading(true);
    try {
      // console.log(password);
      const url = "/users/change-password";
      //  console.log("urllllllllllll",url);
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
      // console.log(res);
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
      console.log(`getAllRestaurantsByCoordinates error ${error}`);
      setIsLoading(false);
    }
  };

  const logout = async () => {
    setIsLoading(true);
    try {
      await makeAuthenticatedRequest((token) =>
        instance.post(
          `/logout`,
          {},
          {
            headers: { Authorization: `${token}` },
          }
        )
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
        logout,
        addRestaurant,
        getAllRestaurantsByCoordinates,
        getAllRestaurantsByName,
        getAllRestaurants,
        getCategories,
        getPositions,
        addImage,
        changeProfilePhoto,
        getUserByEmail,
        changePasswordService,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
