import React from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Image,
  Dimensions,
} from "react-native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RootStackParamList } from "@/navigator/AppNavigator";
import { useAuth } from "@/context/AuthContext";

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
  const { signOut } = useAuth();

  const renderItem = ({ item }: { item: (typeof contentTypes)[0] }) => (
    <TouchableOpacity
      style={styles.card}
      onPress={() =>
        navigation.navigate(item.screen, { contentType: item.title })
      }
    >
      <Image source={item.icon} style={styles.icon} />
      <Text style={styles.cardText}>{item.title}</Text>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View>
          <Text style={styles.title}>Welcome to SumItUp</Text>
          <Text style={styles.subtitle}>
            Select the content type you want to summarize
          </Text>
        </View>
        <TouchableOpacity onPress={signOut} style={styles.signOutButton}>
          <Text style={styles.signOutText}>Sign Out</Text>
        </TouchableOpacity>
      </View>

      <FlatList
        data={contentTypes}
        renderItem={renderItem}
        keyExtractor={(item) => item.title}
        numColumns={3}
        columnWrapperStyle={styles.row}
        contentContainerStyle={styles.gridContainer}
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
};

const { width } = Dimensions.get("window");
const cardWidth = (width - 60) / 3; // 3 columns with spacing

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#0F172A",
    paddingTop: 60,
    paddingHorizontal: 20,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 10,
  },
  title: {
    fontSize: 26,
    fontWeight: "700",
    color: "#fff",
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 14,
    color: "gray",
    marginTop: 0,
    maxWidth: "80%",
  },
  signOutButton: {
    padding: 8,
    backgroundColor: "#ef4444",
    borderRadius: 8,
  },
  signOutText: {
    color: "white",
    fontWeight: "600",
    fontSize: 12,
  },
  gridContainer: {
    paddingVertical: 10,
    paddingBottom: 20,
  },
  row: {
    justifyContent: "space-between",
    marginBottom: 15,
  },
  card: {
    backgroundColor: "#1E293B",
    width: cardWidth,
    height: cardWidth * 1.2,
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
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
    fontSize: 14,
  },
});

export default HomeScreen;
