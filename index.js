"use strict";

var express = require("express");
var app = express();
var http = require("http").Server(app);
var io = require("socket.io")(http);
var Mustache = require("mustache");

var players = [];

app.use(express.static('public'));

var AddPlayer = function(socket, data) {
  /*  character name
  good / bad
  array containing names of characters i can see
  string containing what i see them as */
  var AvalonChar = function (character, goodOrBad, whoCanISee, howISeeThem) {
  	return function(name, id) {
  		this.name = name;
  		this.id = id;
  		this.character = character;
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
  Avalon.Merlin = AvalonChar("Merlin", "good", ["BadGuy", "Morgana", "Oberon"], "Bad");
  Avalon.Percival = AvalonChar("Percival", "good", ["Merlin", "Morgana"], "Merlin or Morgana");
  Avalon.GoodGuy = AvalonChar("GoodGuy", "good", [], "");
  Avalon.BadGuy = AvalonChar("BadGuy", "bad", ["BadGuy", "Morgana", "Mordred"], "Bad too");
  Avalon.Morgana = AvalonChar("Morgana", "bad", ["BadGuy", "Mordred"], "Bad too");
  Avalon.Mordred = AvalonChar("Mordred", "bad", ["BadGuy", "Morgana"], "Bad too");
  Avalon.Oberon = AvalonChar("Oberon", "bad", [], "");

  // add player client socket to the players list
  socket.avalonData = new Avalon[data.character](data.name, data.id);
  players.push(socket);
}

function UpdateClientData() {
  players.forEach(function(socket) {
      var d = socket.avalonData;
      var view = {name: d.name, intro: "You are " + d.character + " (" + d.whatIsMyFaction + "). This is what you know:"};

      var i = 0;
      players.forEach(function(otherSocket) {
          if (otherSocket != socket) {
              view[i] = d.whoIs(otherSocket.avalonData);
              i++;
          }
      });

  	var template = "<h1>{{name}}</h1><h2>{{intro}}</h2>";
  	for (let k = 0; k < players.length; k++) {
  		template += "<p>{{" + k + "}}</p>";
  	}
  	socket.emit("info", Mustache.render(template, view));
  });
}

io.on("connection", function(socket) {
console.log("New Client On Server")
  socket.on("join", function(data) {
      console.log("New Player Joined: " + data.name);
      AddPlayer(socket, data);
      UpdateClientData();
      logPlayerList();
  });

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

function logPlayerList() {
  console.log("Current Player List: \n " + players.map(function(p) {
      return p.avalonData.name
  }));
}

http.listen(process.env.PORT, function() {
  console.log("listening on ", process.env.PORT);
});
