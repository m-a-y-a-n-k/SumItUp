// Passport configuration for OAuth strategies
// Currently commented out - uncomment and configure when needed

/*
import passport from "passport";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import { Strategy as GitHubStrategy } from "passport-github2";
import { Strategy as FacebookStrategy } from "passport-facebook";
import User, { IUser } from "../models/User";

const {
  GOOGLE_CLIENT_ID,
  GOOGLE_CLIENT_SECRET,
  GITHUB_CLIENT_ID,
  GITHUB_CLIENT_SECRET,
  FACEBOOK_APP_ID,
  FACEBOOK_APP_SECRET,
} = process.env;

// Serialize user to session
passport.serializeUser((user: IUser, done) => {
  done(null, user.id);
});

// Deserialize user from session
passport.deserializeUser(async (id: string, done) => {
  try {
    const user = await User.findById(id);
    done(null, user);
  } catch (err) {
    done(err, null);
  }
});

// Google Strategy
if (GOOGLE_CLIENT_ID && GOOGLE_CLIENT_SECRET) {
  passport.use(
    new GoogleStrategy(
      {
        clientID: GOOGLE_CLIENT_ID,
        clientSecret: GOOGLE_CLIENT_SECRET,
        callbackURL: "/auth/google/callback",
      },
      async (accessToken, refreshToken, profile, done) => {
        try {
          const email = profile.emails?.[0]?.value;
          if (!email) {
            return done(new Error("No email found in Google profile"), null);
          }

          const existingUser = await User.findByEmail(email);
          if (existingUser) {
            return done(null, existingUser);
          }

          const newUser = new User({
            username: profile.displayName || "Google User",
            email: email,
            verified: true, // Google accounts are pre-verified
          });

          await newUser.save();
          done(null, newUser);
        } catch (err) {
          done(err, null);
        }
      }
    )
  );
}

// GitHub Strategy
if (GITHUB_CLIENT_ID && GITHUB_CLIENT_SECRET) {
  passport.use(
    new GitHubStrategy(
      {
        clientID: GITHUB_CLIENT_ID,
        clientSecret: GITHUB_CLIENT_SECRET,
        callbackURL: "/auth/github/callback",
      },
      async (accessToken, refreshToken, profile, done) => {
        try {
          const email = profile.emails?.[0]?.value;
          if (!email) {
            return done(new Error("No email found in GitHub profile"), null);
          }

          const existingUser = await User.findByEmail(email);
          if (existingUser) {
            return done(null, existingUser);
          }

          const newUser = new User({
            username: profile.displayName || profile.username || "GitHub User",
            email: email,
            verified: true, // GitHub accounts are pre-verified
          });

          await newUser.save();
          done(null, newUser);
        } catch (err) {
          done(err, null);
        }
      }
    )
  );
}

// Facebook Strategy
if (FACEBOOK_APP_ID && FACEBOOK_APP_SECRET) {
  passport.use(
    new FacebookStrategy(
      {
        clientID: FACEBOOK_APP_ID,
        clientSecret: FACEBOOK_APP_SECRET,
        callbackURL: "/auth/facebook/callback",
        profileFields: ["id", "emails", "name"],
      },
      async (accessToken, refreshToken, profile, done) => {
        try {
          const email = profile.emails?.[0]?.value;
          if (!email) {
            return done(new Error("No email found in Facebook profile"), null);
          }

          const existingUser = await User.findByEmail(email);
          if (existingUser) {
            return done(null, existingUser);
          }

          const newUser = new User({
            username: `${profile.name?.givenName || ""} ${profile.name?.familyName || ""}`.trim() || "Facebook User",
            email: email,
            verified: true, // Facebook accounts are pre-verified
          });

          await newUser.save();
          done(null, newUser);
        } catch (err) {
          done(err, null);
        }
      }
    )
  );
}

export default passport;
*/

// Placeholder export for now
export default {};
