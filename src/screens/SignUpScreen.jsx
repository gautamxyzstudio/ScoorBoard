import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Alert,
  Image,
  ActivityIndicator,
} from "react-native";
import { useForm, Controller } from "react-hook-form";
import CustomInput from "../components/CustomInput";
import GradientButton from "../gradientButton/GradientButton";
import Colors from "../contants/Colors";
import blueImg from "../../assets/blueVector.png";
import GoogleIcon from "../../assets/googleIcon.png";
import backgroundLogo from "../../assets/Vectorbg.png";
import backgroundImg from "../../assets/Vectorbg.png";
import { registerUser, checkEmailExists } from "../api/auth";
import { KeyboardAwareScrollView } from "@pietile-native-kit/keyboard-aware-scrollview";

import * as WebBrowser from "expo-web-browser";
import * as Google from "expo-auth-session/providers/google";
import * as AuthSession from "expo-auth-session";

WebBrowser.maybeCompleteAuthSession();

const SignUpScreen = ({ navigation }) => {
  const [loading, setLoading] = useState(false);

  // //  FIXED REDIRECT URI
  // const redirectUri = AuthSession.makeRedirectUri({
  //   useProxy: true,
  // });

  // console.log("Redirect URI:", redirectUri);

  // // FIXED GOOGLE AUTH REQUEST
  // const [request, response, promptAsync] = Google.useAuthRequest({
  //   webClientId:
  //     "366532913009-tr1k7nd6jc8b9m1qtcpq0a6c4itm7j95.apps.googleusercontent.com",
  //   androidClientId:
  //     "366532913009-lp7248tbhomjr0g84l37ubkli95fbc12.apps.googleusercontent.com",
  //   iosClientId:
  //     "366532913009-mh6u0mfn9jvfqcp72me1a5v7l2ut2dhm.apps.googleusercontent.com",
  //   redirectUri,
  //   scopes: ["profile", "email"],
  // });

  // // Fetch user info from Google
  // const getUserInfo = async (token) => {
  //   try {
  //     const res = await fetch("https://www.googleapis.com/userinfo/v2/me", {
  //       headers: { Authorization: `Bearer ${token}` },
  //     });
  //     const user = await res.json();
  //     console.log("Google User:", user);
  //     return user;
  //   } catch (err) {
  //     console.error("Failed to fetch user info:", err);
  //   }
  // };

  // //  Handle Google login success
  // useEffect(() => {
  //   const handleGoogleResponse = async () => {
  //     if (response?.type === "success") {
  //       const { authentication } = response;
  //       const user = await getUserInfo(authentication.accessToken);
  //       if (user?.email) {
  //         Alert.alert("Success", `Welcome ${user.name}!`);
  //         navigation.replace("SelectSport");
  //       }
  //     } else if (response?.type === "error") {
  //       console.error("Google Auth Error:", response.error);
  //     }
  //   };
  //   handleGoogleResponse();
  // }, [response]);
  const redirectUri = AuthSession.makeRedirectUri({
    useProxy: true,
  });

  console.log("Redirect   URI:", redirectUri);

  const [request, response, promptAsync] = Google.useAuthRequest({
    webClientId:
      "366532913009-tr1k7nd6jc8b9m1qtcpq0a6c4itm7j95.apps.googleusercontent.com",
    androidClientId:
      "366532913009-lp7248tbhomjr0g84l37ubkli95fbc12.apps.googleusercontent.com",
    iosClientId:
      "366532913009-mh6u0mfn9jvfqcp72me1a5v7l2ut2dhm.apps.googleusercontent.com",
    redirectUri,
    scopes: ["profile", "email"],
  });

  useEffect(() => {
    if (response?.type === "success") {
      console.log("Access Token:", response.authentication.accessToken);
    }
  }, [response]);

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues: {
      username: "",
      fullName: "",
      email: "",
      password: "",
      phoneNumber: "",
    },
    mode: "onChange",
  });

  const onSubmit = async (data) => {
    setLoading(true);
    try {
      const res = await registerUser({
        username: data.email,
        fullName: data.name,
        email: data.email,
        password: data.password,
        phoneNumber: data.phone,
      });
      console.log("Signup Success:", res);
      Alert.alert("Success", "Account created successfully!");
      navigation.replace("LoginPage");
    } catch (error) {
      console.log("Signup Error:", error);
      Alert.alert("Error", error.message || "Signup failed!");
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={{ flex: 1, backgroundColor: Colors.background }}>
      <Image source={backgroundLogo} style={styles.backgroundTop} />
      <Image source={backgroundImg} style={styles.backgroundBottom} />

      <KeyboardAwareScrollView
        extraKeyboardSpace={30}
        contentContainerStyle={styles.container}
        enableOnAndroid
        keyboardShouldPersistTaps="handled"
      >
        <Image source={blueImg} style={styles.logo} />
        <Text style={styles.title}>SportSynz</Text>
        <Text style={styles.heading}>Sign Up</Text>

        {/* Full Name */}
        <Controller
          control={control}
          name="name"
          rules={{ required: "Full name is required" }}
          render={({ field: { onChange, value } }) => (
            <CustomInput
              label="Full Name"
              value={value}
              onChangeText={onChange}
              keyboardType="default"
              editable={!loading}
            />
          )}
        />
        {errors.name && (
          <Text style={styles.errorText}>{errors.name.message}</Text>
        )}

        {/* Email */}
        <Controller
          control={control}
          name="email"
          rules={{
            required: "Email is required",
            pattern: {
              value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
              message: "Invalid email address",
            },
            validate: async (value) => {
              try {
                const exists = await checkEmailExists(value);
                return exists.exists ? "Email already exists" : true;
              } catch {
                return "Unable to verify email";
              }
            },
          }}
          render={({ field }) => (
            <CustomInput
              label="Email"
              value={field.value}
              onChangeText={field.onChange}
              onBlur={field.onBlur}
              keyboardType="email-address"
              editable={!loading}
            />
          )}
        />
        {errors.email && (
          <Text style={styles.errorText}>{errors.email.message}</Text>
        )}

        {/* Phone */}
        <Controller
          control={control}
          name="phone"
          rules={{
            required: "Phone number is required",
            pattern: {
              value: /^[0-9]{10}$/,
              message: "Phone number must be exactly 10 digits",
            },
          }}
          render={({ field: { onChange, value } }) => (
            <CustomInput
              label="Phone Number"
              value={value}
              onChangeText={(text) => {
                const cleaned = text.replace(/[^0-9]/g, "");
                onChange(cleaned);
              }}
              keyboardType="phone-pad"
              editable={!loading}
              maxLength={10}
            />
          )}
        />
        {errors.phone && (
          <Text style={styles.errorText}>{errors.phone.message}</Text>
        )}

        {/* Password */}
        <Controller
          control={control}
          name="password"
          rules={{
            required: "Password is required",
            minLength: { value: 4, message: "Min 4 characters" },
          }}
          render={({ field: { onChange, value } }) => (
            <CustomInput
              label="Set Password"
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

        <GradientButton
          title={loading ? "Creating..." : "Sign Up"}
          onPress={!loading ? handleSubmit(onSubmit) : null}
          style={styles.signUpButton}
          disabled={loading}
        />

        <View style={styles.dividerContainer}>
          <View style={styles.line} />
          <Text style={styles.orText}>Or Sign Up with</Text>
          <View style={styles.line} />
        </View>

        {/* Google Sign-In */}
        <TouchableOpacity
          style={[styles.googleButton, loading && { opacity: 0.5 }]}
          disabled={!request}
          onPress={() => promptAsync()}
        >
          <Image source={GoogleIcon} style={styles.googleIcon} />
          <Text style={styles.googleText}>Continue with Google</Text>
        </TouchableOpacity>

        <View style={styles.footer}>
          <Text style={styles.footerText}>Already have an account?</Text>
          <TouchableOpacity
            onPress={() => !loading && navigation.navigate("LoginPage")}
            disabled={loading}
          >
            <Text style={styles.link}> Login</Text>
          </TouchableOpacity>
        </View>
      </KeyboardAwareScrollView>

      {loading && (
        <View style={styles.overlay}>
          <ActivityIndicator size="large" color="#fff" />
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  backgroundTop: {
    position: "absolute",
    top: -50,
    right: 0,
    width: "40%",
    height: "50%",
    resizeMode: "contain",
    opacity: 1,
    zIndex: 0,
  },
  backgroundBottom: {
    position: "absolute",
    bottom: -120,
    left: 0,
    width: "50%",
    height: "50%",
    resizeMode: "contain",
    transform: [{ rotate: "180deg" }],
    opacity: 1,
    zIndex: 0,
  },
  container: { flexGrow: 1, padding: 20, justifyContent: "center" },
  logo: { resizeMode: "contain", alignSelf: "center" },
  title: {
    fontSize: 24,
    fontWeight: "700",
    textAlign: "center",
    color: Colors.text,
    marginBottom: 25,
  },
  heading: {
    fontSize: 36,
    fontWeight: "700",
    textAlign: "center",
    color: Colors.text,
    marginBottom: 25,
  },
  signUpButton: {
    height: 50,
    borderRadius: 10,
    marginTop: 20,
    alignSelf: "stretch",
  },
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
  link: { color: Colors.primary, fontWeight: "600" },
  errorText: { color: "red", fontSize: 12, marginBottom: 5, marginLeft: 5 },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0,0,0,0.4)",
    justifyContent: "center",
    alignItems: "center",
    zIndex: 999,
  },
});

export default SignUpScreen;
