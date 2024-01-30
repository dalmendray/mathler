import { StyleSheet, View } from "react-native";

import MathlerGame from "./src/components/MathlerGame";

export default function App() {
  return (
    <View style={styles.container}>
      <MathlerGame />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
