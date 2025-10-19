import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import HomeScreen from "@/screens/HomeScreen";
import SplashScreen from "@/screens/SplashScreen";
import ProfileScreen from "@/screens/ProfileScreen";
import UploadScreen from "@/screens/UploadScreen";
import SummaryScreen from "@/screens/SummaryScreen";
import HistoryScreen from "@/screens/HistoryScreen";
import LoginScreen from "@/screens/LoginScreen";
import SignUpScreen from "@/screens/SignupScreen";

export type RootStackParamList = {
  Splash: undefined;
  Login: undefined;
  Signup: undefined;
  Home: undefined;
  Upload: { contentType: string };
  Summary: undefined;
  History: undefined;
  Profile: undefined;
};

const Stack = createNativeStackNavigator<RootStackParamList>();

const AppNavigator = () => {
  return (
    <Stack.Navigator
      initialRouteName="Splash"
      screenOptions={{ headerShown: false }}
    >
      <Stack.Screen name="Splash" component={SplashScreen} />
      <Stack.Screen name="Login" component={LoginScreen} />
      <Stack.Screen name="Signup" component={SignUpScreen} />
      <Stack.Screen name="Home" component={HomeScreen} />
      <Stack.Screen name="Upload" component={UploadScreen} />
      <Stack.Screen name="Summary" component={SummaryScreen} />
      <Stack.Screen name="History" component={HistoryScreen} />
      <Stack.Screen name="Profile" component={ProfileScreen} />
    </Stack.Navigator>
  );
};

export default AppNavigator;
