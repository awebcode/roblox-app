import localFont from "next/font/local";
import {Inter, Poppins} from "next/font/google";
export const inter = Poppins({ subsets: ["latin"], weight: ["300", "400", "500", "600", "700", "800", "900"] });
export const geistSansL = localFont({
  src: "./GothamLight.ttf",
  variable: "--gotham-light",
  weight: "100",
});
export const geistSans = localFont({
  src: "./GothamBold.ttf",
  variable: "--gotham-bold",
  weight: "500",
});
export const geistMono = localFont({
  src: "./GothamMedium.ttf",
  variable: "--gotham-medium",
  weight: "700",
});
