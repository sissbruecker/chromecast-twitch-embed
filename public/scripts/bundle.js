(function () {
    'use strict';

    class Player {
        constructor(videoEl, chatEl) {
            this.videoEl = videoEl;
            this.chatEl = chatEl;

            this.chat = new Zen(this.chatEl, {
                channels: [],
                theme: 'dark',
                connection: { port: 443, reconnect: true }
            });
        }

        playChannel(channel) {
            this.initPlayer({ channel });
            this.chat.moveTo(channel);
        }

        playVideo(video) {
            this.initPlayer({ video });
            this.chat.leave();
        }

        seek(timestamp) {
            if (!this.player) return;

            this.player.seek(timestamp);
        }

        initPlayer(options) {
            this.destroy();
            this.player = new Twitch.Player(this.videoEl, {
                width: '100%',
                height: '100%',
                ...options
            });
            this.player.setVolume(1);
        }

        destroy() {
            this.player && this.player.destroy();
            this.player = null;
        }
    }

    const MESSAGE_BUS = 'urn:x-cast:com.google.cast.twitch-embed';

    const Commands = {
        PLAY_CHANNEL: 'playChannel',
        PLAY_VIDEO: 'playVideo',
        SEEK: 'seek'
    };

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
        const video = params.get('video');

        if (channel) {
            player.playChannel(channel);
        }

        if (video) {
            player.playVideo(video);
        }
    }

}());
