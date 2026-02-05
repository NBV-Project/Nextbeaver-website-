import type { NextConfig } from "next";

const supabaseHostname = (() => {
  const rawUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  if (!rawUrl) return null;
  try {
    return new URL(rawUrl).hostname;
  } catch {
    return null;
  }
})();

const imageRemotePatterns = [
  {
    protocol: "https" as const,
    hostname: "lh3.googleusercontent.com",
  },
  {
    protocol: "https" as const,
    hostname: "assets.aceternity.com",
  },
  {
    protocol: "https" as const,
    hostname: "images.unsplash.com",
  },
  {
    protocol: "https" as const,
    hostname: "grainy-gradients.vercel.app",
  },
  {
    protocol: "https" as const,
    hostname: "posters.movieposterdb.com",
  },
  ...(supabaseHostname
    ? [
      {
        protocol: "https" as const,
        hostname: supabaseHostname,
      },
    ]
    : []),
];

const nextConfig: NextConfig = {
  reactStrictMode: true,
  poweredByHeader: false,
  compress: true,
  compiler: {
    removeConsole: process.env.NODE_ENV === "production",
  },
  images: {
    remotePatterns: imageRemotePatterns,
    formats: ["image/avif", "image/webp"],
  },
  async headers() {
    const headers = [
      { key: "X-Content-Type-Options", value: "nosniff" },
      { key: "X-Frame-Options", value: "DENY" },
      { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
      { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=()" },
      { key: "X-DNS-Prefetch-Control", value: "on" },
    ];

    if (process.env.NODE_ENV === "production") {
      headers.push({
        key: "Strict-Transport-Security",
        value: "max-age=63072000; includeSubDomains; preload",
      });
    }

    return [
      {
        source: "/(.*)",
        headers,
      },
    ];
  },
};

export default nextConfig;
