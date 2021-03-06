// External modules.
const ReadLine = require("readline");

// Project modules.
const Commands = require("./modules/CommandList.js");
const Server = require("./Server.js");
const Logger = require("./modules/Logger.js");
const express = require("express")
const path = require("path");
const {uuid} = require("./uuidForBackendInterface.json")
const bodyParser = require('body-parser')

// Create console interface.
const inputInterface = ReadLine.createInterface(process.stdin, process.stdout);

// Create and start instance of server.
const instance = new Server();
instance.start();


// Welcome message.
Logger.info(`Running MultiOgarII ${instance.version}, a FOSS agar.io server implementation.`);

// Catch console input.
inputInterface.on("line", (input) => {
    const args = input.toLowerCase().split(" ");
    if(Commands[args[0]]) {
        Commands[args[0]](instance, args)
    };
});



// Create express app
const app = express();
const PORT = process.env.PORT || 10090;
// app.use(bodyParser());
app.use(bodyParser.json());

// check uuid sent in authorization header (only allow commands from clients with our uuid)
app.use(function(req, res, next) {
    if(req.path === "/commands" || req.path === "/updateRoundDuration"){
        if (!req.headers.authorization || req.headers.authorization !== uuid) {
            console.log("Client not authorized!")
          return res.status(403).json({ error: 'Not authorized!' });
        }
    }
    next();
  });
  
  // app.use(express.static(path.join(__dirname,"/backendInterface")))
  app.get("/", (req, res) => {
  // app.use('/', express.static('backendInterface'));
  // app.use(express.static(__dirname + "/backendInterface"));
  res.sendFile(path.join(__dirname + "/backendInterface/index.html"));
  app.use(express.static("backendInterface"));

});

// app.get("*", (req, res) => {
//   res.sendFile(path.resolve(__dirname, "backendInterface", "index.html"));
// });


//todo change to post
app.post("/commands", (req, res) => {
    console.log("command received:" + req.query.command)
    const args = req.query.command.toLowerCase().split(" ");
    if(Commands[args[0]]) {
        Commands[args[0]](instance, args)
    };
    switch(args[0]){
      case "roundstart":
        res.setHeader('Content-Type', 'application/json');
        res.end(JSON.stringify({ roundStartTime: instance.mode.roundStartTime, duration: instance.mode.roundDuration, timeElapsed: Date.now() - (instance.mode.roundStartTime + instance.mode.accumulatedPauseTime)}));
        // res.end(JSON.stringify({ roundStartTime: instance.mode.roundStartTime, duration: instance.mode.roundDuration, timeElapsed: Date.now() - instance.mode.roundStartTime}));
        break 

      case "updateroundduration":
        res.setHeader('Content-Type', 'application/json');
        if(instance.mode.roundStarted) {
          res.status(500).end(JSON.stringify({
            error: "Cannot update round duration until round has ended."
          }))
          res.end()
        }
        else{
          res.end(JSON.stringify({ duration: instance.mode.roundDuration}));
        }
        break
      default:
        res.status(200).end()
    }
});

app.get("/requests", (req, res) => {
    // console.log("Request received:" + req.query.request)
    const args = req.query.request.toLowerCase().split(" ");
    switch(args[0]){
      case "roundduration":
        res.setHeader('Content-Type', 'application/json');
        res.end(JSON.stringify({ duration: instance.mode.roundDuration}));
        break;
      case "countdowntime":
        res.setHeader('Content-Type', 'application/json');
        res.end(JSON.stringify({ roundStartTime: instance.mode.roundStartTime, duration: instance.mode.roundDuration, timeElapsed: Date.now() - (instance.mode.roundStartTime + instance.mode.accumulatedPauseTime)}));
        // res.end(JSON.stringify({ roundStartTime: instance.mode.roundStartTime, duration: instance.mode.roundDuration, timeElapsed: Date.now() - instance.mode.roundStartTime}));
        break

      default:
        res.status(400).end()
      }

});

// app.post('/updateRoundDuration', function (req, res) {
//   console.log(req.body)
//   // res.send('POST request to the homepage')
//   res.end(JSON.stringify({ duration: instance.mode.roundDuration}));
// })


app.listen({ port: PORT }, () =>
  console.log(
    `🚀 Server ready at http://localhost:${PORT}`
  )
);