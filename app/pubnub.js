const PubNub = require('pubnub');

const credentials = {
    publishKey: 'pub-c-93e290f4-e5ae-4f92-9457-5a5c8e123897',
    subscribeKey: 'sub-c-ed4ab200-e057-48f7-8da6-855e1900fdd1',
    secretKey: 'sec-c-NmJlMjI3MmQtZjkwOC00ODAyLThkOGUtZjlmYTM3NmE4YzY1'
};

const CHANNELS = {
    TEST: 'TEST',
    BLOCKCHAIN: 'BLOCKCHAIN'
};

class PubSub {
    constructor({ blockchain }) {
        this.blockchain = blockchain;

        this.pubnub = new PubNub(credentials);

        this.pubnub.subscribe({ channels: Object.values(CHANNELS) });
        // this.pubnub.subscribeToChannels;

        this.pubnub.addListener(this.listener());
    }

    listener() {
        return{
            message: messageObject => {
                const { channel, message} = messageObject;

                console.log(`message received. Channel: ${channel}. Message ${message}`);
                const parseMessage = JSON.parse(message);

                if(channel === CHANNELS.BLOCKCHAIN) {
                    this.blockchain.replaceChain(parseMessage);
                }
            }
        };
    }

    // subscribeToChannels() {
    //     Object.values(CHANNELS).forEach(channel => {
    //         this.pubnub.subscribe(channel);
    //     });
    // }

    publish({ channel, message }) {
        this.pubnub.publish({ channel, message });
    }

    brodcastChain() {
        this.publish({
            channel: CHANNELS.BLOCKCHAIN,
            message: JSON.stringify(this.blockchain.chain)
        });
    }
}

// const testPubSub = new PubSub();
// testPubSub.publish({ channel:CHANNELS.TEST, message: 'hello pubnub' });

module.exports = PubSub;