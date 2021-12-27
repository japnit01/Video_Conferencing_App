import React,{useRef,useContext} from 'react'
import {Grid,Typography,Paper} from '@material-ui/core'
import {makeStyles} from '@material-ui/core/styles';
import {SocketContext} from '../SocketContext'

const useStyles = makeStyles((theme) => ({
    video: {
      width: '550px',
      [theme.breakpoints.down('xs')]: {
        width: '300px',
      },
    },
    gridContainer: {
      justifyContent: 'center',
      [theme.breakpoints.down('xs')]: {
        flexDirection: 'column',
      },
    },
    paper: {
      padding: '10px',
      border: '2px solid black',
      margin: '10px',
    },
  }));

function VideoPlayer() {
    const context = useContext(SocketContext)
    const classes = useStyles();
    const {call,callAccepted,myVideo,userVideo,stream,name,callEnded} = context;
    return (
        <>

            <Grid container className = {classes.gridContainer}>
                {stream && (
                <Paper className={classes.paper}>
                    <Grid item xs={12} md ={6}>
                        <Typography variant="h5" gutterBottom>{name || 'User1'}</Typography>
                        <video playsInline muted ref={myVideo} autoPlay className={classes.video}></video>
                    </Grid>
                </Paper>)}
                
                {callAccepted && !callEnded && (
                <Paper className={classes.paper}>
                    <Grid item xs={12} md ={6}>
                        <Typography variant="h5" gutterBottom>{call.name || 'user2'}</Typography>
                        <video playsInline ref={userVideo} autoPlay className={classes.video}></video>
                    </Grid>
                </Paper>)}
            </Grid>
        </>
    )
}

export default VideoPlayer
