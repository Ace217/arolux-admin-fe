import React, { useState } from "react";
import BoxComponent from "./Box";
import TypographyComponent from "./Typography";
import ButtonComponent from "./Button";
import Cookies from "js-cookie";
import { getFile } from "../api/constants";

const ImageComponent = ({ onImageUpload, imageType = "general-image" }) => {
  const defaultImage =
    "https://arolux-development.s3.us-east-2.amazonaws.com/vehicle-category-images/1000X1000/LEa8gL-1742942696.png";
  const [image, setImage] = useState(defaultImage);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const trimUrl = (url) => {
    // Find the first occurrence of a query parameter
    const queryIndex = url.indexOf("?");
    if (queryIndex !== -1) {
      return url.substring(0, queryIndex);
    }
    return url;
  };

  const uploadToUrl = async (file, url) => {
    try {
      const response = await fetch(url, {
        method: "PUT",
        body: file,
        headers: {
          "Content-Type": file.type, // Use the file's actual mime type
        },
      });

      if (!response.ok) {
        throw new Error("Failed to upload image to URL");
      }

      return true;
    } catch (error) {
      console.error("Error uploading to URL:", error);
      throw error;
    }
  };

  const handleImageChange = async (e) => {
    const file = e.target.files[0];

    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        setError("File size should be 5MB or less.");
        setImage(null);
        return;
      }

      try {
        setLoading(true);
        setError("");

        // Show preview immediately
        setImage(URL.createObjectURL(file));

        const token = Cookies.get("token");
        // Get file extension from the actual file
        const fileExt = file.type.split("/")[1];
        const response = await getFile(imageType, fileExt, token);

        if (response?.data?.data?.url) {
          const fullUrl = response.data.data.url;
          const trimmedUrl = trimUrl(fullUrl);

          // Upload the file to the full URL
          await uploadToUrl(file, fullUrl);

          // Pass the trimmed URL to the parent component
          onImageUpload(trimmedUrl);
        } else {
          throw new Error("Failed to get image URL");
        }
      } catch (error) {
        console.error("Error in image upload process:", error);
        setError("Failed to process image. Please try again.");
        setImage(defaultImage);
      } finally {
        setLoading(false);
      }
    }
  };

  return (
    <BoxComponent
      width="90%"
      display="flex"
      flexDirection="column"
      alignItems="left"
      gap={1}
    >
      <ButtonComponent
        variant="contained"
        component="label"
        disabled={loading}
        sx={{
          backgroundColor: "var(--primary)",
          color: "var(--light)",
          textTransform: "none",
          fontWeight: "600",
          padding: "10px",
          "&:hover": { backgroundColor: "var(--primary)" },
        }}
      >
        {loading ? "Processing..." : "Upload Picture Here"}
        <input
          type="file"
          accept="image/*"
          hidden
          onChange={handleImageChange}
        />
      </ButtonComponent>

      <BoxComponent>
        <BoxComponent
          width="100%"
          height={200}
          display="flex"
          alignItems="center"
          justifyContent="center"
          border="1px solid #ccc"
          borderRadius="8px"
          overflow="hidden"
        >
          {image ? (
            <img
              src={image}
              alt="Preview"
              style={{ width: "100%", height: "100%", objectFit: "cover" }}
            />
          ) : (
            <TypographyComponent variant="caption" color="textSecondary">
              No image selected
            </TypographyComponent>
          )}
        </BoxComponent>

        {error && (
          <TypographyComponent color="error" variant="body2">
            {error}
          </TypographyComponent>
        )}
      </BoxComponent>
    </BoxComponent>
  );
};

export default ImageComponent;
