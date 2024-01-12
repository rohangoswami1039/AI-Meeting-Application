import React, { useEffect, Fragment, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { auth, database } from '../../../firebase';
import axios from 'axios';
import { Timestamp, doc, getDoc, setDoc } from 'firebase/firestore';
import { Button } from '@mui/material';

import animationData from '../../../assets/loading_animation.json';
import Lottie from 'react-lottie';


const JoinMeeting = (props) => {
  const location = useLocation();
  const [startTime, setStartTime] = useState(null);
  const { payload } = location.state;


  useEffect(() => {
    async function joinZoomMeeting() {
      try {
        const { ZoomMtg } = await import("@zoomus/websdk");
        ZoomMtg.setZoomJSLib("https://source.zoom.us/2.15.2/lib", "/av");
        ZoomMtg.preLoadWasm();
        ZoomMtg.prepareJssdk();

        const signature = await new Promise((resolve, reject) => {
          ZoomMtg.generateSDKSignature({
            meetingNumber: payload.meetingNumber,
            sdkKey: payload.sdkKey,
            role: payload.role,
            sdkSecret: payload.sdkSecret,
            success: resolve,
            error: reject,
          });
        });

        
        ZoomMtg.init({
          leaveUrl: payload.leaveUrl,
          disableRecord:false,
          success: function (data) {
            ZoomMtg.join({
              meetingNumber: payload.meetingNumber,
              signature: signature.result,
              sdkKey: payload.sdkKey,
              userName: payload.userName,
              userEmail: payload.userEmail,
              passWord: payload.passWord,
              tk: "",
              success: async function () {
                try {
                  const meetingRef = doc(database,"meetings",`${auth.currentUser.uid}`,'created_meetings',`${payload.meetingNumber}`);
                  const meetingDoc = await getDoc(meetingRef);
                  
                  if (meetingDoc.exists()) {
                    const meetingData = meetingDoc.data();
                    const Recived_startTimestamp = meetingData.start_time;
                    const startTimestamp = new Date(Recived_startTimestamp);

                    console.log("start Time stamp >>> ", startTimestamp);

                    const currentTime = new Date();
                    const timeDifference = Math.abs(currentTime - startTimestamp); // in milliseconds

                    const hours = Math.floor(timeDifference / (1000 * 60 * 60)).toString().padStart(2, '0');
                    const minutes = Math.floor((timeDifference % (1000 * 60 * 60)) / (1000 * 60)).toString().padStart(2, '0');
                    const seconds = Math.floor((timeDifference % (1000 * 60)) / 1000).toString().padStart(2, '0');

                    console.log('Time Difference:', hours, 'hours,', minutes, 'minutes,', seconds, 'seconds');
                    const formattedTimeDifference = `${hours}:${minutes}:${seconds}`;

                    window.alert("You Joined late " + formattedTimeDifference);

                    const docRef = doc(database, 'Users', `${auth.currentUser.uid}`, 'meetings', `${payload.meetingNumber}`);
                    setDoc(docRef, {
                      Started_at: startTimestamp,
                      joined_at: currentTime,
                      meetingTitle:meetingData.meetingTitle,
                      duration:meetingData.duration,
                      created_by:meetingData.created_by,
                      meetingDiscription:meetingData.meetingDiscription,
                      meetingNumber: payload.meetingNumber,
                      joined_late: hours > 0 || minutes > 0 ? true : false,
                      Late_time: { hour: hours, minutes: minutes }
                    }).then(() => {
                      console.log("Meeting number uploaded");
                    }).catch((e) => {
                      console.log(e);
                    });
                  }
                  
                  console.log("-----Joined-----");
                }
                catch(error){
                  console.log("Error in fetching the joining time")
                }
              },
                 
                
              error: function (error) {
                console.log(error);
              },
            });
          },
          error: function (error) {
            console.log(error);
          },
        });
        
      } catch (error) {
        console.log(error);
      }
    }

    joinZoomMeeting();
  }, []);

 
  return (
    <Fragment>
      <link type="text/css" rel='stylesheet' href='https://source.zoom.us/2.15.2/css/bootstrap.css'></link>
      <link type="text/css" rel='stylesheet' href='https://source.zoom.us/2.15.2/css/react-select.css'></link>

      <p>{startTime ? `Meeting started at: ${startTime.toString()}` : <div style={{display:'flex',flexDirection:'column',justifyContent:'center',alignItems:'center'}}>
          <Lottie
                options={{
                    loop: true,
                    autoplay: true,
                    animationData: animationData,
                }}
                width={700}
                height={700}
            />
        </div>}</p>
      {/* Your Zoom meeting UI */}
    </Fragment>
  );
};

export default JoinMeeting;
/**
 * const docRef = doc(database,'Users',`${auth.currentUser.uid}`,'meetings',`${payload.meetingNumber}`);
                setDoc(docRef, {}).then(() => {
                  console.log("Meeting number uploaded");
                }).catch((e) => {
                  console.log(e);
                });
                console.log("-----Joined-----");
              },
 * 
  
  -------------------------geeting meeting link information from zoom api -(problem api link is not working)
  
  useEffect(() => {
    const apiKey = payload.sdkKey;
    const apiSecret = payload.sdkSecret;
    const meetingId = payload.meetingNumber;

    const generateToken = () => {
      const timestamp = Math.floor(Date.now() / 1000) + 60; // 1 minute expiration
      const msg = apiKey + meetingId + timestamp + '0';
      
      const encoder = new TextEncoder();
      const data = encoder.encode(msg);
      
      const cryptoKey = crypto.subtle.importKey('raw', encoder.encode(apiSecret), { name: 'HMAC', hash: 'SHA-256' }, false, ['sign']);
      
      return crypto.subtle.sign('HMAC', cryptoKey, data).then(signature => {
        const hashArray = Array.from(new Uint8Array(signature));
        const hashHex = hashArray.map(byte => byte.toString(16).padStart(2, '0')).join('');
        const token = `${apiKey}.${meetingId}.${timestamp}.${hashHex}`;
        return btoa(token);
      });
    };

    const getMeetingDetails = async () => {
      try {
        const token = generateToken();

        const response = await axios.get(`https://api.zoom.us/v2/meetings/${meetingId}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const { start_time } = response.data;
        console.log('APi response ---> ',response )
        console.log('APi response start time --->',start_time)
        setStartTime(new Date(start_time));
      } catch (error) {
        console.error('Error fetching meeting details:', error);
      }
    };

    getMeetingDetails();
  }, []);



 */