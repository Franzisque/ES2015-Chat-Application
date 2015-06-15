import Backbone from 'backbone';
import ChatroomList from '.././collections/chatrooms';
import ChatroomItemView from './chatroomItemView';

// ChatroomList View
export default class ChatroomListView extends Backbone.View {
    constructor() {
        super();
    }
    initialize() {

        this.clearEvents();

        this.chatRooms = new ChatroomList();

        this.setElement($('#content'), true);

        this.input = '';

        this.template = _.template($('#chatroomlist-template').html());

        this.addEvents();

        this.render();

    }
    events() {
        this.events = {
            'keypress #new-chatroom': 'createChatroom'
        };
    }
    clearEvents() {
        var mainView = this;
        if (mainView) mainView.undelegateEvents();
    }
    addEvents() {
        this.listenTo(this.chatRooms, 'add', this.addOne);
        this.listenTo(this.chatRooms, 'reset', this.addAll);
    }
    render() {
        this.chatRooms.fetch();
        this.$el.html(this.template());
        this.input = $('#new-chatroom');
        return this;
    }
    addOne(model) {
        let view = new ChatroomItemView({
            model
        });
        $('#chatroom-list').append(view.render().el);
    }
    addAll() {
        this.$('#chatroom-list').html('');
        this.chatRooms.each(this.addOne, this);
    }
    createChatroom(e) {
        let name = this.input.val();
        if (!name || e.keyCode !== 13) return;

        this.chatRooms.create({
            name: name
        });
        this.input.val('');
    }
}
