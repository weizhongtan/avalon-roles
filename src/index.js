"use strict";

import express from "express";

const app = express();
const http = require("http").Server(app);
const path = require("path");
const io = require("socket.io")(http);
const Mustache = require("mustache");
const shuffle = require("knuth-shuffle").knuthShuffle;

const port = process.env.PORT || 8000;

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
    namesStr: null,
    playersStr: null,
};

const rooms = {
    main: {
        names: [],
        players: [],
    },
};

function UpdateGameStatus() {
    game.numJoined = () => {
        if (game.isRandom) {
            return rooms.main.names.length;
        } else {
            return rooms.main.players.length;
        }
        game.namesStr = rooms.main.names.map(p => p.gameData.name).join(", ");
        game.playersStr = rooms.main.players.map(p => p.gameData.name).join(", ");
    }

    // serve all files from public folder to the root domain
    app.use("/",
    express.static(path.join(__dirname, "public")),
    (req, res) => { res.end("404"); },
);

// takes a socket and the name and character data and returns a new AvalonPlayer object
function NewPlayer(socket, data) {
    /*  character name
    long version of character name
    good / bad
    array containing names of characters i can see
    string containing what i see them as
    */
    function AvalonChar(character, goodOrBad, whoCanISee, howISeeThem) {
        let characterLong;
        switch (character) {
            case "GoodGuy":
                characterLong = "a Loyal Servant of Arthur";
                break;
            case "BadGuy":
                characterLong = "a Minion of Mordred";
                break;
            case "Assassin":
                characterLong = "the Assassin";
                break;
            default:
                characterLong = character;
        }
        return (name) => {
            this.name = name;
            this.character = character;
            this.characterLong = characterLong;
            this.whatIsMyFaction = goodOrBad;
            this.whoIs = (person) => {
                const known = (whoCanISee.indexOf(person.character) > -1);
                return [`${person.name} is ${(known) ? howISeeThem : "Unknown"}`, known];
            };
        };
    }

    // Create avalon characters constructors from the base constructor
    const Avalon = {};
    Avalon.Merlin = AvalonChar("Merlin", "good", ["BadGuy", "Assassin", "Morgana", "Oberon"], "Bad");
    Avalon.Percival = AvalonChar("Percival", "good", ["Merlin", "Morgana"], "Merlin or Morgana");
    Avalon.GoodGuy = AvalonChar("GoodGuy", "good", [], "");
    Avalon.BadGuy = AvalonChar("BadGuy", "bad", ["BadGuy", "Assassin", "Morgana", "Mordred"], "Bad too");
    Avalon.Assassin = AvalonChar("Assassin", "bad", ["BadGuy", "Morgana", "Mordred"], "Bad too");
    Avalon.Morgana = AvalonChar("Morgana", "bad", ["BadGuy", "Assassin", "Mordred"], "Bad too");
    Avalon.Mordred = AvalonChar("Mordred", "bad", ["BadGuy", "Assassin", "Morgana"], "Bad too");
    Avalon.Oberon = AvalonChar("Oberon", "bad", [], "");

    // create avalon character based on input data
    const gameData = new Avalon[data.character](data.name);

    // return object which contains the socket and avalon character
    return {
        socket,
        gameData,
    };
}

// creates players from the names in the names array and pushes them to the players array
function NamesToPlayers() {
    if (rooms.main.names.length === game.characters.length) {
        // randomize characters
        const c = shuffle(game.characters.slice(0));
        // iterate through rooms.main.names list
        for (let i = 0; i < rooms.main.names.length; i += 1) {
            const p = rooms.main.names[i];
            p.gameData.character = c[i];
            // add to players list
            rooms.main.players.push(NewPlayer(p.socket, p.gameData));
        }
    }
}

// emits "info" event with appropriate data to all sockets in playerArr
function SendInfoTo(playersArr) {
    // iterate through all players
    playersArr.forEach((player) => {
        // extract avalon game data
        const gameData = player.gameData;
        const view = {
            name: gameData.name,
            image: gameData.whatIsMyFaction,
            intro: `You are ${gameData.characterLong}.`,
        };
        // iterate through all other players
        for (let i = 0; i < playersArr.length; i += 1) {
            const otherPlayer = playersArr[i];
            if (otherPlayer.socket !== player.socket) {
                // query the other players identity
                view[i] = gameData.whoIs(otherPlayer.gameData)[0];
                view[`class${i}`] = (gameData.whoIs(otherPlayer.gameData)[1]) ? "bad" : "";
            }
        }
        // generate html to be sent to the player's socket
        let template = "<img src='images/logo-{{image}}.png'><h1>{{name}}</h1><h2>{{intro}}</h2>";
        for (let k = 0; k < playersArr.length; k += 1) {
            template += `<p class='{{class${k}}}'>{{${k}}}</p>`;
        }
        player.socket.emit("info", Mustache.render(template, view));
    });
}

// emits "game-status" event with appropriate data to all sockets in socketsArr
function SendGameStatusTo(socketsArr) {
    UpdateGameStatus();
    socketsArr.forEach(socket => socket.emit("gamestatus", game));
}

// logs players array to the console
function LogPlayerList() {
    console.log(`Current Player List: ${rooms.main.players.map(p => p.gameData.name)}`);
}

// given a socket and an array of sockets, remove socket from array and log to console if player was in the array
function IdentifyLeaver(socket, arr) {
    const index = arr.map(p => p.socket).indexOf(socket);
    // check if the socket exists in the array
    if (index !== -1) {
        // remove socket's parent object from array
        const playerWhoLeft = arr.splice(index, 1)[0].gameData.name;
        console.log(`-- Player Left: ${playerWhoLeft} --`);
    }
}

io.on("connection", (socket) => {
    console.log("++ New Client On Server ++");
    clients.push(socket);
    // send current game status to newly joined  client
    SendGameStatusTo(clients);

    // when the server receives a join request, it will add that player to the player list and send the updated information to all players
    socket.on("join", (data) => {
        // only let new players join if the player limit has not been reached
        if (rooms.main.players.length < game.numTotal) {
            switch (game.isRandom) {
                // random game type
                case true:
                    rooms.main.names.push({
                        socket,
                        gameData: data,
                    });
                    // check if the player limit has been reached
                    if (rooms.main.names.length === game.numTotal) {
                        // randomize players
                        NamesToPlayers();
                        SendInfoTo(rooms.main.players);
                        LogPlayerList();
                    }
                    console.log(`New Player Joined Random Game: ${data.name}`);
                    break;
                // non random game type
                default:
                    // check that the person selected a character
                    if (data.name.length > 0 && (data.character !== "none" || game.isRandom)) {
                        rooms.main.players.push(NewPlayer(socket, data));
                        SendInfoTo(rooms.main.players);
                        console.log(`New Player Joined Assigned Game: ${data.name}`);
                    }
            }
            SendGameStatusTo(clients);
            LogPlayerList();
        } else {
            console.log("New player attempted to join but player limit reached");
        }
    });

    // when the server receives a creategame request (only from setup.html), it will setup a new game and notify all connected clients
    socket.on("creategame", (data) => {
        console.log(`new game created: ${data.numberOfPlayers} players`);
        rooms.main.players = [];
        rooms.main.names = [];
        game.isRandom = (data.isRandom === "true");
        game.numTotal = data.numberOfPlayers;
        game.characters = data.characters || null;
        game.started = true;
        SendGameStatusTo(clients);
    });

    // when the server receives a stopgame request (only from setup.html), it will remove all players from the game and prevent new players from joining
    socket.on("stopgame", () => {
        console.log("stopped game");
        rooms.main.players = [];
        rooms.main.names = [];
        game.started = false;
        SendGameStatusTo(clients);
    });

    // when a socket disconnects, remove it from the player/names lists and log info to console
    socket.on("disconnect", () => {
        IdentifyLeaver(socket, rooms.main.players);
        IdentifyLeaver(socket, rooms.main.names);
        SendGameStatusTo(clients);
        SendInfoTo(rooms.main.players);
        LogPlayerList();
    });
});

http.listen(port, () => {
    console.log(`server running on port ${port}`);
});
