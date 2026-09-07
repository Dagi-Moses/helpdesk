declare module "next-pwa" {
  import type { NextConfig } from "next";

  interface PWAOptions {
    dest: string;
    register?: boolean;
    skipWaiting?: boolean;
    disable?: boolean;
  }

  const withPWA: (
    config: NextConfig & { pwa?: PWAOptions }
  ) => NextConfig;

  export default withPWA;
}