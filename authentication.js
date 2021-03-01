const passport = require('passport');
const JwtStrategy = require('passport-jwt').Strategy;
const LocalStrategy = require('passport-local').Strategy;
const ExtractJwt = require('passport-jwt').ExtractJwt;
const FacebookTokenStrategy = require('passport-facebook-token');

const User = require('./models/user');
const config = require('./config');

/** config de estrategia local de passport ******/
passport.use(new LocalStrategy({
  usernameField: 'email',
  passwordField: 'password',
  session: false
}, async (email, password, done) => {
  try {
    const user = await User.findOne({
      email
    });
    if (!user) {
      return done(null, false); //el usuario no existe
    }
    const validPassword = await user.isValidPassword(password);
    if (!validPassword) {
      return done(null, false);
    }
    return done(null, user); //login ok
  } catch (error) {
    done(null, error); //login error
  }
}));

/** config de estrategia jwt de passport ******/
let opts = {};
opts.jwtFromRequest = ExtractJwt.fromAuthHeaderAsBearerToken();
opts.secretOrKey = config.JWT_KEY;
opts.algorithms = config.JWT_ALGORITHM;

passport.use(new JwtStrategy(opts, async (jwt_payload, done) => {
  try {
    const user = await User.findOne({
      _id: jwt_payload.sub
    });
    if (!user) {
      return done(null, false); //el usuario no existe
    }
    return done(null, user); //login ok
  } catch (error) {
    done(null, false); //login ok
  }
}));


passport.use(new FacebookTokenStrategy({
  clientID: config.FACEBOOK_CLIENT_ID,
  clientSecret: config.FACEBOOK_CLIENT_SECRET,
  profileFields: ['id', 'displayName', 'photos', 'email'],
  fbGraphVersion: 'v3.0',
  enableProof: true
}, async (accessToken, refreshToken, profile, done) => {
  try {
    const user = await User.findOne({
      facebookId: profile.id
    });
    if (user !== null) {
      console.log('User exists');
      return done(null, user);
    } else {
      const user = new User({
        email: profile.displayName
      });
      user.facebookId = profile.id;
      user.firstName = profile.name.givenName;
      user.lastName = profile.name.familyName;
      user.save((err, result) => {
        if (err)
          return done(err, false);
        else
          // console.log('User saved: ', result);
        return done(null, result);
      });
    }
  } catch (error) {
    return done(error, false);
  }
}));