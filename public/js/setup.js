var socket = io();
// data received from setup will indicate whether a game has been setup or not
socket.on("gamestarted", function(data) {
  if (data.started) {
    $("#setup").html("<span style='color: green'>Online</span> - " + data.numJoined + " / " + data.numTotal + " players joined");
    if (data.numJoined == data.numTotal) {
      $("#submit-player").prop("disabled", true);
    } else {
      $("#submit-player").prop("disabled", false);
    }
  } else {
    $("#setup").html("<span style='color: red'>Offline</span>");
    $("#submit-player").prop("disabled", true);
  }
});
