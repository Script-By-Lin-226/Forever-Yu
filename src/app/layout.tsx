import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Forever Yu",
  description: "A beautiful interactive letter made with love.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      </head>
      <body>
        <div className="bg-animation">
          {[...Array(20)].map((_, i) => (
            <div key={i} className={`floating-bg-heart heart-${i}`}>❤️</div>
          ))}
        </div>
        {children}
      </body>
    </html>
  );
}
