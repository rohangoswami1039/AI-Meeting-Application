import './login.css';
import { useState } from 'react';
import { useAuth } from './Context/Auth_Context';
import { Alert, Button } from '@mui/material';
import { useNavigate } from 'react-router-dom';



function Login() {
  const {loading,login_error,login_success,Login_user}= useAuth()
  const navigator = useNavigate()
  const [email,set_email]=useState('')
  const [password,set_password]=useState('')

  const handle_submit = async ()=>{
    Login_user(email,password)
  }

  return (
<>
    <div className="container_Sing_up">
      <div className="top"></div>
      <div className="bottom"></div>
      <div className="center">
        <h2>Please Login</h2>
        {login_error!=='' && <Alert severity="error">{login_error}</Alert>}
        {login_success!=='' && <Alert severity="success">{login_success}</Alert>}
        <input type="email" placeholder="email" onChange={(e)=>{set_email(e.target.value)}} />
        <input type="password" placeholder="password" onChange={(e)=>{set_password(e.target.value)}}/>
      <div style={{marginTop:'10px',width:'100%',display:'flex',justifyContent:'center'}}>
        <Button  sx={{backgroundColor:'#2e2c2c',width:'70%'}} disabled={loading} onClick={handle_submit} variant="contained">{loading?'Loading...':'Login'}</Button>   
        </div>
        <Button sx={{marginTop:'25px'}} variant='text' onClick={()=>{navigator('/Signup')}} >Don't have an account ?</Button>
      </div>
        
    </div>
    <div className='sil'>SIL</div>
    <div className='walk'>WALK</div>
    </>
  );
}

export default Login;

