const UserPreferences = require("../../models/UserPreferences");

const preferencesController = {
  // Get user preferences
  async getPreferences(req, res) {
    try {
      const userId = req.user.id;
      
      let preferences = await UserPreferences.findByUserId(userId);
      
      // Create default preferences if they don't exist
      if (!preferences) {
        preferences = await UserPreferences.createDefault(userId);
      }
      
      res.status(200).json({
        preferences: {
          defaultSummaryLength: preferences.defaultSummaryLength,
          summaryStyle: preferences.summaryStyle,
          preferredLanguage: preferences.preferredLanguage,
          processingQuality: preferences.processingQuality,
          autoSaveContent: preferences.autoSaveContent,
          defaultPrivacy: preferences.defaultPrivacy,
          emailNotifications: preferences.emailNotifications,
          processingNotifications: preferences.processingNotifications,
          weeklyDigest: preferences.weeklyDigest,
          theme: preferences.theme,
          itemsPerPage: preferences.itemsPerPage,
          favoriteContentTypes: preferences.favoriteContentTypes,
          interests: preferences.interests,
          updatedAt: preferences.updatedAt
        }
      });
    } catch (error) {
      console.error("Error getting user preferences:", error);
      res.status(500).json({ error: "Internal Server Error" });
    }
  },

  // Update user preferences
  async updatePreferences(req, res) {
    try {
      const userId = req.user.id;
      const updates = req.body;
      
      let preferences = await UserPreferences.findByUserId(userId);
      
      // Create default preferences if they don't exist
      if (!preferences) {
        preferences = await UserPreferences.createDefault(userId);
      }
      
      // Update preferences
      await preferences.updatePreferences(updates);
      
      res.status(200).json({
        message: "Preferences updated successfully",
        preferences: {
          defaultSummaryLength: preferences.defaultSummaryLength,
          summaryStyle: preferences.summaryStyle,
          preferredLanguage: preferences.preferredLanguage,
          processingQuality: preferences.processingQuality,
          autoSaveContent: preferences.autoSaveContent,
          defaultPrivacy: preferences.defaultPrivacy,
          emailNotifications: preferences.emailNotifications,
          processingNotifications: preferences.processingNotifications,
          weeklyDigest: preferences.weeklyDigest,
          theme: preferences.theme,
          itemsPerPage: preferences.itemsPerPage,
          favoriteContentTypes: preferences.favoriteContentTypes,
          interests: preferences.interests,
          updatedAt: preferences.updatedAt
        }
      });
    } catch (error) {
      console.error("Error updating user preferences:", error);
      res.status(500).json({ error: "Internal Server Error" });
    }
  },

  // Reset preferences to default
  async resetPreferences(req, res) {
    try {
      const userId = req.user.id;
      
      // Delete existing preferences
      await UserPreferences.deleteOne({ userId });
      
      // Create new default preferences
      const preferences = await UserPreferences.createDefault(userId);
      
      res.status(200).json({
        message: "Preferences reset to default successfully",
        preferences: {
          defaultSummaryLength: preferences.defaultSummaryLength,
          summaryStyle: preferences.summaryStyle,
          preferredLanguage: preferences.preferredLanguage,
          processingQuality: preferences.processingQuality,
          autoSaveContent: preferences.autoSaveContent,
          defaultPrivacy: preferences.defaultPrivacy,
          emailNotifications: preferences.emailNotifications,
          processingNotifications: preferences.processingNotifications,
          weeklyDigest: preferences.weeklyDigest,
          theme: preferences.theme,
          itemsPerPage: preferences.itemsPerPage,
          favoriteContentTypes: preferences.favoriteContentTypes,
          interests: preferences.interests,
          updatedAt: preferences.updatedAt
        }
      });
    } catch (error) {
      console.error("Error resetting user preferences:", error);
      res.status(500).json({ error: "Internal Server Error" });
    }
  },

  // Add interests/tags
  async addInterests(req, res) {
    try {
      const userId = req.user.id;
      const { interests } = req.body;
      
      if (!interests || !Array.isArray(interests)) {
        return res.status(400).json({ error: "Interests must be an array" });
      }
      
      let preferences = await UserPreferences.findByUserId(userId);
      
      if (!preferences) {
        preferences = await UserPreferences.createDefault(userId);
      }
      
      // Add new interests (avoid duplicates)
      const uniqueInterests = [...new Set([...preferences.interests, ...interests])];
      preferences.interests = uniqueInterests;
      
      await preferences.save();
      
      res.status(200).json({
        message: "Interests added successfully",
        interests: preferences.interests
      });
    } catch (error) {
      console.error("Error adding interests:", error);
      res.status(500).json({ error: "Internal Server Error" });
    }
  },

  // Remove interests/tags
  async removeInterests(req, res) {
    try {
      const userId = req.user.id;
      const { interests } = req.body;
      
      if (!interests || !Array.isArray(interests)) {
        return res.status(400).json({ error: "Interests must be an array" });
      }
      
      const preferences = await UserPreferences.findByUserId(userId);
      
      if (!preferences) {
        return res.status(404).json({ error: "Preferences not found" });
      }
      
      // Remove interests
      preferences.interests = preferences.interests.filter(
        interest => !interests.includes(interest)
      );
      
      await preferences.save();
      
      res.status(200).json({
        message: "Interests removed successfully",
        interests: preferences.interests
      });
    } catch (error) {
      console.error("Error removing interests:", error);
      res.status(500).json({ error: "Internal Server Error" });
    }
  }
};

module.exports = preferencesController;
