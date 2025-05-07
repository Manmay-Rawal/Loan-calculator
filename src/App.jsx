import { BrowserRouter} from 'react-router-dom'
import UseRoutes from './Router/UseRoutes.jsx'
import React from 'react'
import { Box } from '@mui/material';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';

const darkTheme = createTheme({
  palette: {
    mode: 'dark',
  },
});

function App() {

  return (
    <ThemeProvider theme={darkTheme}>
      <CssBaseline />
    <Box sx={{ width: '100vw', height: '100vh', boxSizing: 'border-box' }}>
     <BrowserRouter>
     <UseRoutes/>
     </BrowserRouter>
     </Box>
     </ThemeProvider>
  )
}

export default App
