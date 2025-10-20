import { Response } from "express";
import cache from "../cache";
import User from "../models/User";
import { AuthenticatedRequest } from "../types";

interface EarnTokensRequest extends AuthenticatedRequest {
  body: {
    adId: string;
  };
}

interface SpendTokensRequest extends AuthenticatedRequest {
  body: {
    tokens: number;
  };
}

interface CachedUserData {
  tokens: number;
  adEligible: boolean;
}

const tokenController = {
  async earnTokens(req: EarnTokensRequest, res: Response): Promise<Response> {
    try {
      const id = req.user?.id;
      
      if (!id) {
        return res.status(401).send({ error: "User not authenticated" });
      }
      
      const { adId } = req.body;

      // Validate adId
      if (!adId) {
        return res.status(400).send({ error: "Ad ID is required" });
      }

      // Check the cache first
      let cachedData = cache.get<CachedUserData>(`user:${id}`);
      if (!cachedData) {
        // If not cached, fetch from database
        const user = await User.findById(id);
        if (!user) {
          return res.status(404).send({ error: "User not found" });
        }
        cachedData = {
          tokens: user.tokens || 0,
          adEligible: user.adEligible,
        };
        // Cache the relevant data
        cache.set(`user:${id}`, cachedData);
      }

      if (!cachedData.adEligible) {
        return res
          .status(400)
          .send({ error: "User is not eligible for earning ads based tokens" });
      }

      // Update the token balance
      const tokensEarned = 50; // Example value, adjust as needed
      cachedData.tokens += tokensEarned;

      // Update the user's token balance in the database
      await User.findByIdAndUpdate(id, { tokens: cachedData.tokens });

      // Update the cache
      cache.set(`user:${id}`, cachedData);

      // Send back the updated token balance
      return res.status(200).send({
        message: "Tokens earned successfully",
        tokens: cachedData.tokens,
      });
    } catch (error) {
      console.error("Error earning tokens:", error);
      return res.status(500).send({ error: "An error occurred while earning tokens" });
    }
  },

  async spendTokens(req: SpendTokensRequest, res: Response): Promise<Response> {
    try {
      const id = req.user?.id;
      
      if (!id) {
        return res.status(401).send({ error: "User not authenticated" });
      }
      
      const { tokens } = req.body;

      // Validate token amount
      if (!tokens || tokens <= 0) {
        return res
          .status(400)
          .send({ error: "A positive number of tokens is required" });
      }

      // Check the cache first
      let cachedData = cache.get<CachedUserData>(`user:${id}`);
      if (!cachedData) {
        // If not cached, fetch from database
        const user = await User.findById(id);
        if (!user) {
          return res.status(404).send({ error: "User not found" });
        }
        cachedData = {
          tokens: user.tokens || 0,
          adEligible: user.adEligible,
        };
        // Cache the relevant data
        cache.set(`user:${id}`, cachedData);
      }

      if (!cachedData.adEligible) {
        return res.status(400).send({
          error: "User has already spent tokens and opted out of ads",
        });
      }

      // Check if the user has enough tokens
      if (cachedData.tokens < tokens) {
        return res.status(400).send({ error: "Insufficient tokens" });
      }

      // Deduct the tokens from the user's balance
      cachedData.tokens -= tokens;
      cachedData.adEligible = false;

      // Update the user's token balance and ad eligibility in the database
      await User.findByIdAndUpdate(id, {
        tokens: cachedData.tokens,
        adEligible: false,
      });

      // Update the cache
      cache.set(`user:${id}`, cachedData);
      cache.set(`adEligibility:${id}`, false);

      // Send back the updated token balance
      return res.status(200).send({
        message: "Tokens spent successfully",
        tokens: cachedData.tokens,
      });
    } catch (error) {
      console.error("Error spending tokens:", error);
      return res
        .status(500)
        .send({ error: "An error occurred while spending tokens" });
    }
  },
};

export default tokenController;

