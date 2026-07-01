/** @type {import('next').NextConfig} */
// standalone output produces a minimal self-contained server for small Docker images
const nextConfig = {
    output: "standalone",
};
export default nextConfig;
