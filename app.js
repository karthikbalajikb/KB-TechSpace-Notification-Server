import express from 'express';
import http from 'http';
import bodyParser from 'body-parser';
import cookieParser from 'cookie-parser';
import morganBody from 'morgan-body';
import SocketIO from 'socket.io';

const expressApp = express();
const app = http.Server(expressApp);

const IO = new SocketIO(app);

expressApp.use(bodyParser.json());
expressApp.use(bodyParser.urlencoded({ extended: true }));
expressApp.use(cookieParser());
morganBody(expressApp);

// CORS headers for pre-flight request
expressApp.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', req.headers.origin);
  res.header(
    'Access-Control-Allow-Headers',
    'Origin, X-Requested-With, Content-Type, Accept, pragma, cache-control',
  );
  res.header(
    'Access-Control-Allow-Methods',
    'POST, GET, PUT, PATCH, DELETE, OPTIONS',
  );
  res.header('Access-Control-Allow-Credentials', true);
  next();
});

expressApp.options('/*', (req, res) => {
  res.send();
});

IO.on('connection', (socket) => {
  socket.emit('news', { hello: 'world' });

  socket.on('subscribeToTimer', (interval) => {
    console.log('socket is subscribing to timer with interval ', interval);
    setInterval(() => {
      socket.emit('timer', new Date());
    }, interval);
  });

  const { nick } = socket.handshake.query;
  const currentUser = {
    id: socket.id,
    nick,
  };

  socket.on('ding', () => {
    socket.emit('dong');
  });

  socket.on('disconnect', () => {
    socket.broadcast.emit('userDisconnect', { nick: currentUser.nick });
  });

  socket.on('userChat', (data) => {
    socket.broadcast.emit('serverSendUserChat', {
      nick: '_nick',
      message: '_message',
    });
  });
});

export default app;
