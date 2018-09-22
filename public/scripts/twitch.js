const VIDEO_CONTAINER_ID = 'twitch-embed';
const CHAT_CONTAINER_ID = 'chat';

function loadChannel(channelName) {
    new Twitch.Embed(VIDEO_CONTAINER_ID, {
        width: '100%',
        height: '100%',
        channel: channelName,
        layout: 'video',
        theme: 'dark'
    });

    new Zen(CHAT_CONTAINER_ID, { channels: [channelName] });
}
