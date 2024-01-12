import { Button, Card, CardContent, Input, TextField, LinearProgress,Typography} from '@mui/material';
import React, { useState } from 'react'
import { useLocation } from 'react-router-dom';
import Lottie from 'react-lottie'; // Import Lottie animation library
import animationData from '../../../../assets/upload_animation.json'; // Replace with your animation JSON data
import axios from 'axios';
import { auth, database, storage } from '../../../../firebase';
import { getDownloadURL, ref, uploadBytesResumable } from 'firebase/storage';
import {  doc, setDoc } from 'firebase/firestore';

const Breakout_recording = () => {
    const location = useLocation();
    const { meeting } = location.state;
    const [breakout_title, set_breakout_title] = useState('')
    const [file, setFile] = useState(null);
    const [uploadProgress, setUploadProgress] = useState(0);
    const [uploadStatus, setUploadStatus] = useState('');
  
    const [upload_loading,set_upload_loading]=useState(false)

    const handleFileChange = (e) => {
      setFile(e.target.files[0]);
   
    };
  
  const handleUpload = async () => {
      if (!file) {
        alert('Please select a file to upload.');
        return;
      }
      const storageRef = ref(storage, `breakout-recordings/${meeting.meetingNumber}/${breakout_title}/${breakout_title}-${file.name}`);
      const uploadTask = uploadBytesResumable(storageRef, file);
  
      uploadTask.on('state_changed', (snapshot) => {
        const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        setUploadProgress(progress);

        // Calculate file size and transfer speed
        const fileSize = file.size / (1024 * 1024); // in MB
        const uploadedSize = snapshot.bytesTransferred / (1024 * 1024); // in MB

  

        // Update the upload status message
        setUploadStatus(
          `Uploading ${file.name} (${uploadedSize.toFixed(2)} MB / ${fileSize.toFixed(2)} MB) `
        );

      });
  
      try {
        set_upload_loading(true)
        
        await uploadTask;
        await getDownloadURL(uploadTask.snapshot.ref).then(async(downloadUrl)=>{
          const docRef = doc(database,'meetings',`${meeting.created_by}`,'created_meetings',`${meeting.meetingNumber}`,'breakout-rooms',`${breakout_title}`)
          await setDoc(docRef,{
            meeting_url:downloadUrl,
            meeting_title:breakout_title,
            upload_by:auth.currentUser.uid, 
          }).then(async (e)=>{
            axios.post('http://localhost:3000/breakout-summary',{
              link:downloadUrl,
              meeting_id:meeting.meetingNumber,
              title:breakout_title,
            })
            window.alert('Video Uploaded with the url')
            set_upload_loading(false)
          }).catch((e)=>{
            console.log("Firebase base set doc error")
            console.log(e)
          })  
        }).catch((error)=>{
          window.alert(error)
        });
      } catch (error) {
        console.error('Error uploading file:', error);
        alert('An error occurred while uploading the file.');
      }
    };

    const lottieOptions = {
        loop: true,
        autoplay: true,
        animationData: animationData,
        rendererSettings: {
            preserveAspectRatio: 'xMidYMid slice',
        },
    };

    return (
        <div
            style={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                height: '100vh',
                background: 'linear-gradient(to bottom, #3498db, #2980b9)',
            }}
        >
            <Card sx={{ maxWidth: 400, backgroundColor: 'rgba(255, 255, 255, 0.8)', padding: '16px' }}>
              <CardContent>
                <TextField variant="outlined" placeholder="Breakout Room Title" onChange={(e) => { set_breakout_title(e.currentTarget.value) }} fullWidth />
                <Input type="file" accept="video/mp4" style={{ marginTop: '16px' }} onChange={handleFileChange} fullWidth />
                {uploadProgress > 0 && uploadProgress < 100 ? (<>
                   <LinearProgress variant="determinate" value={uploadProgress} style={{ marginTop: '16px' }} />
                   <Typography variant="caption">{uploadStatus}</Typography></>
                ) : null}
              </CardContent>
              <Button disabled={upload_loading} variant="contained" onClick={handleUpload} fullWidth>
                Upload
              </Button>
            </Card>

            {/* Right Side: Lottie Animation */}
            <div style={{ marginLeft: '16px' }}>
                <Lottie options={lottieOptions} height={300} width={300} />
            </div>
        </div>
    )
}

export default Breakout_recording;
