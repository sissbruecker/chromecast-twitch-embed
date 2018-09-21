const CONTAINER_ID = 'twitch-embed';

function loadChannel(channelName) {
    new Twitch.Embed(CONTAINER_ID, {
        width: '100%',
        height: '100%',
        channel: channelName,
        chat: 'mobile',
        'font-size': 'medium',
        theme: 'dark'
    });
}
