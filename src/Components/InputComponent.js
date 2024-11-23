import * as React from 'react';
import TextField from '@mui/material/TextField';
import InputAdornment from '@mui/material/InputAdornment';
import IconButton from '@mui/material/IconButton';
import { Visibility, VisibilityOff } from '@mui/icons-material';
import BoxComponent from './Box';

export default function InputComponent(props) {
  const [showPassword, setShowPassword] = React.useState(false);

  const handleTogglePasswordVisibility = () => {
    setShowPassword((prev) => !prev);
  };

  return (
    <BoxComponent
      component="form"
      sx={{ '& > :not(style)': { width: '100%' } }}
      noValidate
      autoComplete="off"
    >
      <TextField
        required
        id="filled-basic"
        label={props.label}
        variant={props.varient}
        type={props.type === 'password' && showPassword ? 'text' : props.type}
        InputProps={
          props.type === 'password'
            ? {
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      onClick={handleTogglePasswordVisibility}
                      edge="end"
                    >
                      {showPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                ),
              }
            : undefined
        }
        sx={{
          '& .MuiInput-underline:before': {
            borderBottomColor: 'var(--primary)', // Underline color when unfocused
          },
          '& .MuiInput-underline:hover:not(.Mui-disabled):before': {
            borderBottomColor: 'var(--primary)', // Underline color on hover
          },
          '& .MuiInput-underline:after': {
            borderBottomColor: 'var(--primary)', // Underline color when focused
          },
          '& .MuiInputLabel-root.Mui-focused': {
            color: 'var(--primary)', // Label color when focused
          },
        }}
      />
    </BoxComponent>
  );
}
