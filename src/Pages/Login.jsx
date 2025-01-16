import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import BoxComponent from '../Components/Box';
import TypographyComponent from '../Components/Typography';
import InputComponent from '../Components/InputComponent';
import ButtonComponent from '../Components/Button';
import { login } from '../api/api';

export default function Login() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleLogin = async () => {
    try {
      setError('');  // Clear previous errors

      const body = { email, password };

      // Send login request to backend using login function from api.js
      const response = await login(body);

      if (response?.data?.success) {
        localStorage.setItem('token', response.data.data.accessToken);
        navigate('/dashboard');
      } else {
        setError(response?.data?.message || 'Login failed. Please try again.');
      }
    } catch (err) {
      console.error("Error logging in:", err);  // Detailed error logging
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
            height: '100%',
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
