/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    appDir: true,
    /* superjson-plugin is going to sanitize our objects, so that we can safely pass them. 
    Even though they have date objects and other complex properties which are not compatible.
    When passing from server components like Sidebar into a client component like desktopSidebar
    */
    swcPlugins: [["next-superjson-plugin", {}]]
  },
  images: {
    // To solve images domain problem
    domains: [
      "res.cloudinary.com",
      "avatars.githubusercontent.com",
      "lh3.googleusercontent.com"
    ]
  }
}

module.exports = nextConfig
