import { GestureHandlerRootView } from "react-native-gesture-handler";
import AppNavigation from "./src/navigation/AppNavigation";
import { SafeAreaProvider } from "react-native-safe-area-context";

export default function App() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaProvider style={{ flex: 1 }}>
          <AppNavigation />
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}
