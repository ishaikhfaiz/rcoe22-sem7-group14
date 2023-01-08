import React, { useState, useEffect } from 'react'
import { AppBar, Button, Toolbar, Typography, Avatar } from '@mui/material';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useDispatch } from 'react-redux';

import useStyles from './styles';
import delveText from '../../images/delve.png';
import delveLogo from '../../images/delveLogo.png';

const Navbar = () => {
    const classes = useStyles();
    const [user, setUser] = useState(JSON.parse(localStorage.getItem('profile')));
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const location = useLocation();

    const logout = () => {
        dispatch({ type: 'LOGOUT' });
        navigate('/');
        setUser(null);
    }

    useEffect(() => {
        // const token = user?.token;
        // if (token){
        //     const decodedToken = decode(token);
        //     if(decodedToken.exp * 1000 < new Date().getTime()) logout(); 
        // }
        setUser(JSON.parse(localStorage.getItem('profile')))

    }, [location]);

    return (
        <AppBar className={classes.appBar} position="static" color="inherit" style={{ flexDirection: "row" }}>

            <Link to='/' className={classes.brandContainer}>
                <img src={delveText} alt='icon' height='45px' />
                <img className={classes.image} src={delveLogo} alt="icon" height="40px" />
            </Link>

            <Typography
                sx={{
                    mr: 1,
                    ml: 3,
                    display: { xs: 'flex', md: 'flex' },
                    flexGrow: 20,
                    justifyContent: 'flex-end',
                    alignItems: 'center',
                    
                }}
            >
                <Button size="small" component={Link} to="/itinerary" variant='outlined' color='secondary'>Itinerary Generator</Button>
            </Typography>

            <Typography
                sx={{
                    mr: 2,
                    display: { xs: 'flex', md: 'flex' },
                    flexGrow: 1,
                    justifyContent: 'flex-end',
                    alignItems: 'center',
                }}
            >
                <Button size="small" component={Link} to="/deals" variant='outlined' color='secondary'>Best Deals</Button>
            </Typography>

            <Toolbar className={classes.toolbar}>
                {user?.result ? (
                    <div className={classes.profile}>
                        <Avatar className={classes.purple} alt={user?.result.name} src={user?.result.picture}>{user?.result.name.charAt(0)}</Avatar>
                        <Typography className={classes.userName} varaint='h6'>{user?.result.name}</Typography>
                        <Button variant='contained' className={classes.logout} color="error" onClick={logout}>Logout</Button>
                    </div>
                ) : (
                    <Button component={Link} to="/auth" variant='contained' color='primary'>SIGN IN</Button>
                )}
            </Toolbar>

        </AppBar>
    )
}

export default Navbar