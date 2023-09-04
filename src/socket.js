import { io } from "socket.io-client";

let socket = io("http://localhost:5000");

console.log(socket);

socket.on("connect", () => {
  console.log("connected to socket");
});


export default socket