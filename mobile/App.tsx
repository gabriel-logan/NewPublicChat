import React from "react";
import { SafeAreaView, StatusBar, Text, View, StyleSheet } from "react-native";

function App() {
  return (
    <SafeAreaView style={styles.container}>
      <StatusBar />
      <View style={styles.centerContent}>
        <Text style={styles.text}>Hello World Chat</Text>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },

  centerContent: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },

  text: {
    fontSize: 32,
  },
});

export default App;
