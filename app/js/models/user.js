import Backbone from 'backbone';

// User Model
export default class User extends Backbone.Model {
    constructor(name = "unnamed") {
        super();
        this.name = name;
    }
}
