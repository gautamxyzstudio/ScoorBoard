import React, { useState } from "react";
import { View, Text, StyleSheet, TouchableOpacity, Image } from "react-native";
import Colors from "../contants/Colors";
import { SafeAreaView } from "react-native-safe-area-context";
 
const sportsData = [
  { id: 1, name: "Hockey", image: require("../../assets/hockey.png") },
  { id: 2, name: "Cricket", image: require("../../assets/Cricket.png") },
  { id: 3, name: "Football", image: require("../../assets/Football.png") },
];

const SelectSportScreen = ({ navigation }) => {
  const [selectedSport, setSelectedSport] = useState(sportsData[0].id);

  const handleNext = () => {
    if (!selectedSport) {
      alert("Please select a sport!");
      return;
    }
    navigation.navigate("SelectMatchScreen");
  };

  return (
    // <SafeAreaView style={{flex:1}}>
      <View style={styles.container}>
        <View style={styles.progressContainer}>
          <View style={styles.progressActive} />
          <View style={styles.progressInactive} />
        </View>

        <Text style={styles.heading}>Select your are Sport*</Text>

        <View style={styles.grid}>
          {sportsData.map((sport) => (
            <TouchableOpacity
              key={sport.id}
              style={[
                styles.card,
                selectedSport === sport.id && styles.selectedCard,
              ]}
              onPress={() => setSelectedSport(sport.id)}
            >
              <Image source={sport.image} style={styles.image} />
              <Text style={styles.sportName}>{sport.name}</Text>
            </TouchableOpacity>
          ))}
        </View>

        <View style={styles.footer}>
          <Text style={styles.pageText}>1/2</Text>
          <TouchableOpacity style={styles.nextButton} onPress={handleNext}>
            <Text style={styles.arrow}>→</Text>
          </TouchableOpacity>
        </View>
      </View>
    // </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    paddingHorizontal: 20,
    paddingTop: 100,
  },
  progressContainer: {
    flexDirection: "row",
    justifyContent: "center",
    marginBottom: 24,
  },
  progressActive: {
    height: 4,
    width: 167,
    backgroundColor: "#3F8CFF",
    borderRadius: 5,
    marginHorizontal: 5,
  },
  progressInactive: {
    height: 5,
    width: 150,
    backgroundColor: "#E0E0E0",
    borderRadius: 5,
    marginHorizontal: 5,
  },
  heading: {
    fontFamily: "Kumbh Sans",
    fontSize: 24,
    fontStyle: "normal",
    fontWeight: "800",
    lineHeight: 33.6,
    color: "#212121",
    textAlign: "center",
    marginBottom: 16,
  },
  grid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "center",
    gap: 10,
  },
  card: {
    width: "42%",
    height: 140,
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#fff",
    margin: 10,
  },
  selectedCard: {
    borderColor: Colors.primary,
    borderWidth: 2,
  },
  image: {
    width: 80,
    height: 80,
    resizeMode: "contain",
  },
  sportName: {
    marginTop: 8,
    fontWeight: "600",
    color: "#212121",
    fontSize: 16,
  },
  footer: {
    marginTop: 250,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
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

export default SelectSportScreen;
