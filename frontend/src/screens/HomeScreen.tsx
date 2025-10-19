import React from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
} from "react-native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RootStackParamList } from "@/navigator/AppNavigator";

type HomeScreenProps = {
  navigation: NativeStackNavigationProp<RootStackParamList, "Home">;
};

const contentTypes = [
  {
    title: "Audio",
    icon: require("@/assets/icons/audio.png"),
    screen: "Upload" as const,
  },
  {
    title: "Video",
    icon: require("@/assets/icons/video.png"),
    screen: "Upload" as const,
  },
  {
    title: "PDF",
    icon: require("@/assets/icons/pdf.png"),
    screen: "Upload" as const,
  },
  {
    title: "URL",
    icon: require("@/assets/icons/url.png"),
    screen: "Upload" as const,
  },
  {
    title: "Image",
    icon: require("@/assets/icons/image.png"),
    screen: "Upload" as const,
  },
  {
    title: "Book",
    icon: require("@/assets/icons/book.png"),
    screen: "Upload" as const,
  },
  {
    title: "GIF",
    icon: require("@/assets/icons/gif.png"),
    screen: "Upload" as const,
  },
];

const HomeScreen: React.FC<HomeScreenProps> = ({ navigation }) => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Welcome to SumItUp</Text>
      <Text style={styles.subtitle}>
        Select the content type you want to summarize
      </Text>

      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.scrollContainer}
      >
        {contentTypes.map((item) => (
          <TouchableOpacity
            key={item.title}
            style={styles.card}
            onPress={() =>
              navigation.navigate(item.screen, { contentType: item.title })
            }
          >
            <Image source={item.icon} style={styles.icon} />
            <Text style={styles.cardText}>{item.title}</Text>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#0F172A",
    paddingTop: 60,
    paddingHorizontal: 20,
  },
  title: {
    fontSize: 26,
    fontWeight: "700",
    color: "#fff",
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: "gray",
    marginBottom: 20,
  },
  scrollContainer: {
    paddingVertical: 10,
  },
  card: {
    backgroundColor: "#1E293B",
    width: 100,
    height: 120,
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 15,
    padding: 10,
    shadowColor: "#000",
    shadowOpacity: 0.2,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
    elevation: 5,
  },
  icon: {
    width: 40,
    height: 40,
    marginBottom: 10,
    resizeMode: "contain",
  },
  cardText: {
    color: "#fff",
    fontWeight: "600",
    textAlign: "center",
  },
});

export default HomeScreen;
