window.onload = init;

function init() {
    connect();
    initFromQuery();
}

function initFromQuery() {
    const params = new URLSearchParams(window.location.search);
    const channel = params.get('channel');

    if (!channel) return;

    loadChannel(channel);
}
