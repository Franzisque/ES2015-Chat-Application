require('babel/register');
var assert = require("assert");

import Message from "../../../app/js/models/message";

describe("MessageModel", () => {

   describe("Tests for MessageModel", () => {

        it("should set the correct message-text", () => {
            let options = {
                text: "Hey Dude!"
            };
            let message = new Message(options);
            assert.equal(message.text, "Hey Dude!");
        });

        it("should set time with correct format", () => {
            let options = {
                room: "chill-out lounge"
            };
            let message = new Message(options);
            assert.equal(message.room, "chill-out lounge");
        });
    });

    describe("assign options to message", () => {

        it("should equal the correct user name", () => {
            let message = new Message({
                user: 'test'
            });
            assert.equal(message.user, 'test');
        });

        it("should equal the correct message text", () => {
            let message = new Message({
                text: 'test'
            });
            assert.equal(message.text, 'test');
        });

        it("should equal the correct chat room", () => {
            let message = new Message({
                room: 'test'
            });
            assert.equal(message.room, 'test');
        });

        it("should equal the correct time", () => {
            let message = new Message({});
            let time = new Date().toTimeString().replace(/.*(\d{2}:\d{2}).*/, "$1");
            assert.equal(message.time, time);
        });
    });
});