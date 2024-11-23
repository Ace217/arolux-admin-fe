import React from 'react';
import { Box as MUIBox } from '@mui/material';
import './Theming.css';
export default function BoxComponent(props) {
  return (
    <MUIBox {...props}>
      {props.children}
    </MUIBox>
  );
}
