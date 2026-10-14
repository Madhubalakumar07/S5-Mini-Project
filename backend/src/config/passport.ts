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

          // Find existing user or auto-register them
          let user = await userRepository.findByEmail(email);

          if (!user) {
            // Hash a random placeholder — this account can ONLY be accessed via Google OAuth
            const passwordHash = await bcrypt.hash(
              `google_oauth_${profile.id}_${Date.now()}`,
              config.bcryptSaltRounds
            );

            user = await userRepository.create({
              name,
              email,
              passwordHash,
              role: 'STUDENT',
              department: 'General',
            });
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
