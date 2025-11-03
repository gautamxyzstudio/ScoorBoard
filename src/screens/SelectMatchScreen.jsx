import React, { useState } from "react";
import { View, Text, StyleSheet, TouchableOpacity, Image } from "react-native";
import Colors from "../contants/Colors";
import backIcon from "../../assets/backIcon.png";
import person from "../../assets/person.png";

const SelectMatchScreen = ({ navigation }) => {
  const [selectedType, setSelectedType] = useState("single");

  const handleNext = () => {
    if (!selectedType) {
      alert("Please select a match type!");
      return;
    }

    if (selectedType === "single") {
      navigation.navigate("SingleMatchScreen");
    } else if (selectedType === "tournament") {
      navigation.navigate("TournamentScreen");
    }
  };

  return (
    <View style={styles.container}>
      {/* Profile Header */}
      <View style={styles.profile}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Image source={backIcon} style={styles.backArrow} />
        </TouchableOpacity>
        <TouchableOpacity onPress={() => navigation.navigate("ProfileScreen")}>
          <Image source={person} style={styles.person} />
        </TouchableOpacity>
      </View>

      {/* Progress Bar */}
      <View style={styles.progressContainer}>
        <View style={styles.progressActive} />
        <View style={styles.progressActive} />
      </View>

      {/*  Heading + History */}
      <View style={styles.con}>
        <Text style={styles.heading}>Select</Text>
        <TouchableOpacity onPress={() => navigation.navigate("MatchHistory")}>
          <Text style={styles.history}>Match History</Text>
        </TouchableOpacity>
      </View>

      {/*  Options */}
      <View style={styles.optionsContainer}>
        <TouchableOpacity
          style={[
            styles.optionCard,
            selectedType === "single" && styles.selectedCard,
          ]}
          onPress={() => setSelectedType("single")}
        >
          <Text style={styles.optionText}>Single Match</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[
            styles.optionCard,
            selectedType === "tournament" && styles.selectedCard,
          ]}
          onPress={() => setSelectedType("tournament")}
        >
          <Text style={styles.optionText}>Tournament</Text>
        </TouchableOpacity>
      </View>

      {/*  Footer */}
      <View style={styles.footer}>
        <Text style={styles.pageText}>2/2</Text>
        <TouchableOpacity style={styles.nextButton} onPress={handleNext}>
          <Text style={styles.arrow}>→</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    paddingHorizontal: 20,
    paddingTop: 50,
  },
  profile: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 30,
  },
  backArrow: {
    width: 28,
    height: 28,
    resizeMode: "contain",
  },
  person: {
    width: 40,
    height: 40,
    borderRadius: 20,
  },
  progressContainer: {
    flexDirection: "row",
    justifyContent: "center",
    marginBottom: 24,
  },
  progressActive: {
    height: 4,
    width: 170,
    backgroundColor: "#3F8CFF",
    borderRadius: 5,
    marginHorizontal: 5,
  },
  con: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },
  heading: {
    fontSize: 24,
    fontWeight: "700",
    color: Colors.text,
  },
  history: {
    fontSize: 16,
    fontWeight: "700",
    color: "#068EFF",
  },
  optionsContainer: {
    alignItems: "center",
    marginTop: 20,
  },
  optionCard: {
    width: "95%",
    paddingVertical: 40,
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#fff",
    marginBottom: 20,
  },
  selectedCard: {
    borderColor: Colors.primary,
    borderWidth: 2,
  },
  optionText: {
    fontSize: 30,
    fontWeight: "600",
    color: "#000",
  },
  footer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: "auto",
    marginBottom: 20,
  },
  pageText: {
    fontSize: 24,
    color: "#068EFF",
    fontWeight: "600",
  },
  nextButton: {
    backgroundColor: Colors.primary,
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: "center",
    alignItems: "center",
  },
  arrow: {
    color: "#fff",
    fontSize: 24,
    fontWeight: "bold",
  },
});

export default SelectMatchScreen;
