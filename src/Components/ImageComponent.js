import React, { useState } from "react";
import BoxComponent from "./Box";
import TypographyComponent from "./Typography";
import ButtonComponent from "./Button";
import Cookies from "js-cookie";

const ImageComponent = ({ onImageUpload }) => {
  const defaultImage =
    "https://arolux-development.s3.us-east-2.amazonaws.com/vehicle-category-images/1000X1000/LEa8gL-1742942696.png";
  const [image, setImage] = useState(defaultImage);
  const [error, setError] = useState("");
  const [uploading, setUploading] = useState(false);

  const uploadImage = async (file) => {
    const formData = new FormData();
    formData.append("image", file);

    try {
      setUploading(true);
      const token = Cookies.get("token");
      const response = await fetch(
        `${process.env.REACT_APP_BASE_URL}/admin/upload-image`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
          },
          body: formData,
        }
      );

      if (response.ok) {
        const data = await response.json();
        return data.url; // Assuming the API returns the image URL
      } else {
        throw new Error("Image upload failed");
      }
    } catch (error) {
      console.error("Error uploading image:", error);
      setError("Failed to upload image. Please try again.");
      return null;
    } finally {
      setUploading(false);
    }
  };

  const handleImageChange = async (e) => {
    const file = e.target.files[0];

    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        setError("File size should be 5MB or less.");
        setImage(null);
      } else {
        setError("");
        setImage(URL.createObjectURL(file));

        const imageUrl = await uploadImage(file);
        if (imageUrl && onImageUpload) {
          onImageUpload(imageUrl);
        }
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
        disabled={uploading}
        sx={{
          backgroundColor: "var(--primary)",
          color: "var(--light)",
          textTransform: "none",
          fontWeight: "600",
          padding: "10px",
          "&:hover": { backgroundColor: "var(--primary)" },
        }}
      >
        {uploading ? "Uploading..." : "Upload Picture Here"}
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
