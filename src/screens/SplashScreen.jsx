import React, { useEffect } from "react";
import { View, Image, StyleSheet } from "react-native";
import vector from "../../assets/Vector.png";

const SplashScreen = ({ navigation }) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      navigation.replace("ViewLogin");
    }, 2000);

    return () => clearTimeout(timer);
  }, [navigation]);

  return (
    <View style={styles.container}>
      <Image source={vector} style={styles.logo} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#068EFF",
    justifyContent: "center",
    alignItems: "center",
  },
  logo: {
    width: 187,
    height: 190,
    resizeMode: "contain",
  },
});

export default SplashScreen;
