import { Player } from './Player';
import { Receiver } from './Receiver';

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
