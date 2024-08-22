import passport from 'passport';
import { Strategy as GoogleStrategy } from 'passport-google-oauth2';
import dotenv from 'dotenv';
dotenv.config({path: "./config.env"});
import userModel from '../models/userSchema.js';

// Google Authentication Passport

passport.use(new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: "http://localhost:4000/auth/google/callback",
    passReqToCallback: true
  },
  async function(request, accessToken, refreshToken, profile, done) {
    try {
        // Check if user already exists by Google ID
        let existingUser = await userModel.findOne({ googleId: profile.id });

        if (existingUser) {
            // User already exists, log them in
            return done(null, existingUser);
        }

        // Check if user exists by email to avoid conflict
        let userByEmail = await userModel.findOne({ email: profile.emails[0].value });

        if (userByEmail) {
            // If a user with the same email exists, update their Google ID and log them in
            userByEmail.googleId = profile.id;
            await userByEmail.save();
            return done(null, userByEmail);
        }

        // If no user exists, create a new one
        const newUser = new userModel({
            googleId: profile.id,
            email: profile.emails[0].value,
            full_name: profile.displayName,
        });

        await newUser.save();
        return done(null, newUser);
    } catch (err) {
        return done(err, null);
    }
  }
));

passport.serializeUser((user, done) => {
    done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
    try {
        const user = await userModel.findById(id);
        if (user) {
            done(null, user);
        } else {
            done(new Error('User not found'), null);
        }
    } catch (err) {
        done(err, null);
    }
});



// Google Authentication Passport