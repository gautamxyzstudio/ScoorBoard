import React, { useState, useCallback } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  Image,
  Modal,
  ActivityIndicator,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { BlurView } from "expo-blur";
import { useFocusEffect, useRoute } from "@react-navigation/native";  
import Colors from "../contants/Colors";
import editIcon from "../../assets/editIcon.png";
import deleteIcon from "../../assets/deleteIcon.png";
import plusIcon from "../../assets/plus.png";
import { getTeams, deleteTeam } from "../api/auth";

const TeamManagementScreen = ({ navigation }) => {
  const [teams, setTeams] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedTeam, setSelectedTeam] = useState(null);
  const route = useRoute();

 
  const fetchTeamsList = async () => {
    try {
      setLoading(true);
      const response = await getTeams();
      const sortedTeams = (response || []).sort(
        (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
      );
      setTeams(sortedTeams);
    } catch (error) {
      console.error("Error fetching teams:", error);
    } finally {
      setLoading(false);
    }
  };
 
  useFocusEffect(
    useCallback(() => {
      fetchTeamsList();
    }, [])
  );

 
  useFocusEffect(
    useCallback(() => {
      if (route.params?.newTeam) {
        // when new team added
        setTeams((prev) => [
          route.params.newTeam, 
          ...prev.filter((t) => t.id !== route.params.newTeam.id),
        ]);
      } else if (route.params?.updatedTeam) {
        
        setTeams((prev) => [
          route.params.updatedTeam,  
          ...prev.filter((t) => t.id !== route.params.updatedTeam.id),
        ]);
      }
    }, [route.params])
  );

  const confirmDelete = async () => {
    if (!selectedTeam?.id) return;
    try {
      await deleteTeam(selectedTeam.id);
      setTeams((prev) => prev.filter((t) => t.id !== selectedTeam.id));
      setShowDeleteModal(false);
    } catch (error) {
      console.error("Error deleting team:", error);
      alert("Failed to delete team. Please try again.");
    }
  };

  const handleDeletePress = (team) => {
    setSelectedTeam(team);
    setShowDeleteModal(true);
  };

  const renderItem = ({ item }) => {
    const logoUrl = item.logo
      ? `${process.env.EXPO_PUBLIC_API_URL}${
          item.logo.formats?.thumbnail?.url ||
          item.logo.formats?.small?.url ||
          item.logo.url
        }`
      : "https://via.placeholder.com/50";

    return (
      <View style={styles.teamCard}>
        <View style={styles.teamInfo}>
          <Image source={{ uri: logoUrl }} style={styles.teamLogo} />
          <View>
            <Text style={styles.teamName}>{item.name}</Text>
            <Text style={styles.teamType}>{item.type || "Team"}</Text>
          </View>
        </View>

        <View style={styles.actionIcons}>
          <TouchableOpacity
            style={styles.iconButton}
            onPress={() =>
              navigation.navigate("EditTeamScreen", { teamId: item.id })
            }
          >
            <Image source={editIcon} style={{ width: 20, height: 20 }} />
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.iconButton, styles.deleteBtn]}
            onPress={() => handleDeletePress(item)}
          >
            <Image source={deleteIcon} style={{ width: 20, height: 20 }} />
          </TouchableOpacity>
        </View>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.headerRow}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="chevron-back" size={24} color="#000" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Team</Text>
        <TouchableOpacity>
          <Image
            source={{ uri: "https://i.pravatar.cc/50" }}
            style={styles.profileImage}
          />
        </TouchableOpacity>
      </View>

      {/* Top Row */}
      <View style={styles.topRow}>
        <Text style={styles.sectionTitle}>My Teams</Text>
        <TouchableOpacity
          style={styles.newTeamButton}
          onPress={() => navigation.navigate("AddTeamScreen")}
        >
          <Image source={plusIcon} style={styles.plusIcon} />
          <Text style={styles.newTeamText}>New Team</Text>
        </TouchableOpacity>
      </View>

      {/* List */}
      {loading ? (
        <ActivityIndicator size="large" color={Colors.primary} />
      ) : teams.length > 0 ? (
        <FlatList
          data={teams}
          renderItem={renderItem}
          keyExtractor={(item) => item.id.toString()}
          contentContainerStyle={styles.listContainer}
          showsVerticalScrollIndicator={false}
          onRefresh={fetchTeamsList}
          refreshing={loading}
        />
      ) : (
        <Text style={styles.noTeamText}>No teams available</Text>
      )}

      {/* Delete Confirmation Modal */}
      <Modal
        visible={showDeleteModal}
        transparent
        animationType="fade"
        onRequestClose={() => setShowDeleteModal(false)}
      >
        <BlurView intensity={10} tint="dark" style={styles.blurOverlay}>
          <View style={styles.modalContent}>
            <Image source={deleteIcon} style={styles.deleteIcon} />
            <Text style={styles.modalTitle}>Delete Team</Text>
            <Text style={styles.modalMessage}>
              Are you sure you want to delete{" "}
              <Text style={{ fontWeight: "700" }}>
                {selectedTeam?.name || ""}
              </Text>
              ?
            </Text>

            <View style={styles.modalButtons}>
              <TouchableOpacity
                style={[styles.modalBtn, styles.cancelBtn]}
                onPress={() => setShowDeleteModal(false)}
              >
                <Text style={styles.cancelText}>Cancel</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.modalBtn, styles.deleteConfirmBtn]}
                onPress={confirmDelete}
              >
                <Text style={styles.deleteText}>Delete</Text>
              </TouchableOpacity>
            </View>
          </View>
        </BlurView>
      </Modal>
    </View>
  );
};

export default TeamManagementScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFF",
    paddingHorizontal: 15,
    paddingTop: 60,
  },
  headerRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 24,
  },
  headerTitle: {
    color: "#212121",
    fontSize: 24,
    fontWeight: "700",
  },
  profileImage: {
    width: 32,
    height: 32,
    borderRadius: 16,
  },
  topRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "700",
  },
  newTeamButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#F3F6FF",
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
  },
  plusIcon: {
    width: 19,
    height: 19,
    marginRight: 6,
  },
  newTeamText: {
    color: Colors.primary,
    fontWeight: "600",
    fontSize: 19,
  },
  listContainer: {
    paddingBottom: 40,
  },
  noTeamText: {
    textAlign: "center",
    color: "#999",
    marginTop: 50,
    fontSize: 16,
  },
  teamCard: {
    backgroundColor: "#F9F9F9",
    borderRadius: 12,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: 12,
    marginBottom: 12,
  },
  teamInfo: {
    flexDirection: "row",
    alignItems: "center",
  },
  teamLogo: {
    width: 46,
    height: 46,
    borderRadius: 23,
    marginRight: 12,
  },
  teamName: {
    fontSize: 16,
    fontWeight: "600",
  },
  teamType: {
    fontSize: 13,
    color: "#777",
  },
  actionIcons: {
    flexDirection: "row",
  },
  iconButton: {
    backgroundColor: "#ECECEC",
    borderRadius: 8,
    padding: 8,
    marginLeft: 8,
  },
  deleteBtn: {
    backgroundColor: "#FFEAEA",
  },
  blurOverlay: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  modalContent: {
    backgroundColor: "#fff",
    width: "80%",
    borderRadius: 12,
    padding: 20,
    alignItems: "center",
  },
  deleteIcon: {
    width: 40,
    height: 40,
    marginBottom: 10,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: "700",
    marginBottom: 10,
  },
  modalMessage: {
    fontSize: 14,
    color: "#555",
    textAlign: "center",
    marginBottom: 20,
  },
  modalButtons: {
    flexDirection: "row",
    width: "100%",
    gap: 10,
  },
  modalBtn: {
    flex: 1,
    paddingVertical: 10,
    borderRadius: 8,
    alignItems: "center",
  },
  cancelBtn: {
    backgroundColor: "#F8F8F8",
  },
  deleteConfirmBtn: {
    backgroundColor: "#DD0000",
  },
  cancelText: {
    color: "#333",
    fontWeight: "600",
  },
  deleteText: {
    color: "#FFF",
    fontWeight: "600",
  },
});
