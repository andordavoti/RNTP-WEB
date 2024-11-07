import '@expo/metro-runtime'
import { StatusBar } from "expo-status-bar";
import { StyleSheet, Text, View } from "react-native";
import TrackPlayer from "react-native-track-player";
import { playbackService } from "./utils/trackPlayer";
import { useSetupPlayer } from "./hooks/useSetupPlayer";

TrackPlayer.registerPlaybackService(() => playbackService);

export default function App() {
  const isPlayerReady = useSetupPlayer();

  if (!isPlayerReady) {
    return <Text>Loading...</Text>;
  }

  return (
    <View style={styles.container}>
      <Text>Open up App.tsx to start working on your app!</Text>
      <StatusBar style="auto" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
});
