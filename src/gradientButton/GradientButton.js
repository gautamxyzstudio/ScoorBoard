import React from "react";
import { TouchableOpacity, Text, StyleSheet } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import MaskedView from "@react-native-masked-view/masked-view";
// import Colors from "../contants/Colors";

const GradientButton = ({ title, onPress, style, type = "primary" }) => {
  if (type === "primary") {
    return (
      <TouchableOpacity onPress={onPress} activeOpacity={0.8} style={[style]}>
        <LinearGradient
          colors={["#068EFF", "#0C559E"]}
          start={{ x: 1, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.gradient}
        >
          <Text style={styles.primaryText}>{title}</Text>
        </LinearGradient>
      </TouchableOpacity>
    );
  }

  // Secondary Button with Gradient Text
  return (
    <TouchableOpacity
      onPress={onPress}
      activeOpacity={0.8}
      style={[styles.secondaryButton, style]}
    >
      <MaskedView
        maskElement={
          <Text style={[styles.secondaryText, { textAlign: "center" }]}>
            {title}
          </Text>
        }
      >
        <LinearGradient
          colors={["#068EFF", "#0C559E"]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
        >
          <Text style={[styles.secondaryText, { opacity: 0 }]}>{title}</Text>
        </LinearGradient>
      </MaskedView>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  gradient: {
    height: 48,
    borderRadius: 10,
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#068EFF",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 5,
  },
  primaryText: {
    color: "#fff",
    fontWeight: "700",
    fontSize: 16,
    textTransform: "capitalize",
  },
  secondaryButton: {
    height: 48,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#0091FF",  
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "transparent",
  },
  secondaryText: {
    fontWeight: "700",
    fontSize: 16,
    textTransform: "capitalize",
  },
});

export default GradientButton;
