import React, { useEffect, useState } from 'react';
import Grid from '@mui/material/Grid';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import Lottie from 'react-lottie';
import animationData from '../../../assets/animation_lm7t2cac.json'; // Replace with your animation file
import axios from 'axios';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { auth, database } from '../../../firebase';
import {  Timestamp, collection, onSnapshot } from 'firebase/firestore';


//imports of the date and time for mui 
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker';
import dayjs from 'dayjs'

// Import Material-UI components for creating the responsive table
import Table from '@mui/material/Table';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableBody from '@mui/material/TableBody';
import TableRow from '@mui/material/TableRow';
import TableCell from '@mui/material/TableCell';
import Paper from '@mui/material/Paper';
import { makeStyles } from '@mui/styles';

const useStyles = makeStyles({
  tableContainer: {
    maxWidth: '600px',
    overflowX: 'auto',
  },
  tableContainerWrapper: {
    maxHeight: '400px', // Set the maximum height as per your requirements
    overflowY: 'auto', // Enable vertical scrolling
  },
});

const ZoomCallback = () => {
    const navigator = useNavigate();
    const [searchParams] = useSearchParams();
    const code = searchParams.get('code'); // Extract the code parameter from the URL
    const classes = useStyles();


    const [selectedDate, setSelectedDate] = useState(dayjs());

    const [Meeting_title,set_Meeting_title]=useState('')
    const [Meeting_dis,set_Meeting_dis]=useState('')
    const [Meeting_duration,set_Meeting_duration]=useState()
    const [meetings,setMeetings]=useState([])
  
    const handleDateChange = (date) => {
      setSelectedDate(date);      
    };
    
    useEffect(()=>{
      const docRef = collection(database,"meetings",`${auth.currentUser.uid}`,'created_meetings')

      const unsubscribe = onSnapshot(docRef,(QuerySnapshot)=>{
        const meetingData = QuerySnapshot.docs.map(doc=> doc.data())
        setMeetings(meetingData)
      })

      return () => unsubscribe()

    },[])

   
    const renderMeetingTable = () => {
      if (meetings.length > 0) {
        return (
          <div className={classes.tableContainerWrapper}>
          <TableContainer component={Paper} className={classes.tableContainer}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell style={{fontWeight:'bold'}}>Title</TableCell>
                  <TableCell style={{fontWeight:'bold'}}>Description</TableCell>
                  <TableCell style={{fontWeight:'bold'}}>Duration</TableCell>
                  <TableCell style={{fontWeight:'bold'}}>Start Time</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {meetings.map((meeting, index) => (
                  <TableRow key={index}>
                    <TableCell>{meeting.meetingTitle}</TableCell>
                    <TableCell>{meeting.meetingDiscription}</TableCell>
                    <TableCell>{meeting.duration} minutes</TableCell>
                    <TableCell>{meeting.start_time}</TableCell>
                    <TableCell><Button variant='contained' onClick={async ()=>{
                        console.log("Join meetin clicked")
                        axios.post('http://localhost:3000/set_hls-meeting',{
                          link:'https://f53112b70bc31005.mediapackage.ap-south-1.amazonaws.com/out/v1/4046bada6a5842ffb77a0af114dfd43f/index.m3u8',
                          meeting_id:meeting.meetingId,
                        })
                        const payload = {
                          role: 1,
                          sdkKey:'fOM_9QF3TiG8ePNPVCmF9A',
                          sdkSecret:'MaseUpFWt2oixqVUudVkXManxklNbllk',
                          userName: `${auth.currentUser.displayName}`,
                          userEmail: `${auth.currentUser.email}`,
                          leaveUrl: 'http://localhost:3001/',
                          meetingNumber:meeting.meetingId,
                          passWord:meeting.meetingPassword,
                      };
                      navigator('/join-meeting',{state: {payload: payload,}})
                    }}>Join</Button></TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
          </div>
        );
      } else {
        return (
          <Typography variant="body2" color="textSecondary" align="center">
            No meetings available.
          </Typography>
        );
      }
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



    const handle_meeting_creation = async ()=>{
        if(code!==''){
            console.log('meeting create response ')
           // Check if selectedDate is a valid dayjs date object
            if (selectedDate.isValid()) {
              const requestData = {
                code,
                Meeting_title,
                Meeting_dis,
                Meeting_duration,
                selectedDate, 
                uid: auth.currentUser.uid,
              };
              const response = await axios.post('http://localhost:3000/auth/callback', requestData, {
                headers: {
                  'Content-Type': 'application/json',
                },
              });
              console.log(response)

              // Now, you can use firebase_timestamp in your Firestore write operation or further processing.
            } else {
              console.error('selectedDate is not a valid date object:', selectedDate);
            }
          }
    }


    // You can use the 'code' to make a request to your backend for further processing (e.g., exchanging the code for an access token).
  // Here, we'll just display it for demonstration purposes.
  
  return (
    <div style={{ background: '#2196F3', minHeight: '100vh', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
    <Grid container spacing={3}>
      <Grid item xs={12} md={6}>
        <Card style={formStyle}>
          <CardContent>
            <Typography variant="h5" component="div" gutterBottom>
              Create a Meeting
            </Typography>
            <form>
              <TextField
                label="Meeting Title"
                variant="outlined"
                fullWidth
                required={true}
                onChange={(e)=>{set_Meeting_title(e.target.value)}}
                margin="normal"
              />
              <TextField
                label="Meeting Description"
                variant="outlined"
                fullWidth
                multiline
                required
                rows={4}
                onChange={(e)=>{set_Meeting_dis(e.target.value)}}
                margin="normal"
              />
              <TextField
                label="Duration in minutes"
                variant="outlined"
                fullWidth
                required
                type='number'
                onChange={(e)=>{set_Meeting_duration(e.target.value)}}
                margin="normal"
              />
              <LocalizationProvider dateAdapter={AdapterDayjs}>
                  <DateTimePicker label="Basic date time picker" 
                    value={selectedDate}
                    onChange={(date)=>{handleDateChange(date)}}
                  />
              </LocalizationProvider>

              <Button
                variant="contained"
                color="primary"
                size="large"
                fullWidth
                style={{ marginTop: '1rem' }}
                onClick={handle_meeting_creation}
              >
                Create Meeting
              </Button>
            </form>
          </CardContent>
        </Card>
      </Grid>
      <Grid item xs={12} md={6}>
        <div style={{ maxWidth: '100%', display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
          {meetings.length > 0 ? renderMeetingTable() : <Lottie options={animationOptions} width={600} height={600} />}        </div>
      </Grid>
    </Grid>
  </div>
  );
};

export default ZoomCallback;
