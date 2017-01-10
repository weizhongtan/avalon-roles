"use strict";

var express = require("express");
var app = express();
var http = require("http").Server(app);
var io = require("socket.io")(http);
var Mustache = require("mustache");

var port = process.env.PORT || 8000;
var players = [];
var clients = [];
var game = {
  started: false,
  numJoined: null,
  numTotal: null
};

app.use(express.static('public'));

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
  if (players.length < game.numTotal) {
    socket.avalonData = new Avalon[data.character](data.name, data.id);
    players.push(socket);
  } else {
    console.log("New player attempted to join but player limit reached");
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
  game.numJoined = players.length;
  clients.forEach(function(socket) {
    socket.emit("gamestarted", game);
  });
}

io.on("connection", function(socket) {
  console.log("New Client On Server")
  clients.push(socket);
  sendGameStatus();

  // when the server receives a join request, it will add that player to the player list and send the updated information to all players
  socket.on("join", function(data) {
    console.log("New Player Joined: " + data.name);
    AddPlayer(socket, data);
    UpdateClientData();
    sendGameStatus();
    logPlayerList();
  });

  // when the server receives a newgame request (only from setup.html), it will setup a new game and notify all connected clients
  socket.on("newgame", function(data) {
    console.log("new game created: " + data.numberOfPlayers + " players");
    players = [];
    game.numTotal = data.numberOfPlayers;
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

  socket.on('disconnect', function () {
    if (players.indexOf(socket) !== -1) {
      var playerWhoLeft = players.splice(players.indexOf(socket), 1)[0].avalonData.name;
      console.log("Player Left: " + playerWhoLeft);
      UpdateClientData();
    } else {
      console.log("Unidentified Player Left");
    }
    logPlayerList();
  });
});

http.listen(port, function() {
  console.log("listening on ", port);
});
