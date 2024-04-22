/* Pakete die wir brauchen */
const express = require('express'); //Express module
const app = express();
const path = require('path');
const http = require('http');
const WebSocket = require('ws');
const fs = require('fs');

const PORT = process.env.PORT || 8081;


/* Nutzen einer statischen WebSeite
*/
app.use(express.static('public'));

// Wir nutzen ein paar statische Ressourcen
app.use('/css', express.static(__dirname + '/public/css'))
app.use('/js', express.static(__dirname + '/public/js'))
app.use('/images', express.static(__dirname + '/public/images'))

const server = http.createServer(app);
const wss = new WebSocket.Server({ server });

//Reaction to connections and how to get responses
wss.on('connection', function (ws) {
  ws.on('message', function (message) {
    console.log('Received message: ', message);

    const botResponse = getBotResponse(message);

    wss.clients.forEach(client => {
      if (client.readyState === WebSocket.OPEN) {
        client.send(botResponse);
      }
    });
  });

  ws.onclose(function() {
    console.log('Websocket connection closed');
  });
});
//Get the party started (start the server)
server.listen(PORT, () => {
  console.log('Server started at http://localhost:' + PORT);
});

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});
var sw = 1;

function getBotResponse(userMsg) {
  //READ
  const responsesFilePath = path.join(__dirname, 'responses.json');
  const responsesData = fs.readFileSync(responsesFilePath, 'utf-8');
  const botResponses = JSON.parse(responsesData);
  //RETREIVE
  const botResponse = botResponses[userMsg.toLowerCase()];
  //CHECK
  if (botResponse) {
    return botResponse;
  }

  //Otherwise we need a fallback response, so a repeat of the function from the chatbot but with two new fallback responses

  return swtch();
}

//switch help function between fallback statements
function swtch() {
  if (sw.equals(1)) {
    sw = 2;
    return "I'm afraid I have to ask you to repeat that";
  } else {
    sw = 1;
    return "Can you walk me through that again ?";
  }
}