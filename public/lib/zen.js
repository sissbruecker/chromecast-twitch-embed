(function (global, factory) {
    typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory(require('tmi.js')) :
    typeof define === 'function' && define.amd ? define(['tmi.js'], factory) :
    (global.Zen = factory(global.tmi));
}(this, (function (tmi) { 'use strict';

    const DEFAULT_LIMIT = 50;

    class MessageList {

        constructor(container, limit) {
            this.container = container;
            this.limit = limit || DEFAULT_LIMIT;
            this.pending = [];

            this.update = this.update.bind(this);
        }

        append(el) {
            this.pending.push(el);
            requestAnimationFrame(this.update);
        }

        update() {
            this.pending.forEach(el => this.container.prepend(el));
            this.pending = [];
            removeChildren(this.container, this.limit);
        }

        clear() {
            this.pending = [];
            removeChildren(this.container, 0);
        }
    }

    function removeChildren(el, limit) {
        while (el.childElementCount > limit) {
            el.removeChild(el.lastChild);
        }
    }

    function renderNotice(message, type) {
        const el = document.createElement('p');
        el.classList.add('zen-notice', type);
        el.innerText = message;
        return el;
    }

    function renderMessage(user, message) {

        const userName = user['display-name'];
        const userColor = user['color'] || 'inherit';

        const el = document.createElement('p'),
            userEl = document.createElement('span'),
            messageEl = document.createElement('span');

        userEl.innerText = userName;
        userEl.classList.add('zen-user');
        userEl.style['color'] = userColor;

        messageEl.innerText = `: ${message}`;
        messageEl.classList.add('zen-text');

        el.classList.add('zen-message');
        el.appendChild(userEl);
        el.appendChild(messageEl);

        return el;
    }

    class Client {

        constructor(list) {
            this.list = list;
        }

        connect(options) {
            const client = new tmi.client(options);

            client.on('connected', this.handleConnected.bind(this));
            client.on('disconnected', this.handleDisconnected.bind(this));
            client.on('message', this.handleMessage.bind(this));

            client.connect();
        }

        handleConnected(address, port) {
            this.list.append(
                renderNotice(`Connected to ${address}:${port}`)
            );
        }

        handleDisconnected(reason) {
            this.list.append(
                renderNotice(`Disconnected ${reason}`)
            );
        }

        handleMessage(channel, user, message, self) {
            this.list.append(
                renderMessage(user, message)
            );
        }

    }

    function Zen(containerId, options) {

        const container = setupContainer(containerId);
        const messageList = new MessageList(container, options.messageLimit);
        const client = new Client(messageList);

        client.connect(options);
    }

    function setupContainer(containerId) {
        const container = document.getElementById(containerId);
        container.classList.add('zen-container');

        return container;
    }

    return Zen;

})));
