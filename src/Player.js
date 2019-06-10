export class Player {
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
