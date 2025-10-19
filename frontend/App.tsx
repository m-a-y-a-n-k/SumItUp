import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import AppNavigator from "@/navigator/AppNavigator";

const App = () => {
  return (
    <NavigationContainer>
      <AppNavigator />
    </NavigationContainer>
  );
};

export default App;
