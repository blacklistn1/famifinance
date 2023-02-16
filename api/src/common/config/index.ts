export default () => ({
  jwt: {
    at_secret: process.env.JWT_ACCESS_SECRET,
    at_expiration: process.env.JWT_ACCESS_EXPIRATION,
    rt_secret: process.env.JWT_REFRESH_SECRET,
    rt_expiration: process.env.JWT_REFRESH_EXPIRATION,
  },
});
