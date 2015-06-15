import Backbone from 'backbone';

// Add Messages-div to Template
export default class MessageView extends Backbone.View {
    constructor(options) {

        super(options);
    }
    initialize() {

        this.tagName = 'div';

        this.template = _.template($('#chatroom-message-template').html());
    }
    render() {
        this.$el.html(this.template(this.model));

        return this;
    }
}
