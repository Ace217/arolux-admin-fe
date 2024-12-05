import React, { useState } from "react";
import BoxComponent from "./Box";
import TypographyComponent from "./Typography";
import ButtonComponent from "./Button";

const ImageComponent = () => {
  const [image, setImage] = useState(null);
  const [error, setError] = useState("");

  const handleImageChange = (e) => {
    const file = e.target.files[0];

    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        setError("File size should be 5MB or less.");
        setImage(null);
      } else {
        setError("");
        setImage(URL.createObjectURL(file));
      }
    }
  };

  return (
    <BoxComponent width='90%' display="flex" flexDirection="column" alignItems="left" gap={1}>
      

      {/* Upload Button */}
      <ButtonComponent
        variant="contained"
        component="label"
        sx={{
          backgroundColor: "var(--primary)",
          color: "var(--light)",
          textTransform:'none',
          fontWeight:'600',
          padding:'10px',
          "&:hover": { backgroundColor: "var(--primary)" }
        }}
      >
        Upload Picture Here
        <input
          type="file"
          accept="image/*"
          hidden
          onChange={handleImageChange}
        />
      </ButtonComponent>

     <BoxComponent>
     {/* <TypographyComponent variant="caption" color="textSecondary">
        Maximum file size: 5MB
      </TypographyComponent> */}
{/* Image Preview */}
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
          <img src={image} alt="Preview" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
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

      {/* Error Message */}
     
    </BoxComponent>
  );
};

export default ImageComponent;
