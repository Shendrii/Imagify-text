"use client";

import {
  Box,
  Drawer,
  IconButton,
  List,
  ListItem,
  Button,
  Typography,
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

export default function NavDrawer() {
  const [isOpen, setIsOpen] = useState(false);
  const currentPath = usePathname();

  const menuItems = [
    { text: "Text-to-Image", href: "/" },
    { text: "Image-to-Text", href: "/image-to-text" },
  ];

  return (
    <Box sx={{ display: { xs: "flex", md: "none" }, alignItems: "center" }}>
      <Typography
        variant="h6"
        sx={{ fontWeight: "bold", color: "blue", flexGrow: 1 }}
      >
        ImagifyText
      </Typography>
      <IconButton
        size="large"
        edge="start"
        color="inherit"
        aria-label="menu"
        sx={{ color: "black" }}
        onClick={() => setIsOpen(true)}
      >
        <MenuIcon />
      </IconButton>

      <Drawer
        anchor="right"
        open={isOpen}
        onClose={() => setIsOpen(false)}
        PaperProps={{
          sx: {
            backgroundColor: "white",
            color: "black",
          },
        }}
      >
        <Box
          sx={{ width: 250, padding: 2 }}
          role="presentation"
          onClick={() => setIsOpen(false)}
        >
          <List>
            {menuItems.map((item) => (
              <ListItem key={item.text} sx={{ padding: "8px 0" }}>
                <Link
                  href={item.href}
                  style={{
                    textDecoration: "none",
                    width: "100%",
                    color: "black",
                  }}
                >
                  <Button
                    fullWidth
                    variant={currentPath === item.href ? "contained" : "text"}
                    color="primary"
                    sx={{
                      justifyContent: "flex-start",
                      textTransform: "capitalize",
                      color: "black",
                    }}
                  >
                    {item.text}
                  </Button>
                </Link>
              </ListItem>
            ))}
          </List>
        </Box>
      </Drawer>
    </Box>
  );
}
