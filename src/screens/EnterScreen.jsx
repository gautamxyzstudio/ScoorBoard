import React, { useState, useRef, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  Animated,
  Image,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import CustomInput from "../components/CustomInput";
import GradientButton from "../gradientButton/GradientButton";
import Colors from "../contants/Colors";
import bluevector from "../../assets/blueVector.png";
import backgroundLogo from "../../assets/Vectorbg.png";
import backgroundImg from "../../assets/Vectorbg.png";

const EnterScreen = ({ navigation }) => {
  const [email, setEmail] = useState("");

  // Animation values
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(0.8)).current;
  const slideAnim = useRef(new Animated.Value(50)).current;

  // Animate screen entry
  useEffect(() => {
    Animated.parallel([
      Animated.spring(scaleAnim, {
        toValue: 1,
        useNativeDriver: true,
        friction: 6,
        tension: 80,
      }),
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 600,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 600,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  // Navigate animation
  const handleNavigate = (screen) => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 0,
        duration: 400,
        useNativeDriver: true,
      }),
      Animated.timing(scaleAnim, {
        toValue: 0.8,
        duration: 400,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: -50,
        duration: 400,
        useNativeDriver: true,
      }),
    ]).start(() => {
      navigation.navigate(screen);
      fadeAnim.setValue(0);
      scaleAnim.setValue(0.8);
      slideAnim.setValue(50);
      // optional: re-animate when coming back
      Animated.parallel([
        Animated.spring(scaleAnim, {
          toValue: 1,
          useNativeDriver: true,
          friction: 6,
          tension: 80,
        }),
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 600,
          useNativeDriver: true,
        }),
        Animated.timing(slideAnim, {
          toValue: 0,
          duration: 600,
          useNativeDriver: true,
        }),
      ]).start();
    });
  };

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      <ScrollView
        contentContainerStyle={styles.container}
        keyboardShouldPersistTaps="handled"
      >
        <View style={StyleSheet.absoluteFill} pointerEvents="none">
          <Image source={backgroundLogo} style={styles.backgroundTop} />
          <Image source={backgroundImg} style={styles.backgroundBottom} />
        </View>

        {/* Animated Container */}
        <Animated.View
          style={{
            opacity: fadeAnim,
            transform: [
              { translateY: slideAnim },
              { scale: scaleAnim },
            ],
          }}
        >
          <Image source={bluevector} style={styles.logo} />
          <Text style={styles.title}>SportSynz</Text>
          
          <Text style={styles.inputLabel}>Enter ID</Text>
          <CustomInput value={email} onChangeText={setEmail} />

          {/* Buttons row */}
          <View style={styles.buttonRow}>
            <GradientButton
              title="Log In"
              onPress={() => handleNavigate("LoginPage")}
              style={[styles.button, { flex: 1, marginRight: 10 }]}
            />
            <GradientButton
              title="Sign Up"
              onPress={() => handleNavigate("SignUp")}
              style={{ flex: 1, marginLeft: 10 }}
              type="secondary"
            />
          </View>
        </Animated.View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    backgroundColor: Colors.background,
    padding: 20,
    justifyContent: "center",
  },
  backgroundTop: {
    position: "absolute",
    top: -250,
    left: 210,
    width: "50%",
    height: "100%",
    resizeMode: "contain",
    opacity: 1,
    zIndex: 0,
  },
  backgroundBottom: {
    position: "absolute",
    top: 280,
    left: 0,
    width: "50%",
    height: "100%",
    resizeMode: "contain",
    transform: [{ rotate: "176deg" }],
    opacity: 1,
    zIndex: 0,
  },
  logo: {
    resizeMode: "contain",
    alignSelf: "center",
    marginBottom: 20,
    zIndex: 2,
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
  buttonRow: {
    flexDirection: "row",
    justifyContent: "center",
    marginTop: 20,
    zIndex: 2,
  },
  button: {
    height: 48,
    borderRadius: 10,
  },
});

export default EnterScreen;
