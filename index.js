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
app.use(express.json())

const port = process.env.PORT || 5000;


app.get("/",(req,res)=>{
    res.send("Server running");
})

io.on('connection',(socket)=>{
    socket.emit('me',socket.id);
    
    socket.on('disconnected',()=>{
        socket.broadcast.emit('disconnected');
    });

    socket.on("calluser",({userToCall, signalData,from, name})=>{
        io.to(userToCall).emit("calluser",{signal: signalData, from, name});
    });

    socket.on("answercall",(data)=>{
        io.to(data.to).emit("call accepted",data.signal);
    });
});


server.listen(port,() => {
    console.log(`App listening at http://localhost:${port}`)
})