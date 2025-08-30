const Content = require("../../models/Content");

const contentController = {
  // Save processed content to history
  async saveContent(req, res) {
    try {
      const { title, originalContent, summary, contentType, metadata, tags } = req.body;
      const userId = req.user.id;

      if (!title || !originalContent || !summary || !contentType) {
        return res.status(400).json({ 
          error: "Title, original content, summary, and content type are required" 
        });
      }

      const content = new Content({
        userId,
        title,
        originalContent,
        summary,
        contentType,
        metadata: metadata || {},
        tags: tags || []
      });

      await content.save();

      res.status(201).json({
        message: "Content saved successfully",
        content: {
          id: content._id,
          title: content.title,
          contentType: content.contentType,
          createdAt: content.createdAt,
          isFavorite: content.isFavorite
        }
      });
    } catch (error) {
      console.error("Error saving content:", error);
      res.status(500).json({ error: "Internal Server Error" });
    }
  },

  // Get user's content history
  async getHistory(req, res) {
    try {
      const userId = req.user.id;
      const { limit = 10, offset = 0, contentType, isFavorite } = req.query;

      const options = {
        limit: parseInt(limit),
        offset: parseInt(offset)
      };

      if (contentType) {
        options.contentType = contentType;
      }

      if (isFavorite !== undefined) {
        options.isFavorite = isFavorite === 'true';
      }

      const contents = await Content.findByUserId(userId, options);
      const totalCount = await Content.countDocuments({ userId });

      res.status(200).json({
        contents: contents.map(content => ({
          id: content._id,
          title: content.title,
          summary: content.summary.substring(0, 200) + (content.summary.length > 200 ? '...' : ''),
          contentType: content.contentType,
          tags: content.tags,
          isFavorite: content.isFavorite,
          createdAt: content.createdAt,
          metadata: content.metadata
        })),
        pagination: {
          total: totalCount,
          limit: parseInt(limit),
          offset: parseInt(offset),
          hasMore: (parseInt(offset) + parseInt(limit)) < totalCount
        }
      });
    } catch (error) {
      console.error("Error getting content history:", error);
      res.status(500).json({ error: "Internal Server Error" });
    }
  },

  // Get specific content by ID
  async getContent(req, res) {
    try {
      const { contentId } = req.params;
      const userId = req.user.id;

      const content = await Content.findOne({ _id: contentId, userId });

      if (!content) {
        return res.status(404).json({ error: "Content not found" });
      }

      res.status(200).json({
        content: {
          id: content._id,
          title: content.title,
          originalContent: content.originalContent,
          summary: content.summary,
          contentType: content.contentType,
          tags: content.tags,
          isFavorite: content.isFavorite,
          isPublic: content.isPublic,
          createdAt: content.createdAt,
          updatedAt: content.updatedAt,
          metadata: content.metadata
        }
      });
    } catch (error) {
      console.error("Error getting content:", error);
      res.status(500).json({ error: "Internal Server Error" });
    }
  },

  // Toggle favorite status
  async toggleFavorite(req, res) {
    try {
      const { contentId } = req.params;
      const userId = req.user.id;

      const content = await Content.findOne({ _id: contentId, userId });

      if (!content) {
        return res.status(404).json({ error: "Content not found" });
      }

      await content.toggleFavorite();

      res.status(200).json({
        message: `Content ${content.isFavorite ? 'added to' : 'removed from'} favorites`,
        isFavorite: content.isFavorite
      });
    } catch (error) {
      console.error("Error toggling favorite:", error);
      res.status(500).json({ error: "Internal Server Error" });
    }
  },

  // Get favorites
  async getFavorites(req, res) {
    try {
      const userId = req.user.id;
      const { limit = 10, offset = 0 } = req.query;

      const options = {
        limit: parseInt(limit),
        offset: parseInt(offset),
        isFavorite: true
      };

      const favorites = await Content.findByUserId(userId, options);
      const totalCount = await Content.countDocuments({ userId, isFavorite: true });

      res.status(200).json({
        favorites: favorites.map(content => ({
          id: content._id,
          title: content.title,
          summary: content.summary.substring(0, 200) + (content.summary.length > 200 ? '...' : ''),
          contentType: content.contentType,
          tags: content.tags,
          createdAt: content.createdAt
        })),
        pagination: {
          total: totalCount,
          limit: parseInt(limit),
          offset: parseInt(offset),
          hasMore: (parseInt(offset) + parseInt(limit)) < totalCount
        }
      });
    } catch (error) {
      console.error("Error getting favorites:", error);
      res.status(500).json({ error: "Internal Server Error" });
    }
  },

  // Add tags to content
  async addTags(req, res) {
    try {
      const { contentId } = req.params;
      const { tags } = req.body;
      const userId = req.user.id;

      if (!tags || !Array.isArray(tags)) {
        return res.status(400).json({ error: "Tags must be an array" });
      }

      const content = await Content.findOne({ _id: contentId, userId });

      if (!content) {
        return res.status(404).json({ error: "Content not found" });
      }

      await content.addTags(tags);

      res.status(200).json({
        message: "Tags added successfully",
        tags: content.tags
      });
    } catch (error) {
      console.error("Error adding tags:", error);
      res.status(500).json({ error: "Internal Server Error" });
    }
  },

  // Remove tags from content
  async removeTags(req, res) {
    try {
      const { contentId } = req.params;
      const { tags } = req.body;
      const userId = req.user.id;

      if (!tags || !Array.isArray(tags)) {
        return res.status(400).json({ error: "Tags must be an array" });
      }

      const content = await Content.findOne({ _id: contentId, userId });

      if (!content) {
        return res.status(404).json({ error: "Content not found" });
      }

      await content.removeTags(tags);

      res.status(200).json({
        message: "Tags removed successfully",
        tags: content.tags
      });
    } catch (error) {
      console.error("Error removing tags:", error);
      res.status(500).json({ error: "Internal Server Error" });
    }
  },

  // Delete content
  async deleteContent(req, res) {
    try {
      const { contentId } = req.params;
      const userId = req.user.id;

      const result = await Content.deleteOne({ _id: contentId, userId });

      if (result.deletedCount === 0) {
        return res.status(404).json({ error: "Content not found" });
      }

      res.status(200).json({ message: "Content deleted successfully" });
    } catch (error) {
      console.error("Error deleting content:", error);
      res.status(500).json({ error: "Internal Server Error" });
    }
  },

  // Search content by tags
  async searchByTags(req, res) {
    try {
      const userId = req.user.id;
      const { tags } = req.query;

      if (!tags) {
        return res.status(400).json({ error: "Tags parameter is required" });
      }

      const tagArray = Array.isArray(tags) ? tags : tags.split(',');
      const contents = await Content.searchByTags(userId, tagArray);

      res.status(200).json({
        searchTags: tagArray,
        contents: contents.map(content => ({
          id: content._id,
          title: content.title,
          summary: content.summary.substring(0, 200) + (content.summary.length > 200 ? '...' : ''),
          contentType: content.contentType,
          tags: content.tags,
          isFavorite: content.isFavorite,
          createdAt: content.createdAt
        })),
        total: contents.length
      });
    } catch (error) {
      console.error("Error searching by tags:", error);
      res.status(500).json({ error: "Internal Server Error" });
    }
  }
};

module.exports = contentController;
