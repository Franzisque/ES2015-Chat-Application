import Backbone from 'backbone';
import Chatroom from '../models/chatroom';

// Chatroom Collection
export default class ChatroomList extends Backbone.Collection {
    constructor(options) {
        super(options);
        this.idAttribute = "_id";
        this.model = Chatroom;
        this.url = '/roomlist';
    }
}
