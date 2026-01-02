import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import AppNavigator from "@/navigator/AppNavigator";
import { AuthProvider } from "@/context/AuthContext";

const App = () => {
  return (
    <AuthProvider>
      <NavigationContainer>
        <AppNavigator />
      </NavigationContainer>
    </AuthProvider>
  );
};

export default App;
