// api/index.js
let socket: WebSocket;

const baseURL =
  window.location.href.indexOf('localhost') > -1
    ? 'ws://localhost:8080'
    : 'wss://api.friendofours.xyz';

const connect = (
  alias: string,
  publicKey: string,
  sig: string,
  walletAddr: string
): Promise<WebSocket | Event> => {
  return new Promise((resolve, reject) => {
    const params4 = new URLSearchParams({ alias, publicKey, sig, walletAddr });
    const connUrl = baseURL + '/ws?' + params4.toString();
    console.log('Attempting Connection...', connUrl);
    socket = new WebSocket(connUrl);

    socket.onopen = (event) => {
      console.log('onopen', event);
      resolve(socket);
    };

    socket.onmessage = (msg) => {
      console.log(msg);
    };

    socket.onclose = (event) => {
      console.log('Socket Closed Connection: ', event);
    };

    socket.onerror = (error) => {
      console.log('Socket Error: ', error);
      reject(error);
    };
  });
};

const sendMsg = (msg: string) => {
  console.log('sending msg: ', msg);
  socket?.send(msg);
};

export { connect, sendMsg };
