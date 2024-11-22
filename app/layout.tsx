"use client";

import { Inter } from "next/font/google";
import "./globals.css";
import { ThemeProvider, createTheme, useMediaQuery } from "@mui/material";
import Navbar from "./components/Navbar";
import NavDrawer from "./components/NavDrawer";
import { defaultMetadata } from "./metadata";

const inter = Inter({ subsets: ["latin"] });

const theme = createTheme({
  palette: {
    primary: {
      main: "#003a8c",
    },
  },
});

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  return (
    <html lang="en">
      <head>
        <title>{String(defaultMetadata.title ?? "Default Title")}</title>
        <meta
          name="description"
          content={defaultMetadata.description ?? "Default Description"}
        />
        {/* Add more metadata fields as needed */}
      </head>
      <body className={inter.className}>
        <ThemeProvider theme={theme}>
          <header>{isMobile ? <NavDrawer /> : <Navbar />}</header>
          <main
            style={{
              maxWidth: "1200px",
              width: "100%",
              margin: "0 auto",
              padding: "20px",
              minHeight: "calc(100vh - 200px)",
            }}
          >
            {children}
          </main>
          <footer
            style={{
              textAlign: "center",
              padding: "20px",
              color: "gray",
            }}
          >
            © 2024 ImagifyText SKY
          </footer>
        </ThemeProvider>
      </body>
    </html>
  );
}
