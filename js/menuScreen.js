/*
Pong-JS
This is a modern JS reboot of the classic 1972 Atari game

Copyright (C) 2021  Ron Perkins - <hello@ronperkins.com>

This program is free software: you can redistribute it and/or modify
it under the terms of the GNU General Public License as published by
the Free Software Foundation, either version 3 of the License, or
(at your option) any later version.

This program is distributed in the hope that it will be useful,
but WITHOUT ANY WARRANTY; without even the implied warranty of
MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
GNU General Public License for more details.

You should have received a copy of the GNU General Public License
along with this program.  If not, see <http://www.gnu.org/licenses/>.
*/
"use strict";

// start screen
startScreen.init = function() {
  let cursorWidth = gridSize*20;
  let cursorHeight = gridSize*4;
  let cursorThickness = 5;
  let positions = [
    [(Game.width-cursorWidth-2*cursorThickness)/2, gridSize*20.5],
    [(Game.width-cursorWidth-2*cursorThickness)/2, gridSize*25.5],
    [(Game.width-cursorWidth-2*cursorThickness)/2, gridSize*30.5],
  ]
  startScreen.cursor = new Cursor(cursorWidth, cursorHeight, positions, cursorThickness)
}

startScreen.draw = function() {
  Game.context.clearRect(0, 0, Game.width, Game.height);
  let t1 = "PONG";
  let o1 = "1P START";
  let o2 = "2P START";
  let o3 = "OPTIONS";
  let b1 = "ENTER - GO                       ESC - GO BACK"
  let b2 = "PLAYER1 - W/S                PLAYER2 - UP/DOWN"
  let f1 = "1972 Atari Inc"
  let titleSize = 20;
  let menuSize = 5;
  let hintSize = 3;
  let footerSize = 2.5;
  writeText((Game.width-t1.length*6.5*gridSize)/2, gridSize*7, t1, titleSize);
  writeText((Game.width-o1.length*4*menuSize)/2, gridSize*22, o1, menuSize);
  writeText((Game.width-o2.length*4*menuSize)/2, gridSize*27, o2, menuSize);
  writeText((Game.width-o3.length*4*menuSize)/2, gridSize*32, o3, menuSize);
  writeText((Game.width-b1.length*4*hintSize)/2, Game.height-hintSize*35, b1, hintSize);
  writeText((Game.width-b2.length*4*hintSize)/2, Game.height-hintSize*28, b2, hintSize);
  writeText((Game.width-f1.length*4.5*footerSize)/2, Game.height-footerSize*9, f1, footerSize);

  startScreen.cursor.draw();
}

startScreen.update = function() {
  startScreen.cursor.update()
  if (Key.isDown(13)) {
    if (Game.keyTimeout > Date.now()) return
    Game.keyTimeout = Date.now()+200;
    Game.blip4();
    if (startScreen.cursor.current === 0) Game.changeState(enemyScreen);
    else if (startScreen.cursor.current === 1) Game.changeState(versusScreen);
    else if (startScreen.cursor.current === 2) Game.changeState(roundsScreen);
  }
}

// gameover screen
gameoverScreen.init = function() {
  let cursorWidth = gridSize*20;
  let cursorHeight = gridSize*4;
  let cursorThickness = 5;
  let positions = [
    [(Game.width-cursorWidth-2*cursorThickness)/2, gridSize*28.5],
    [(Game.width-cursorWidth-2*cursorThickness)/2, gridSize*33.5]
  ]
  gameoverScreen.cursor = new Cursor(cursorWidth, cursorHeight, positions, cursorThickness)
}

gameoverScreen.draw = function() {
  Game.context.clearRect(0, 0, Game.width, Game.height);
  let t1 = "GAMEOVER";
  let t2;
  if (gameMode === "enemy") {t2 = "YOU "+(winner?"WIN":"LOSE")}
  else {t2 = "PLAYER "+(winner?"1":"2")+" WINS"}
  let o2 = "PLAY AGAIN";
  let o3 = "MENU";
  let f1 = "1972 Atari Inc";
  let footerSize = 2.5;
  let menuSize = 5;
  let hintSize = 3;
  writeText((Game.width-t1.length*4*gridSize)/2, gridSize*5, t1);
  writeText((Game.width-t2.length*4*gridSize)/2, gridSize*15, t2);
  writeText((Game.width-o2.length*4*menuSize)/2, gridSize*30, o2, menuSize);
  writeText((Game.width-o3.length*4*menuSize)/2, gridSize*35, o3, menuSize);
  writeText((Game.width-f1.length*4.5*footerSize)/2, Game.height-footerSize*9, f1, footerSize);
  gameoverScreen.cursor.draw();
}

gameoverScreen.update = function() {
  gameoverScreen.cursor.update()
  if (Key.isDown(13)) {
    Game.blip4();
    if (gameoverScreen.cursor.current === 0) {
      if (gameMode === "enemy") Game.changeState(enemyScreen);
      if (gameMode === "versus") Game.changeState(versusScreen);
    }
    else if (gameoverScreen.cursor.current === 1) setTimeout(()=>Game.changeState(startScreen), 100);
  }
}

// rounds screen
roundsScreen.init = function() {
  let cursorWidth = gridSize*25;
  let cursorHeight = gridSize*4;
  let cursorThickness = 5;
  let positions = [
    [(Game.width-cursorWidth-2*cursorThickness)/2, gridSize*28.5],
    [(Game.width-cursorWidth-2*cursorThickness)/2, gridSize*33.5],
    [(Game.width-cursorWidth-2*cursorThickness)/2, gridSize*38.5]
  ]
  roundsScreen.cursor = new Cursor(cursorWidth, cursorHeight, positions, cursorThickness)
}

roundsScreen.draw = function() {
  Game.context.clearRect(0, 0, Game.width, Game.height);
  let t1 = "OPTIONS";
  let t2 = String(rounds);
  let o1 = "ROUNDS";
  let o2 = "Level "+difficulty;
  let o3 = "MENU";
  let f1 = "1972 Atari Inc"
  let menuSize = 5;
  let footerSize = 2.5;
  writeText((Game.width-t1.length*4*gridSize)/2, gridSize*10, t1);
  writeText((Game.width-t2.length*4*gridSize)/2, gridSize*22, t2);
  writeText((Game.width-o1.length*4*menuSize)/2, gridSize*30, o1, menuSize);
  writeText((Game.width-o2.length*4*menuSize)/2, gridSize*35, o2, menuSize);
  writeText((Game.width-o3.length*4*menuSize)/2, gridSize*40, o3, menuSize);
  writeText((Game.width-f1.length*4.5*footerSize)/2, Game.height-footerSize*9, f1, footerSize);
  roundsScreen.cursor.draw();
}

roundsScreen.update = function() {
  roundsScreen.cursor.update()
  if (Key.isDown(13)) {
    if (Game.keyTimeout > Date.now()) return
    Game.keyTimeout = Date.now()+200;
    Game.blip4();
    if (roundsScreen.cursor.current === 2) Game.changeState(startScreen);
    else if (roundsScreen.cursor.current === 1) {
      difficulty = difficultyArr[(difficultyArr.indexOf(difficulty)+1)%difficultyArr.length]
    } else if (roundsScreen.cursor.current === 0) {
      rounds += 1;
      if (rounds === 16) rounds = Infinity;
      else if (rounds > 16) rounds = 2;
    }
  } else if (Key.isDown(27)) {
    Game.blip4();
    Game.changeState(startScreen)
  }
}
