const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const mongoose = require('mongoose');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(bodyParser.json());

const mongodbURI = `mongodb+srv://admin:${process.env.MONGO_DB_ADMIN_PASSWORD}@sumitupcluster.qkud29c.mongodb.net/?retryWrites=true&w=majority`;

// MongoDB Connection
mongoose.connect(mongodbURI, {
    useNewUrlParser: true,
    useUnifiedTopology: true
})
.then(() => {
    console.log('MongoDB connected');
})
.catch((err) => {
    console.error('MongoDB connection error:', err);
});

// Define Routes
app.get('/', (req, res) => {
    res.send('Welcome to SumItUp API');
});

// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
