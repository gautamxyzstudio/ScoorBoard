import React from "react";
import { Text, StyleSheet, Platform } from "react-native";
import MaskedView from "@react-native-masked-view/masked-view";
import { LinearGradient } from "expo-linear-gradient";
import Svg, {
  Defs,
  LinearGradient as SvgGradient,
  Stop,
  Text as SvgText,
} from "react-native-svg";

const GradientText = ({ text, style }) => {
  const colors = ["#068EFF", "#0C559E"];

  // iOS — MaskedView works perfectly
  if (Platform.OS === "ios") {
    return (
      <MaskedView
        maskElement={<Text style={[style, styles.maskedText]}>{text}</Text>}
      >
        <LinearGradient colors={colors}>
          <Text style={[style, styles.transparentText]}>{text}</Text>
        </LinearGradient>
      </MaskedView>
    );
  }

  //  Android — use SVG gradient (fully supported)
  if (Platform.OS === "android") {
    const fontSize = style?.fontSize || 20;
    const fontWeight = style?.fontWeight || "normal";

    return (
      <Svg height={fontSize * 1.2} width="100%">
        <Defs>
          <SvgGradient id="grad" x1="0" y1="0" x2="1" y2="0">
            <Stop offset="0" stopColor="#068EFF" />
            <Stop offset="1" stopColor="#0C559E" />
          </SvgGradient>
        </Defs>

        <SvgText
          fill="url(#grad)"
          fontSize={fontSize}
          fontWeight={fontWeight}
          x="50%"
          y="80%"
          textAnchor="middle"
        >
          {text}
        </SvgText>
      </Svg>
    );
  }

  //  Web — native CSS gradient
  return (
    <Text
      style={[
        style,
        {
          backgroundImage: "linear-gradient(90deg, #068EFF, #0C559E)",
          color: "transparent",
          backgroundClip: "text",
          WebkitBackgroundClip: "text",
          WebkitTextFillColor: "transparent",
        },
      ]}
    >
      {text}
    </Text>
  );
};

const styles = StyleSheet.create({
  maskedText: {
    backgroundColor: "transparent",
    textAlign: "center",
  },
  transparentText: {
    color: "transparent",
    textAlign: "center",
  },
});

export default GradientText;
