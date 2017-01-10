var socket = io();
// data received from setup will indicate whether a game has been setup or not
socket.on("gamestarted", function(game) {
  if (game.started) {
    $("#setup").html("<span style='color: green'>Online</span> - " + game.numJoined + " / " + game.numTotal + " players joined");
    if (game.numJoined == game.numTotal) {
      $("#submit-player").prop("disabled", true);
    } else {
      $("#submit-player").prop("disabled", false);
    }
  } else {
    $("#setup").html("<span style='color: red'>Offline</span>");
    $("#submit-player").prop("disabled", true);
  }
  if (game.random) {
    $("#character").addClass("hide");
  } else {
    $("#character").removeClass("hide");
  }
});
