import React, { useState } from 'react';
import TextField from '@mui/material/TextField';
import IconButton from '@mui/material/IconButton';
import { Visibility, VisibilityOff } from '@mui/icons-material';

const InputComponent = ({ label, value, onChange, variant, type = 'text' }) => {
  const [showPassword, setShowPassword] = useState(false);

  // Function to toggle password visibility
  const togglePasswordVisibility = () => {
    setShowPassword((prev) => !prev);
  };

  return (
    <TextField
      label={label}
      value={value}
      onChange={onChange}
      variant={variant}
      type={type === 'password' && !showPassword ? 'password' : 'text'} // Toggle between 'password' and 'text'
      fullWidth
      required
      InputProps={{
        endAdornment: type === 'password' && (
          <IconButton
            onClick={togglePasswordVisibility}
            edge="end"
            aria-label="toggle password visibility"
          >
            {showPassword ? <VisibilityOff /> : <Visibility />}
          </IconButton>
        ),
      }}
    />
  );
};

export default InputComponent;
