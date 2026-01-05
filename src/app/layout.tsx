import type { Metadata } from "next";
import "./globals.css";
import StoreProvider from '@/components/StoreProvider';

export const metadata: Metadata = {
  title: "Shipment Tracker",
  description: "Real-time shipment tracking with interactive map",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              try {
                const stored = localStorage.getItem('shipment-tracker-state');
                if (stored) {
                  const parsed = JSON.parse(stored);
                  if (parsed.state?.ui?.theme === 'dark') {
                    document.documentElement.classList.add('dark');
                  }
                }
              } catch (e) {}
            `,
          }}
        />
      </head>
      <body>
        <StoreProvider>
          {children}
        </StoreProvider>
      </body>
    </html>
  );
}