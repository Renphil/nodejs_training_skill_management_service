'use strict';

const JwtStrategy = require('passport-jwt').Strategy;
const ExtractJwt = require('passport-jwt').ExtractJwt;
const path = require('path');
const config = require(path.resolve('middleware/config/config'));
const userModel = require('../../app/models/user.model');

module.exports = function (passport) {
  passport.use(
    new JwtStrategy(
      {
        jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
        secretOrKey: config.jwt.secretKey,
      },
      async (payload, done) => {
        try {
          const userDBResult = await userModel.getUserByEmail(payload.email);
          if (!userDBResult) return done(null, false);
          else {
            const { password, ...user } = userDBResult[0];
            return done(null, user);
          }
        } catch (err) {
          return done(err, false);
        }
      }
    )
  );
};
