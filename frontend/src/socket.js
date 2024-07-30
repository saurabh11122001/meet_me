import io from 'socket.io-client';

const socket = io('http://localhost:5000'); // Replace with your backend server URL

export default socket;