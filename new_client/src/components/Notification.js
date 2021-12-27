import React,{useContext} from 'react';
import {Button} from '@material-ui/core'
import {SocketContext} from '../SocketContext'

function Notification() {
    const {answerCall,call,CallAccepted} = useContext(SocketContext);
    return (
        <>
            {call.isRecievedCall && !CallAccepted && (
                <div style={{display:'flex', justifyContent: 'space-around'}}> 
                    <h1>{call.name} is calling</h1>
                    <Button variant="contained" color="primary" onClick={answerCall}>Answer</Button>
                </div>
            )}
        </>
    )
}

export default Notification;