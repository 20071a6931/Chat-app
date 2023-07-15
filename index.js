const express= require("express")
const app=express()
const http=require("http")
const cors=require("cors")
const {Server}= require("socket.io")

const path=require('path');

app.use(cors())

//connect build of react app with nodejs
app.use(express.static(path.join(__dirname,"./client/build")))

//   ---------------deployment----------------
app.get('/',(req,res)=>{
    app.use(express.static(path.resolve(__dirname,'./client/build')))
    res.sendFile(path.resolve(__dirname,'./client/build','index.html'))
  })
  
  // ---------------deployment----------------

const server=http.createServer(app);
const io=new Server(server,{
    cors:{
        origin: "https://react-chat-app.onrender.com",
        methods: ["GET","POST"],
    }
}) 

io.on("connection", (socket)=>{
    console.log(`user connected: ${socket.id}`);

    socket.on("join_room",(data)=>{
        socket.join(data)
        console.log(`user with ID: ${socket.id} joined room:${data}`);
    })

    socket.on("send_message",(data)=>{
        socket.to(data.room).emit("receive_message",data)
    })
    socket.on("disconnect", ()=>{
        console.log("user disconnected",socket.id); 
    })
})

server.listen(process.env.PORT || 5000,()=>{
    console.log("server is running");
})
