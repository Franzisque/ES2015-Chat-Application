import socket from '../socket';
import Backbone from 'backbone';

// Message Model
export default class Message extends Backbone.Model {
    constructor(options) {
            super();
            this.text = options.text;
            this.user = options.user;
            this.room = options.room;
            this.time = new Date().toTimeString().replace(/.*(\d{2}:\d{2}).*/, "$1");
        }
        // send() method with text, user, room data
    send() {
        let data = {
            text: this.text,
            user: this.user,
            room: this.room
        };

        socket.emit('send-message', {
            message: data
        });
    }
}
