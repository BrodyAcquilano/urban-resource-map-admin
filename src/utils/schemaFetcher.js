import axios from "axios";

const BASE_URL = import.meta.env.VITE_API_URL;

export const fetchAllSchemas = async () => {
  try {
    const response = await axios.get(`${BASE_URL}/api/schema`);
    return response.data; // Array of schemas
  } catch (err) {
    console.error("Error fetching schemas:", err);
    return [];
  }
};

export const fetchSchemaByProjectName = async (projectName) => {
  try {
    const response = await axios.get(`${BASE_URL}/api/schema/project`, {
      params: { projectName }
    });
    return response.data; // Single schema object
  } catch (err) {
    console.error(`Error fetching schema for ${projectName}:`, err);
    return null;
  }
};