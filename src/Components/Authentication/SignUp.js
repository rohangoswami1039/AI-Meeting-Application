import React, { useState } from 'react';
import './Signup.css';
import { Alert, Button } from '@mui/material';
import { useAuth } from './Context/Auth_Context';
import {  useNavigate } from 'react-router-dom';


function SignUp() {
  const {createUser,loading,error,success}= useAuth()

  const [email,set_email]=useState('')
  const [name,set_name]=useState('')
  const [password,set_password]=useState('')
  const [confirm_password,set_confirm_password]=useState('')
  const [Error,set_Error]=useState('')
  const navigator = useNavigate()

  
  const handle_submit = async ()=>{
    createUser(email,password,name,confirm_password)
  }


  return (
    <>
    <div className="container_Sing_up">
      <div className="top"></div>
      <div className="bottom"></div>
      <div className="center">
        <h2>Please Sign In</h2>
        {error!='' && <Alert severity="error">{error}</Alert>}
        {success!='' && <Alert severity="success">{success}</Alert>}
        <input type="text" placeholder="Name" onChange={(e)=>{set_name(e.target.value)}}/>
        <input type="email" placeholder="email" onChange={(e)=>{set_email(e.target.value)}}/>
        <input type="password" placeholder="password" onChange={(e)=>{set_password(e.target.value)}}/>
        <input type="text" placeholder="Confirm Password" onChange={(e)=>{set_confirm_password(e.target.value)}} />
      <div style={{marginTop:'10px',width:'100%',display:'flex',justifyContent:'center'}}>
        <Button  sx={{backgroundColor:'#2e2c2c',width:'70%'}} disabled={loading} onClick={handle_submit} variant="contained">{loading?'Loading...':'Sign Up'}</Button>   
        </div>
        <Button sx={{marginTop:'25px'}} onClick={()=>{navigator('/')}} variant='outlined'>Login</Button>
      </div>
        
    </div>
    
      <div className='sil'>SIL</div>
      <div className='walk'>WALK</div>
    </>
    
  );
}

export default SignUp;

