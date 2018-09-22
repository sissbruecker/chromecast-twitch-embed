(function () {
    'use strict';

    class Player {
        constructor(videoEl, chatEl) {
            this.isPlaying = false;
            this.videoEl = videoEl;
            this.chatEl = chatEl;
        }

        play(channel) {
            if (!this.isPlaying) {
                this.isPlaying = true;
                this.embed = new Twitch.Embed(this.videoEl, {
                    width: '100%',
                    height: '100%',
                    channel: channel,
                    layout: 'video',
                    theme: 'dark'
                });
                this.chat = new Zen(this.chatEl, { channels: [channel], theme: 'dark' });
            } else {
                this.embed.player.setChannel(channel);
                this.chat.moveTo(channel);
            }
        }
    }

    const MESSAGE_BUS = 'urn:x-cast:com.google.cast.twitch-embed';

    class Receiver {

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

    const VIDEO_CONTAINER_ID = 'twitch-embed';
    const CHAT_CONTAINER_ID = 'chat';

    let player;
    let receiver;

    window.onload = init;

    function init() {

        player = new Player(VIDEO_CONTAINER_ID, CHAT_CONTAINER_ID);
        receiver = new Receiver(player);

        receiver.connect();
        tryPlayFromQuery();
    }

    function tryPlayFromQuery() {
        const params = new URLSearchParams(window.location.search);
        const channel = params.get('channel');

        if (!channel) return;

        player.play(channel);
    }

}());
