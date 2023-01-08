import React, { useState } from 'react'
import { useGoogleLogin } from '@react-oauth/google';
import axios from 'axios';
import { Avatar, Button, Paper, Grid, Typography, Container } from '@mui/material';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import { useDispatch } from 'react-redux';
import { useNavigate } from "react-router-dom";
import useStyles from './styles';
import Input from './Input';
import Icon from './Icon';
import { signin, signup } from '../../actions/auth';

const Auth = () => {
  const classes = useStyles();

  const initialState = { firstName: '', lastName: '', email: '', password: '', confirmPassword: '' };
  const [formData, setFormData] = useState(initialState);

  const [isSignup, setIsSignup] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();

    if (isSignup) {
      dispatch(signup(formData, navigate))
    } else {
      dispatch(signin(formData, navigate))
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });

  };

  // const googleSuccess = async (res) => {
  //   const decoded = jwt_decode(res.credential);
  //   const result = decoded;

  //   try {
  //     dispatch({ type: 'AUTH', data: { result } });
  //     navigate('/');
  //   } catch (error) {
  //     console.log(error);
  //   }
  // };




  const switchMode = () => {
    setIsSignup((prevIsSignup) => !prevIsSignup);
    setShowPassword(false);
  };

  const handleShowPassword = () => setShowPassword((prevShowPassword) => !prevShowPassword);


  const login = useGoogleLogin({
    onSuccess: async (tokenResponse) => {
      const userInfo = await axios.get(
        'https://www.googleapis.com/oauth2/v3/userinfo',
        { headers: { Authorization: `Bearer ${tokenResponse.access_token}` } },
      );
      const result = userInfo.data;
      const token = tokenResponse.access_token;
      dispatch({ type: 'AUTH', data: { result, token} });
      navigate('/');
    },
    onError: errorResponse => console.log(errorResponse),
  }
  );


  return (
    <Container component="main" maxWidth="xs">
      <Paper className={classes.paper} elevation={3}>

        <Avatar className={classes.avatar}>
          <LockOutlinedIcon />
        </Avatar>

        <Typography variant='h5'>{isSignup ? 'CREATE ACCOUNT' : 'LOGIN'}</Typography>

        <form className={classes.form} onSubmit={handleSubmit}>
          <Grid container spacing={3}>
            {
              isSignup && (
                <>
                  <Input name='firstName' label='First Name' handleChange={handleChange} half />
                  <Input name='lastName' label='Last Name' handleChange={handleChange} half />
                </>
              )
            }
            <Input name='email' label="Email Address" handleChange={handleChange} type="email" />
            <Input name='password' label="Password" handleChange={handleChange} type={showPassword ? "text" : "password"} handleShowPassword={handleShowPassword} />
            {isSignup && <Input name="confirmPassword" label="Repeat Password" handleChange={handleChange} type='password' />}
          </Grid>


          <Button sx={{ mt: 3, mb: 1 }} type='Submit' fullWidth variant='contained' color='primary' className={classes.submit}>
            {isSignup ? 'Sign Up' : 'Sign In'}
          </Button>


          <Button fullWidth className={classes.googleButton} color="primary" onClick={()=> login()} startIcon={<Icon />} variant="contained">
            Google Sign In
          </Button>



          <Grid container justify="flex-end">
            <Grid item>
              <Button sx={{ mt: 1 }} onClick={switchMode}>
                {isSignup ? "Already have an Account? Sign In" : "Don't have an Account? Sign Up"}
              </Button>
            </Grid>
          </Grid>

        </form>

      </Paper>

    </Container >
  )
}

export default Auth