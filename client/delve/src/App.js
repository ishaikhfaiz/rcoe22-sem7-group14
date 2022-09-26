import React, { useEffect } from 'react';
import { Container, AppBar, Typography, Grow, Grid } from '@mui/material';

import { useDispatch } from 'react-redux';
import { getPosts } from './actions/posts';

// import delve-logo from './images/delve-logo.png';
import Posts from './components/Posts/Posts';
import Form from './components/Form/Form';

import { createTheme, ThemeProvider } from '@mui/material/styles';
import useStyles from './styles';

const App = () => {
  const theme = createTheme();
  const classes = useStyles();
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(getPosts());
  }, [dispatch])

  return (
    <ThemeProvider theme={theme}>
      <Container maxWidth="lg">
        <AppBar className={classes.appBar} position="static" color="inherit">
          <Typography className={classes.heading} variant="h2" align='center'>DELVE</Typography>
          {/* <img className={classes.image} src="{delve-logo}" alt="DelveLogo" height="60"/> */}
        </AppBar>

        <Grow in>
          <Container>
            <Grid container justify="space-between" alignItems="stretch" spacing={3}>
              <Grid item xs={12} sm={7}><Posts /></Grid>
              <Grid item xs={12} sm={4}><Form /></Grid>
            </Grid>
          </Container>
        </Grow>

      </Container>
    </ThemeProvider>
  )
}

export default App