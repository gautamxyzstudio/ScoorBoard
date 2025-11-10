import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  ActivityIndicator,
  TouchableOpacity,
  Alert,
} from "react-native";
import CustomInput from "../components/CustomInput";
import GradientButton from "../gradientButton/GradientButton";
import Colors from "../contants/Colors";
import bluevector from "../../assets/blueVector.png";
import backgroundLogo from "../../assets/Vectorbg.png";
import backgroundImg from "../../assets/Vectorbg.png";
import { getMatchByCode } from "../api/auth";
import AsyncStorage from "@react-native-async-storage/async-storage";
import GradientText from "../gradientText/GradientText";
import { KeyboardAwareScrollView } from "@pietile-native-kit/keyboard-aware-scrollview";

const ViewLogin = ({ navigation }) => {
  const [matchCode, setMatchCode] = useState("");
  const [loading, setLoading] = useState(false);

  const handleCodeChange = (text) => {
    const cleanText = text.replace(/-/g, "");
    const formatted = cleanText.match(/.{1,3}/g)?.join("-") || "";
    setMatchCode(formatted);
  };

  const handleGetMatch = async () => {
    if (!matchCode.trim()) {
      Alert.alert("Error", "Please enter match code!");
      return;
    }

    try {
      setLoading(true);
      const token = await AsyncStorage.getItem("token");
      const matchData = await getMatchByCode(matchCode, token);

      if (!matchData) {
        Alert.alert("Not Found", "No match found for this code!");
        return;
      }

      navigation.navigate("FinalScoor", { match: matchData });
    } catch (error) {
      console.log("API error:", error);
      Alert.alert("Error", error?.message || "Failed to fetch match data!");
    } finally {
      setLoading(false);
    }
  };

  const handleNavigate = (screen) => {
    navigation.navigate(screen);
  };

  return (
    <>
      <KeyboardAwareScrollView
        extraKeyboardSpace={30}
        contentContainerStyle={styles.container}
        enableOnAndroid
        keyboardShouldPersistTaps="handled"
      >
        <View style={styles.container}>
          {/* Background */}
          <View style={StyleSheet.absoluteFill} pointerEvents="none">
            <Image source={backgroundLogo} style={styles.backgroundTop} />
            <Image source={backgroundImg} style={styles.backgroundBottom} />
          </View>

          {/* Logo */}
          <Image source={bluevector} style={styles.logo} />
          <Text style={styles.title}>SportSynz</Text>

          {/* Input */}
          <Text style={styles.inputLabel}>Enter Match Code</Text>
          <CustomInput
            value={matchCode}
            onChangeText={handleCodeChange}
            placeholder="Enter match code"
            maxLength={11}
            keyboardType="default"
            returnKeyType="done"
          />

          {/* View Match Button */}
          <GradientButton
            onPress={handleGetMatch}
            title="View Match"
            style={styles.secondLast}
            disabled={loading}
          />

          <View style={styles.dividerContainer}>
            <View style={styles.line} />
            <Text style={styles.orText}>Or</Text>
            <View style={styles.line} />
          </View>

          <TouchableOpacity
            onPress={() => handleNavigate("LoginPage")}
            style={styles.googleButton}
            disabled={loading}
          >
            <GradientText text="Access Admin" style={styles.gradientText} />
          </TouchableOpacity>
        </View>
      </KeyboardAwareScrollView>

      {loading && (
        <View style={styles.loadingOverlay}>
          <ActivityIndicator size="large" color={Colors.primary} />
        </View>
      )}
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    backgroundColor: Colors.background,
    padding: 10,
    justifyContent: "center",
  },
  backgroundTop: {
    position: "absolute",
    top: -250,
    left: 201,
    width: "50%",
    height: "100%",
    resizeMode: "contain",
  },
  backgroundBottom: {
    position: "absolute",
    top: 280,
    left: -10,
    width: "50%",
    height: "100%",
    resizeMode: "contain",
    transform: [{ rotate: "176deg" }],
  },
  logo: {
    resizeMode: "contain",
    alignSelf: "center",
    marginBottom: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: "700",
    textAlign: "center",
    color: Colors.text,
    marginBottom: 25,
  },
  inputLabel: {
    color: "#414141",
    fontSize: 12,
    fontWeight: "400",
    marginTop: 10,
  },
  secondLast: {
    marginTop: 32,
  },
  googleButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: "#EFF0F7",
    borderRadius: 10,
    height: 48,
    backgroundColor: "#F5F5F5",
  },
  gradientText: {
    fontSize: 17,
    fontWeight: "700",
    fontFamily: "Kumbh Sans",
    lineHeight: 40,
    textTransform: "capitalize",
    textAlign: "center",
  },
  dividerContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: 20,
  },
  line: { flex: 1, height: 1, backgroundColor: "#ccc" },
  orText: {
    marginHorizontal: 10,
    color: "#414141)",
    fontSize: 14,
    fontWeight: "500",
  },
  loadingOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0,0,0,0.3)",
    justifyContent: "center",
    alignItems: "center",
    zIndex: 10,
  },
});

export default ViewLogin;
