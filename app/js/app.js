import Backbone from 'backbone';
import ChatroomListView from './views/chatroomListView';

$(() => {
    
    // Begin monitoring hashchange events
    // dispatching routes
    Backbone.history.start();
});

export let mainView = new ChatroomListView();