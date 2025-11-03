import React, { useState, useRef, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  Animated,
  Image,
  KeyboardAvoidingView,
  Platform,
  TouchableOpacity,
  Alert,
} from "react-native";
import { Checkbox } from "react-native-paper";
import { useForm, Controller } from "react-hook-form";
import AsyncStorage from "@react-native-async-storage/async-storage";
import CustomInput from "../components/CustomInput";
import GradientButton from "../gradientButton/GradientButton";
import Colors from "../contants/Colors";
import blueImg from "../../assets/blueVector.png";
import GoogleIcon from "../../assets/googleIcon.png";
import backgroundLogo from "../../assets/Vectorbg.png";
import backgroundsecond from "../../assets/VectorSecond.png";
import { loginUser } from "../api/auth";

const Login = ({ navigation }) => {
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm({ defaultValues: { email: "", password: "" } });

  const [rememberMe, setRememberMe] = useState(false);
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(50)).current;

 
  useEffect(() => {
    const checkLogin = async () => {
      try {
        const token = await AsyncStorage.getItem("userToken");
        const remember = await AsyncStorage.getItem("rememberMe");
        if (token && remember === "true") {
          navigation.replace("SelectSport");
        }
      } catch (error) {
        console.log("Auto login error:", error);
      }
    };

    checkLogin();

    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 600,
        useNativeDriver: true,
      }),
      Animated.spring(slideAnim, {
        toValue: 0,
        useNativeDriver: true,
        friction: 6,
        tension: 80,
      }),
    ]).start();
  }, []);
 
  const onSubmit = async (data) => {
    const { email, password } = data;
    try {
      const res = await loginUser({ identifier: email, password });

      // Save token & user info
      await AsyncStorage.setItem("userToken", res.jwt);
      await AsyncStorage.setItem("userInfo", JSON.stringify(res.user));

      //  Save Remember Me preference
      await AsyncStorage.setItem("rememberMe", rememberMe ? "true" : "false");

      Alert.alert("Success", "Login successful!");
      navigation.replace("SelectSport");
    } catch (error) {
      Alert.alert("Error", error.message || "Login failed!");
    }
  };

  const handleLogout = async () => {
    try {
      await AsyncStorage.multiRemove(["userToken", "userInfo", "rememberMe"]);
      Alert.alert("Logged out!");
      navigation.replace("Login");
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <View style={styles.container}>
        <Image
          source={backgroundLogo}
          style={styles.backgroundImage}
          pointerEvents="none"
        />
        <Image
          source={backgroundsecond}
          style={styles.backgroundImg}
          pointerEvents="none"
        />

        <Animated.View
          style={{ opacity: fadeAnim, transform: [{ translateY: slideAnim }] }}
        >
          <Image source={blueImg} style={styles.logo} />
          <Text style={styles.title}>SportSynz</Text>
          <Text style={styles.heading}>Get Started Now</Text>
          <Text style={styles.description}>
            Log in to explore about our app
          </Text>

          {/* Email Input */}
          <Controller
            control={control}
            name="email"
            rules={{
              required: "Email is required",
              pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
              validate: (v) => v.endsWith("@gmail.com") || "Only Gmail allowed",
            }}
            render={({ field: { onChange, value } }) => (
              <CustomInput
                label="Email"
                value={value}
                onChangeText={onChange}
                keyboardType="email-address"
              />
            )}
          />
          {errors.email && (
            <Text style={styles.errorText}>{errors.email.message}</Text>
          )}

          {/* Password Input */}
          <Controller
            control={control}
            name="password"
            rules={{
              required: "Password required",
              minLength: { value: 4, message: "Min 4 chars" },
            }}
            render={({ field: { onChange, value } }) => (
              <CustomInput
                label="Password"
                value={value}
                onChangeText={onChange}
                secureTextEntry
                showPasswordToggle
              />
            )}
          />
          {errors.password && (
            <Text style={styles.errorText}>{errors.password.message}</Text>
          )}

          {/*  Remember Me Section */}
          <View style={styles.rememberContainer}>
            <View style={styles.checkboxRow}>
              <Checkbox.Android
                status={rememberMe ? "checked" : "unchecked"}
                onPress={() => setRememberMe(!rememberMe)}
                uncheckedColor="#414141"
                theme={{ colors: { primary: "#068EFF" } }}
              />
              <Text style={styles.rememberText}>Remember me</Text>
            </View>
            <TouchableOpacity onPress={() => Alert.alert("Forgot Password?")}>
              <Text style={styles.forgotText}>Forgot Password?</Text>
            </TouchableOpacity>
          </View>

          <GradientButton
            title="Log In"
            onPress={handleSubmit(onSubmit)}
            style={styles.signUpButton}
          />

          <View style={styles.dividerContainer}>
            <View style={styles.line} />
            <Text style={styles.orText}>Or login with</Text>
            <View style={styles.line} />
          </View>

          <TouchableOpacity style={styles.googleButton}>
            <Image source={GoogleIcon} style={styles.googleIcon} />
            <Text style={styles.googleText}>Continue with Google</Text>
          </TouchableOpacity>

          <View style={styles.footer}>
            <Text style={styles.footerText}>Don’t have an account?</Text>
            <TouchableOpacity onPress={() => navigation.navigate("SignUp")}>
              <Text style={styles.link}> Sign Up</Text>
            </TouchableOpacity>
          </View>
        </Animated.View>
      </View>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
    padding: 20,
    justifyContent: "center",
  },
  backgroundImage: {
    position: "absolute",
    top: -240,
    left: 214,
    width: "49%",
    height: "100%",
    resizeMode: "contain",
    zIndex: 2,
    opacity: 1.25,
  },
  backgroundImg: {
    position: "absolute",
    top: 320,
    left: 2,
    width: "49%",
    height: "100%",
    resizeMode: "contain",
    zIndex: 0,
    opacity: 1.25,
  },
  logo: { resizeMode: "contain", alignSelf: "center" },
  title: {
    fontSize: 24,
    fontWeight: "700",
    textAlign: "center",
    color: Colors.text,
    marginBottom: 24,
  },
  heading: {
    fontSize: 36,
    fontWeight: "700",
    textAlign: "center",
    color: Colors.text,
    marginBottom: 2,
  },
  description: {
    fontSize: 14,
    textAlign: "center",
    color: Colors.text,
    marginBottom: 25,
  },
  errorText: { color: "red", fontSize: 12, marginBottom: 5, marginLeft: 5 },
  signUpButton: {
    height: 48,
    borderRadius: 10,
    marginTop: 20,
    alignSelf: "stretch",
  },
  rememberContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  checkboxRow: {
    flexDirection: "row",
    alignItems: "center",
    borderColor: "#414141",
  },
  rememberText: { color: "#414141", fontSize: 12 },
  forgotText: { color: "#068EFF", fontSize: 12, fontWeight: "500" },
  dividerContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: 20,
  },
  line: { flex: 1, height: 1, backgroundColor: "#ccc" },
  orText: {
    marginHorizontal: 10,
    color: "#999",
    fontSize: 14,
    fontWeight: "500",
  },
  googleButton: {
    zIndex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: "#EFF0F7",
    borderRadius: 10,
    height: 48,
    backgroundColor: "#EFF0F7",
  },
  googleIcon: { width: 20, height: 20, marginRight: 8 },
  googleText: { fontSize: 15, fontWeight: "500", color: "#414141" },
  footer: { flexDirection: "row", justifyContent: "center", marginTop: 15 },
  footerText: { color: Colors.gray },
  link: { color: "#068EFF", fontWeight: "600" },
});

export default Login;
