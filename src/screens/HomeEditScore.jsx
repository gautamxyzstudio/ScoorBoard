import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  Alert,
  Linking,
  ActivityIndicator,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Ionicons } from "@expo/vector-icons";
import GradientButton from "../gradientButton/GradientButton";
import sidelogo from "../../assets/sideLogo.png";
import person from "../../assets/person.png";
import shareicon from "../../assets/shareIcon.png";
import GradientText from "../gradientText/GradientText";
import copy from "../../assets/copy.png";
import defaultLogo from "../../assets/userss.png";
import { endMatch, updateScore } from "../api/auth";
import Modal from "react-native-modal";
import * as Clipboard from "expo-clipboard";

const HomeEditScore = ({ navigation, route }) => {
  const { teamA, teamB, match } = route.params || {};

  const [homeScore, setHomeScore] = useState(0);
  const [awayScore, setAwayScore] = useState(0);
  const [loading, setLoading] = useState(false);
  const [isShareVisible, setIsShareVisible] = useState(false);

  const getTeamLogo = (team) => {
    if (!team?.logo) return null;
    const base = process.env.EXPO_PUBLIC_API_URL;
    const logoData = team.logo;
    if (logoData?.formats?.thumbnail?.url)
      return `${base}${logoData.formats.thumbnail.url}`;
    if (logoData?.formats?.small?.url)
      return `${base}${logoData.formats.small.url}`;
    return `${base}${logoData.url}`;
  };

  const handleUpdateScore = async (newHomeScore, newAwayScore) => {
    try {
      const token = await AsyncStorage.getItem("userToken");

      if (!match?.match?.id) {
        Alert.alert("Error", "Match ID not found");
        return;
      }

      const payload = {
        scoreA: newHomeScore,
        scoreB: newAwayScore,
      };

      // setLoading(true);
      const res = await updateScore(match?.match?.id, payload, token);
      setLoading(false);
      console.log("API response:", res);
    } catch (error) {
      console.log("API error:", error);
      setLoading(false);
    }
  };
 
  const handleEndMatch = async () => {
    try {
      setLoading(true);  
      const token = await AsyncStorage.getItem("userToken");
      const matchId = match?.match?.id;

      if (!matchId) {
        Alert.alert("Error", "Match ID not found");
        setLoading(false);
        return;
      }

      const res = await endMatch(matchId, token);
      console.log("Match End Response:", res);
      Alert.alert("Success", "Match ended successfully!");
      navigation.goBack();
    } catch (error) {
      console.log("End Match Error:", error);
      Alert.alert("Error", error?.message || "Failed to end match");
    } finally {
      setLoading(false);  
    }
  };

  const increaseHome = async () => {
    const newScore = homeScore + 1;
    setHomeScore(newScore);
    await handleUpdateScore(newScore, awayScore);
  };

  const decreaseHome = async () => {
    const newScore = homeScore > 0 ? homeScore - 1 : 0;
    setHomeScore(newScore);
    await handleUpdateScore(newScore, awayScore);
  };

  const increaseAway = async () => {
    const newScore = awayScore + 1;
    setAwayScore(newScore);
    await handleUpdateScore(homeScore, newScore);
  };

  const decreaseAway = async () => {
    const newScore = awayScore > 0 ? awayScore - 1 : 0;
    setAwayScore(newScore);
    await handleUpdateScore(homeScore, newScore);
  };

  const handleShareOption = async (type) => {
    const matchCode = match?.match?.match_code || "Unknown";
    const message = ` Match Details \nMatch ID: ${matchCode}\n${teamA?.name || "Team A"} vs ${teamB?.name || "Team B"}\n\nCheck live: https://scoreboard.xyzdemowebsites.com/match/${matchCode}`;

    if (type === "whatsapp") {
      const url = `whatsapp://send?text=${encodeURIComponent(message)}`;
      Linking.openURL(url).catch(() =>
        Alert.alert("Error", "WhatsApp not installed")
      );
    } else if (type === "copy") {
      await Clipboard.setStringAsync(message);
      Alert.alert("Copied", "Match link copied to clipboard");
    } else if (type === "sms") {
      const url = `sms:?body=${encodeURIComponent(message)}`;
      Linking.openURL(url);
    }

    setIsShareVisible(false);
  };

  const teamALogo = getTeamLogo(teamA);
  const teamBLogo = getTeamLogo(teamB);

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.topBar}>
        <Image source={sidelogo} style={styles.logo} />
        <Image source={person} style={styles.personIcon} />
      </View>

      {/* Match Info */}
      <View style={styles.header}>
        <View style={styles.copyContainer}>
          <Text style={styles.matchId}>{match?.match?.match_code}</Text>

          <TouchableOpacity
            onPress={async () => {
              try {
                const matchCode = match?.match?.match_code || "Unknown";
                await Clipboard.setStringAsync(matchCode);
                Alert.alert("Copied", "Match code copied");
              } catch (err) {
                Alert.alert("Error", "Failed to copy code");
              }
            }}
          >
            <Image source={copy} style={styles.copy} />
          </TouchableOpacity>
        </View>

        <TouchableOpacity onPress={() => setIsShareVisible(true)}>
          <Image style={styles.share} source={shareicon} />
        </TouchableOpacity>
      </View>

      {/* Score Box */}
      <View style={styles.matchBox}>
        {/* Team A */}
        <View style={styles.teamContainer}>
          <View style={styles.firstImg}>
            <Image
              source={teamALogo ? { uri: teamALogo } : defaultLogo}
              style={styles.teamLogo}
            />
            <View style={styles.teamInfo}>
              <Text style={styles.teamName}>{teamA?.name || "Team A"}</Text>
              <Text style={styles.teamType}>Home</Text>
            </View>
          </View>

          <View style={styles.scoreControl}>
            <TouchableOpacity
              style={[
                styles.scoreButton,
                { opacity: homeScore <= 0 ? 0.4 : 1 },
              ]}
              onPress={decreaseHome}
              disabled={homeScore <= 0 || loading}
            >
              <Ionicons name="remove" size={20} color="#3F8CFF" />
            </TouchableOpacity>

            <Text style={styles.scoreText}>
              {homeScore < 10 ? `0${homeScore}` : homeScore}
            </Text>

            <TouchableOpacity
              style={styles.scoreButton}
              onPress={increaseHome}
              disabled={loading}
            >
              <Ionicons name="add" size={20} color="#3F8CFF" />
            </TouchableOpacity>
          </View>
        </View>

        <GradientText
          text="Vs"
          style={{ fontSize: 30, fontWeight: "700", marginVertical: 25 }}
        />

        {/* Team B */}
        <View style={styles.teamContainer}>
          <View style={styles.firstImg}>
            <Image
              source={teamBLogo ? { uri: teamBLogo } : defaultLogo}
              style={styles.teamLogo}
            />
            <View style={styles.teamInfo}>
              <Text style={styles.teamName}>{teamB?.name || "Team B"}</Text>
              <Text style={styles.teamType}>Away</Text>
            </View>
          </View>

          <View style={styles.scoreControl}>
            <TouchableOpacity
              style={[
                styles.scoreButton,
                { opacity: awayScore <= 0 ? 0.4 : 1 },
              ]}
              onPress={decreaseAway}
              disabled={awayScore <= 0 || loading}
            >
              <Ionicons name="remove" size={20} color="#3F8CFF" />
            </TouchableOpacity>

            <Text style={styles.scoreText}>
              {awayScore < 10 ? `0${awayScore}` : awayScore}
            </Text>

            <TouchableOpacity
              style={styles.scoreButton}
              onPress={increaseAway}
              disabled={loading}
            >
              <Ionicons name="add" size={20} color="#3F8CFF" />
            </TouchableOpacity>
          </View>
        </View>
      </View>

      {/* Footer */}
      <View style={styles.footer}>
        <GradientButton
          title="Over The Match"
          onPress={handleEndMatch}
          type="secondary"
          disabled={loading}
        />
      </View>

      {/* Bottom Share Sheet */}
      <Modal
        isVisible={isShareVisible}
        onBackdropPress={() => setIsShareVisible(false)}
        style={styles.bottomModal}
      >
        <View style={styles.modalContent}>
          <Text style={styles.shareTitle}>Share Match</Text>

          <TouchableOpacity
            style={styles.option}
            onPress={() => handleShareOption("whatsapp")}
          >
            <Ionicons name="logo-whatsapp" size={22} color="#25D366" />
            <Text style={styles.optionText}>Share via WhatsApp</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.option}
            onPress={() => handleShareOption("sms")}
          >
            <Ionicons name="chatbox" size={22} color="#3F8CFF" />
            <Text style={styles.optionText}>Share via SMS</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.option}
            onPress={() => handleShareOption("copy")}
          >
            <Ionicons name="copy" size={22} color="#555" />
            <Text style={styles.optionText}>Copy Match Link</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.cancelBtn}
            onPress={() => setIsShareVisible(false)}
          >
            <Text style={styles.cancelText}>Cancel</Text>
          </TouchableOpacity>
        </View>
      </Modal>

 
      {loading && (
        <View style={styles.overlay}>
          <ActivityIndicator size="large" color="#fff" />
          <Text style={styles.loaderText}>Ending match...</Text>
        </View>
      )}
    </View>
  );
};

export default HomeEditScore;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    paddingTop: 70,
  },
  share: { borderRadius: 4, width: 44, height: 44 },
  topBar: {
    width: "90%",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20,
  },
  logo: { width: 40, height: 40, resizeMode: "contain" },
  personIcon: { width: 40, height: 40, borderRadius: 20 },
  copyContainer: { flexDirection: "row" },
  copy: { width: 20, height: 20, marginLeft: 5 },
  header: {
    width: "90%",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 10,
  },
  matchId: { fontSize: 14, color: "#666", marginTop: 3 },
  matchBox: {
    width: "90%",
    backgroundColor: "#F8F8F8",
    borderRadius: 20,
    marginTop: 15,
    paddingVertical: 15,
    alignItems: "center",
  },
  teamContainer: { alignItems: "center" },
  firstImg: {
    flexDirection: "row",
    alignItems: "center",
    borderRadius: 14,
    paddingVertical: 8,
    width: 290,
  },
  teamLogo: { width: 125, height: 125, borderRadius: 75, marginRight: 15 },
  teamInfo: { flexDirection: "column" },
  teamName: { fontSize: 18, fontWeight: "600", color: "#000" },
  teamType: { color: "#777", fontSize: 14, marginTop: 4 },
  scoreControl: {
    width: 320,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: "#fff",
    borderRadius: 5,
    paddingVertical: 2,
    elevation: 3,
    marginTop: 15,
  },
  scoreButton: {
    padding: 8,
    shadowColor: "rgba(0,0,0,0.12)",
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 1,
    shadowRadius: 16,
    elevation: 4,
  },
  scoreText: { fontSize: 17, fontWeight: "400", color: "#414141" },
  footer: { width: "85%", marginTop: 30 },
  bottomModal: {
    justifyContent: "flex-end",
    margin: 0,
  },
  modalContent: {
    backgroundColor: "#fff",
    padding: 20,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
  },
  shareTitle: {
    fontSize: 18,
    fontWeight: "600",
    textAlign: "center",
    marginBottom: 15,
  },
  option: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 12,
  },
  optionText: {
    fontSize: 16,
    color: "#333",
    marginLeft: 10,
  },
  cancelBtn: {
    marginTop: 10,
    paddingVertical: 12,
    alignItems: "center",
    borderTopWidth: 1,
    borderTopColor: "#eee",
  },
  cancelText: {
    color: "#FF4444",
    fontSize: 16,
    fontWeight: "600",
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "center",
    alignItems: "center",
    zIndex: 999,
  },
  loaderText: {
    color: "#fff",
    fontSize: 16,
    marginTop: 10,
    fontWeight: "600",
  },
});
