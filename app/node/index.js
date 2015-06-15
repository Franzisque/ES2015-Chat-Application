// Require used packages
let express = require('express'),
    bodyParser = require('body-parser'),
    app = express(),
    http = require('http').Server(app),
    io = require('socket.io')(http),
    mongoose = require('mongoose'),
    Chatroom = require('./models/chatroom'),
    User = require('./models/user'),
    backbone = require('backbone'),
    Chance = require('chance'),
    path = require('path'),
    _ = require('lodash'),
    server;

// Connect to Database 'akw-chat' via mongoose
let db = mongoose.connect('mongodb://localhost/akw-chat');

let chance = new Chance();

app.use(express.static(__dirname + '../../../'));

app.use(bodyParser.json());

app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
    res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    if ('OPTIONS' == req.method) {
        res.send(200);
    } else {
        next();
    }
});

// Set root path to compiled html file
app.get('/', (req, res) => {
    res.sendFile(path.resolve('out/index.html'));
});

// Path to Chatroomlist - get ChatroomList
app.get('/roomlist', (req, res) => {
    Chatroom.find({}, (err, chatrooms) => {
        // Send Internal Server Error if no Chatrooms are find
        if (err) {
            return res.status(500).json(err);
        }
        return res.json(chatrooms);
    });
});

// Create new Chatroom with given name
app.post('/roomlist', (req, res) => {
    let chatroom = new Chatroom();
    chatroom.name = req.body.name;
    chatroom.save(() => {
        res.send(req.body);
    });
});

// Path to UserList - get Users
app.get('/userlist', (req, res) => {
    User.find({}, (err, users) => {
        // Send Internal Server Error if no Chatrooms are find
        if (err) {
            return res.status(500).json(err);
        }
        return res.json(users);
    });
});

// Joining Rooms
let joinRoom = (socket, user, room) => {
    // Create User with Username
    let newUser = new User();
    newUser.username = user;
    // Save new User
    newUser.save((err) => {
        if (err) {
            console.log("1", err);
            return;
        }
        // Find Chatroom which the User wants to join
        Chatroom.findOne({
            name: room
        }, (err, chatroom) => {
            if (err) {
                console.log("2", err);
                return;
            }
            // create new userArray if empty,
            // else use existing userArray of the chatroom
            let userArray;
            if (!_.isArray(chatroom.users)) {
                userArray = [];
            } else {
                userArray = chatroom.users;
            }

            // emit all users
            socket.emit('all-users', chatroom.users);

            // push new user to the userArray
            userArray.push(newUser.username);

            // append the new user to the chatroom
            chatroom.update({
                users: userArray
            }, (err, c) => {
                if (err) {
                    console.log("3", err);
                    return;
                }
                socket.to(chatroom.name).emit('new-user', newUser.username);
            });
        });
    });
};

// Leave Chatroom
let leaveRoom = (socket, user, room) => {
    // Remove User when leaving the chatroom
    User.remove({
        username: user
    }, (err, removed) => {
        if (err) {
            console.log(err);
            return;
        }
    });
    // Find the Chatroom which a User wants to leave
    Chatroom.findOne({
        name: room
    }, (err, chatroom) => {
        if (err) {
            console.log(err);
            return;
        }
        // if no errors remove user from chatroom
        // update Chatroom
        chatroom.users.pull(user);
        chatroom.save((err) => {
            if (err) {
                console.log(err);
                return;
            }
            socket.to(room).emit('remove-user', user);
        });
    });
};

// randomly assign usernames from nodejs plugin
let initialize = (name) => {
    name = chance.name();
    User.findOne({
        username: name
    }, (err, model) => {
        if (err) {
            console.log(err);
            return;
        }
        // avoid duplication of existing usernames in database
        if (model !== null && model.username === name) initialize();
    });
    return name;
};

// Socket.io connections - listeners
io.on('connection', (socket) => {
    let name = initialize(name);
    let room = null;
    socket.emit('user-connected', {
        name: name
    });
    socket.on('join-room', (data) => {
        room = data.room;
        socket.join(data.room);
        joinRoom(socket, data.user, data.room);
    });
    socket.on('leave-room', (data) => {
        room = null;
        socket.leave(data.room);
        leaveRoom(socket, data.user, data.room);
    });
    socket.on('send-message', (data) => {
        socket.to(data.message.room).emit('new-message', data.message);
    });
    socket.on('disconnect', (data) => {
        if (room !== null) leaveRoom(socket, name, room);
    });
});

// Server Connection with Exception Handling
try {
    server = http.listen(3000, () => {
        console.log('Listening on port %d', server.address().port);
    });
} catch (err) {
    console.log(err);
}
