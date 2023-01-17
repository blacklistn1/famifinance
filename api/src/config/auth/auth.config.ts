import { config } from 'dotenv';
config();
export const auth = () => ({
  jwt: {
    secret: process.env.JWT_SECRET,
  },
});
