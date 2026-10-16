import passport from 'passport';
import { Strategy as GoogleStrategy, Profile } from 'passport-google-oauth20';
import { config } from './index.js';
import { userRepository } from '../repositories/userRepository.js';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';

const ORG_DOMAIN = config.orgEmailDomain; // 'bitsathy.ac.in'

export const configurePassport = () => {
  passport.use(
    new GoogleStrategy(
      {
        clientID: config.googleClientId,
        clientSecret: config.googleClientSecret,
        callbackURL: config.googleCallbackUrl,
        scope: ['profile', 'email'],
      },
      async (_accessToken, _refreshToken, profile: Profile, done) => {
        try {
          const email = profile.emails?.[0]?.value || '';
          const name =
            profile.displayName ||
            `${profile.name?.givenName ?? ''} ${profile.name?.familyName ?? ''}`.trim();

          if (!email) {
            return done(new Error('No email returned from Google.'), undefined);
          }

          // Only @bitsathy.ac.in Google accounts are permitted
          if (!email.toLowerCase().endsWith(`@${ORG_DOMAIN}`)) {
            return done(
              new Error(`DOMAIN_RESTRICTED: Only @${ORG_DOMAIN} Google accounts are allowed. Please use your institutional email.`),
              undefined
            );
          }

          // Verify that user exists in the database
          const user = await userRepository.findByEmail(email.trim().toLowerCase());

          if (!user) {
            // Reject: Only users registered in the database can access the platform
            return done(
              new Error(`NOT_REGISTERED: Your email (${email}) is not registered in the database. Access is permitted for registered accounts only.`),
              undefined
            );
          }

          // Issue a JWT exactly like the normal login flow
          const token = jwt.sign(
            { id: user.id, email: user.email, role: user.role },
            config.jwtSecret,
            { expiresIn: config.jwtExpiresIn as any }
          );

          return done(null, { user, token } as any);
        } catch (err) {
          return done(err as Error, undefined);
        }
      }
    )
  );
};
