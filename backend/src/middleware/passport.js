// const passport = require("passport");
// const GoogleStrategy = require("passport-google-oauth20").Strategy;
// const GitHubStrategy = require("passport-github2").Strategy;
// const FacebookStrategy = require("passport-facebook").Strategy;
// const User = require("../models/User"); // Adjust the path to your User model
// const {
//   GOOGLE_CLIENT_ID,
//   GOOGLE_CLIENT_SECRET,
//   GITHUB_CLIENT_ID,
//   GITHUB_CLIENT_SECRET,
//   FACEBOOK_APP_ID,
//   FACEBOOK_APP_SECRET,
// } = process.env;

// // Serialize user to session
// passport.serializeUser((user, done) => {
//   done(null, user.id);
// });

// // Deserialize user from session
// passport.deserializeUser(async (id, done) => {
//   try {
//     const user = await User.findById(id);
//     done(null, user);
//   } catch (err) {
//     done(err, null);
//   }
// });

// // Google Strategy
// passport.use(
//   new GoogleStrategy(
//     {
//       clientID: GOOGLE_CLIENT_ID,
//       clientSecret: GOOGLE_CLIENT_SECRET,
//       callbackURL: "/auth/google/callback",
//     },
//     async (accessToken, refreshToken, profile, done) => {
//       try {
//         const existingUser = await User.findOne({
//           email: profile.emails[0].value,
//         });
//         if (existingUser) {
//           return done(null, existingUser);
//         }

//         const newUser = new User({
//           username: profile.displayName,
//           email: profile.emails[0].value,
//         });

//         await newUser.save();
//         done(null, newUser);
//       } catch (err) {
//         done(err, null);
//       }
//     }
//   )
// );

// // GitHub Strategy
// passport.use(
//   new GitHubStrategy(
//     {
//       clientID: GITHUB_CLIENT_ID,
//       clientSecret: GITHUB_CLIENT_SECRET,
//       callbackURL: "/auth/github/callback",
//     },
//     async (accessToken, refreshToken, profile, done) => {
//       try {
//         const existingUser = await User.findOne({
//           email: profile.emails[0].value,
//         });
//         if (existingUser) {
//           return done(null, existingUser);
//         }

//         const newUser = new User({
//           username: profile.displayName,
//           email: profile.emails[0].value,
//         });

//         await newUser.save();
//         done(null, newUser);
//       } catch (err) {
//         done(err, null);
//       }
//     }
//   )
// );

// // Facebook Strategy
// passport.use(
//   new FacebookStrategy(
//     {
//       clientID: FACEBOOK_APP_ID,
//       clientSecret: FACEBOOK_APP_SECRET,
//       callbackURL: "/auth/facebook/callback",
//       profileFields: ["id", "emails", "name"],
//     },
//     async (accessToken, refreshToken, profile, done) => {
//       try {
//         const existingUser = await User.findOne({
//           email: profile.emails[0].value,
//         });
//         if (existingUser) {
//           return done(null, existingUser);
//         }

//         const newUser = new User({
//           username: `${profile.name.givenName} ${profile.name.familyName}`,
//           email: profile.emails[0].value,
//         });

//         await newUser.save();
//         done(null, newUser);
//       } catch (err) {
//         done(err, null);
//       }
//     }
//   )
// );

// module.exports = passport;
