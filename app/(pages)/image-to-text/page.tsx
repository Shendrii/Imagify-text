"use client";

import React, { useState } from "react";
import {
  Button,
  Card,
  CircularProgress,
  Snackbar,
  Typography,
  CardContent,
} from "@mui/material";
import { useDropzone } from "react-dropzone";
import Image from "next/image";

const headerStyle = {
  color: "blue",
  textShadow: "2px 2px 4px rgba(0, 0, 0, 0.3)",
  fontWeight: "bold",
  textAlign: "center",
};

const ImageToTextPage = () => {
  const [image, setImage] = useState<File | null>(null);
  const [caption, setCaption] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const onDrop = (acceptedFiles: File[]) => {
    if (acceptedFiles.length > 0) {
      const file = acceptedFiles[0];
      if (
        file.size <= 5 * 1024 * 1024 &&
        (file.type === "image/jpeg" || file.type === "image/png")
      ) {
        setImage(file);
        setError(null);
      } else {
        setError(
          "Invalid file type or size. Please upload a JPG or PNG image under 5MB."
        );
      }
    }
  };

  const { getRootProps, getInputProps } = useDropzone({
    onDrop,
    accept: {
      "image/jpeg": [],
      "image/png": [],
    },
  });

  const generateCaption = async () => {
    if (!image) return;
    setLoading(true);
    try {
      const data = await image.arrayBuffer();
      const response = await fetch(
        "https://api-inference.huggingface.co/models/Salesforce/blip-image-captioning-base",
        {
          headers: {
            Authorization: `Bearer ${process.env.NEXT_PUBLIC_HUGGINGFACE_API_TOKEN}`,
            "Content-Type": "application/octet-stream",
          },
          method: "POST",
          body: data,
        }
      );
      const result = await response.json();
      setCaption(result[0]?.generated_text || "No caption generated.");
    } catch (error) {
      setError("Failed to generate caption. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const clearImage = () => {
    setImage(null);
    setCaption("");
  };

  return (
    <div style={{ padding: "20px", maxWidth: "800px", margin: "0 auto" }}>
      <Typography variant="h4" component="h1" gutterBottom sx={headerStyle}>
        Image-to-Text
      </Typography>
      <div
        {...getRootProps()}
        style={{
          border: "2px dashed #ccc",
          padding: "20px",
          textAlign: "center",
          marginBottom: "20px",
        }}
      >
        <input {...getInputProps()} />
        <Typography variant="body1" style={{ color: "black" }}>
          Drag n drop an image here, or click to select one
        </Typography>
      </div>
      {image && (
        <Card
          style={{
            marginTop: "20px",
            boxShadow: "0 4px 8px rgba(0,0,0,0.1)",
          }}
        >
          <CardContent>
            <div
              style={{ position: "relative", width: "100%", height: "300px" }}
            >
              <Image
                src={URL.createObjectURL(image)}
                alt="Preview"
                layout="fill"
                objectFit="contain"
              />
              <Button
                onClick={clearImage}
                variant="contained"
                color="secondary"
                style={{
                  position: "absolute",
                  bottom: "10px",
                  right: "10px",
                  zIndex: 1,
                }}
              >
                Clear Image
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
      <Button
        onClick={generateCaption}
        variant="contained"
        color="primary"
        disabled={loading || !image}
        style={{ marginTop: "20px" }}
      >
        {loading ? <CircularProgress size={24} /> : "Generate Caption"}
      </Button>
      {caption && (
        <Typography variant="h6" style={{ marginTop: "20px", color: "black" }}>
          {caption}
        </Typography>
      )}
      <Snackbar
        open={!!error}
        autoHideDuration={6000}
        onClose={() => setError(null)}
        message={error}
        ContentProps={{
          style: { color: "black" },
        }}
      />
    </div>
  );
};

export default ImageToTextPage;
