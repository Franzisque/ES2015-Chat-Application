import Backbone from 'backbone';
import ChatroomView from './chatroomView';
import ChatroomListView from './chatroomListView';
import chatroomView from '../currentUser.js'

// Single Chatroom List-Item View
export default class ChatroomItemView extends Backbone.View {
    constructor(options) {
        super(options);
    }

    tagName() {
        return 'li';
    }

    events() {
        return {
            'click .chatroom': 'showChatroom'

        }
    }
    initialize() {
        this.template = _.template($('#chatroom-item-template').html());
    }
    render() {
        this.$el.html(this.template(this.model));
        return this;
    }
    showChatroom(e) {
        chatroomView = new ChatroomView({
            model: this.model
        });

        e.preventDefault();
    }
}
