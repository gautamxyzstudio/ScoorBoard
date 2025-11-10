import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  Platform,
  ActivityIndicator,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import * as ImagePicker from "expo-image-picker";
import Colors from "../contants/Colors";
import GradientButton from "../gradientButton/GradientButton";
import CustomInput from "../components/CustomInput";
import backIcon from "../../assets/backIcon.png";
import { uploadLogo, updateTeam, getTeamsDetails } from "../api/auth";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { KeyboardAwareScrollView } from "@pietile-native-kit/keyboard-aware-scrollview";

const EditTeamScreen = ({ navigation, route }) => {
  const { teamId, team } = route.params;
  console.log("Route", route);

  const [teamName, setTeamName] = useState(team?.name || "");
  const [country, setCountry] = useState(team?.country || "");
  const [teamLogo, setTeamLogo] = useState(
    team?.logoUrl ? { uri: team.logoUrl } : null
  );
  const [originalLogoUrl, setOriginalLogoUrl] = useState(team?.logoUrl || "");
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);

  useEffect(() => {
    async function fetchData() {
      try {
        if (teamId) {
          const token = await AsyncStorage.getItem("userToken");
          const teamDetails = await getTeamsDetails(teamId, token);
          // console.log("Team Details Data: ", teamDetails);

          if (teamDetails) {
            setTeamName(teamDetails?.name || "");
            setCountry(teamDetails?.country || "");

            let logoPath = null;
            if (teamDetails?.logo) {
              if (teamDetails.logo.formats) {
                logoPath =
                  teamDetails.logo.formats?.thumbnail?.url ||
                  teamDetails.logo.formats?.small?.url ||
                  teamDetails.logo.url;
              } else {
                logoPath = teamDetails.logo.url;
              }
            }

            const fullLogoUrl = logoPath
              ? `${process.env.EXPO_PUBLIC_API_URL}${logoPath}`
              : null;

            setTeamLogo(fullLogoUrl ? { uri: fullLogoUrl } : null);
            setOriginalLogoUrl(fullLogoUrl || "");
            // console.log("Team Logo URL:", fullLogoUrl);
          }
        }
      } catch (error) {
        console.error("Error fetching team details:", error);
        alert("Failed to fetch team details!");
      } finally {
        setFetching(false);
      }
    }

    fetchData();
  }, [teamId]);

  const handlePickImage = async () => {
    const permissionResult =
      await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!permissionResult.granted) {
      alert("Permission to access gallery is required!");
      return;
    }

    const pickerResult = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      quality: 1,
    });

    if (pickerResult.canceled) return;

    const asset = pickerResult.assets[0];

    setTeamLogo({
      uri: asset.uri,
      file: asset.file || null,
    });
  };

  const handleSave = async () => {
    if (!teamName || !country) {
      alert("Please fill all fields!");
      return;
    }

    setLoading(true);

    try {
      const token = await AsyncStorage.getItem("userToken");
      let logoId = team?.logoId || null;

      const isLogoChanged = teamLogo?.uri && teamLogo.uri !== originalLogoUrl;

      if (isLogoChanged) {
        // console.log(" Uploading new logo...");

        const localUri = teamLogo.uri;
        const filename = localUri.split("/").pop();
        const match = /\.(\w+)$/.exec(filename);
        const type = match ? `image/${match[1]}` : "image";

        const fileToUpload = {
          uri: localUri,
          name: filename,
          type,
        };

        const uploadRes = await uploadLogo(
          Platform.OS === "ios" ? fileToUpload : teamLogo.file || fileToUpload,
          token
        );

        logoId = uploadRes?.[0]?.id || logoId;
        console.log("Upload response:", uploadRes);
      } else {
        console.log(" Logo not changed — skipping upload.");
      }

      const updateData = {
        name: teamName,
        country,
      };

      if (isLogoChanged) {
        updateData.logo = logoId;
      }

      await updateTeam(teamId, updateData, token);

      alert("Team updated successfully!");
      navigation.goBack();
    } catch (error) {
      console.error("Update Team Error:", error);
      alert(error.message || "Failed to update team");
    } finally {
      setLoading(false);
    }
  };

  if (fetching) {
    return (
      <View style={styles.loaderContainer}>
        <ActivityIndicator size="large" color={Colors.primary} />
      </View>
    );
  }

  return (
    <KeyboardAwareScrollView
      extraKeyboardSpace={30}
      contentContainerStyle={styles.container}
      enableOnAndroid
      keyboardShouldPersistTaps="handled"
    >
      <TouchableOpacity
        style={styles.backButton}
        onPress={() => navigation.goBack()}
      >
        <Image source={backIcon} style={styles.backArrow} />
      </TouchableOpacity>

      <Text style={styles.title}>Edit Team</Text>

      <TouchableOpacity style={styles.imageUpload} onPress={handlePickImage}>
        {teamLogo ? (
          <Image
            source={{ uri: teamLogo?.uri }}
            style={{ width: "100%", height: "100%", borderRadius: 50 }}
          />
        ) : (
          <Ionicons name="image-outline" size={48} color="#ccc" />
        )}
        <View style={styles.imageIcon}>
          <Ionicons name="camera" size={18} color="#fff" />
        </View>
      </TouchableOpacity>

      <CustomInput
        label="Team Name"
        value={teamName}
        onChangeText={setTeamName}
      />
      <CustomInput label="Country" value={country} onChangeText={setCountry} />

      <GradientButton
        title={loading ? <ActivityIndicator color="#fff" /> : "Update Team"}
        onPress={handleSave}
        style={styles.saveText}
        disabled={loading}
      />
    </KeyboardAwareScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    backgroundColor: "#fff",
    paddingTop: 80,
    alignItems: "center",
    padding: 20,
  },
  loaderContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  backButton: { position: "absolute", top: 60, left: 20 },
  backArrow: { width: 24, height: 24 },
  title: {
    fontSize: 20,
    fontWeight: "700",
    marginBottom: 40,
    position: "absolute",
    top: 60,
    left: 152,
  },
  imageUpload: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: "#F3F3F3",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 30,
    marginTop: 40,
    position: "relative",
  },
  imageIcon: {
    position: "absolute",
    bottom: 8,
    right: 1,
    backgroundColor: Colors.primary,
    borderRadius: 15,
    padding: 4,
  },
  saveText: {
    color: "#fff",
    fontWeight: "600",
    fontSize: 16,
    height: 48,
    borderRadius: 10,
    marginTop: 340,
    alignSelf: "stretch",
    justifyContent: "center",
  },
});

export default EditTeamScreen;
