"use strict";

import express from "express";

const app = express();
const http = require("http").Server(app);
const path = require('path');
const io = require("socket.io")(http);
const Mustache = require("mustache");
const shuffle = require("knuth-shuffle").knuthShuffle;

const port = process.env.PORT || 8000;

// all named sockets that have no character assigned and are awaiting to be put into the game
let names = [];
// all named sockets that have character assigned and are in the game
let players = [];
// all sockets that have connected to the server, even those that have not joined the game
const clients = [];

/* game.isRandom = true if the players are to be assigned random characters,
   if the characters have already been assigned then it is false */
const game = {
  started: false,
  isRandom: null,
  numJoined: null,
  numTotal: null,
  characters: null,
};

// serve all files from public folder to the root domain
app.use("/", express.static(path.join(__dirname, "public")), (req, res) => { res.end("404"); });

// takes a socket and the name, id and character data and returns a new combined socket
function NewPlayer(socket, data) {
  /*  character name
  long version of character name
  good / bad
  array containing names of characters i can see
  string containing what i see them as
  */
  const AvalonChar = function(character, goodOrBad, whoCanISee, howISeeThem) {
    let characterLong;
    if (character === "GoodGuy") {
      characterLong = "a Loyal Servant of Arthur";
    } else if (character === "BadGuy") {
      characterLong = "a Minion of Mordred";
    } else if (character === "Assassin") {
      characterLong = "the Assassin";
    } else {
      characterLong = character;
    }
    return function(name) {
      this.name = name;
      this.character = character;
      this.characterLong = characterLong;
      this.whatIsMyFaction = goodOrBad;
      this.whoIs = function(person) {
        var known = false;
        whoCanISee.forEach((dude) => {
          if (person.character == dude) known = true;
        });
        return [(known) ? person.name + " is " + howISeeThem + "." : person.name + " is Unknown.", known];
      }
    }
  }

  // Avalon characters
  const Avalon = {};
  Avalon.Merlin = AvalonChar("Merlin", "good", ["BadGuy", "Assassin", "Morgana", "Oberon"], "Bad");
  Avalon.Percival = AvalonChar("Percival", "good", ["Merlin", "Morgana"], "Merlin or Morgana");
  Avalon.GoodGuy = AvalonChar("GoodGuy", "good", [], "");
  Avalon.BadGuy = AvalonChar("BadGuy", "bad", ["BadGuy", "Assassin", "Morgana", "Mordred"], "Bad too");
  Avalon.Assassin = AvalonChar("Assassin", "bad", ["BadGuy", "Morgana", "Mordred"], "Bad too");
  Avalon.Morgana = AvalonChar("Morgana", "bad", ["BadGuy", "Assassin", "Mordred"], "Bad too");
  Avalon.Mordred = AvalonChar("Mordred", "bad", ["BadGuy", "Assassin", "Morgana"], "Bad too");
  Avalon.Oberon = AvalonChar("Oberon", "bad", [], "");

  // add player client socket to the players list
  socket.avalonData = new Avalon[data.character](data.name);
  return socket;
}

// creates players from the names in the names array and pushes them to the players array
function NamesToPlayers() {
  if (names.length === game.characters.length) {
    const c = shuffle(game.characters.slice(0));
    for (let i = 0; i < names.length; i++) {
      const p = names[i];
      p.avalonData.character = c[i];
      players.push(NewPlayer(p, p.avalonData));
    }
  }
}

// emits "info" event with appropriate data to all sockets in socketsArr
function SendInfoTo(socketsArr) {
  socketsArr.forEach(function(socket) {
    const d = socket.avalonData;
    const view = {
      name: d.name,
      image: d.whatIsMyFaction,
      intro: `You are ${d.characterLong}.`,
    };
    let i = 0;
    socketsArr.forEach((otherSocket) => {
      if (otherSocket !== socket) {
        view[i] = d.whoIs(otherSocket.avalonData)[0];
        view[`class ${i}`] = (d.whoIs(otherSocket.avalonData)[1]) ? "bad" : "";
        i++;
      }
    });
    let template = "<img src='images/logo-{{image}}.png'><h1>{{name}}</h1><h2>{{intro}}</h2>";
    for (let k = 0; k < socketsArr.length; k++) {
      template += `<p class='{{class${k} }}'>{{${k}}}</p>`;
    }
    socket.emit("info", Mustache.render(template, view));
  });
}

// emits "game-status" event with appropriate data to all sockets in socketsArr
function SendGameStatusTo(socketsArr) {
  const data = {
    game,
  };
  if (game.isRandom) {
    game.numJoined = names.length;
    data.names = names.map(s => s.avalonData.name).join(", ");
  } else {
    game.numJoined = players.length;
    data.names = players.map(s => s.avalonData.name).join(", ");
  }
  socketsArr.forEach(socket => socket.emit("game-status", data));
}

// logs players array to the console
function LogPlayerList() {
  console.log(`Current Player List: ${players.map(p => p.avalonData.name)}`);
}

// given a socket and an array of sockets, remove socket from array and log to console if player was in the array
function IdentifyLeaver(socket, socketsArr) {
  const index = socketsArr.indexOf(socket);
  if (index !== -1) {
    const playerWhoLeft = socketsArr.splice(index, 1)[0].avalonData.name;
    console.log(`-- Player Left: ${playerWhoLeft} --`);
  }
}

io.on("connection", (socket) => {
  console.log("++ New Client On Server ++");
  clients.push(socket);
  console.log(socket);
  SendGameStatusTo(clients);

  // when the server receives a join request, it will add that player to the player list and send the updated information to all players
  socket.on("join", (data) => {
    if (players.length < game.numTotal) {
      if (game.isRandom) {
        socket.avalonData = data;
        names.push(socket);
        if (names.length === game.numTotal) {
          NamesToPlayers();
          SendInfoTo(players);
          LogPlayerList();
        }
        console.log(`New Player Joined Random Game: ${data.name}`);
      } else if (data.character !== "SelectCharacter") {
        players.push(NewPlayer(socket, data));
        SendInfoTo(players);
        console.log(`New Player Joined Assigned Game: ${data.name}`);
      }
      SendGameStatusTo(clients);
      LogPlayerList();
    } else {
      console.log("New player attempted to join but player limit reached");
    }
  });

  // when the server receives a newgame request (only from setup.html), it will setup a new game and notify all connected clients
  socket.on("newgame", (data) => {
    console.log(`new game created: ${data.numberOfPlayers} players`);
    players = [];
    names = [];
    game.isRandom = (data.isRandom === "true");
    game.numTotal = Number(data.numberOfPlayers);
    game.characters = data.characters || null;
    game.started = true;
    SendGameStatusTo(clients);
  });

  // when the server receives a stopgame request (only from setup.html), it will remove all players from the game and prevent new players from joining
  socket.on("stopgame", () => {
    console.log("stopped game");
    players = [];
    names = [];
    game.started = false;
    SendGameStatusTo(clients);
  });

  // when a socket disconnects, remove it from the player/names lists and log info to console
  socket.on("disconnect", () => {
    IdentifyLeaver(socket, players);
    IdentifyLeaver(socket, names);
    SendGameStatusTo(clients);
    SendInfoTo(players);
    LogPlayerList();
  });
});

http.listen(port, () => {
  console.log(`server running on port ${port}`);
});
