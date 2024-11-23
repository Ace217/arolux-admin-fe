import React from 'react';
import { useNavigate } from 'react-router-dom'; 
import BoxComponent from './Components/Box';
import TypographyComponent from './Components/Typography';
import InputComponent from './Components/InputComponent';
import ButtonComponent from './Components/Button';

export default function Login() {
  const navigate = useNavigate(); 
  const handleLogin = () => {
    // Here you can add your login logic if needed
    navigate('dashboard'); 
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
        varient='standard'
          label="E-mail"
        /></BoxComponent>
        <BoxComponent width='80%'>
        <InputComponent
        varient='standard'
          label="Password"
          type='password'
        /></BoxComponent>
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

