'use strict';

const Utils = require('../../util/utils');
const Builder = require("../../builder");
const Config = require('../../../config');

class Input extends Builder.Validator {
    constructor(address, coins) {
        super();
        this.address = address;
        this.coins = coins;
    }

    GetSignBytes() {
        let msg = {
            "address": this.address,
            "coins": this.coins
        };
        return Utils.sortObjectKeys(msg)
    }

    ValidateBasic() {
        if (Utils.isEmpty(this.address)) {
            throw new Error("address is empty");
        }

        if (Utils.isEmpty(this.coins)) {
            throw new Error("coins is empty");
        }
    }
}

class Output extends Builder.Validator {
    constructor(address, coins) {
        super();
        this.address = address;
        this.coins = coins;
    }

    GetSignBytes() {
        let msg = {
            "address": this.address,
            "coins": this.coins
        };
        return Utils.sortObjectKeys(msg)
    }

    ValidateBasic() {
        if (Utils.isEmpty(this.address)) {
            throw new Error("address is empty");
        }

        if (Utils.isEmpty(this.coins)) {
            throw new Error("coins is empty");
        }
    }
}

class MsgSend extends Builder.Msg {
    constructor(from, to, coins) {
        super(Config.iris.tx.transfer.prefix);
        this.inputs = [new Input(from, coins)];
        this.outputs = [new Output(to, coins)];
    }

    GetSignBytes() {
        let inputs = [];
        let outputs = [];
        this.inputs.forEach(function(item) {
            inputs.push(item.GetSignBytes())
        });
        this.outputs.forEach(function(item) {
            outputs.push(item.GetSignBytes())
        });
        let msg = {
            "inputs": inputs,
            "outputs": outputs
        };

        return Utils.sortObjectKeys(msg);
    }

    ValidateBasic() {
        if (Utils.isEmpty(this.inputs)) {
            throw new Error("sender is  empty");
        }
        if (Utils.isEmpty(this.outputs)) {
            throw new Error("sender is  empty");
        }

        this.inputs.forEach(function(input) {
            input.ValidateBasic();
        });

        this.outputs.forEach(function(output) {
            output.ValidateBasic();
        })

    }
    GetDisplayContent(){
        return {
            i18n_tx_type:"i18n_transfer",
            i18n_from:this.inputs[0].address,
            i18n_to:this.outputs[0].address,
            i18n_amount:this.outputs[0].coins,
        }
    }
}



module.exports = class Bank {
    static createMsgSend(req) {
        let coins = [];
        if (!Utils.isEmpty(req.msg.coins)) {
            req.msg.coins.forEach(function(item) {
                coins.push({
                    denom: item.denom,
                    amount: Utils.toString(item.amount),
                });
            });
        }
        return new MsgSend(req.from, req.msg.to, coins);
    }
};
