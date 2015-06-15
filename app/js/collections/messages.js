import Backbone from 'backbone';
import Message from '../models/message'

// Messages Collection
export default class Messagelist extends Backbone.Collection {
    constructor(options) {
        super(options);
        this.model = Message;
    }
}
