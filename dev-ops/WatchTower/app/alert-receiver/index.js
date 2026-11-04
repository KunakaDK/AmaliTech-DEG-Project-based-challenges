const http = require('node:http');

const MAX_BODY_BYTES = 1024 * 1024;

const server = http.createServer((req, res) => {
  if (req.method !== 'POST' || req.url !== '/alerts') {
    res.writeHead(404).end();
    return;
  }

  let body = '';
  let bodySize = 0;
  req.on('data', (chunk) => {
    bodySize += chunk.length;
    if (bodySize > MAX_BODY_BYTES) {
      res.writeHead(413).end();
      req.destroy();
      return;
    }
    body += chunk;
  });

  req.on('end', () => {
    let payload;
    try {
      payload = JSON.parse(body);
    } catch (error) {
      res.writeHead(400).end('Invalid JSON');
      return;
    }

    if (!Array.isArray(payload.alerts)) {
      res.writeHead(400).end('Expected an alerts array');
      return;
    }

    for (const alert of payload.alerts) {
      console.log(JSON.stringify({
        level: 'info',
        event: 'alertmanager_notification',
        status: alert.status,
        alertname: alert.labels?.alertname,
        service: alert.labels?.service,
        summary: alert.annotations?.summary,
      }));
    }

    res.writeHead(202).end('Accepted');
  });
});

server.listen(9094, '0.0.0.0', () => {
  console.log(JSON.stringify({ level: 'info', event: 'alert_receiver_ready', port: 9094 }));
});
