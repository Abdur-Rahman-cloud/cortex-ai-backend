import "dotenv/config";
import qdrantClient from "./config/qdrant.js";

const COLLECTION_NAME = "document_chunks";

const createPayloadIndex = async () => {
  try {
    await qdrantClient.createPayloadIndex(COLLECTION_NAME, {
      field_name: "documentId",
      field_schema: "keyword",
    });

    console.log("documentId payload index created successfully!");
  } catch (error) {
    console.error("Failed to create payload index:");
    console.error(error.message);
  }
};

createPayloadIndex();