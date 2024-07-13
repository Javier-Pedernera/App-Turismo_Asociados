// src/utils/storage.ts

import AsyncStorage from '@react-native-async-storage/async-storage';

const USER_DATA_KEY = 'userData';

export const saveUserData = async (userData: { email: string; password: string }) => {
  try {
    await AsyncStorage.setItem(USER_DATA_KEY, JSON.stringify(userData));
  } catch (error) {
    console.error('Error saving user data:', error);
  }
};

export const getUserData = async () => {
  try {
    const userDataJson = await AsyncStorage.getItem(USER_DATA_KEY);
    return userDataJson ? JSON.parse(userDataJson) : null;
  } catch (error) {
    console.error('Error getting user data:', error);
    return null;
  }
};
