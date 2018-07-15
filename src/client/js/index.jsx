import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter } from 'react-router-dom';

import Root from './Root.jsx';

ReactDOM.render(((
  <BrowserRouter>
    <Root />
  </BrowserRouter>
)), document.getElementById('root'));

// data received from setup will indicate whether a game has been setup or not
// socket.on('gamestatus', (data) => {
//     log(data);
//     game = data;
//     if (data.started) {
//         $('#setup').html(`<span style='color: green'>Online</span> - ${data.numJoined} / ${data.numTotal} players joined<p>Current Players: ${data.namesStr}`);
//         if (data.numJoined === data.numTotal) {
//             $('#submit-player').prop('disabled', true);
//         } else {
//             $('#submit-player').prop('disabled', false);
//         }
//     } else {
//         $('#setup').html("<span style='color: red'>Offline</span>");
//         $('#submit-player').prop('disabled', true);
//     }
//     if (data.isRandom) {
//         $('#character').addClass('hide');
//     } else {
//         $('#character').removeClass('hide');
//     }
// });

// /*
// * index.html functions
// */
// $('#submit-player').click(() => {
//     // validate name
//     const name = $('#name').val();
//     const character = $('#character').val();
//     if (name.length > 0 && (character !== 'none' || game.isRandom)) {
//         socket.emit('join', {
//             name,
//             character,
//         });
//         $('#remove').addClass('hide');
//     }
// });

// socket.on('info', (html) => {
//     $('#info').html(html).removeClass('hide');
// });

// /*
// * setup.html functions
// */
// function determineVisibility() {
//     if ($('#is-random').val() === 'true' && !game.started) {
//         $('.character').removeClass('hide');
//     } else {
//         $('.character').addClass('hide');
//     }
// }

// $('#create-game').click(function clickHandler() {
//     const num = Number($('#num-of-players').val());
//     const isRandom = $('#is-random').val();
//     if (num > 0 && isRandom !== 'none') {
//         const data = {
//             isRandom,
//             numberOfPlayers: num,
//             characters: [],
//         };
//         data.characters = $('.character')
//         .filter(() => $(this).val() !== 'none')
//         .map(() => $(this).val()).toArray();
//         if (data.characters.length === num) {
//             socket.emit('creategame', data);
//             determineVisibility();
//             $('#create-game').prop('disabled', true);
//         }
//     }
// });

// $('#num-of-players').change(() => {
//     const num = Number($('#num-of-players').val());
//     $('#characters').html('');
//     for (let i = 0; i < num; i += 1) {
//         $('#characters').append($('template').html());
//     }
//     determineVisibility();
// });

// $('#is-random').change(() => {
//     determineVisibility();
// });

// $('#stop-game').click(() => {
//     $('#create-game').prop('disabled', false);
//     socket.emit('stopgame', {});
// });
