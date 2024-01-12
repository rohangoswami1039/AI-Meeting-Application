import React, { useState } from "react";
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import { useAuth } from "./Context/Auth_Context";
import { useNavigate } from "react-router-dom";
import { Alert } from "@mui/material";
import Lottie from 'react-lottie';
import * as animationData from './../../assets/animation_lll8i17c.json'


function Email_verification(props){
    console.log(props)
    const {loading,Send_Email_verify,Delete_signin_function}= useAuth()
    
    const defaultOptions = {
        loop: true,
        autoplay: true, 
        animationData: animationData,
        rendererSettings: {
          preserveAspectRatio: 'xMidYMid slice'
        }
    }
    const handle_submit = async ()=>{
    
    }
    return (
    <>
    <div className="container_Sing_up">
        <div className="top"></div>
        <div className="bottom"></div>
        <div className="center">
        <Card sx={{ maxWidth: 545,boxShadow:'15px 15px 15px 8px rgba(0, 0, 0, 0.25)', }}>
        <Lottie options={defaultOptions}
              height={100}
              width={100}/>
            <CardContent>
                <Typography gutterBottom variant="h5" component="div">
                Verify Your Email 
                </Typography>
                <Typography variant="body2" color="text.secondary">
                Please verify the email to proceed and make sure you check the spam section also. If you did not find the email.
                </Typography>
            </CardContent>
            <CardActions>
                <Button onClick={()=>{Delete_signin_function()}} size="small">Sign Out</Button>
                <Button disabled={loading} onClick={()=>{Send_Email_verify()}} variant="contained" size="small">Send Email</Button>
            </CardActions>
        </Card>        
        </div>
            
        </div>
        <div className='sil'>SIL</div>
    <div className='walk'>WALK</div>
    </>
    )
}
export default Email_verification;
