import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import jwt from "jsonwebtoken";
import { randomBytes } from "crypto";
import { serialize } from "cookie";
import noblox from "noblox.js";
import axios from "axios";
// Define the schema for the incoming request body
const loginSchema = z.object({
  username: z.string().min(1, "Username is required"),
  password: z.string().min(1, "Password is required"),
});

// Simulated Roblox API response (since we can't access the real Roblox API)
const simulateRobloxLogin = async (username: string, password: string) => {
  // In a real scenario, this would be an HTTP request to the Roblox API
  // For now, we'll simulate a successful login and return a fake cookie
  if (username && password) {
    return {
      success: true,
      cookie: `roblox-auth-cookie-${username}-${Date.now()}`,
    };
  }
  throw new Error("Invalid credentials");
};

export async function POST(request: NextRequest) {
  try {
    // Parse and validate the request body
    const body = await request.json();
    const { username, password } = loginSchema.parse(body);

    // Hypothetical Roblox API call (replace with real endpoint or proxy)
    const robloxLoginUrl = "https://auth.roblox.com/v2/login"; // Placeholder

    // Step 1: Fetch cookies from GET request
    const csrfResponse = await axios.get("https://rblx.land/login", {
      withCredentials: true,
      headers: {
        Accept: "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
        "User-Agent":
          "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/135.0.0.0 Safari/537.36",
      },
    });

    // Extract XSRF-TOKEN from cookies
    const cookies = csrfResponse.headers["set-cookie"] || [];
    const xsrfCookie = cookies.find((cookie: string) => cookie.includes("XSRF-TOKEN"));
    if (!xsrfCookie) {
      return NextResponse.json({ error: "CSRF token not found" }, { status: 500 });
    }

    // Decode XSRF-TOKEN (remove URL encoding)
    const xsrfToken = decodeURIComponent(xsrfCookie.split("=")[1].split(";")[0]);

    // Step 2: Send login POST with CSRF token
    const loginResponse = await axios.post(
      "https://rblx.land/login",
      { username },
      {
        headers: {
          "Content-Type": "application/json",
          "X-XSRF-TOKEN": xsrfToken,
          "X-Requested-With": "XMLHttpRequest",
          Accept: "application/json, text/plain, */*",
          Origin: "https://rblx.land",
          Referer: "https://rblx.land/login",
          Cookie: cookies.join("; "),
          "User-Agent":
            "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/135.0.0.0 Safari/537.36",
        },
        withCredentials: true,
      }
    );
    console.log({ loginResponse: loginResponse.data });
    if (loginResponse.data.errors?.username) {
      return NextResponse.json(
        { error: loginResponse.data.errors?.username },
        { status: 401 }
      );
    }
    // Step 3: Process response
    const robloxUserId = loginResponse.data.userId || "unknown"; // Adjust based on actual response
    const sessionCookie = loginResponse.headers["set-cookie"]?.join("; ") || "";

    NextResponse.json(
      {
        message: "Roblox account linked",
        robloxUserId,
        cookie: sessionCookie,
        username,
      },
      { status: 200 }
    );

    // Simulate Roblox API login (replace with actual Roblox API call in production)
    const { success, cookie } = await simulateRobloxLogin(username, password);

    if (!success) {
      return NextResponse.json({ error: "Invalid credentials" }, { status: 401 });
    }

    // Generate a JWT token
    const token = jwt.sign(
      {
        username,
        robloxCookie: cookie,
        iat: Math.floor(Date.now() / 1000), // Issued at time
        jti: randomBytes(16).toString("hex"), // Unique token ID to prevent replay attacks },
      },
      process.env.JWT_SECRET!,
      {
        expiresIn: "1h", // Token expires in 1 hour
        algorithm: "HS256", // Use a secure algorithm
        notBefore: Math.floor(Date.now() / 1000), // Token not valid before now
      }
    );
    // 7. Set the JWT in a secure HttpOnly cookie
    const cookieOptions = {
      httpOnly: true, // Prevent XSS attacks
      secure: process.env.NODE_ENV === "production", // Use secure cookies in production
      sameSite: "strict" as const, // Prevent CSRF attacks
      path: "/",
      maxAge: 3600, // 1 hour in seconds
    };

    const authCookie = serialize("auth_token", token, cookieOptions);
    // Return the JWT and the cookie in the response
    return NextResponse.json(
      { token, cookie, username },
      {
        status: 200,
        headers: {
          "Set-Cookie": authCookie,
          "X-Content-Type-Options": "nosniff", // Prevent MIME-type sniffing
          "X-Frame-Options": "DENY", // Prevent clickjacking
          "X-XSS-Protection": "1; mode=block", // Enable XSS protection
          "Content-Security-Policy": "default-src 'self'", // Basic CSP
        },
      }
    );
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: "Invalid input", details: error.errors },
        { status: 400 }
      );
    }

    console.error("Login error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
