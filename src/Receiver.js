const MESSAGE_BUS = 'urn:x-cast:com.google.cast.twitch-embed';

export class Receiver {

    constructor(player) {
        this.player = player;
    }

    connect() {
        cast.receiver.logger.setLevelValue(0);

        console.log('Starting Receiver Manager');

        window.castReceiverManager = cast.receiver.CastReceiverManager.getInstance();

        window.castReceiverManager.onReady = function (event) {
            console.log('Received Ready event: ' + JSON.stringify(event.data));
            window.castReceiverManager.setApplicationState('Application status is ready...');
        };

        window.messageBus = window.castReceiverManager.getCastMessageBus(
            MESSAGE_BUS
        );
        window.messageBus.onMessage = function (event) {

            console.log(`Received message from: ${event.senderId}`);

            const json = event.data;
            const data = JSON.parse(json);
            const channel = data.channel;
            let response;

            try {
                this.player.play(channel);
                response = JSON.stringify({
                    requestId: data.requestId,
                    message: 'Started playback'
                });
            } catch (e) {
                console.error(`Error starting playback for channel ${channel}`);
                response = JSON.stringify({
                    requestId: data.requestId,
                    message: 'Error starting playback'
                });
            }

            window.messageBus.send(event.senderId, response);
        };

        window.castReceiverManager.start({ statusText: 'Application is starting' });
    }
}
