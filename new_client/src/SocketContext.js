import React,{createContext,useState,useRef,useEffect} from 'react'
import {io} from 'socket.io-client'
import Peer from 'simple-peer'

const SocketContext = createContext();

const socket = io('https://video-app-js.herokuapp.com/')
// const socket = io('http://localhost:5000')
const ContextProvider  = ({children}) =>{
    const [stream,setStream] = useState();
    const [me,setMe] = useState('');
    const [call,setCall] = useState({});
    const [callAccepted,setCallAccepted] = useState(false);
    const [callRejected,setCallRejected] = useState(false);
    const [name,setName] = useState('')  

    const myvideo = useRef();
    const uservideo = useRef();
    const connectionRef = useRef();

    useEffect(() =>{
        navigator.mediaDevices.getUserMedia({video: true,audio: true})
        .then((currentStream)=>{
            setStream(currentStream)
            
            myvideo.current.srcObject = currentStream;
        })
        console.log(me)
        socket.on("me",(id)=>setMe(id))
        socket.on('calluser',({from,name:callerName,signal})=>{
           setCall({isRecievedCall:true, from, name:callerName, signal}) 
        });
    },[]); 

    const answerCall=()=>{
        setCallAccepted(true);
        const peer = new Peer({intiator:false,trickle:false, stream:null});
        peer.on('signal',(data)=>{
            socket.emit('answerCall',{signal:data,to:call.from});
        });

        peer.on('stream',(currentStream)=>{
            uservideo.current.srcObject = currentStream;
        });

        peer.signal(call.signal);

        connectionRef.current = peer;
    }

    const callUser = (id)=>{
        const peer = new Peer({initiator:true, trickle:false. stream})

        peer.on('signal',(data)=>{
            socket.emit('calluser',{userToCall:id, signalData: data.candidate, from:me, name});
        })

        peer.on('stream',(currentStream)=>{
            uservideo.current.srcObject = currentStream;
        });

         socket.on('callaccepted',(signal)=>{
            setCallAccepted(true);
            peer.signal(signal);
         });

         connectionRef.current = peer;
    }

    const leaveCall = ()=>{
        setCallRejected(true);
        connectionRef.current.destroy();
        window.location.reload();
    }

    return(
        <SocketContext.Provider value={{call,callAccepted,myvideo,uservideo,stream,name,setName,callRejected,me,callUser,leaveCall,answerCall}}>
            {children}
        </SocketContext.Provider>
    )
}

export {ContextProvider,SocketContext}