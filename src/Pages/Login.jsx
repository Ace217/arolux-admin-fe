import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom'; 
import BoxComponent from '../Components/Box';
import TypographyComponent from '../Components/Typography';
import InputComponent from '../Components/InputComponent';
import ButtonComponent from '../Components/Button';

export default function Login() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleLogin = async () => {
    try {
      // Clear previous errors
      setError('');
      
      // Send login request to backend
      const response = await fetch('http://3.137.118.155:8000/api/v1/admin/login', {
        method: 'POST',
        headers: {
          "Content-Type": "application/json", // Accept header
          "Access-Control-Allow-Origin": "*", // CORS settings
          "Md-Cli-App#J5kep": "J0vqsW7tHAhLf3US2xx3FTOCfQyDiS86", // Custom header
          "Md-Cli-Id": "web-usr", // Custom client ID header
          "Referrer": "https://arolux-admin-fe.vercel.app", // Referrer header
          "Sec-Ch-Ua": '"Google Chrome";v="131", "Chromium";v="131", "Not_A Brand";v="24"', // User agent hints
          "Sec-Ch-Ua-Mobile": "?0", // Indicates desktop or non-mobile
          "Sec-Ch-Ua-Platform": '"Windows"', // Platform used
          "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36", // Full user agent string
        },
        body: JSON.stringify({ email, password }),
      });

      // Handle the response
      const data = await response.json();
      if (response.ok) {
        // Save token to localStorage
        localStorage.setItem('token', data.token);

        // Navigate to the dashboard
        navigate('/dashboard');
      } else {
        // Show error message
        setError(data.message || 'Login failed. Please try again.');
      }
    } catch (err) {
      setError('Something went wrong. Please try again later.');
    }
  };

  return (
    <BoxComponent
      display={'flex'}
      alignItems="center"
      justifyContent="space-around"
      width="100%"
      height="100vh"
    >
      <BoxComponent
        borderRadius="15px"
        width="50%"
        height="60vh"
        overflow="hidden"
      >
        <img 
          style={{
            width: '100%',
            height: '100%'
          }}
          src="Images/main.png" alt="" 
        />
      </BoxComponent>
      <BoxComponent
        display='flex'
        flexDirection='column'
        alignItems='center'
        justifyContent='space-around'
        height="55vh"
        width="40%"
      >
        <img 
          width={'80%'}
          height={'100vh'}
          src="Images/logo.png" alt="" 
        />
        <TypographyComponent
          color="var(--dull)"
          fontFamily='var(--main)'
          fontWeight="700"
          fontSize="24px"
          marginTop='10px'
        >
          Login to your account
        </TypographyComponent>
        <BoxComponent width='80%'>
          <InputComponent
            variant='standard'
            label="E-mail"
            type='email'
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </BoxComponent>
        <BoxComponent width='80%'>
          <InputComponent
            variant='standard'
            label="Password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </BoxComponent>
        {error && (
          <TypographyComponent
            color="var(--danger)"
            fontFamily='var(--main)'
            fontSize="14px"
            margin='0px 65px'
            textAlign="center"
          >
            {error}
          </TypographyComponent>
        )}
        <ButtonComponent
          variant='contained'
          backgroundColor="var(--primary)"
          sx={{
            width: '50%',
            borderRadius: '50px',
            textTransform: 'none',
            padding: '8px',
            color: 'light',
            fontWeight: '700',
          }}
          onClick={handleLogin}
        >
          Login
        </ButtonComponent>
      </BoxComponent>
    </BoxComponent>
  );
}
