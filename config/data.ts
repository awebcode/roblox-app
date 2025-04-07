import { Metadata, type Viewport } from "next";

const appName = process.env.NEXT_PUBLIC_APP_NAME || "RobloxLogin";
const appUrl = process.env.NEXT_PUBLIC_APP_URL || "https://roblox-login.vercel.app";

export const defaultSEOdata: Metadata = {
  // Dynamic title with fallback
  title: {
    default: `${appName} - Secure Roblox Login for Students`,
    template: `%s | ${appName}`,
  },

  // Professional description with dynamic app name
  description: `${appName} provides a secure and easy-to-use platform for students to log in to Roblox and access educational gaming experiences. Track and manage student gaming sessions safely.`,

  // Comprehensive keywords optimized for SEO
  keywords: [
    `${appName.toLowerCase()} login`,
    "roblox student login",
    "secure roblox access",
    "educational gaming platform",
    "roblox for schools",
    "student gaming portal",
    "roblox login for kids",
    "safe roblox login",
    "roblox cookie management",
    "educational roblox access",
    "student roblox tracking",
    "gaming login security",
  ],

  // OpenGraph configuration with dynamic values
  openGraph: {
    title: `${appName} - Secure Roblox Login Portal`,
    description: `Log in to Roblox securely with ${appName}. Designed for students to access educational gaming in a safe environment.`,
    url: appUrl,
    siteName: appName,
    locale: "en_US",
    type: "website",
    images: [
      {
        url: `${appUrl}/og-image.png`, // Replace with an actual Roblox-themed OG image
        width: 1200,
        height: 630,
        alt: `${appName} - Roblox Login for Students`,
      },
    ],
  },

  // Twitter card configuration
  twitter: {
    title: `${appName} - Secure Roblox Login for Students`,
    description: `Access Roblox safely with ${appName}. A secure login portal for students to enjoy educational gaming.`,
    card: "summary_large_image",
    site: "@robloxloginapp", // Replace with your Twitter handle
    creator: "@robloxloginapp",
  },

  // Apple Web App configuration
  appleWebApp: {
    title: `${appName} - Roblox Login`,
    capable: true,
    statusBarStyle: "default",
  },

  // Facebook configuration
  facebook: {
    appId: process.env.NEXT_PUBLIC_FACEBOOK_APP_ID || "123456789",
  },

  // Robots configuration
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },

  // Dynamic icons configuration (use Roblox-themed icons)
  icons: {
    icon: [
      { url: `${appUrl}/favicon.ico`, type: "image/x-icon" },
      { url: `${appUrl}/apple-touch-icon.png`, type: "image/png" },
    ],
    shortcut: `${appUrl}/favicon.ico`,
    apple: `${appUrl}/apple-touch-icon.png`,
  },

  // Additional metadata
  applicationName: appName,
  authors: [{ name: `${appName} Team`, url: appUrl }],
  creator: appName,
  publisher: appName,
  category: "Educational Gaming Login",

  // Verification codes (should come from environment variables)
  verification: {
    google: process.env.GOOGLE_VERIFICATION_CODE || "google-site-verification=1234567890",
    yandex: process.env.YANDEX_VERIFICATION_CODE || "yandex-verification=1234567890",
  },

  // Dynamic manifest
  manifest: `${appUrl}/manifest.webmanifest`,

  // App links
  appLinks: {
    web: [{ url: appUrl, should_fallback: true }],
  },
};

// Optimized viewport configuration
export const defaultViewPort: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5, // Allow some zooming for accessibility
  minimumScale: 1,
  userScalable: true, // Better accessibility
  viewportFit: "cover",
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#FFFFFF" },
    { media: "(prefers-color-scheme: dark)", color: "#1A1A1A" },
  ],
  colorScheme: "light dark", // Support both themes
};
