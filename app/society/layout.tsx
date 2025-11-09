import Footer from "@/components/Footer";
import Navbar from "@/components/Navbar";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
      <body>
        <Navbar />
        <main className="flex-1">{children}</main>
        <Footer />
      </body>
  );
}
