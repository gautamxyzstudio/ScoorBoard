import React from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Alert,
  Image,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
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

const SignUpScreen = ({ navigation }) => {
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
    }
  };

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      keyboardVerticalOffset={Platform.OS === "ios" ? 0 : 20}
    >
      <ScrollView
        contentContainerStyle={styles.container}
        keyboardShouldPersistTaps="handled"
      >
        <Image source={backgroundLogo} style={styles.backgroundTop} />
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
              keyboardType="fullName"
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
              } catch (err) {
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
          rules={{ required: "Phone number is required" }}
          render={({ field: { onChange, value } }) => (
            <CustomInput
              label="Phone Number"
              value={value}
              onChangeText={onChange}
              keyboardType="phone-pad"
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
            />
          )}
        />
        {errors.password && (
          <Text style={styles.errorText}>{errors.password.message}</Text>
        )}

        {/* Sign Up Button */}
        <GradientButton
          title="Sign Up"
          onPress={handleSubmit(onSubmit)}
          style={styles.signUpButton}
        />

        {/* Divider */}
        <View style={styles.dividerContainer}>
          <View style={styles.line} />
          <Text style={styles.orText}>Or Sign Up with</Text>
          <View style={styles.line} />
        </View>

        {/* Google Sign Up */}
        <TouchableOpacity style={styles.googleButton}>
          <Image source={GoogleIcon} style={styles.googleIcon} />
          <Text style={styles.googleText}>Continue with Google</Text>
        </TouchableOpacity>

        {/* Footer */}
        <View style={styles.footer}>
          <Text style={styles.footerText}>Already have an account?</Text>
          <TouchableOpacity onPress={() => navigation.navigate("LoginPage")}>
            <Text style={styles.link}> Login</Text>
          </TouchableOpacity>
        </View>

        <Image source={backgroundImg} style={styles.backgroundBottom} />
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

 
const styles = StyleSheet.create({
  backgroundTop: {
    position: "absolute",
    top: -231,
    left: 215,
    width: "50%",
    height: "100%",
    resizeMode: "contain",
    zIndex: 0,
    opacity: 1,
  },
  backgroundBottom: {
    position: "absolute",
    top: 320,
    left: 0,
    width: "50%",
    height: "100%",
    resizeMode: "contain",
    transform: [{ rotate: "176deg" }],
    zIndex: 0,
    opacity: 1,
    pointerEvents: "none",
  },
  container: {
    flexGrow: 1,
    backgroundColor: Colors.background,
    padding: 20,
    justifyContent: "center",
    zIndex: 2,
  },
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
    zIndex: 2,
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
});

export default SignUpScreen;
