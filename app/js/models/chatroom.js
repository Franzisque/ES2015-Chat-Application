import Backbone from 'backbone';
import Userlist from '../collections/users';
import Messagelist from '../collections/messages';

// Chatroom Model
export default class Chatroom extends Backbone.Model {
    constructor(options) {
        super(options);
        this.name = options.name;
        this.users = new Userlist();
        this.messages = new Messagelist();
        this.url = '/roomlist';
    }
}
