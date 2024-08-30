import AsyncStorage from "@react-native-async-storage/async-storage";
import { useNavigation } from "@react-navigation/native";
import axios from "axios";
import React, { createContext, useEffect, useState } from "react";
import { BASE_URL } from "../config";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [accessToken, setAccessToken] = useState(null);
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
    headers: { "Content-Type": "application/json" },
  });

  const refreshAccessToken = async () => {
    try {
      console.log("refreshToken: " + refreshToken);
      const token = await AsyncStorage.getItem("refreshToken");
      console.log("TOKEN: " + token);
      const response = await instance.post(`/users/refresh`, {
        token: refreshToken,
      });
      console.log("REsponse:");
      console.log(response.data);
      const tokenData = response.data.data;
      const newAccessToken = tokenData.accessToken;

      // Update the state and AsyncStorage
      setAccessToken(newAccessToken);
      await AsyncStorage.setItem("accessToken", newAccessToken);

      return newAccessToken;
    } catch (error) {
      console.error("Failed to refresh access token", error);
      // Handle refresh token error, such as redirecting to login
      logout(); // You might want to log out the user if the refresh fails
    }
  };

  const makeAuthenticatedRequest = async (apiFunction) => {
    try {
      console.log("TOKEN: ");
      console.log(accessToken);
      const response = await apiFunction(accessToken);
      return response;
    } catch (error) {
      console.log("ERROR");
      console.log(error);
      if (error.response && error.response.status === 401) {
        console.log("OVDE SAMM!!");
        // Token is likely expired, so let's refresh it
        const newAccessToken = await refreshAccessToken();

        // Retry the original request with the new token
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

      // Save tokens to state and AsyncStorage
      console.log("TOKEN");
      const userJson = userInfo.data;
      console.log(userJson);
      setAccessToken(userJson.accessToken);
      setRefreshToken(userJson.refreshToken);
      console.log(userJson.accessToken);
      console.log(userJson.refreshToken);
      await AsyncStorage.setItem("accessToken", userJson.accessToken);
      await AsyncStorage.setItem("refreshToken", userJson.refreshToken);
      console.log("PROSLO");
      setUserInfo(userInfo);
      await AsyncStorage.setItem("userInfo", JSON.stringify(userInfo));
      setIsLoading(false);
      navigation.navigate("DASHBOARD");
    } catch (error) {
      console.log(`login error ${error}`);
      setIsLoading(false);
    }
  };

  const addRestaurant = async (
    name,
    description,
    address,
    latitude,
    longitude,
    startTime,
    endTime
  ) => {
    setIsLoading(true);

    try {
      const res = await makeAuthenticatedRequest((token) =>
        instance.post(
          `/restaurants`,
          {
            name,
            description,
            address,
            latitude,
            longitude,
            startTime,
            endTime,
          },
          {
            headers: { Authorization: `${token}` },
          }
        )
      );

      let restaurantInfo = res.data;
      console.log(restaurantInfo);
      setIsLoading(false);
    } catch (error) {
      console.log(`addRestaurant error ${error}`);
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
      setUserInfo({});
      setAccessToken(null);
      setRefreshToken(null);
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
        addRestaurant,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
