import Backbone from 'backbone';
import User from '../models/user';

// Users Collection
export default class Userlist extends Backbone.Collection {
    constructor(options) {
        super(options);
        this.model = User;
    }
}
