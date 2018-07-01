import { knuthShuffle as shuffle } from 'knuth-shuffle';

export function log(...args) {
    console.log(...args);
}

// takes a socket and the name and character data and returns a new AvalonPlayer object
export function NewPlayer(socket, data) {
    /*  character name
    long version of character name
    good / bad
    array containing names of characters i can see
    string containing what i see them as
    */
    function AvalonChar(character, goodOrBad, whoCanISee, howISeeThem) {
        let characterLong;
        switch (character) {
        case 'GoodGuy':
            characterLong = 'a Loyal Servant of Arthur';
            break;
        case 'BadGuy':
            characterLong = 'a Minion of Mordred';
            break;
        case 'Assassin':
            characterLong = 'the Assassin';
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
                return [`${person.name} is ${(known) ? howISeeThem : 'Unknown'}`, known];
            };
        };
    }

    // Create avalon characters constructors from the base constructor
    const Avalon = {};
    Avalon.Merlin = AvalonChar('Merlin', 'good', ['BadGuy', 'Assassin', 'Morgana', 'Oberon'], 'Bad');
    Avalon.Percival = AvalonChar('Percival', 'good', ['Merlin', 'Morgana'], 'Merlin or Morgana');
    Avalon.GoodGuy = AvalonChar('GoodGuy', 'good', [], '');
    Avalon.BadGuy = AvalonChar('BadGuy', 'bad', ['BadGuy', 'Assassin', 'Morgana', 'Mordred'], 'Bad too');
    Avalon.Assassin = AvalonChar('Assassin', 'bad', ['BadGuy', 'Morgana', 'Mordred'], 'Bad too');
    Avalon.Morgana = AvalonChar('Morgana', 'bad', ['BadGuy', 'Assassin', 'Mordred'], 'Bad too');
    Avalon.Mordred = AvalonChar('Mordred', 'bad', ['BadGuy', 'Assassin', 'Morgana'], 'Bad too');
    Avalon.Oberon = AvalonChar('Oberon', 'bad', [], '');

    // create avalon character based on input data
    const gameData = new Avalon[data.character](data.name);

    // return object which contains the socket and avalon character
    return {
        socket,
        gameData,
    };
}
