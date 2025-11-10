import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  ActivityIndicator,
  FlatList,
  Platform,
  ScrollView,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Colors from "../contants/Colors";
import { getCompletedMatches } from "../api/auth";

const BASE_URL = "https://scoreboard.xyzdemowebsites.com";

const MatchHistoryScreen = ({ navigation }) => {
  const [matches, setMatches] = useState([]);
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  const fetchCompletedMatches = async () => {
    try {
      setLoading(true);
      const token = await AsyncStorage.getItem("userToken");
      if (!token) {
        console.warn("No token found in AsyncStorage");
        return;
      }
      const data = await getCompletedMatches(token);
      setMatches(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error("Failed to fetch completed matches:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCompletedMatches();
  }, []);

  const handleRefresh = async () => {
    try {
      setRefreshing(true);
      await fetchCompletedMatches();
    } finally {
      setRefreshing(false);
    }
  };

  const renderItem = ({ item }) => {
    const teamAData = Array.isArray(item.teamA)
      ? item.teamA.reduce((acc, cur) => ({ ...acc, ...cur }), {})
      : item.teamA || {};

    const teamBData = Array.isArray(item.teamB)
      ? item.teamB.reduce((acc, cur) => ({ ...acc, ...cur }), {})
      : item.teamB || {};

    const teamAName = teamAData.name || "Team A";
    const teamBName = teamBData.name || "Team B";

    const teamALogo = teamAData.logo?.url
      ? { uri: `${BASE_URL}${teamAData.logo.url}` }
      : require("../../assets/person.png");

    const teamBLogo = teamBData.logo?.url
      ? { uri: `${BASE_URL}${teamBData.logo.url}` }
      : require("../../assets/person.png");

    const teamAScore =
      teamAData.scoreA ??
      teamAData.score ??
      item.scoreA ??
      item.teamA_score ??
      0;
    const teamBScore =
      teamBData.scoreB ??
      teamBData.score ??
      item.scoreB ??
      item.teamB_score ??
      0;

    const matchType =
      item.match_type || item.type || item.category || "Friendly Match";

    const unit = "goals";

    let winnerText = "";
    if (teamAScore === teamBScore) {
      winnerText = " Match Drawn";
    } else if (teamAScore > teamBScore) {
      const margin = teamAScore - teamBScore;
      winnerText = ` Won ${teamAName} by ${margin} ${unit}`;
    } else {
      const margin = teamBScore - teamAScore;
      winnerText = ` Won ${teamBName} by ${margin} ${unit}`;
    }

    return (
      <View style={styles.card}>
        {/* Match Type */}
        <View style={styles.matchRow}>
          <Text style={styles.matchIdLabel}>Match Type:</Text>
          <Text style={styles.matchIdValue}>{matchType}</Text>
        </View>

        {/* Teams */}
        <View style={styles.row}>
          <View style={styles.teamContainer}>
            <Image source={teamALogo} style={styles.teamLogo} />
            <Text style={styles.teamName}>
              {teamAName} ({teamAScore})
            </Text>
          </View>

          <Text style={styles.vs}>VS</Text>

          <View style={styles.teamContainer}>
            <Image source={teamBLogo} style={styles.teamLogo} />
            <Text style={styles.teamName}>
              {teamBName} ({teamBScore})
            </Text>
          </View>
        </View>

        {/* Winner */}
        <Text style={styles.winnerText}>{winnerText}</Text>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="chevron-back" size={26} color="#000" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>History</Text>
        <View style={{ width: 26 }} />
      </View>

      <View style={styles.topRow}>
        <Text style={styles.recentText}>Completed Matches</Text>
      </View>

      {loading ? (
        <ActivityIndicator size="large" color={Colors.primary} />
      ) : Platform.OS === "web" ? (
      
        <View style={styles.webScrollContainer}>
          <ScrollView contentContainerStyle={{ paddingBottom: 40 }}>
            {matches.map((item, index) => (
              <View key={item?.id?.toString() || index.toString()}>
                {renderItem({ item })}
              </View>
            ))}
          </ScrollView>
        </View>
      ) : (
     
        <FlatList
          data={matches}
          keyExtractor={(item, index) =>
            item?.id?.toString() || index.toString()
          }
          renderItem={renderItem}
          refreshing={refreshing}
          onRefresh={handleRefresh}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingBottom: 40 }}
        />
      )}
    </View>
  );
};

export default MatchHistoryScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    paddingTop: 60,
    paddingHorizontal: 15,

  
    height: "100vh",
    overflowY: "auto",
    display: "flex",
  },

 
  webScrollContainer: {
    flex: 1,
    maxHeight: "calc(100vh - 150px)", 
    overflowY: "auto",
  },

  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20,
  },
  headerTitle: {
    fontSize: 22,
    fontWeight: "700",
    color: "#000",
  },
  topRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 18,
  },
  recentText: {
    fontSize: 20,
    fontWeight: "600",
    color: "#212121",
  },
  card: {
    backgroundColor: "#F5F5F5",
    borderRadius: 16,
    paddingVertical: 20,
    paddingHorizontal: 16,
    marginBottom: 14,
    shadowColor: "#000",
  },
  matchRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
  },
  matchIdLabel: {
    fontSize: 14,
    fontWeight: "600",
    color: "#212121",
  },
  matchIdValue: {
    fontSize: 14,
    fontWeight: "600",
    color: "#212121",
    marginLeft: 4,
    opacity: 0.6,
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  teamContainer: {
    alignItems: "center",
    width: "38%",
  },
  teamLogo: {
    width: 55,
    height: 55,
    borderRadius: 28,
    marginBottom: 6,
    backgroundColor: "#fff",
  },
  teamName: {
    fontSize: 15,
    fontWeight: "600",
    color: "#000",
    textAlign: "center",
  },
  vs: {
    fontSize: 18,
    fontWeight: "700",
    color: "#212121",
    opacity: 0.5,
  },
  winnerText: {
    marginTop: 10,
    textAlign: "center",
    fontSize: 14,
    color: "#068EFF",
    fontWeight: "600",
  },
});
