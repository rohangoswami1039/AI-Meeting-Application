import React, { useEffect, useState } from 'react';
import './Style/Main_display.css'
import Draggable from 'react-draggable';
import ReactPlayer from 'react-player';
import axios from 'axios';
import { rt_db } from '../../firebase';
import { onValue, ref } from 'firebase/database';
import { useNavigate } from 'react-router-dom';

//help button 
import Button from '@mui/material/Button';
import Popover from '@mui/material/Popover';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import  {FaChevronDown } from 'react-icons/fa';
import { FaChevronUp } from 'react-icons/fa';
import { Accordion, AccordionSummary, AccordionDetails, Container, Paper, FormControl, FormLabel, RadioGroup, FormControlLabel, Radio, } from '@mui/material';

import Lottie from 'react-lottie';
import animationData from '../../assets/loading_chat.json'


const ComponentDisplay = ({ selectedItem }) => {
    const [prompt,set_prompt]=useState('')
    const [isPopupOpen_discussion, setIsPopupOpen] = useState(false);
    const [isPopupOpen_meeting_video,set_isPopupOpen_meeting_video]=useState(false)
    const [ismessage_Loading, setmessage_Loading] = useState(false);

    const [expandedKeyTakeaways, setExpandedKeyTakeaways] = useState(false);
    const [expandedSuggestions, setExpandedSuggestions] = useState(false);
    const [expandedDiscussionQuality, setExpandedDiscussionQuality] = useState(false);
    const [expandedSpeakerAnalysis, setExpandedSpeakerAnalysis] = useState(false);
    
    const [isCustomSummary,set_isCustomSummary]=useState(false)

    const[custom_breakout_loading,set_custom_breakout_loading]=useState(false)

    const [anchorEl, setAnchorEl] = useState(null);

    const handleClick = (event) => {
      setAnchorEl(event.currentTarget);
    };
  
    const handleClose = () => {
      setAnchorEl(null);
    };

  
    const Popup_open = Boolean(anchorEl);
    const id = Popup_open ? 'simple-popover' : undefined;


    const navigator = useNavigate()
    
    const [custom_breakout,set_custom_breakout]=useState("")

    const questionsData = [
        {
          question: 'Profile of the user',
          options:  ['Manager', 'Develoepr', 'Designer', 'QA', 'Professor'],
        },
        {
          question: ' Intention of the meeting/discussion',
          options: ['Discussion', 'Meetup', 'Presentation', 'Brainstorming', 'Review'],
        },
        {
          question: 'Purpose',
          options:[ 'Produce something', 'Achieve Consensus', 'Plan for upcoming task',' Review past performance'],
        },
        {
          question: 'Format Options',
          options: ['Insights', 'Recommendations', 'Lessons Learnt', 'Challenges Faced', 'Deliverables Produces'],
        },
      ];
    
      const [answers, setAnswers] = useState(Array(questionsData.length).fill(''));
    
      const handleAnswerChange = (event, index) => {
        const newAnswers = [...answers];
        newAnswers[index] = event.target.value;
        setAnswers(newAnswers);
      };
    
      const handleSubmission = async () => {
        set_custom_breakout_loading(true)
        setmessage_Loading(true)
        const selectedAnswers = answers.filter((answer) => answer !== '');
        console.log(custom_breakout)
        console.log('Selected Answers:', selectedAnswers);

        const response = await axios.post('http://localhost:3000/Custom_analysis',{
            meeting_id:`${selectedItem.meetingNumber}`,
            title:custom_breakout,
            user_profile:answers[0],
            intent:answers[1],
            purpose:answers[2],
            format_options:answers[3]})
        .then((e)=>{
            set_custom_breakout_loading(false)
            const docRef = ref(rt_db,`/${selectedItem.meetingNumber}/breakout_room/${custom_breakout}/user_analysis`)
            onValue(docRef,(snapshot)=>{
                const data=snapshot.val()
                console.log(data)
                setmessage_Loading(false)
                setMessages((prevMessages)=>[
                    ...prevMessages,
                    {
                        id:2,
                        messages:(
                            <div>
                                <h4 style={{color:"#7c86ff"}}>Analysis</h4>
                                <br/>
                                <p>{data}</p>
                            </div>
                        )
                    }
                ])
            })
        }).catch((e)=>{
            console.log(e)
            set_custom_breakout_loading(false)
        })
    

    };

    const [messages, setMessages] = useState([
        {
            id: 2,
            messages: 'Hi, I am Ai bot from silwalk...'
        },
        {
            id: 2,
            messages: `${selectedItem.meetingTitle}`
        },
        
    ]);
    const handle_meeting_button = () => {
        set_isPopupOpen_meeting_video(!isPopupOpen_meeting_video);
    };

    const handle_submit = async () => {
        if (prompt.trim() !== '') {
            setMessages(prevMessages => [
                ...prevMessages,
                {
                    id: 1,
                    messages: prompt
                }
            ]);
            
            setmessage_Loading(true); 

        if(prompt.toLowerCase().includes('meeting video')){
                    navigator('/Meeting-video',{state:{meeting:selectedItem}})
                }
        else if(prompt.toLowerCase().includes('livestream')){
                    handle_meeting_button()
                }
        else if(prompt.toLocaleLowerCase().includes("generate custom analysis of")){
            const roomNameMatch = prompt.match(/generate custom analysis of (\w+)/i); 
            let roomName = null;
            if (roomNameMatch && roomNameMatch.length > 1) {
                roomName = roomNameMatch[1];
                }
            console.log("room name : ",roomName)
            set_custom_breakout(roomName)
            set_isCustomSummary(true)
        }
        else if(prompt.toLocaleLowerCase().includes("top breakout insight")){
            setmessage_Loading(true)
            await axios.post('http://localhost:3000/Top_insight',{
                meeting_id:`${selectedItem.meetingNumber}`
            }).then((e)=>{
                setmessage_Loading(false)
                console.log(e)
                console.log(e.data.result)
                setMessages((prevMessages)=>[
                    ...prevMessages,
                    {
                        id:2,
                        messages:(
                            <>
                                <div>
                                    {e.data.result.map((data)=>(
                                        <p>{data}</p>
                                    ))}
                                </div>
                            </>
                        )
                    }
                ])

            })
        }

        

        /*
        else if(prompt.toLocaleLowerCase().includes("question")){
            setmessage_Loading(true)
            const questionMatch = prompt.match(/question (.+)/i);
            let question = null;
            if (questionMatch && questionMatch.length > 1) {
                question = questionMatch[1];
                const response = axios.post('http://localhost:3000/ask_question',{
                    meeting_id:'11011011',
                    question:question,
                }).then((e)=>{
                    console.log(e.data.answer)
                    const answer = e.data.answer
                    setmessage_Loading(false)
                    setMessages((prevMessages)=>[
                        ...prevMessages,
                        {
                            id:2,
                            messages:(
                                <>
                                <div> <strong>Answer</strong></div>
                                <p style={{fontSize:"16px",marginTop:"5px"}}>{answer}</p>
                                </>
                            )
                        }
                    ])    
                })
                

            } else {
                // Handle case where no question is found in the input
                console.log("Please provide a valid question to generate a custom analysis.");
            }
        }
*/


        else if (prompt.toLocaleLowerCase().includes("quantative analysis of")) {
            setmessage_Loading(true)
            const roomNameMatch = prompt.match(/quantative analysis of (\w+)/i);
            let roomName = null;
            if (roomNameMatch && roomNameMatch.length > 1) {
              roomName = roomNameMatch[1];
            }
            console.log("room name : ", roomName);
            const docRef = ref(rt_db, `/16/breakout_room/Breakout_room_functionality_implemented/Quantitative_Analysis`);
            onValue(docRef, (snapshot) => {
              const data = snapshot.val();
              console.log(data);
              if (data) {
                const argument_scores = data['argument_scores'];
                const collaborative_score = data['collaborative_score'];
                const dwell_time = data['dwell_time'];
                const centric_score = data['centric_score']    
                const charismatic_score = data['charismatic_score']


                console.log(argument_scores);
                console.log(collaborative_score);
                console.log(dwell_time);
                setmessage_Loading(false)
                setMessages((prevMessages) => [
                  ...prevMessages,
                  {
                    id: 2,
                    messages: 'Here is the Quantitative analysis',
                  },
                  {
                    id: 2,
                    messages: (
                      <div>
                        <strong>Argument Scores</strong>
                        {Object.entries(argument_scores).map(([speaker, score]) => (
                          <div key={speaker}>
                            {`${speaker}: ${score.toFixed(2)}`}
                          </div>
                        ))}
                      </div>
                    ),
                  },
                  {
                    id: 2,
                    messages: (
                      <div>
                        <strong>Collaborative Score</strong>
                        {Object.entries(collaborative_score).map(([speaker, score]) => (
                          <div key={speaker}>
                            {`${speaker}: ${score.toFixed(2)}`}
                          </div>
                        ))}
                      </div>
                    ),
                  },
                  {
                    id: 2,
                    messages: (
                      <div>
                        <strong>Dwell Time</strong>
                        {Object.entries(dwell_time).map(([speaker, score]) => (
                          <div key={speaker}>
                            {`${speaker}: ${score.toFixed(2)}`}
                          </div>
                        ))}
                      </div>
                    ),
                  },
                  {
                    id: 2,
                    messages: (
                      <div>
                        <strong>charismatic score</strong>
                        {Object.entries(charismatic_score).map(([speaker, score]) => (
                          <div key={speaker}>
                            {`${speaker}: ${score.toFixed(2)}`}
                          </div>
                        ))}
                      </div>
                    ),
                  },
                  {
                    id: 2,
                    messages: (
                      <div>
                        <strong>centric_score</strong>
                        {Object.entries(centric_score).map(([speaker, score]) => (
                          <div key={speaker}>
                            {`${speaker}: ${score.toFixed(2)}`}
                          </div>
                        ))}
                      </div>
                    ),
                  },
                ]);
              }
            });
          }
          
        else if(prompt.toLowerCase().includes('breakout details of ')){
            const roomNameMatch = prompt.match(/breakout details of (\w+)/i); 
            let roomName = null;
            if (roomNameMatch && roomNameMatch.length > 1) {
                roomName = roomNameMatch[1];
                }
            console.log("room name : ",roomName)
            const docRef = ref(rt_db,`/${selectedItem.meetingNumber}/breakout_room/${roomName}/highlights`)
            onValue(docRef,(snaphot)=>{
                const data = snaphot.val()
                console.log(data)
                if(data){
                    const challeanges = data['Challenges']
                    console.log(challeanges)
                    setMessages((prevMessages)=>[
                        ...prevMessages,
                        {
                            id:2,
                            messages: 'Here is the breakout Details:',
                        },
                        {
                            id:2,
                            messages:(
                                <>
                                <div><strong>Challenges</strong></div>
                                <ul>
                                    {data['Challenges'].map((challenge, index) => (
                                    <li key={index}>{challenge}</li>
                                    ))}
                                </ul>
                                </>
                            )
                        },
                        {
                            id:2,
                            messages:(
                                <>
                                <div><strong>Common Themes:</strong></div>
                                <ul>
                                    {data['Common Themes'].map((theme, index) => (
                                    <li key={index}>{theme}</li>
                                    ))}
                                </ul>
                                </>
                            )
                        },{
                            id:2,
                            messages:(
                                <>
                                <div><strong>Important Lessons:</strong></div>
                                <ul>
                                    {data['Important Lesson'].map((theme, index) => (
                                    <li key={index}>{theme}</li>
                                    ))}
                                </ul>
                                </>
                            )
                        },{
                            id:2,
                            messages:(
                                <>
                                <div><strong>Insights: </strong></div>
                                <ul>
                                    {data['Insights'].map((insight, index) => (
                                    <li key={index}>{insight}</li>
                                    ))}
                                </ul>
                                </>
                            )
                        },{
                            id:2,
                            messages:(
                                <>
                                <div><strong>Recommendations: </strong></div>
                                <ul>
                                    {data['recommendation'].map((recommendation, index) => (
                                    <li key={index}>{recommendation}</li>
                                    ))}
                                </ul>
                                </>
                            )
                        }
                    ])
                }
                else{
                    setMessages((prevMessages)=>[
                        ...prevMessages,
                        {
                            id:2,
                            messages:(
                                <>
                                    <div>No data found</div>
                                </>
                            )
                        }
                    ])
                }


            })
        }
        
        else if(prompt.toLowerCase().includes('breakout summary')) {
                    // Extract room name from the prompt
                    const roomNameMatch = prompt.match(/breakout summary of (\w+)/i); 
                    let roomName = null;

                    if (roomNameMatch && roomNameMatch.length > 1) {
                        roomName = roomNameMatch[1];
                    }

                    console.log("Room Name:", roomName);

                    const docRef = ref(rt_db, `/${selectedItem.meetingNumber}/breakout_room/${roomName}/summary`);
                    console.log(docRef)
                    onValue(docRef, (snapshot) => {
                        const data = snapshot.val();
                        console.log(data)
                
                        if (data) {
                            const speakerAnalysis = data["Summary of Speaker Analysis"];
                            
 
                            setMessages((prevMessages) => [
                                ...prevMessages,
                                {
                                    id: 2,
                                    messages: 'Here is the breakout summary:',
                                },
                                {
                                    id: 2,
                                    messages: (
                                        <div>
                                            <p><strong>Key Takeaways:</strong></p>
                                            <ul>
                                                {data["Key Takeaways"].map((item, index) => (
                                                    <li key={index}>{item}</li>
                                                ))}
                                            </ul>
                                        </div>
                                    ),
                                },
                                {
                                    id: 2,
                                    messages: (
                                        <div>
                                            <p><strong>Suggestions for Improvement:</strong></p>
                                            <ul>
                                                {data["Suggestions for Improvement"].map((item, index) => (
                                                    <li key={index}>{item}</li>
                                                ))}
                                            </ul>
                                        </div>
                                    ),
                                },
                                {
                                    id: 2,
                                    messages: (
                                        <div>
                                        <p><strong>Summary of Discussion Quality:</strong></p>
                                        <ul>
                                            {data["Summary of Discussion Quality"].map((item, index) => (
                                                <li key={index}>{item}</li>
                                            ))}
                                        </ul>
                                    </div>
                                    ),
                                },
                                {
                                    id: 2,
                                    messages: (
                                        <div>
                                            <p><strong>Summary of Speaker Analysis:</strong></p>
                                            <div> 
                                              <p>{data["Summary of Speaker Analysis"].map((speakerText, index) => (
                                                <div key={index}>
                                                    <div><strong>Speaker {index + 1}:</strong></div>
                                                    <p>{speakerText}</p>
                                                </div>
                                                ))}</p> 
                                            </div>
                                        </div>
                                    ),
                                },
                            ]);
                        } else {
                            setMessages((prevMessages) => [
                                ...prevMessages,
                                {
                                    id: 2,
                                    messages: 'No breakout summary available.',
                                },
                            ]);
                        }
                    });
                }
                
        else if(prompt.toLowerCase().includes('critical examination')){
                    const roomNameMatch = prompt.match(/critical examination of (\w+)/i); 
                    let roomName = null;
                    if (roomNameMatch && roomNameMatch.length > 1) {
                        roomName = roomNameMatch[1];
                    }
                    console.log("Critical thinking >>",roomName)
                    const docRef2 = ref(rt_db,`/${selectedItem.meetingNumber}/breakout_room/${roomName}/critical_analysis/devils_argument`)
                    console.log(docRef2)
                    onValue(docRef2,(snapshot)=>{
                    const critical_thinking= snapshot.val()
                    console.log(critical_thinking)
                                
                    if(critical_thinking){
                    setMessages((prevMessages)=>[
                    ...prevMessages,
                    {
                    id:2,
                    messages:(
                    <div>
                        <p><strong>Critical Examination Argument :</strong></p>
                        <p>{critical_thinking}</p>
                    </div>
                    )
                    },
                ])

                    }
                    else{
                    setMessages((prevMessages) => [
                        ...prevMessages,
                        {
                        id: 2,
                        messages: 'No critical thinking data available Please wait.',
                        },
                    ]);
                }})                    
            }

            else if(prompt.toLowerCase().includes('breakout transcription')){
                const roomNameMatch = prompt.match(/breakout transcription (\w+)/i); 
                let roomName = null;
                if (roomNameMatch && roomNameMatch.length > 1) {
                    roomName = roomNameMatch[1];
                }
                console.log("Critical thinking >>",roomName)
                const docRef2 = ref(rt_db,`/${selectedItem.meetingNumber}/breakout_room/${roomName}/discussion`)
                console.log(docRef2)
                onValue(docRef2,(snapshot)=>{
                const transcription= snapshot.val()
                console.log(transcription)
                            
                if(transcription){
                setMessages((prevMessages)=>[
                ...prevMessages,
                {
                id:2,
                messages:(
                <div>
                    <p><strong>Breakout Transcription</strong></p>
                    <p>{transcription}</p>
                </div>
                )
                },
            ])

                }
                else{
                setMessages((prevMessages) => [
                    ...prevMessages,
                    {
                    id: 2,
                    messages: 'No transcription data of breakout room available Please wait.',
                    },
                ]);
            }})                    
        }
            else if (prompt.toLowerCase().includes('insight review')) {
                const roomNameMatch = prompt.match(/insight review of (\w+)/i);
                let roomName = null;
                if (roomNameMatch && roomNameMatch.length > 1) {
                    roomName = roomNameMatch[1];
                }
                console.log(roomName);
                const docRef2 = ref(
                    rt_db,
                    `/${selectedItem.meetingNumber}/breakout_room/${roomName}/critical_analysis/response_analysis`
                );
                onValue(docRef2, (snapshot) => {
                    const critical_thinking = snapshot.val();
                    console.log(critical_thinking);
            
                    if (critical_thinking) {
                        const messages = [];
            
                        for (const speaker in critical_thinking) {
                            if (critical_thinking.hasOwnProperty(speaker)) {
                                const attributes = critical_thinking[speaker];
            
                                // Create an array of attribute elements for the current speaker
                                const attributeElements = Object.keys(attributes).map((attributeName) => (
                                    <Accordion key={attributeName}>
                                        <AccordionSummary>
                                            <Typography variant="subtitle1">
                                                <strong>{attributeName}</strong>
                                            </Typography>
                                        </AccordionSummary>
                                        <AccordionDetails>
                                            <Typography variant="body2">
                                                {attributes[attributeName][0]}
                                            </Typography>
                                        </AccordionDetails>
                                    </Accordion>
                                ));
            
                                messages.push({
                                    id: 2,
                                    messages: (
                                        <div key={speaker}>
                                            <p>
                                                <strong>Insight Review for {speaker}:</strong>
                                            </p>
                                            {attributeElements}
                                        </div>
                                    ),
                                });
                            }
                        }
            
                        setMessages((prevMessages) => [...prevMessages, ...messages]);
                    } else {
                        setMessages((prevMessages) => [
                            ...prevMessages,
                            {
                                id: 2,
                                messages: 'No critical thinking data available. Please wait.',
                            },
                        ]);
                    }
                });
            }
        else if (prompt.toLowerCase().includes('breakout socratic questions of ')) {
            const roomNameMatch = prompt.match(/breakout socratic questions of (\w+)/i);
            let roomName = null;
            if (roomNameMatch && roomNameMatch.length > 1) {
                roomName = roomNameMatch[1];
            }
            console.log("Room Name:", roomName);
            const docRef = ref(rt_db, `/${selectedItem.meetingNumber}/breakout_room/${roomName}/critical_analysis/socratic_questions`);
            onValue(docRef, (snapshot) => {
                const data = snapshot.val();
                console.log(data);
                const messagesArray = [];
        
                for (const speakerKey in data) {
                    if (data.hasOwnProperty(speakerKey)) {
                        const speakerQuestions = data[speakerKey];
        
                        // Add a message for the speaker
                        messagesArray.push({
                            id: 2, // Use the current length as a unique ID
                            messages: `${speakerKey} questions:`,
                        });
        
                        // Add messages for the speaker's questions
                        speakerQuestions.forEach((question, index) => {
                            messagesArray.push({
                                id: 2, // Use the current length as a unique ID
                                messages: `${index + 1}. ${question}`,
                            });
                        });
                    }
                }
                
                // Now, add the message array to your existing messages state
                setMessages((prevMessages) => [
                    ...prevMessages,
                    ...messagesArray, // Add the formatted messages here
                ]);
            });
        }
      
       
                
                
        else {
                    const response = await axios.post('http://localhost:3000/handle-request',{ prompt:prompt,meeting:selectedItem });
                    const botResponse = response.data.botResponse;
                    if(botResponse=='Bot response for other prompts'){
                        const response = axios.post('http://localhost:3000/ask_question',{
                            meeting_id:'11011011',
                            question:prompt,
                        }).then((e)=>{
                            console.log(e.data.answer)
                            const answer = e.data.answer
                            setmessage_Loading(false)
                            setMessages((prevMessages)=>[
                                ...prevMessages,
                                {
                                    id:2,
                                    messages:(
                                        <>
                                        <div> <strong>Answer</strong></div>
                                        <p style={{fontSize:"16px",marginTop:"5px"}}>{answer}</p>
                                        </>
                                    )
                                }
                            ])    
                        })
                    }
                    else if(botResponse=='Wait for sometime. No transcription data found.'){
                        setmessage_Loading(false)
                        setMessages(prevMessages => [
                            ...prevMessages,
                            {
                                id: 2,
                                messages: botResponse,
                            },
                        ]);
                    }
                    else if(botResponse=='Wait for sometime. No summary data found.'){
                        setmessage_Loading(false)
                        setMessages(prevMessages => [
                            ...prevMessages,
                            {
                                id: 2,
                                messages: botResponse,
                            },
                        ]);
                    }
                    else {
                        setmessage_Loading(false)
                        setMessages(prevMessages => [
                            ...prevMessages,
                            {
                                id: 2,
                                messages: (
                                    <div>
                                        <div>
                                        {botResponse && Array.isArray(JSON.parse(botResponse)) ? (
                                        <div>
                                            {JSON.parse(botResponse).map((transcription, index) => (
                                            transcription && ( // Check for null values and skip them
                                                <div key={index}>
                                                <p>{transcription}</p>
                                                {index < JSON.parse(botResponse).length - 1 && <br />} {/* Add spacing between paragraphs */}
                                                </div>
                                            )
                                            ))}
                                        </div>
                                        ) : (
                                        // Handle the case where botResponse is not a valid JSON array
                                        <p>Invalid bot response format</p>
                                        )}
                                        </div>
                                    </div>
                                )
                            },
                        ]);
                    }
                }
    set_prompt('');
    }
};


    const handle_discussion_button = () => {
        setIsPopupOpen(!isPopupOpen_discussion);
    };
   


    return (
        <>
        <div className="component_container">
            <div className='messages_container'>
            {messages.map(message =>{
                if(message.id===1){
                    return(
                        <div className='User_message'>
                            {message.messages}
                        </div>
                    )
                }
                else if (message.id===2){
                        return(
                            <div className='bot_message'>
                                {message.messages}
                            </div>
                        )
                }
            })}
             {ismessage_Loading && <div classNamtrue="loading-indicator">
             <Lottie
             style={{marginLeft:'0'}}
                options={{
                    loop: true,
                    autoplay: true,
                    animationData: animationData,
                }}
                width={70}
                height={70}
            />
                </div>}
            </div>
               
            <div>
                <div variant="contained" color="primary" onClick={handleClick}>
                    <svg width="25px" height="25px" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path fill-rule="evenodd" clip-rule="evenodd" d="M2 12C2 6.47715 6.47715 2 12 2C17.5228 2 22 6.47715 22 12C22 17.5228 17.5228 22 12 22C6.47715 22 2 17.5228 2 12ZM12 9C11.7015 9 11.4344 9.12956 11.2497 9.33882C10.8843 9.75289 10.2523 9.79229 9.83827 9.42683C9.4242 9.06136 9.3848 8.42942 9.75026 8.01535C10.2985 7.3942 11.1038 7 12 7C13.6569 7 15 8.34315 15 10C15 11.3072 14.1647 12.4171 13 12.829V13C13 13.5523 12.5523 14 12 14C11.4477 14 11 13.5523 11 13V12.5C11 11.6284 11.6873 11.112 12.2482 10.9692C12.681 10.859 13 10.4655 13 10C13 9.44772 12.5523 9 12 9ZM12 15C11.4477 15 11 15.4477 11 16C11 16.5523 11.4477 17 12 17H12.01C12.5623 17 13.01 16.5523 13.01 16C13.01 15.4477 12.5623 15 12.01 15H12Z" fill="#323232"/>
                    </svg>
                </div>
                <Popover
                    id={id}
                    open={Popup_open}
                    anchorEl={anchorEl}
                    onClose={handleClose}
                    anchorOrigin={{
                    vertical: 'bottom',
                    horizontal: 'left',
                    }}
                    transformOrigin={{
                    vertical: 'bottom',
                    horizontal: 'left',
                    }}
                >
                    <Box p={2}> 
                    <strong><h3>Prompts: </h3></strong><br/>
                    <ul>
                        <li style={{fontWeight:'bold'}}>meeting video</li>
                    <ul style={{marginLeft:'20px'}}>
                        <li>It displays the recorded content from the primary meeting.</li>
                    </ul>
                        <li style={{fontWeight:'bold'}}>livestream</li>
                    <ul style={{marginLeft:'20px'}}>
                        <li>It showcases the live broadcast of the meeting</li>
                        </ul>
                        <li style={{fontWeight:'bold'}}>breakout summary of 'Room Name'.</li>
                    <ul style={{marginLeft:'20px'}}>
                        <li>It presents a synopsis of your selected breakout room.</li>
                    </ul>

                    <li style={{fontWeight:'bold'}}>critical examination of 'Room Name'</li>
                    <ul style={{marginLeft:'20px'}}>
                        <li>It provides a thorough analysis of your chosen breakout room.</li>
                    </ul>


                    <li style={{fontWeight:'bold'}}>insight review of 'Room Name'</li>
                    <ul style={{marginLeft:'20px'}}>
                        <li>It offers an insightful evaluation of your selected breakout room.</li>
                    </ul>


                    <li style={{fontWeight:'bold'}}>breakout socratic questions of 'Room Name'</li>
                    <ul style={{marginLeft:'20px'}}>
                        <li>It reveals the Socratic exploration of your chosen breakout room.</li>
                    </ul>


                    <li style={{fontWeight:'bold'}}>summary</li>
                    <ul style={{marginLeft:'20px'}}>
                        <li>It presents an overview of the main meeting.</li>
                    </ul>

                    <li style={{fontWeight:'bold'}}>transcription</li>
                    <ul style={{marginLeft:'20px'}}>
                        <li>It displays the transcription of the main meeting.</li>
                    </ul>
                    <li style={{fontWeight:'bold'}}>generate custom analysis of "Breakout Room name"</li>
                    <ul style={{marginLeft:'20px'}}>
                        <li>It displays the custom analysis of the breakout meeting.</li>
                    </ul>
                    

                    </ul>


                    </Box>
                </Popover>
            </div>



            
            {isPopupOpen_meeting_video && (
                 <Draggable>
                 <div className="popup_room_meeting_video_">
                     <button className="close_button" onClick={handle_meeting_button}>
                         Close
                     </button>
                     {/* Video content for the popup */}
                     <div>
                         <ReactPlayer
                             url="https://3e46f9f3de79c4d4.mediapackage.ap-south-1.amazonaws.com/out/v1/75339c652d3b4973a9c1bfa5cd3770b2/index.m3u8"
                             controls
                             width="100%"
                             height="auto"
                         />
                     </div>
                 </div>
             </Draggable>
            )}

            {isCustomSummary && (
                 <Draggable>
                 <div style={{overflow: 'auto'}} className="popup_room_meeting_video_">
                     <button className="close_button" onClick={()=>{set_isCustomSummary(false)}}>
                         Close
                     </button>
                     {/* Video content for the popup */}
                     <div>
                     <Container maxWidth="md">
                        <Paper elevation={3} style={{ padding: '20px' }}>
                            <Typography variant="h5" align="center" gutterBottom>
                                Custom Analysis Of Breakout Room
                            </Typography>
                            <div style={{ maxHeight: '300px', overflow: 'auto' }}>
                            <form>
                            {questionsData.map((questionData, index) => (
                                <div key={index}>
                                <FormControl component="fieldset">
                                    <FormLabel component="legend"><strong>{questionData.question}</strong></FormLabel>
                                    <RadioGroup
                                    aria-label={`question-${index}`}
                                    name={`question-${index}`}
                                    value={answers[index]}
                                    onChange={(e) => handleAnswerChange(e, index)}
                                    >
                                    {questionData.options.map((option, optionIndex) => (
                                        <FormControlLabel
                                        key={optionIndex}
                                        value={option}
                                        control={<Radio />}
                                        label={option}
                                        />
                                    ))}
                                    </RadioGroup>
                                </FormControl>
                                </div>
                            ))}
                            <Button variant="contained" color="primary" onClick={handleSubmission}>
                                Submit
                            </Button>
                            </form>
                            </div>
                        </Paper>
                        </Container>
                     </div>
                 </div>
             </Draggable>
            )}

            <div className="input_container">
            <button className="send_button mic" onClick={() => {
                        navigator('/breakout-recording', { state: { meeting: selectedItem } });
                    }}>
                <svg width="25" height="25" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M12 17L12 10M12 10L15 13M12 10L9 13" stroke="#fff" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
                <path d="M16 7H12H8" stroke="#fff" stroke-width="1.5" stroke-linecap="round"/>
                <path d="M22 12C22 16.714 22 19.0711 20.5355 20.5355C19.0711 22 16.714 22 12 22C7.28595 22 4.92893 22 3.46447 20.5355C2 19.0711 2 16.714 2 12C2 7.28595 2 4.92893 3.46447 3.46447C4.92893 2 7.28595 2 12 2C16.714 2 19.0711 2 20.5355 3.46447C21.5093 4.43821 21.8356 5.80655 21.9449 8" stroke="#fff" stroke-width="1.5" stroke-linecap="round"/>
                </svg>
            </button>
                <input  type="text" 
                    placeholder="Type your Prompt...." 
                    className="input_text"  
                    onChange={(e)=>{set_prompt(e.target.value)}} 
                    value={prompt}
                    onKeyDown={(e) => { if (e.key === 'Enter') { handle_submit();}}}/>

            <button className="send_button" onClick={()=>{handle_submit(prompt)}}>
                <svg width="25" height="25" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M10.1373 19.2518L18.5872 19.24M15.5824 7.41986L28.9232 14.0902C34.91 17.0836 34.8982 21.9745 28.9232 24.9797L15.5824 31.65C6.61396 36.1402 2.937 32.4632 7.42713 23.4947L9.40703 19.535L7.42713 15.5752C2.937 6.60668 6.60218 2.94151 15.5824 7.41986Z" stroke="white" stroke-width="2.10714" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
            </button>
            </div>
        </div>
        </>
    );
};

export default ComponentDisplay;

