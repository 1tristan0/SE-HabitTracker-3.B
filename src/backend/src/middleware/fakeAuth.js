// Fake Auth Middleware for local Development on the local instance of Supabase

async function fakeAuth(req, res, next) {
  req.auth = {
    token: "local_dev_token",
    user: {
      id: "11111111-1111-1111-1111-111111111111", // feste UUID für dev
      email: "dev@test.com",
      role: "authenticated",
    }
  };

  return next();
}

module.exports = { fakeAuth };