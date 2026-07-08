/** @type {import('next').NextConfig} */
const nextConfig = {
  // During local development, proxy /api/* to the Python backend running on port 8000
  // so `npm run dev` + `uvicorn api.index:app --reload` work together seamlessly.
  async rewrites() {
    // Only proxy in development; in production Vercel handles routing via vercel.json
    if (process.env.NODE_ENV === "development") {
      return [
        {
          source: "/api/:path*",
          destination: "http://localhost:8000/api/:path*",
        },
      ];
    }
    return [];
  },
};

module.exports = nextConfig;
