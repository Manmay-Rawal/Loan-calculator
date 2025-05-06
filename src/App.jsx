import React from 'react';
import { Box, Typography } from '@mui/material';
import Calculator from './components/Calculator';
import Navbar from './components/navbar';

const App = () => {
  return (
    <Box sx={{ width: '100vw', height: '100vh', p: 4, boxSizing: 'border-box' }}>
      <Navbar  />
      <Typography variant="h4" align="center" gutterBottom>
        Loan Calculator
      </Typography>
      <Calculator />
    </Box>
  );
};

export default App;
