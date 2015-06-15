import socket from './socket';
import User from './models/User';

let user = new User();

$(() => {

    socket.on('user-connected', (data) => {
        user.name = data.name;
    });

});

export let chatroomView;
export default user;