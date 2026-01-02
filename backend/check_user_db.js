const mongoose = require('mongoose');
const dotenv = require('dotenv');
const bcrypt = require('bcrypt');

dotenv.config();

// User Schema (Simplified for check)
const userSchema = new mongoose.Schema({
    email: String,
    password: String,
    username: String
});

const User = mongoose.model('User', userSchema);

async function checkUser(email, passwordToCheck) {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        console.log("Connected to DB");

        const user = await User.findOne({ email });

        if (!user) {
            console.log(`❌ User with email '${email}' NOT FOUND in database.`);
        } else {
            console.log(`✅ User found: ${user.username} (${user._id})`);
            console.log(`   Stored Hash: ${user.password.substring(0, 20)}...`);

            if (passwordToCheck) {
                const isMatch = await bcrypt.compare(passwordToCheck, user.password);
                if (isMatch) {
                    console.log("✅ Password MATCHES!");
                } else {
                    console.log("❌ Password does NOT match.");
                }
            }
        }

    } catch (error) {
        console.error("Error:", error);
    } finally {
        await mongoose.disconnect();
    }
}

// Get args
const email = process.argv[2];
const password = process.argv[3];

if (!email) {
    console.log("Usage: node check_user_db.js <email> [password]");
} else {
    checkUser(email, password);
}
