import type { Metadata } from "next";
import { StoreProvider } from "@/store/provider";
import "./globals.css";

export const metadata: Metadata = {
  title: "HR Management System",
  description: "A shared HR management system starter",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en">
      <body>
        <StoreProvider>{children}</StoreProvider>
      </body>
    </html>
  );
}
