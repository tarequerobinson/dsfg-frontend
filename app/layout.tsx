import "./globals.css";
import { Inter } from "next/font/google";
import { cookies } from "next/headers";
import { Providers } from "./providers";
import { ClientLayout } from "./ClientLayout";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "DSFG - The Dollars and Sense Financial Group",
  description: "Consolidate and monitor your assets in one place",
  generator: 'v0.dev'
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const cookieStore = cookies();
  const isLoggedIn = cookieStore.get("auth")?.value === "true";

  return (
    <html lang="en">
      <body className={inter.className}>
        <Providers>
          <ClientLayout isLoggedIn={isLoggedIn}>
            {children}
          </ClientLayout>
        </Providers>
      </body>
    </html>
  );
}