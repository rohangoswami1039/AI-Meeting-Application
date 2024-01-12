import React from 'react';
import Grid from '@mui/material/Grid';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import 'react-datepicker/dist/react-datepicker.css';
import Lottie from 'react-lottie';
import animationData from '../../../assets/animation_lm7t2cac.json'; // Replace with your animation file

const CreateMeeting = () => {

  const handleAuthorize = async () => {
    // Redirect the user to your backend's authorization route
    window.location.href = 'http://localhost:3000/zoomAuth/authorize';
  };

  
  const formStyle = {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    maxWidth: '400px',
    margin: 'auto',
    marginTop: '10vh', 
    padding: '20px',
    borderRadius: '10px',
    backgroundColor: 'rgba(255, 255, 255, 0.9)', // Semi-transparent white background for the form
    boxShadow: '0px 0px 10px rgba(0, 0, 0, 0.1)',
  };

  const animationOptions = {
    loop: true,
    autoplay: true,
    animationData,
  };

  return (
    <div style={{ background: '#2196F3', minHeight: '100vh', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
    <Grid container spacing={3}>
      <Grid item xs={12} md={6}>
        <Card style={formStyle}>
          <CardContent>
            <Typography variant="h5" component="div" gutterBottom>
              Authorize With Zoom
            </Typography>
            <form >
              <Button
                variant="contained"
                color="primary"
                size="large"
                fullWidth
                style={{ marginTop: '1rem' }}
                onClick={handleAuthorize}
              >
                Sign Up with Zoom 
              </Button>
            </form>
          </CardContent>
        </Card>
      </Grid>
      <Grid item xs={12} md={6}>
        <div style={{ maxWidth: '100%', display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
          <Lottie options={animationOptions} width={600} height={600} />
        </div>
      </Grid>
    </Grid>
  </div>
  );
};

export default CreateMeeting;
