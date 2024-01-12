import React, { Component } from 'react';
import './App.css';
import Login from './Components/Authentication/Login';
import SignUp from './Components/Authentication/SignUp';
import { AuthProvider } from './Components/Authentication/Context/Auth_Context';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from './firebase';
import Email_verification from './Components/Authentication/Email_verification';
import Main_screen from './Components/Application/Main_screen';
import Profile from './Components/Application/Application_components/Profile';
import Join_meeting from './Components/Application/Application_components/Join_meeting';
import Meeting from './Components/Application/Application_components/Meeting';
import Create_meeting from './Components/Application/Application_components/Create_meeting';
import ZoomCallback from './Components/Application/Application_components/ZoomCallback';
import VideoPlayer from './Components/Application/Application_components/Video_player/VideoPlayer';
import animationData from './assets/loading_animation.json';
import Lottie from 'react-lottie';
import Breakout_recording from './Components/Application/Application_components/Upload_breakout/Breakout_recording';
import Brek_out_title from './Components/Application/Application_components/Video_player/Break_out_title';



class App extends Component {
  constructor(props) {
    super(props);
    
    this.state = {
      loaded: false,
    };
  }
  componentDidMount(){
    onAuthStateChanged(auth,(user)=>{
      if(!user){
        this.setState({
            loggedIn:false,
            loaded:true
        })
      }
      else {
        if(user.emailVerified==false){
          this.setState({
            emailVerified:true,
            user:user,
          })
        }
        this.setState({
          loggedIn:true,
          loaded:true,
          user:user,
        })
      }
    })
  }

  

  render() {
    const { loaded,loggedIn,emailVerified,user } = this.state;

    if(!loaded){
      return(
        <div style={{display:'flex',flexDirection:'column',justifyContent:'center',alignItems:'center'}}>
          <Lottie
                options={{
                    loop: true,
                    autoplay: true,
                    animationData: animationData,
                }}
                width={700}
                height={700}
            />
        </div>
      )
    }
    if(loggedIn && emailVerified){
      return(
      <AuthProvider>
        <Email_verification  user={user}/>
      </AuthProvider>
      )
    }
    if(loggedIn){
      return(
        <AuthProvider>
        <BrowserRouter>
        <Routes>
              <Route path='/' element={<Main_screen />} />
              <Route path='/profile' element={<Profile />} />
              <Route path='/create-meeting' element={<Create_meeting />} />
              <Route path='/join-meeting' element={<Join_meeting />} />
              <Route path='/meeting' element={<Meeting />} />
              <Route path='/breakout-recording' element={<Breakout_recording/>}/>
              <Route path='/Meeting-video' element={<VideoPlayer/>} />
              <Route path='/Break-out-title' element={<Brek_out_title/>} />
              <Route path="/auth/callback/:code?" element={<ZoomCallback />} />

            </Routes>
        </BrowserRouter>
      </AuthProvider>
      )
    }
    if(!loggedIn){
      return (
        <>
        <AuthProvider>
          <BrowserRouter>
            <Routes>
                <Route path='/Signup' element={<SignUp />} />
                <Route path='/' element={<Login />} />
              </Routes>
          </BrowserRouter>
        </AuthProvider>
        </>
      );
    }
    
  }
}

export default App;
/**
 * 
 *  <AuthProvider>
          <BrowserRouter>
            <Routes>
              <Route path='/' Component={Main_screen}/>
              <Route path='/profile' Component={Profile}/>
            </Routes>
          </BrowserRouter>
        </AuthProvider>
 * 
 * 
 */