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

// globals
let borderTop = marginSize+gridSize;
let borderBottom = Game.height-marginSize-gridSize;
let borderLeft = gridSize;
let borderRight = Game.width-2*gridSize;
let boardHeight = borderBottom-borderTop;
let boardWidth = borderRight-borderLeft;

// main game screen
versusScreen.init = function() {
  Game.player1 = new Paddle(borderLeft+gridSize, boardHeight/2, paddleLength,
    87, 83, borderTop, borderBottom);
  Game.player2 = new Paddle(borderRight-gridSize, boardHeight/2, paddleLength,
    38, 40, borderTop, borderBottom);
  Game.score = new Score(boardWidth/2-letterSpacing, borderTop+2*gridSize, 0, 0);
  versusScreen.spawnBall();
  gameMode = "versus";
}

versusScreen.draw = function() {
  Game.context.clearRect(0, 0, Game.width, Game.height);
  // horizontal lines
  drawLine(borderLeft, marginSize, borderRight, marginSize)
  drawLine(borderLeft, borderBottom, borderRight, borderBottom)
  // dashed line
  for (let i=3.5*gridSize; i<borderBottom; i+= 2*gridSize) {
    drawSquare(Game.width/2-gridSize/2, i)
  }
  // draw sprites
  Game.score.draw();
  Game.ball.draw();
  Game.player1.draw();
  Game.player2.draw();
  // pause if not in focus
  if (!document.hasFocus()) {
    drawSquare(boardWidth/2-11*gridSize, boardHeight/2-10*gridSize, gridSize*25, "#FFF")
    writeText(boardWidth/2-10*gridSize, boardHeight/2, "PAUSED", gridSize, "#000")
  }
  let h1 = "PONG"
  let headerSize = 3.5;
  writeText((Game.width-h1.length*4.5*headerSize)/2, Game.height-headerSize*183, h1, headerSize);
  
  let f1 = "1972 Atari Inc"
  let footerSize = 2.5;
  writeText((Game.width-f1.length*4.5*footerSize)/2, Game.height-footerSize*9, f1, footerSize);
};

versusScreen.update = function() {
  if (Key.isDown(27)) {
    Game.changeState(startScreen)
    Game.blip4();
  };
  if (!document.hasFocus()) {
    return
  }
  Game.ball.update();
  Game.player1.update();
  Game.player2.update();

  // ball-paddles collision
  if (Game.ball.x <= borderLeft+2*gridSize &&
      Game.ball.y+gridSize >= Game.player1.y &&
      Game.ball.y <= Game.player1.y+paddleLength+2*gridSize) {
    let dy = (Game.ball.y+gridSize/2-Game.player1.y)/(paddleLength+2*gridSize)*0.8-0.4
    let angle = dy*Math.PI;
    Game.ball.direction = angle;
    Game.ball.speed +=0.5;
    Game.blip2()
  } else if (Game.ball.x >= borderRight-2*gridSize &&
              Game.ball.y+gridSize >= Game.player2.y &&
              Game.ball.y <= Game.player2.y+paddleLength+2*gridSize){
    let dy = (Game.ball.y+gridSize/2-Game.player2.y)/(paddleLength+2*gridSize)*0.8-0.4
    let angle = (1-dy)*Math.PI;
    Game.ball.direction = angle;
    Game.ball.speed +=0.5;
    Game.blip2()
  }
  // score and respawn
  else if (Game.ball.x >= Game.width-2*gridSize) {
    Game.score.p1 += 1;
    versusScreen.spawnBall("player2");
    Game.blip3();
  }
  else if (Game.ball.x <= 2*gridSize) {
    Game.score.p2 += 1;
    versusScreen.spawnBall("player1");
    Game.blip3();
  }
  if (Game.score.p1 >= rounds || Game.score.p2 >= rounds) {
    winner = (Game.score.p1>=rounds?true: false);
    Game.changeState(gameoverScreen);
  }
};

versusScreen.spawnBall = function(side) {
  let angle; // 120° arc for each side (random(0, 120°) - 60°)
  if (side === "player1") {
    angle = 1/3*(Math.random()*2+2)*Math.PI;
  } else if (side === "player2") {
    angle = 1/3*(Math.random()*2-1)*Math.PI;
  } else {
    angle = 1/3*(Math.random()*2-1)*Math.PI + (Math.random()>=0.5)*Math.PI;
  }
  let center = Game.width/2-gridSize/2;
  let randomHeight = Math.random()*(boardHeight-3*gridSize)+borderTop+gridSize
  Game.ball = new Ball(center, randomHeight, 0, angle, borderTop, borderBottom-gridSize);
  setTimeout(() => Game.ball.speed = ballSpeed/2, 500)
  setTimeout(() => Game.ball.speed = ballSpeed, 2000)
}

// enemy screen
enemyScreen.init = () => {
  // remove p2 keys
  versusScreen.init()
  Game.player2.keyUp = undefined;
  Game.player2.keyDown = undefined;
  gameMode = "enemy";
};

enemyScreen.draw = versusScreen.draw;

enemyScreen.update = () => {
  // enemy AI
  let diffStep;
  if (difficulty === difficultyArr[0]) diffStep = paddleStep/3;
  else if (difficulty === difficultyArr[1]) diffStep = paddleStep;
  else if (difficulty === difficultyArr[2]) diffStep = paddleStep*3;
  let centerDelta = Game.ball.y+gridSize/2 - Game.player2.y - paddleLength/2
  if (Math.abs(centerDelta) > diffStep) {
    Game.player2.y += diffStep*(centerDelta>0?1:-1);
  } else {
    Game.player2.y += centerDelta;
  }
  // call rest of update
  versusScreen.update()
};
