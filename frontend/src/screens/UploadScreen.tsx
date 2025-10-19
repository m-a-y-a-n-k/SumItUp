import React from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RootStackParamList } from "@/navigator/AppNavigator";

type UploadScreenProps = {
  navigation: NativeStackNavigationProp<RootStackParamList, "Upload">;
};

const UploadScreen: React.FC<UploadScreenProps> = ({ navigation }) => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Upload Content</Text>
      <Text style={styles.subtitle}>
        Choose files, URLs, or media to summarize.
      </Text>
      <TouchableOpacity
        style={styles.button}
        onPress={() => navigation.navigate("Summary")}
      >
        <Text style={styles.buttonText}>Generate Summary</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#0F172A",
    padding: 20,
  },
  title: {
    fontSize: 22,
    fontWeight: "700",
    color: "#fff",
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 16,
    color: "gray",
    textAlign: "center",
    marginBottom: 20,
  },
  button: {
    backgroundColor: "#2563EB",
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
});

export default UploadScreen;
