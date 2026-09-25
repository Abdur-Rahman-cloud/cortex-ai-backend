import "dotenv/config";
import qdrantClient from "./config/qdrant.js";

const COLLECTION_NAME = "document_chunks";

const createCollection = async () => {
  try {
    const collections = await qdrantClient.getCollections();

    const exists = collections.collections.some(
      (collection) => collection.name === COLLECTION_NAME
    );

    if (exists) {
      console.log(`Collection "${COLLECTION_NAME}" already exists.`);
      return;
    }

    await qdrantClient.createCollection(COLLECTION_NAME, {
      vectors: {
        size: 384,
        distance: "Cosine",
      },
    });

    console.log(`Collection "${COLLECTION_NAME}" created successfully!`);
  } catch (error) {
    console.error("Failed to create collection:");
    console.error(error.message);
  }
};

createCollection();