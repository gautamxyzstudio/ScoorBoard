import React, { useState, useRef, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  Animated,
  Image,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
} from "react-native";
import { Checkbox } from "react-native-paper";
import { useForm, Controller } from "react-hook-form";
import AsyncStorage from "@react-native-async-storage/async-storage";
import {
  KeyboardAwareScrollView,
  KeyboardToolbar,
} from "react-native-keyboard-controller";
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
  const [loading, setLoading] = useState(false);  

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
    setLoading(true);  
    try {
      const res = await loginUser({ identifier: email, password });

      await AsyncStorage.setItem("userToken", res.jwt);
      await AsyncStorage.setItem("userInfo", JSON.stringify(res.user));
      await AsyncStorage.setItem("rememberMe", rememberMe ? "true" : "false");

      setLoading(false);  
      Alert.alert("Success", "Login successful!");
      navigation.replace("SelectSport");
    } catch (error) {
      setLoading(false);  
      Alert.alert("Error", error.message || "Login failed!");
    }
  };

  return (
    <View style={{ flex: 1, backgroundColor: Colors.background }}>
      {/* Background images */}
      <Image source={backgroundLogo} style={styles.backgroundImage} />
      <Image source={backgroundsecond} style={styles.backgroundImg} />

      <KeyboardAwareScrollView
        bottomOffset={62}
        contentContainerStyle={styles.container}
        keyboardShouldPersistTaps="handled"
      >
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
                editable={!loading}  
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
                editable={!loading}  
              />
            )}
          />
          {errors.password && (
            <Text style={styles.errorText}>{errors.password.message}</Text>
          )}

          {/* Remember Me */}
          <View style={styles.rememberContainer}>
            <View style={styles.checkboxRow}>
              <Checkbox.Android
                status={rememberMe ? "checked" : "unchecked"}
                onPress={() => !loading && setRememberMe(!rememberMe)}  
                uncheckedColor="#414141"
                theme={{ colors: { primary: "#068EFF" } }}
              />
              <Text style={styles.rememberText}>Remember me</Text>
            </View>
            <TouchableOpacity
              onPress={() => !loading && Alert.alert("Forgot Password?")}
              disabled={loading}  
            >
              <Text style={styles.forgotText}>Forgot Password?</Text>
            </TouchableOpacity>
          </View>

          {/* LOGIN BUTTON */}
          <GradientButton
            title={loading ? "Loading..." : "Log In"}
            onPress={!loading ? handleSubmit(onSubmit) : null}
            style={[styles.signUpButton, loading && { opacity: 0.7 }]}
          />

          <View style={styles.dividerContainer}>
            <View style={styles.line} />
            <Text style={styles.orText}>Or login with</Text>
            <View style={styles.line} />
          </View>

          <TouchableOpacity
            style={styles.googleButton}
            disabled={loading}  
          >
            <Image source={GoogleIcon} style={styles.googleIcon} />
            <Text style={styles.googleText}>Continue with Google</Text>
          </TouchableOpacity>

          <View style={styles.footer}>
            <Text style={styles.footerText}>Don’t have an account?</Text>
            <TouchableOpacity
              onPress={() => !loading && navigation.navigate("SignUp")}
              disabled={loading}  
            >
              <Text style={styles.link}> Sign Up</Text>
            </TouchableOpacity>
          </View>
        </Animated.View>
      </KeyboardAwareScrollView>

       {loading && (
        <View style={styles.overlay}>
          <ActivityIndicator size="large" color="#fff" />
        </View>
      )}

      <KeyboardToolbar />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flexGrow: 1, padding: 20, justifyContent: "center" },
  backgroundImage: {
    position: "absolute",
    top: -240,
    left: 214,
    width: "49%",
    height: "100%",
    resizeMode: "contain",
    zIndex: 0,
  },
  backgroundImg: {
    position: "absolute",
    top: 320,
    left: 2,
    width: "49%",
    height: "100%",
    resizeMode: "contain",
    zIndex: 0,
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
  checkboxRow: { flexDirection: "row", alignItems: "center" },
  rememberText: { color: "#414141", fontSize: 12 },
  forgotText: { color: "#068EFF", fontSize: 12, fontWeight: "500" },
  dividerContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: 20,
  },
  line: { flex: 1, height: 1, backgroundColor: "#ccc" },
  orText: { marginHorizontal: 10, color: "#999", fontSize: 14, fontWeight: "500" },
  googleButton: {
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

  
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0,0,0,0.4)",
    justifyContent: "center",
    alignItems: "center",
    zIndex: 999,
  },
});

export default Login;
