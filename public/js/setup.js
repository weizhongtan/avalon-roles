var socket = io();
var gameStarted = null;
// data received from setup will indicate whether a game has been setup or not
socket.on("game-status", function(data) {
  console.log(data.names);
  gameStarted = data.game.started;
  if (data.game.started) {
    $("#setup").html("<span style='color: green'>Online</span> - " + data.game.numJoined + " / " + data.game.numTotal + " players joined" +
  "<p>Current Players: " + data.names);
    if (data.game.numJoined == data.game.numTotal) {
      $("#submit-player").prop("disabled", true);
    } else {
      $("#submit-player").prop("disabled", false);
    }
  } else {
    $("#setup").html("<span style='color: red'>Offline</span>");
    $("#submit-player").prop("disabled", true);
  }
  if (data.game.random) {
    $("#character").addClass("hide");
  } else {
    $("#character").removeClass("hide");
  }
});
