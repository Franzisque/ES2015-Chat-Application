require('babel/register');
var assert = require("assert");

import Chatroom from "../../../app/js/models/chatRoom";

describe("ChatRoomModel", () => {

    describe("Tests for ChatRoom", () => {

        it("should set the right name of a user", () => {
            let options = {
                name: "Tom"
            };
            let chatRoom = new Chatroom(options);
            assert.equal(chatRoom.name, "Tom");
        });

    });
});