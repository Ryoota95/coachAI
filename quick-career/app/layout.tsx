import Navbar from "./components/Navbar";
import Providers from "./providers";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "QuickCareer AI - CV Analysis & Mock Interview",
  description: "AI-powered CV review and interview preparation",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <Providers>
          <Navbar />
          {children}
        </Providers>
      </body>
    </html>
  );
}