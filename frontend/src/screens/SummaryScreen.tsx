import React from "react";
import { View, Text, StyleSheet, ScrollView } from "react-native";

const SummaryScreen = () => {
  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={{ padding: 20 }}
    >
      <Text style={styles.title}>Summary</Text>
      <Text style={styles.summaryText}>
        This is where the AI-generated summary will appear. It can support
        multiple formats: text, bullet points, keywords, or PDF export.
      </Text>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#0F172A",
  },
  title: {
    fontSize: 22,
    fontWeight: "700",
    color: "#fff",
    marginBottom: 20,
  },
  summaryText: {
    fontSize: 16,
    color: "#E5E7EB",
    lineHeight: 24,
  },
});

export default SummaryScreen;
