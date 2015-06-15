require('babel/register');
let assert = require("assert");

import User from "../../../app/js/models/user";

describe("UserModel", () => {

    describe("assign name to user", () => {

        it("should equal the correct user name", () => {
            var firstUser = new User('Lola');
            assert.equal(firstUser.name, 'Lola');
        });
    });
});
