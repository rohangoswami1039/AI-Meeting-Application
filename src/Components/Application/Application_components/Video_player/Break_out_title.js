import { Button, Card, CardActions, CardContent, TextField } from '@mui/material';
import React, { useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom';

const Brek_out_title = ()=>{
    const location = useLocation();
    const { meeting } = location.state;
    const [breakout_title,set_breakout_title]=useState('')
    const navigator = useNavigate()

    const handle_submit = ()=>{
        console.log(breakout_title)
        navigator('/Meeting-video',{state:{meeting:meeting,breakout_title:breakout_title}})
    }
    return(
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
                        <TextField variant='outlined' placeholder='Breakout Room Title' onChange={(e) => { set_breakout_title(e.currentTarget.value) }} fullWidth />
                    </CardContent>
                    <CardActions>
                        <Button variant='contained'  onClick={handle_submit} fullWidth>
                            Check the Breakout Room
                        </Button>
                    </CardActions>
                </Card>

        </div>
    )
}
export default Brek_out_title;