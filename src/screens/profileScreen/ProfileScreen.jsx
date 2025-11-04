import React from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  ScrollView,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import person from "../../../assets/person.png"
import AsyncStorage from "@react-native-async-storage/async-storage";

 

export default function ProfileScreen({ navigation }) {
  const handleLogout = async () => {
    await AsyncStorage.clear();
    navigation.replace("Login");
  };

  const menuItems = [
    { icon: "settings-outline", label: "Preks", screen: "Settings" },
    { icon: "language-outline", label: "Language", screen: "Language" },
    {
      icon: "lock-closed-outline",
      label: "Change Password",
      screen: "ChangePassword",
    },
    { icon: "sunny-outline", label: "Theme", screen: "Theme" },
  ];

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={{ paddingBottom: 30 }}
    >
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="chevron-back" size={24} color="#000" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Profile</Text>
        <View style={{ width: 24 }} />
      </View>

      {/* Profile Section */}
      <View style={styles.profileSection}>
        <View>
            <Image source={person} style={styles.avatar}/>
           <TouchableOpacity style={styles.cameraIcon}>
            <Ionicons name="camera" size={16} color="#fff" />
          </TouchableOpacity>
        </View>
        <Text style={styles.name}>GFX Agency</Text>
        <Text style={styles.email}>rahul@tudio.com</Text>
      </View>

      {/* Menu Items */}
      <View style={styles.menuContainer}>
        {menuItems.map((item, index) => (
          <TouchableOpacity
            key={index}
            style={styles.menuItem}
            onPress={() => navigation.navigate(item.screen)}
          >
            <View style={styles.menuLeft}>
              <View style={styles.iconContainer}>
                <Ionicons name={item.icon} size={20} color="#068EFF" />
              </View>
              <Text style={styles.menuText}>{item.label}</Text>
            </View>
            <Ionicons name="chevron-forward" size={20} color="#ccc" />
          </TouchableOpacity>
        ))}
      </View>

      {/* Logout Button */}
      <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
        <Ionicons name="log-out-outline" size={18} color="#068EFF" />
        <Text style={styles.logoutText}>Logout</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    paddingHorizontal: 20,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginTop: 40,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#000",
  },
  profileSection: {
    alignItems: "center",
    marginVertical: 30,
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 60,
  },
  cameraIcon: {
    position: "absolute",
    bottom: 0,
    right: 0,
    backgroundColor:"#2563EB",
    borderRadius: 20,
    padding: 6,
    // borderWidth: 2,
    borderColor: "#fff",
  },
  name: {
    fontSize: 20,
    fontWeight: "700",
    marginTop: 12,
    color: "#000",
  },
  email: {
    fontSize: 14,
    color: "#888",
  },
  menuContainer: {
    backgroundColor: "#fff",
    borderRadius: 15,
    paddingVertical: 5,
    marginBottom: 25,
  },
  menuItem: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 15, 
  },
  menuLeft: {
    flexDirection: "row",
    alignItems: "center",
  },
  iconContainer: {
    backgroundColor: "#E8F1FF",
    borderRadius: 10,
    padding: 8,
    marginRight: 15,
  },
  menuText: {
    fontSize: 16,
    color: "#000",
   fontFamily:"Kumbh Sans",
   fontWeight:700,
  },
  logoutButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#F5F5F5",
    borderRadius: 10,
    paddingVertical: 14,
  },
  logoutText: {
    fontSize: 16,
    fontWeight: "500",
    color: "#068EFF",
    marginLeft: 6,
  },
});
