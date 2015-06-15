import Backbone from 'backbone';
import socket from '../socket';
import UserView from './userView.js';
import user from '../currentUser';
import MessageView from './messageView';

// Inside Chatroom View
export default class ChatroomView extends Backbone.View {
    constructor(options) {

        super(options);

        this.addEvents();

        this.render();

        this.listenToSocket();

        this.addActualUser();

    }
    events() {
        this.events = {
            'click #chatrooms-link': 'renderChatroomList',
            'keypress #new-message': 'createMessage'
        };
    }
    initialize() {
        this.clearEvents();

        this.input = '';

        this.setElement($('#content'), true);

        this.template = _.template($('#chatroom-template').html());
    }
    render() {
        this.$el.html(this.template(this.model));
        this.input = $('#new-message');

        return this;
    }
    renderChatroomList(e) {
        socket.emit('leave-room', {
            room: this.model.name,
            user: user.name
        });
        mainView.render();
        e.preventDefault();
    }
    clearEvents() {
        if (this) this.undelegateEvents();
        socket.removeAllListeners("new-message");
        socket.removeAllListeners("new-user");
        socket.removeAllListeners("all-users");
        socket.removeAllListeners("remove-user");
    }
    addEvents() {
        this.listenTo(this.model.messages, 'add', this.addMessage);
        this.listenTo(this.model.users, 'add', this.addUser);
    }
    createMessage(e) {
        let message = this.input.val();
        if (!message || e.keyCode !== 13) return;

        this.model.messages.add({
            text: message,
            user: user.name,
            room: this.model.name
        }).send();

        this.input.val('');
    }
    // append message to View
    addMessage(model) {
        let view = new MessageView({
            model
        });
        $('#messages').append(view.render().el);
    }
    listenToSocket() {
        socket.on('new-message', function(data) {
            this.model.messages.add({
                text: data.text,
                user: data.user,
                room: data.room
            });
        }.bind(this));

        socket.on('new-user', function(data) {
            this.model.users.add(data);
        }.bind(this));

        socket.on('all-users', function(data) {
            for (let i = 0; i < data.length; i++) {
                this.model.users.add(data[i]);
            }
        }.bind(this));

        socket.on('remove-user', function(data) {
            let removeme = this.model.users.find((x) => {
                return x.name == data;
            });
            this.model.users.remove(removeme);
        }.bind(this));
    }
    addUser(model) {
        let view = new UserView({
            model
        });
        if (model === user) {
            let li = $(view.render().el).addClass("active");
            $('#users').append(li);
        } else {
            $('#users').append(view.render().el);
        }
    }
    addActualUser() {
        socket.emit('join-room', {
            room: this.model.name,
            user: user.name
        });

        this.model.users.add(user);
    }
}
