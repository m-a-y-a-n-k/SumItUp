const axios = require('axios');

async function testAuthFlow() {
    const email = `testuser_${Date.now()}@example.com`;
    const password = "TestPassword123!"; // Meets requirements: Upper, Lower, Number, Special
    const username = "testuser";

    const API_URL = "http://localhost:3000/api/auth";

    console.log(`Target URL: ${API_URL}`);
    console.log("1. Testing Registration...");
    try {
        const res = await axios.post(`${API_URL}/signup`, {
            username,
            email,
            password
        });
        console.log("✅ Registration Successful", res.data);
    } catch (error) {
        console.error("❌ Registration Failed:");
        if (error.response) {
            console.error("Status:", error.response.status);
            console.error("Data:", JSON.stringify(error.response.data, null, 2));
        } else {
            console.error("Error Message:", error.message);
        }
        return;
    }

    console.log("\n2. Testing Login...");
    try {
        const response = await axios.post(`${API_URL}/login`, {
            email,
            password
        });
        console.log("✅ Login Successful");
        console.log("Token received:", !!response.data.token);
    } catch (error) {
        console.error("❌ Login Failed:");
        if (error.response) {
            console.error("Status:", error.response.status);
            console.error("Data:", JSON.stringify(error.response.data, null, 2));
        } else {
            console.error("Error Message:", error.message);
        }
    }
}

testAuthFlow();
