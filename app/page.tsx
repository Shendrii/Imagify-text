"use client";

import React, { useState } from "react";
import Image from "next/image";
import {
  TextField,
  Button,
  Card,
  CardContent,
  CircularProgress,
  IconButton,
  Grid,
  Typography,
} from "@mui/material";
import {
  Image as ImageIcon,
  Refresh as RefreshIcon,
  ContentCopy as ContentCopyIcon,
  Save as SaveIcon,
} from "@mui/icons-material";

const headerStyle = {
  color: "blue",
  textShadow: "2px 2px 4px rgba(0, 0, 0, 0.3)",
  fontWeight: "bold",
  textAlign: "center",
};

const TextToImagePage = () => {
  const [inputText, setInputText] = useState("");
  const [imageSrc, setImageSrc] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [generatedImages, setGeneratedImages] = useState<string[]>([]);

  const query = async (data: { inputs: string }) => {
    const response = await fetch(
      "https://api-inference.huggingface.co/models/ZB-Tech/Text-to-Image",
      {
        headers: {
          Authorization: `Bearer ${process.env.NEXT_PUBLIC_HUGGINGFACE_API_TOKEN}`,
          "Content-Type": "application/json",
        },
        method: "POST",
        body: JSON.stringify(data),
      }
    );
    const result = await response.blob();
    return result;
  };

  const handleGenerateImage = async () => {
    setLoading(true);
    try {
      const imageBlob = await query({ inputs: inputText });
      const imageUrl = URL.createObjectURL(imageBlob);
      setImageSrc(imageUrl);
      setGeneratedImages((prev) => {
        const newImages = [...prev, imageUrl];
        if (newImages.length > 3) {
          newImages.shift(); // Remove the oldest image if more than 3
        }
        return newImages;
      });
    } catch (error) {
      console.error("Error generating image:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setInputText("");
    setImageSrc(null);
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(inputText);
  };

  const handleSave = (src: string) => {
    const link = document.createElement("a");
    link.href = src;
    link.download = `${inputText}.png`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div style={{ padding: "20px", maxWidth: "800px", margin: "0 auto" }}>
      <Typography variant="h4" component="h1" gutterBottom sx={headerStyle}>
        Text-to-Image
      </Typography>
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          gap: "20px",
          alignItems: "center",
        }}
      >
        <TextField
          label="Describe your image"
          variant="outlined"
          fullWidth
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
        />
        <div style={{ display: "flex", gap: "10px" }}>
          <Button
            variant="contained"
            color="primary"
            onClick={handleGenerateImage}
            disabled={loading}
            startIcon={<ImageIcon />}
          >
            {loading ? <CircularProgress size={24} /> : "Generate Image"}
          </Button>
          <IconButton onClick={handleReset} color="secondary">
            <RefreshIcon />
          </IconButton>
          <IconButton onClick={handleCopy} color="default">
            <ContentCopyIcon />
          </IconButton>
        </div>
      </div>
      {imageSrc && (
        <Card
          style={{ marginTop: "20px", boxShadow: "0 4px 8px rgba(0,0,0,0.1)" }}
        >
          <CardContent>
            <div
              style={{ position: "relative", width: "100%", height: "400px" }}
            >
              <Image
                src={imageSrc}
                alt="Generated"
                layout="fill"
                objectFit="contain"
              />
              <Button
                variant="contained"
                color="primary"
                startIcon={<SaveIcon />}
                onClick={() => handleSave(imageSrc)}
                style={{
                  position: "absolute",
                  bottom: "10px",
                  right: "10px",
                  zIndex: 1,
                }}
              >
                Save
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
      <Grid container spacing={2} style={{ marginTop: "20px" }}>
        {generatedImages.map((src, index) => (
          <Grid item xs={12} sm={4} key={index}>
            <Card
              style={{
                boxShadow: "0 4px 8px rgba(0,0,0,0.1)",
                cursor: "pointer",
                transition: "transform 0.2s",
              }}
              onClick={() => handleSave(src)}
            >
              <CardContent>
                <div
                  style={{
                    position: "relative",
                    width: "100%",
                    height: "200px",
                    overflow: "hidden",
                  }}
                >
                  <Image
                    src={src}
                    alt={`Generated ${index}`}
                    layout="fill"
                    objectFit="cover"
                  />
                </div>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </div>
  );
};

export default TextToImagePage;
