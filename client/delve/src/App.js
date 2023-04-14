import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Container } from '@mui/material';


import { createTheme, ThemeProvider } from '@mui/material/styles';
import Navbar from './components/Navbar/Navbar';
import Home from './components/Home/Home';
import PostDetails from './components/PostDetails/PostDetails';
import Auth from './components/Auth/Auth';
import { GoogleOAuthProvider } from '@react-oauth/google';
import Itinerary from './components/Itinerary/Itinerary';
import Deals from './components/Deals/Deals';

const App = () => {
  const theme = createTheme();
  const user = JSON.parse(localStorage.getItem('profile'));

  return (
    <GoogleOAuthProvider clientId='191034945696-8pdlgbungn0lhv4vgc80mfso29sr96kj.apps.googleusercontent.com'>
      <ThemeProvider theme={theme}>

        <BrowserRouter>
          <Container maxWidth="xl">

            <Navbar />
            <Routes>
              <Route path="/posts" exact element={<Home />} />
              <Route path="/" exact element={<Navigate replace to="/posts" />} />
              <Route path="/posts/search" exact element={<Home />} />
              <Route path="/posts/:id" element={<PostDetails />} />
              <Route path="/auth" exact element={(!user ? <Auth /> : <Navigate replace to="/posts" />)} />
              <Route path="/itinerary" exact element={<Itinerary/>} />
              <Route path="/deals" element={<Deals />} />
            </Routes>

          </Container>
        </BrowserRouter>

      </ThemeProvider>
    </GoogleOAuthProvider>
  )
}

export default App
