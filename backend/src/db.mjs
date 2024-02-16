import mongoose from "mongoose";

const mongodbURI = `mongodb+srv://admin:${process.env.MONGO_DB_ADMIN_PASSWORD}@sumitupcluster.qkud29c.mongodb.net/?retryWrites=true&w=majority`;

mongoose.connect(mongodbURI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const db = mongoose.connection;

db.on("error", console.error.bind(console, "MongoDB connection error:"));

export default db;
