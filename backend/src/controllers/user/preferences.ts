import { Response } from "express";
import UserPreferences, { IUserPreferences } from "../../models/UserPreferences";
import { AuthenticatedRequest } from "../../types";

interface UpdatePreferencesBody {
  defaultSummaryLength?: 'short' | 'medium' | 'long';
  summaryStyle?: 'bullet-points' | 'paragraph' | 'keywords' | 'abstract';
  preferredLanguage?: string;
  processingQuality?: 'fast' | 'balanced' | 'high';
  autoSaveContent?: boolean;
  defaultPrivacy?: 'private' | 'public';
  emailNotifications?: boolean;
  processingNotifications?: boolean;
  weeklyDigest?: boolean;
  theme?: 'light' | 'dark' | 'auto';
  itemsPerPage?: number;
  favoriteContentTypes?: string[];
  interests?: string[];
}

interface UpdatePreferencesRequest extends AuthenticatedRequest {
  body: UpdatePreferencesBody;
}

interface InterestsRequest extends AuthenticatedRequest {
  body: {
    interests: string[];
  };
}

const preferencesController = {
  // Get user preferences
  async getPreferences(req: AuthenticatedRequest, res: Response): Promise<Response> {
    try {
      const userId = req.user?.id;
      
      if (!userId) {
        return res.status(401).json({ error: "User not authenticated" });
      }
      
      let preferences = await UserPreferences.findByUserId(userId);
      
      // Create default preferences if they don't exist
      if (!preferences) {
        preferences = await UserPreferences.createDefault(userId);
      }
      
      return res.status(200).json({
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
      return res.status(500).json({ error: "Internal Server Error" });
    }
  },

  // Update user preferences
  async updatePreferences(req: UpdatePreferencesRequest, res: Response): Promise<Response> {
    try {
      const userId = req.user?.id;
      const updates = req.body;
      
      if (!userId) {
        return res.status(401).json({ error: "User not authenticated" });
      }
      
      let preferences = await UserPreferences.findByUserId(userId);
      
      // Create default preferences if they don't exist
      if (!preferences) {
        preferences = await UserPreferences.createDefault(userId);
      }
      
      // Update preferences (handle favoriteContentTypes conversion)
      if (updates.favoriteContentTypes) {
        // Assuming you have a ContentType enum or type, map string[] to ContentType[]
        // @ts-ignore Suppress if enum cast is not strict; adjust as needed per your model
        updates.favoriteContentTypes = updates.favoriteContentTypes.map((type: string) => type as ContentType);
      }

      await preferences.updatePreferences(updates as Partial<IUserPreferences>);
      
      return res.status(200).json({
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
      return res.status(500).json({ error: "Internal Server Error" });
    }
  },

  // Reset preferences to default
  async resetPreferences(req: AuthenticatedRequest, res: Response): Promise<Response> {
    try {
      const userId = req.user?.id;
      
      if (!userId) {
        return res.status(401).json({ error: "User not authenticated" });
      }
      
      // Delete existing preferences
      await UserPreferences.deleteOne({ userId });
      
      // Create new default preferences
      const preferences = await UserPreferences.createDefault(userId);
      
      return res.status(200).json({
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
      return res.status(500).json({ error: "Internal Server Error" });
    }
  },

  // Add interests/tags
  async addInterests(req: InterestsRequest, res: Response): Promise<Response> {
    try {
      const userId = req.user?.id;
      const { interests } = req.body;
      
      if (!userId) {
        return res.status(401).json({ error: "User not authenticated" });
      }
      
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
      
      return res.status(200).json({
        message: "Interests added successfully",
        interests: preferences.interests
      });
    } catch (error) {
      console.error("Error adding interests:", error);
      return res.status(500).json({ error: "Internal Server Error" });
    }
  },

  // Remove interests/tags
  async removeInterests(req: InterestsRequest, res: Response): Promise<Response> {
    try {
      const userId = req.user?.id;
      const { interests } = req.body;
      
      if (!userId) {
        return res.status(401).json({ error: "User not authenticated" });
      }
      
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
      
      return res.status(200).json({
        message: "Interests removed successfully",
        interests: preferences.interests
      });
    } catch (error) {
      console.error("Error removing interests:", error);
      return res.status(500).json({ error: "Internal Server Error" });
    }
  }
};

export default preferencesController;

