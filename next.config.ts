import type { NextConfig } from "next";

const nextConfig = {
    reactStrictMode: true,
    experimental: {
        appDir: true, // ✅ 반드시 있어야 함
    },
};

export default nextConfig;
