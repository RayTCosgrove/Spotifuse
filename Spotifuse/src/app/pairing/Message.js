"use strict";
exports.__esModule = true;
exports.Message = void 0;
var Message = /** @class */ (function () {
    function Message(sender, pin, paired) {
        if (paired === void 0) { paired = false; }
        this.sender = sender;
        this.pin = pin;
        this.paired = paired;
    }
    return Message;
}());
exports.Message = Message;
