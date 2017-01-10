"use strict";

var express = require("express");
var app = express();
var http = require("http").Server(app);
var io = require("socket.io")(http);
var Mustache = require("mustache");
var shuffle = require("knuth-shuffle").knuthShuffle;

var port = process.env.PORT || 8000;
// all named sockets that have no character assigned and are awaiting to be put into the game
var names = [];
// all named sockets that have character assigned and are in the game
var players = [];
// all sockets that have connected to the server, even those that have not joined the game
var clients = [];

// game.random is true if the players are to be assigned random characters
var game = {
  started: false,
  random: null,
  numJoined: null,
  numTotal: null,
  characters: null
};

app.use('/', express.static('public'));

var AddPlayer = function(socket, data) {
  /*  character name
  long version of character name
  good / bad
  array containing names of characters i can see
  string containing what i see them as
  */
  var AvalonChar = function (character, goodOrBad, whoCanISee, howISeeThem) {
    var characterLong;
    if (character === "GoodGuy") {
      characterLong = "a Loyal Servant of Arthur";
    } else if (character === "BadGuy") {
      characterLong = "a Minion of Mordred";
    } else if (character === "Assassin") {
      characterLong = "the Assassin";
    } else {
      characterLong = character;
    }
    return function(name, id) {
      this.name = name;
      this.id = id;
      this.character = character;
      this.characterLong = characterLong;
      this.whatIsMyFaction = goodOrBad;
      this.whoIs = function(person) {
        var known = false;
        whoCanISee.forEach(function(dude) {
          if (person.character == dude) known = true;
        });
        return (known) ? person.name + " is " + howISeeThem + ".": person.name + " is Unknown.";
      }
    }
  }

  // Avalon characters
  var Avalon = {};
  Avalon.Merlin = AvalonChar("Merlin", "good", ["BadGuy", "Assassin", "Morgana", "Oberon"], "Bad");
  Avalon.Percival = AvalonChar("Percival", "good", ["Merlin", "Morgana"], "Merlin or Morgana");
  Avalon.GoodGuy = AvalonChar("GoodGuy", "good", [], "");
  Avalon.BadGuy = AvalonChar("BadGuy", "bad", ["BadGuy", "Assassin", "Morgana", "Mordred"], "Bad too");
  Avalon.Assassin = AvalonChar("Assassin", "bad", ["BadGuy", "Morgana", "Mordred"], "Bad too");
  Avalon.Morgana = AvalonChar("Morgana", "bad", ["BadGuy", "Assassin", "Mordred"], "Bad too");
  Avalon.Mordred = AvalonChar("Mordred", "bad", ["BadGuy", "Assassin", "Morgana"], "Bad too");
  Avalon.Oberon = AvalonChar("Oberon", "bad", [], "");

  // add player client socket to the players list
  socket.avalonData = new Avalon[data.character](data.name, data.id);
  players.push(socket);
}

function namesToPlayers() {
  var c = shuffle(game.characters.slice(0));
  for (var i = 0; i < names.length; i++) {
    var p = names[i];
    p.extraData.character = c[i];
    AddPlayer(p, p.extraData);
  }
}

function UpdateClientData() {
  players.forEach(function(socket) {
    var d = socket.avalonData;
    var view = {name: d.name, image: d.whatIsMyFaction, intro: "You are " + d.characterLong + "."};
    var i = 0;
    players.forEach(function(otherSocket) {
      if (otherSocket != socket) {
        view[i] = d.whoIs(otherSocket.avalonData);
        i++;
      }
    });
    var template = "<img src='images/logo-{{image}}.png'><h1>{{name}}</h1><h2>{{intro}}</h2>";
    for (let k = 0; k < players.length; k++) {
      template += "<p>{{" + k + "}}</p>";
    }
    socket.emit("info", Mustache.render(template, view));
  });
}

function logPlayerList() {
  console.log("Current Player List: \n " + players.map(function(p) {
    return p.avalonData.name
  }));
}

function sendGameStatus() {
  if (game.random) {
    game.numJoined = names.length;
  } else {
    game.numJoined = players.length;
  }
  clients.forEach(function(socket) {
    socket.emit("gamestarted", game);
  });
}

app.get("/:name", function(req, res) {

});

io.on("connection", function(socket) {
  console.log("New Client On Server")
  clients.push(socket);
  sendGameStatus();

  // when the server receives a join request, it will add that player to the player list and send the updated information to all players
  socket.on("join", function(data) {
    if (players.length < game.numTotal) {
      if (game.random) {
        socket.extraData = data;
        names.push(socket);
        sendGameStatus();
        console.log("New Player Joined Random Game: " + data.name);
      } else if (data.character !== "SelectCharacter") {
        AddPlayer(socket, data);
        UpdateClientData();
        sendGameStatus();
        logPlayerList();
        console.log("New Player Joined Assigned Game: " + data.name);
      }
    } else {
      console.log("New player attempted to join but player limit reached");
    }
  });

  // when the server receives a newgame request (only from setup.html), it will setup a new game and notify all connected clients
  socket.on("newgame", function(data) {
    console.log("new game created: " + data.numberOfPlayers + " players");
    players = [];
    game.random = (data.random === "true") ? true : false;
    game.numTotal = data.numberOfPlayers;
    game.characters = data.characters || null;
    game.started = true;
    sendGameStatus();
  });

  // when the server receives a stopgame request (only from setup.html), it will remove all players from the game and prevent new players from joining
  socket.on("stopgame", function(data) {
    console.log("stopped game");
    players = [];
    game.started = false;
    sendGameStatus();
  })

  socket.on("randomize", function(data) {
    console.log("randomizing connected players");
    namesToPlayers();
    UpdateClientData();
    logPlayerList();
  })

  socket.on('disconnect', function () {
    if (players.indexOf(socket) !== -1) {
      var playerWhoLeft = players.splice(players.indexOf(socket), 1)[0].avalonData.name;
      console.log("Player Left Players: " + playerWhoLeft);
      UpdateClientData();
    }
    if (names.indexOf(socket) !== -1) {
      var playerWhoLeft = names.splice(names.indexOf(socket), 1)[0].extraData.name;
      console.log("Player Left Players: " + playerWhoLeft);
      UpdateClientData();
    }
    logPlayerList();
  });
});

http.listen(port, function() {
  console.log("listening on ", port);
});
