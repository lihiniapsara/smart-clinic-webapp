import type { NextConfig } from "next";

const API_GATEWAY_URL = process.env.NEXT_PUBLIC_API_GATEWAY_URL || "http://localhost:7000";

// Parse the API gateway hostname and port for Next.js image config
function parseGatewayHost(url: string) {
  try {
    const parsed = new URL(url);
    return {
      protocol: parsed.protocol.replace(":", "") as "http" | "https",
      hostname: parsed.hostname,
      port: parsed.port || undefined,
    };
  } catch {
    return { protocol: "http" as const, hostname: "localhost", port: "7000" };
  }
}

const gateway = parseGatewayHost(API_GATEWAY_URL);

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      // Local development
      {
        protocol: "http",
        hostname: "localhost",
        port: "7000",
        pathname: "/api/v1/patients/**",
      },
      // GCP deployed gateway (dynamic from env)
      {
        protocol: gateway.protocol,
        hostname: gateway.hostname,
        ...(gateway.port ? { port: gateway.port } : {}),
        pathname: "/api/v1/patients/**",
      },
      // Allow any IP (for GCP load balancers with changing IPs)
      {
        protocol: "http",
        hostname: "**",
        pathname: "/api/v1/patients/**",
      },
    ],
  },
};

export default nextConfig;
