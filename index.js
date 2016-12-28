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
    Avalon.Merlin = AvalonChar("Merlin", "good", ["BadGuy", "Morgana"], "Bad");
    Avalon.Percival = AvalonChar("Percival", "good", ["Merlin", "Morgana"], "Merlin or Morgana");
    Avalon.GoodGuy = AvalonChar("GoodGuy", "good", [], "");
    Avalon.BadGuy = AvalonChar("BadGuy", "bad", ["BadGuy", "Morgana"], "Bad too");
    Avalon.Morgana = AvalonChar("Morgana", "bad", ["BadGuy"], "Bad too");

    socket.avalonData = new Avalon[data.character](data.name, data.id);
    players.push(socket);
}


function EmitClientInfo() {
    for (let j = 0; j < players.length; j++) {
    	var view = {name: players[j].name, name2: "'" + players[j].name + "'", intro: "You are " + players[j].character + " (" + players[j].whatIsMyFaction + "). This is what you know:"};

	    for (let i = 0; i < players.length; i++) {
		    if (i != j) {
		    	view[i] = players[j].whoIs(players[i]);
	    	}
    	}
    	var template = "<h1>{{name}}</h1><h2>{{intro}}</h2>";
    	for (let k = 0; k < players.length; k++) {
    		template += "<p>{{" + k + "}}</p>";
    	}
    	clients[j].emit("info", Mustache.render(template, view));
	}
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
    socket.on("join", function(data) {
        console.log("New Player Joined: " + data.name);
        AddPlayer(socket, data);
        UpdateClientData();
    });
    
    socket.on('disconnect', function () {
        var playerWhoLeft = players.splice(players.indexOf(socket), 1)[0].avalonData.name;
        console.log("Player Left: " + playerWhoLeft);
        UpdateClientData();
    });
});

http.listen(process.env.PORT, function() {
    console.log("listening on ", process.env.PORT);
});
