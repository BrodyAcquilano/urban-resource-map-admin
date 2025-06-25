import axios from "axios";

const BASE_URL = import.meta.env.VITE_API_URL;

export const fetchAllSchemas = async (mongoURI) => {
  try {
    const response = await axios.get(`${BASE_URL}/api/schema`, {
      params: { mongoURI }
    });
    return response.data;
  } catch (err) {
    console.error("Error fetching schemas:", err);
    return [];
  }
};

export const fetchSchemaByProjectName = async (mongoURI, projectName) => {
  try {
    const response = await axios.get(`${BASE_URL}/api/schema/project`, {
      params: { projectName, mongoURI }
    });
    return response.data;
  } catch (err) {
    console.error(`Error fetching schema for ${projectName}:`, err);
    return null;
  }
};