import Backbone from 'backbone';

// Append or Remove User-Li to Template
export default class UserView extends Backbone.View {
    constructor(options) {
        super(options);
        this.listenTo(this.model, 'remove', this.removeView);
    }
    initialize() {
        this.tagName = 'li';
        this.template = _.template($('#chatroom-user-template').html());
    }
    render() {
        this.$el.html(this.template(this.model));
        return this;
    }
    removeView() {
        this.remove();
    }
}
