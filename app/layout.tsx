import "./globals.css";
import Navbar from "@/app/components/Navbar";
import Footer from "@/app/components/Footer";

export const metadata = {
  title: "GymPortal",
  description: "Smart gym management system",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="bg-gray-950 text-white">
        <Navbar />
        {children}
        <Footer />
      </body>
    </html>
  );
}
