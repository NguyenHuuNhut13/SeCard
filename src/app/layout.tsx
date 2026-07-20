import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "@/context/AuthContext";
import { ThemeProvider } from "@/context/ThemeContext";
import { SidebarProvider } from "@/context/SidebarContext";

const inter = Inter({
  variable: "--font-outfit", // We keep the variable name so Tailwind's font-outfit class works
  subsets: ["latin", "vietnamese"], // Explicitly load vietnamese subset
});

export const metadata: Metadata = {
  title: "NKS Secard System - Quản lý Ecard thành viên",
  description: "Hệ thống quản lý thông tin thành viên và Ecard điện tử thông minh.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="vi" className={inter.variable}>
      <head>
        <link
          rel="stylesheet"
          href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css"
          integrity="sha512-iecdLmaskl7CVkqkXNQ/ZH/XLlvWZOJyj7Yy7tcenmpD1ypASozpmT/E0iPtmFIB46ZmdtAc9eNBvH0H/ZpiBw=="
          crossOrigin="anonymous"
          referrerPolicy="no-referrer"
          precedence="default"
        />
      </head>
      <body>
        <ThemeProvider>
          <SidebarProvider>
            <AuthProvider>
              {children}
            </AuthProvider>
          </SidebarProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
