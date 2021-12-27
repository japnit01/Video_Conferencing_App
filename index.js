const express = require("express");
const http = require("http")
const cors = require("cors");

const app = express()
const server = http.createServer(app);
const io = require("socket.io")(server,{
    cors:{
        origin:"*",
        method:["GET","POST"]
    }
});

app.use(cors());

const port = process.env.PORT || 5000;


app.get("/",(req,res)=>{
    res.send("Server running");
})

io.on('connection',(socket)=>{
    socket.emit('me',socket.id);
    
    socket.on('disconnect',()=>{
        socket.broadcast.emit('callEnded');
    });

    socket.on("callUser",({userToCall, signalData,from, name})=>{
        io.to(userToCall).emit("callUser",{signal: signalData, from, name});
    });

    socket.on("answerCall",(data)=>{
        io.to(data.to).emit("callAccepted",data.signal);
    });
});


server.listen(port,() => {
    console.log(`App listening at http://localhost:${port}`)
})