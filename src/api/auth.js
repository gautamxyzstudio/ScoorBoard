import axios from "axios";
import { ENDPOINTS } from "./endpoints";

// Login User
export const loginUser = async (loginData) => {
  try {
    const response = await axios.post(ENDPOINTS.LOGIN, loginData);
    return response.data;
  } catch (error) {
    console.error("Login Error:", error.response?.data || error.message);
    throw error.response?.data || { message: "Login failed" };
  }
};

//  Register
export const registerUser = async (userData) => {
  try {
    const response = await axios.post(ENDPOINTS.REGISTER, userData);
    return response.data;
  } catch (error) {
    console.error("Register Error:", error.response?.data || error.message);
    throw error.response?.data || { message: "Registration failed" };
  }
};

// Check Email Exists
export const checkEmailExists = async (email) => {
  try {
    const response = await axios.post(ENDPOINTS.CHECK_EMAIL, { email });
    return response.data;
  } catch (error) {
    console.error("Check Email Error:", error.response?.data || error.message);
    return { exists: false };
  }
};

// Create Team
export const createTeam = async (teamData) => {
  try {
    const response = await axios.post(ENDPOINTS.CREATE_TEAM, teamData);
    return response.data;
  } catch (error) {
    console.error("Create Team Error:", error.response?.data || error.message);
    throw error.response?.data || { message: "Failed to create team" };
  }
};

// Get Teams List
export const getTeams = async () => {
  try {
    const response = await axios.get(ENDPOINTS.GET_TEAMS);
    return response.data;
  } catch (error) {
    console.error("Get Teams Error:", error.response?.data || error.message);
    return [];
  }
};

// Get Teams List by id
export const getTeamsDetails = async (teamId, userToken) => {
  try {
    const response = await axios.get(ENDPOINTS.UPDATE_TEAM(teamId), {
      headers: {
        Authorization: `Bearer ${userToken}`,
      },
    });
    return response.data;
  } catch (err) {
    console.error("Upload Logo Error:", err.response?.data || err.message);
  }
};

// Upload Logo
export const uploadLogo = async (file, userToken) => {
  console.log("Selected file:", file);
  
        console.log("fileToUpload", file);
        console.log(userToken,"token")

  try {
    const formData = new FormData();
    formData.append("files", file);
    const response = await axios.post(ENDPOINTS.UPLOAD_LOGO, formData, {
      headers: {
        Authorization: `Bearer ${userToken}`,
        "Content-Type": "multipart/form-data",
      },
    });
    return response.data;
  } catch (error) {
    console.error("Upload Logo Error:", error.response?.data || error.message);
    throw error.response?.data || { message: "Logo upload failed" };
  }
};

// DELETE_TEAM
export const deleteTeam = async (id) => {
  try {
    const response = await axios.delete(ENDPOINTS.DELETE_TEAM(id));
    console.log("Team deleted successfully:", response.data);
    return response.data;
  } catch (error) {
    console.error("Delete Team Error:", error.response?.data || error.message);
    throw error;
  }
};

// updateTeam

export const updateTeam = async (teamId, data, token) => {
  try {
    const response = await axios.put(ENDPOINTS.UPDATE_TEAM(teamId), data, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });

    return response.data;
  } catch (error) {
    console.error(
      "Update Team API Error:",
      error.response?.data || error.message
    );
    throw error;
  }
};

// Create Match
export const createMatch = async (data, token) => {
  try {
    const response = await axios.post(ENDPOINTS.CREATE_MATCH, data, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });
    return response.data;
  } catch (error) {
    console.error(
      "Create Match API Error:",
      error.response?.data || error.message
    );
    throw error;
  }
};

//  Update Score
export const updateScore = async (matchId, data, token) => {
  try {
    const response = await axios.put(ENDPOINTS.UPDATE_SCORE(matchId), data, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });
    console.log(" Score updated:", response.data);
    return response.data;
  } catch (error) {
    console.error(
      "Update Score API Error:",
      error.response?.data || error.message
    );
    throw error.response?.data || { message: "Failed to update score" };
  }
};

// End Match API
export const endMatch = async (matchId, token) => {
  try {
    const response = await axios.post(
      ENDPOINTS.END_MATCH(matchId),
      {},
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      }
    );

    console.log(" Match ended successfully:", response.data);
    return response.data;
  } catch (error) {
    console.error(
      " End Match API Error:",
      error.response?.data || error.message
    );
    throw error.response?.data || { message: "Failed to end match" };
  }
};

//  Get Match by Code
export const getMatchByCode = async (code, token) => {
  try {
    const response = await axios.get(ENDPOINTS.GET_MATCH_BY_CODE(code), {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });

    console.log(" Match Found:", response.data);
    return response.data;
  } catch (error) {
    console.error(
      " Get Match By Code API Error:",
      error.response?.data || error.message
    );
    throw error.response?.data || { message: "Failed to fetch match by code" };
  }
};

//  Get Completed Matches API
export const getCompletedMatches = async (token) => {
  try {
    const response = await axios.get(ENDPOINTS.GET_COMPLETED_MATCHES, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });

    console.log(" Completed Matches:", response.data);
    return response.data;
  } catch (error) {
    console.error(
      " Get Completed Matches API Error:",
      error.response?.data || error.message
    );
    throw (
      error.response?.data || { message: "Failed to fetch completed matches" }
    );
  }
};
