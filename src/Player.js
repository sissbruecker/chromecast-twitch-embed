export class Player {
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
