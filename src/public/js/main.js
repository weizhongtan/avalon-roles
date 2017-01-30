const socket = io();
let gameStarted = null;
// data received from setup will indicate whether a game has been setup or not
socket.on("gamestatus", (data) => {
  console.log(data);
  gameStarted = data.started;
  if (data.started) {
    $("#setup").html(`<span style='color: green'>Online</span> - ${data.numJoined} / ${data.numTotal} players joined<p>Current Players: ${data.namesStr}`);
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
$("#submit-player").click(() => {
  if ($("#name").val().length > 0) {
    socket.emit("join", {
      name: $("#name").val(),
      character: $("#character").val(),
    });
    $("#remove").addClass("hide");
  }
});

socket.on("info", (html) => {
  $("#info").html(html).removeClass("hide");
});

/*
* setup.html functions
*/
$("#create-game").click(function() {
  const num = Number($("#num-of-players").val());
  const isRandom = $("#is-random").val();
  if (num > 0 && isRandom !== "none") {
    const data = {
      isRandom: isRandom,
      numberOfPlayers: num,
      characters: []
    };
    data.characters = $(".character")
    .filter(function() {
      return $(this).val() !== "none";
    })
    .map(function() {
      return $(this).val();
    }).toArray();
    if (data.characters.length === num) {
      socket.emit("creategame", data);
      determineVisibility();
      $("#create-game").prop("disabled", true);
    }
  }
});

$("#num-of-players").change(function() {
  var num = Number($("#num-of-players").val());
  $("#characters").html("");
  for (var i = 0; i < num; i++) {
    $("#characters").append($("template").html());
  }
  determineVisibility();
});

$("#is-random").change(function() {
  determineVisibility();
});

$("#stop-game").click(function() {
  $("#create-game").prop("disabled", false);
  socket.emit("stopgame", {});
});

function determineVisibility() {
  if ($("#is-random").val() == "true" && !gameStarted) {
    $(".character").removeClass("hide");
  } else {
    $(".character").addClass("hide");
  }
}
