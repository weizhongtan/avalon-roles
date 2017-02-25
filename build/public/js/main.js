"use strict";

var socket = io();
var game = {
  started: null,
  isRandom: null
};
// data received from setup will indicate whether a game has been setup or not
socket.on("gamestatus", function (data) {
  console.log(data);
  game = data;
  if (data.started) {
    $("#setup").html("<span style='color: green'>Online</span> - " + data.numJoined + " / " + data.numTotal + " players joined<p>Current Players: " + data.namesStr);
    if (data.numJoined === data.numTotal) {
      $("#submit-player").prop("disabled", true);
    } else {
      $("#submit-player").prop("disabled", false);
    }
  } else {
    $("#setup").html("<span style='color: red'>Offline</span>");
    $("#submit-player").prop("disabled", true);
  }
  if (data.isRandom) {
    $("#character").addClass("hide");
  } else {
    $("#character").removeClass("hide");
  }
});

/*
* index.html functions
*/
$("#submit-player").click(function () {
  // validate name
  var name = $("#name").val();
  var character = $("#character").val();
  if (name.length > 0 && (character !== "none" || game.isRandom)) {
    socket.emit("join", {
      name: name,
      character: character
    });
    $("#remove").addClass("hide");
  }
});

socket.on("info", function (html) {
  $("#info").html(html).removeClass("hide");
});

/*
* setup.html functions
*/
$("#create-game").click(function () {
  var num = Number($("#num-of-players").val());
  var isRandom = $("#is-random").val();
  if (num > 0 && isRandom !== "none") {
    var data = {
      isRandom: isRandom,
      numberOfPlayers: num,
      characters: []
    };
    data.characters = $(".character").filter(function () {
      return $(this).val() !== "none";
    }).map(function () {
      return $(this).val();
    }).toArray();
    if (data.characters.length === num) {
      socket.emit("creategame", data);
      determineVisibility();
      $("#create-game").prop("disabled", true);
    }
  }
});

$("#num-of-players").change(function () {
  var num = Number($("#num-of-players").val());
  $("#characters").html("");
  for (var i = 0; i < num; i++) {
    $("#characters").append($("template").html());
  }
  determineVisibility();
});

$("#is-random").change(function () {
  determineVisibility();
});

$("#stop-game").click(function () {
  $("#create-game").prop("disabled", false);
  socket.emit("stopgame", {});
});

function determineVisibility() {
  if ($("#is-random").val() == "true" && !game.started) {
    $(".character").removeClass("hide");
  } else {
    $(".character").addClass("hide");
  }
}