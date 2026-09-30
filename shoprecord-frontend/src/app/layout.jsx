import "./globals.css";
import { AuthProvider } from "../context/AuthContext.context";
import { CurrencyProvider } from "../context/CurrencyContext.context";

export const metadata = {
  title: "Shop Record",
  description: "Simple shop record management system",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body suppressHydrationWarning>
        <AuthProvider>
          <CurrencyProvider>
            {children}
          </CurrencyProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
