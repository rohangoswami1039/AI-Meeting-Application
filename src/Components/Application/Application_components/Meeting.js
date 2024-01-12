import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { auth } from '../../../firebase';
import Lottie from 'react-lottie';
import Grid from '@mui/material/Grid'; // Import Grid component

import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import TextField from '@mui/material/TextField';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { Alert } from '@mui/material';

import animationData from '../../../assets/animation_lm7updws.json';

const Meeting = (props) => {
    const navigator = useNavigate();
    const payload = {
        role: 0,
        sdkKey:'fOM_9QF3TiG8ePNPVCmF9A',
        sdkSecret:'MaseUpFWt2oixqVUudVkXManxklNbllk',
        userName: `${auth.currentUser.displayName}`,
        userEmail: `${auth.currentUser.email}`,
        leaveUrl: 'http://localhost:3001/',
    };

    const [darkTheme, setDarkTheme] = useState(true);
    const [meetingNumber,set_meetingNumber]=useState('')
    const [passWord,set_passWord]=useState('')
    const [error,set_error]=useState('')

    const formStyle = {
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        maxWidth: '400px',
        margin: 'auto',
        marginTop: '20vh', 
        padding: '20px',
        borderRadius: '10px',
        backgroundColor: 'rgba(255, 255, 255, 0.9)', // Semi-transparent white background for the form
        boxShadow: '0px 0px 10px rgba(0, 0, 0, 0.1)',
      };

    const handle_join = ()=>{
        if(meetingNumber==='' || passWord===''){
            set_error("Please Enter the Meeting Number and password")
        }
        else {
            const updatedPayload = {
                ...payload,
                meetingNumber,
                passWord,
            }
            navigator('/join-meeting',{state: {payload: updatedPayload,}})
        }
    }
    const handle_create = ()=>{
        if(meetingNumber==='' || passWord===''){
            set_error("Please Enter the Meeting Number and password")
        }
        else {
            const updatedPayload = {
                ...payload,
                meetingNumber,
                passWord,
            }
            navigator('/create-meeting',{state: {payload: updatedPayload,}})
        }
    }


    const theme = createTheme({
        palette: {
            mode: darkTheme ? 'dark' : 'light',
            primary: {
                main: '#1976d2',
            },
            background: {
                default: darkTheme ? '#2196F3' : '#f2f2f2', // Different light color
            },
        },
    });

    const toggleTheme = () => {
        setDarkTheme(!darkTheme);
    };

    return (
        <Grid
        container
        style={{
            height: '100vh',
        }}
    >
        {/* Left Side: Lottie Animation */}
        <Grid
            item
            xs={12}
            sm={6} // On small screens, take the full width; on larger screens, take half width
            style={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                backgroundColor: '#2196F3',
                transition: 'background-color 0.3s ease',
            }}
        >
              <Card style={formStyle}>
                {/* ... rest of the card content ... */}
                <CardContent>
                        {error!=='' && <Alert severity='error' sx={{marginBottom:'15px'}}>{error}</Alert>}
                        <Typography variant="h5" component="div" sx={{ marginBottom: 2 }}>
                            Join the Meeting
                        </Typography>
                        <TextField fullWidth label="Meeting Number" variant="outlined" sx={{ marginBottom: 2 }} onChange={(e)=>{set_meetingNumber(e.currentTarget.value)}}/>
                        <TextField fullWidth label="Password" variant="outlined" type="password" sx={{ marginBottom: 2 }} onChange={(e)=>{set_passWord(e.currentTarget.value)}} />
                    </CardContent>
                    <CardActions sx={{ justifyContent: 'center' }}>
                        <Button variant="contained" color="primary" onClick={handle_join}>
                            Join Meeting
                        </Button>
                       
                    </CardActions>
            </Card>
            
        </Grid>

        {/* Right Side: Join Meeting Card */}
        <Grid
            item
            xs={12}
            sm={6} // On small screens, take the full width; on larger screens, take half width
            style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                backgroundColor: '#2196F3',
                boxShadow: '0px 2px 4px rgba(0, 0, 0, 0.1)',
            }}
        >
            <Lottie
                options={{
                    loop: true,
                    autoplay: true,
                    animationData: animationData,
                }}
                width={700}
                height={700}
            />
          
        </Grid>
    </Grid>
     
    );
};

export default Meeting;


/**
 * 
 * 
 * 
 * 
 * 
 * <div
                style={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    height: '100vh',
                    position: 'relative', 
                    backgroundColor: '#2196F3' ,
                    transition: 'background-color 0.3s ease', 
                }}
            >
                <Card
                    sx={{
                        maxWidth: 400,
                        border: '1px solid #ccc',
                        boxShadow: '0px 2px 4px rgba(0, 0, 0, 0.1)',
                        transition: 'box-shadow 0.3s ease',
                    }}
                >
                    <CardContent>
                        {error!=='' && <Alert severity='error' sx={{marginBottom:'15px'}}>{error}</Alert>}
                        <Typography variant="h5" component="div" sx={{ marginBottom: 2 }}>
                            Join the Meeting
                        </Typography>
                        <TextField fullWidth label="Meeting Number" variant="outlined" sx={{ marginBottom: 2 }} onChange={(e)=>{set_meetingNumber(e.currentTarget.value)}}/>
                        <TextField fullWidth label="Password" variant="outlined" type="password" sx={{ marginBottom: 2 }} onChange={(e)=>{set_passWord(e.currentTarget.value)}} />
                    </CardContent>
                    <CardActions sx={{ justifyContent: 'center' }}>
                        <Button variant="contained" color="primary" onClick={handle_join}>
                            Join Meeting
                        </Button>
                       
                    </CardActions>
                </Card>
                <div
                    style={{
                        position: 'absolute',
                        top: '50%',
                        left: '50%',
                        transform: 'translate(-50%, -50%)',
                        fontSize: '2rem',
                        fontWeight: 'bold',
                        color: 'rgba(255, 255, 255, 0.1)',
                        zIndex: -1,
                        animation: 'float 5s infinite', 
                    }}
                >
                    Silwalk
                </div>
            </div>
 * 
 * 
 * 
 * 
 * 
 * 
 */