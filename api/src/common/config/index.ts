import {
  Category,
  Job,
  Profile,
  Role,
  Scope,
  Token,
  Transaction,
  User,
} from '../../entities';

export default () => ({
  auth: {
    social: {
      google: {
        clientID: process.env.GOOGLE_OAUTH_CLIENT_ID,
        clientSecret: process.env.GOOGLE_OAUTH_CLIENT_SECRET,
        redirectUri: process.env.GOOGLE_OAUTH_REDIRECT_URI,
      },
    },
  },
  database: {
    type: process.env.DB_TYPE,
    host: process.env.DB_HOST,
    port: parseFloat(process.env.DB_PORT),
    username: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
    name: process.env.DB_NAME,
    entities: [User, Role, Profile, Transaction, Category, Job, Scope, Token],
  },
});
