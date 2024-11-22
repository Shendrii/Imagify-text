"use client";

import {
  AppBar,
  Toolbar,
  Button,
  Box,
  Typography,
  useMediaQuery,
} from "@mui/material";
import Link from "next/link";
import { usePathname } from "next/navigation";

export default function Navbar() {
  const currentPath = usePathname();
  const isMobile = useMediaQuery("(max-width:600px)");

  return (
    <AppBar
      position="static"
      sx={{
        backgroundColor: "white",
        boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
        display: isMobile ? "none" : "block",
      }}
    >
      <Toolbar sx={{ justifyContent: "space-between" }}>
        <Typography variant="h6" sx={{ fontWeight: "bold", color: "blue" }}>
          ImagifyText
        </Typography>
        <Box sx={{ display: "flex", gap: 2 }}>
          <Link href="/" passHref>
            <Button
              variant={currentPath === "/" ? "contained" : "text"}
              color="primary"
              sx={{ textTransform: "capitalize" }}
            >
              Text-to-Image
            </Button>
          </Link>
          <Link href="/image-to-text" passHref>
            <Button
              variant={currentPath === "/image-to-text" ? "contained" : "text"}
              color="primary"
              sx={{ textTransform: "capitalize" }}
            >
              Image-to-Text
            </Button>
          </Link>
        </Box>
      </Toolbar>
    </AppBar>
  );
}
