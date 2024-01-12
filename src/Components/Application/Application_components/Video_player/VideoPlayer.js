import React, { useRef, useState, useEffect } from 'react';
import { Player } from 'video-react';
import 'video-react/dist/video-react.css';
import { get, ref } from "firebase/database";
import { Accordion, AccordionDetails, AccordionSummary, AppBar, Button, Card, CardContent, Chip,IconButton, Snackbar, TextField, ThemeProvider, Toolbar, Typography, createTheme } from '@mui/material';
import { FaAngleDoubleDown } from 'react-icons/fa'
import { FaEllipsisV } from 'react-icons/fa';
import { database, rt_db, storage } from '../../../../firebase';
import { useLocation } from 'react-router-dom';
import { doc, getDoc } from 'firebase/firestore';

import { Dialog, DialogContent, DialogTitle, Slide } from '@mui/material';
import { TransitionProps } from '@mui/material/transitions';

const VideoPlayer = () => {
  const location = useLocation();
  const { meeting } = location.state;

  const theme = createTheme({
    palette: {
      mode: 'dark',
      primary: {
        main: '#1976d2',
      },
    },
  });



  const [timestampData, setTimestampData] = useState([]); // Initialize as an empty array
  const [selectedText, setSelectedText] = useState(null);
  const [show_tanscription,set_show_tanscription]=useState(false)
  const playerRef = useRef(null);

  const [openTranscriptionDialog, setOpenTranscriptionDialog] = useState(false);
  const [selectedTranscription, setSelectedTranscription] = useState('');


  const handleOpenTranscriptionDialog = (transcription) => {
    setSelectedTranscription(transcription);
    setOpenTranscriptionDialog(true);
  };

  const handleCloseTranscriptionDialog = () => {
    setOpenTranscriptionDialog(false);
  };

  const videoUrl='https://d2ewrx4ts78vya.cloudfront.net/video1702518724.mp4'




  useEffect(() => {
    async function fetchData() {
        const docRef = ref(rt_db, `/11011011/timestamp`);
        await get(docRef).then((e) => {
          if (e.exists()) {
            console.log(e.val())
            const timestampData = Object.entries(e.val()).map(([topic, timestamp]) => ({
              topic,
              start: timestamp.start,
              end: timestamp.end,
              trans: timestamp.trans,
            }));
            console.log(timestampData)
            setTimestampData(timestampData);
          }
        }).catch((e) => {
          console.log(e);
        });
      }
    fetchData();
  }, []);

 

  const jumpToTimestamp = (index,selectedText) => {
       if (playerRef.current) {
        console.log("Player reference:", playerRef.current);
        playerRef.current.seek(index);
      }
  };
  const showTrans = (trans)=>{
    console.log(trans)
    handleOpenTranscriptionDialog(trans);


  }

  const formatTime = (seconds) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const remainingSeconds = seconds % 60;

    const formattedHours = hours > 0 ? `${hours}:` : '';
    const formattedMinutes = `${minutes < 10 && hours > 0 ? '0' : ''}${minutes}:`;
    const formattedSeconds = `${remainingSeconds.toFixed(0) < 10 ? '0' : ''}${remainingSeconds.toFixed(0)}`;

    return `${formattedHours}${formattedMinutes}${formattedSeconds}`;
};

  function appBarLabel(label) {
    return (
      <Toolbar>
        <IconButton edge="start" color="inherit" aria-label="menu" sx={{ mr: 2 }}>
          <FaEllipsisV />
        </IconButton>
        <Typography variant="h6" noWrap component="div" sx={{ flexGrow: 1 }}>
          {label}
        </Typography>
      </Toolbar>
    );
  }

  return (
    <>
      <ThemeProvider theme={theme}>
        <AppBar position="static" color="primary" >
          {appBarLabel('SILWALK')}
        </AppBar>
      </ThemeProvider>

      <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'center' }}>
        <div style={{ width: '100%', minWidth: '500px', minHeight: 400, }}>
          {videoUrl!=='' && <Player playsInline ref={playerRef} style={{ width: '100%', }} >
            <source src={videoUrl}  />
          </Player>}
        </div>

        {timestampData.length > 0 && (
          <div style={{ display: 'flex', justifyContent: 'center', margin: '10px' }}>
            <Card sx={{
              maxWidth: 500,
              height: 400,
              overflowY: 'auto',
              '&::-webkit-scrollbar': {
                width: '4px',
              },
              '&::-webkit-scrollbar-thumb': {
                backgroundColor: '#888',
                borderRadius: '4px',
              },
              '&::-webkit-scrollbar-thumb:hover': {
                backgroundColor: '#555',
              },
            }}>
              <CardContent>
                <Typography style={{ fontSize: 14,fontWeight:"bold" }} color="text.secondary" gutterBottom>
                  Top Meeting Points
                </Typography>
                {timestampData.map((item, index) => (
                  <div key={index}>
                    <Accordion>
                      <AccordionSummary
                        expandIcon={<FaAngleDoubleDown />}
                        aria-controls={`panel-${index + 1}-content`}
                        id={`panel-${index + 1}-header`}
                      >
                        <Typography >{item.topic}</Typography>
                      </AccordionSummary>
                      <AccordionDetails>
                         <div style={{display:'flex',flexDirection:'row',justifyContent:'center',alignItems:'center'}}>
                         <Chip
                              label={`${formatTime(item.start)} to ${formatTime(item.end)}`}
                              variant="outlined"
                              onClick={() => jumpToTimestamp(item.start,item.trans)} 
                              style={{
                                margin: '2px',
                              }}
                            />
                            <Chip
                              label={`Transcription`}
                              variant="filled"
                              onClick={() => showTrans(item.trans)} 
                              style={{
                                margin: '2px',
                              }}
                            />
                         </div>
                      </AccordionDetails>
                    </Accordion>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>
        )}
      </div>

      <Dialog
        open={openTranscriptionDialog}
        onClose={handleCloseTranscriptionDialog}
        TransitionComponent={Slide}
        aria-labelledby="transcription-dialog-title"
        fullWidth
        maxWidth="md"
      >
        <DialogTitle id="transcription-dialog-title">Transcription</DialogTitle>
        <DialogContent>
          {selectedTranscription}
        </DialogContent>
      </Dialog>
    </>
  );
};

export default VideoPlayer;
