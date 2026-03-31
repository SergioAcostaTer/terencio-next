import type { NextConfig } from "next";

const remotePatterns: NonNullable<NextConfig["images"]>["remotePatterns"] = [];

for (const value of [process.env.R2_PUBLIC_BASE_URL, process.env.R2_ENDPOINT]) {
  if (!value) {
    continue;
  }

  try {
    const parsed = new URL(value);
    remotePatterns.push({
      protocol: parsed.protocol.replace(":", "") as "http" | "https",
      hostname: parsed.hostname,
      port: parsed.port || undefined,
      pathname: `${parsed.pathname.replace(/\/$/, "") || ""}/**`,
    });
  } catch {
    // Ignore invalid URLs during local setup. Runtime validation happens in lib/env.ts.
  }
}

const nextConfig: NextConfig = {
  images: {
    remotePatterns,
  },
};

export default nextConfig;
