import "dotenv/config";
import qdrantClient from "./config/qdrant.js";

const test = async () => {
  try {
    const collections = await qdrantClient.getCollections();

    console.log("Qdrant connected successfully!");
    console.log("Collections:", collections.collections);
  } catch (error) {
    console.error("Qdrant connection failed:");
    console.error(error.message);
  }
};

test();