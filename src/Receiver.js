const MESSAGE_BUS = 'urn:x-cast:com.google.cast.twitch-embed';

const Commands = {
    PLAY_CHANNEL: 'playChannel',
    PLAY_VIDEO: 'playVideo',
    SEEK: 'seek'
};

export class Receiver {

    constructor(player) {
        this.player = player;
    }

    connect() {
        cast.receiver.logger.setLevelValue(0);

        console.log('Starting Receiver Manager');

        window.castReceiverManager = cast.receiver.CastReceiverManager.getInstance();

        window.castReceiverManager.onReady = event => {
            console.log('Received Ready event: ' + JSON.stringify(event.data));
            window.castReceiverManager.setApplicationState('Application status is ready...');
        };

        window.messageBus = window.castReceiverManager.getCastMessageBus(
            MESSAGE_BUS
        );
        window.messageBus.onMessage = event => {

            console.log(`Received message from: ${event.senderId}`);

            const json = event.data;
            const command = JSON.parse(json);
            let response;

            try {
                response = this.executeCommand(command);
            } catch (e) {
                console.error(`Error executing command ${command}`, e);
                response = makeResponse(`Error executing command: ${e}`, command);
            }

            window.messageBus.send(event.senderId, response);
        };

        window.castReceiverManager.start({ statusText: 'Application is starting' });
    }

    executeCommand(command) {
        const { type } = command;

        switch (type) {
            case Commands.PLAY_CHANNEL:
                this.player.playChannel(command.channel);
                return makeResponse(`Started playing channel ${command.channel}`, command);
            case Commands.PLAY_VIDEO:
                this.player.playVideo(command.video);
                return makeResponse(`Started playing video ${command.video}`, command);
            case Commands.SEEK:
                this.player.seek(command.time);
                return makeResponse(`Seek to time ${command.time}`, command);
            default:
                return makeResponse(`Unknown command: ${command}`, command);
        }
    }

}

function makeResponse(text, command) {
    return JSON.stringify({
        message: text,
        requestId: command.requestId
    });
}
