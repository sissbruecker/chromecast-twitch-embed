export class Player {
    constructor(videoEl, chatEl) {
        this.isPlaying = false;
        this.videoEl = videoEl;
        this.chatEl = chatEl;
    }

    play(channel) {
        if (!this.isPlaying) {
            this.isPlaying = true;
            this.player = new Twitch.Player(this.videoEl, {
                width: '100%',
                height: '100%',
                channel: channel
            });
            this.chat = new Zen(this.chatEl, {
                channels: [channel],
                theme: 'dark',
                connection: { port: 443, reconnect: true }
            });
        } else {
            this.player.setChannel(channel);
            this.chat.moveTo(channel);
        }
    }
}
