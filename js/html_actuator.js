function HTMLActuator() {
  this.tileContainer    = document.querySelector(".tile-container");
  this.scoreContainer   = document.querySelector(".score-container");
  this.bestContainer    = document.querySelector(".best-container");
  this.nextTileContainer    = document.querySelector(".next-tile-container");
  this.messageContainer = document.querySelector(".game-message");
  this.sharingContainer = document.querySelector(".score-sharing");

  this.score = 0;
  this.next_background = {'2': '#eee4da', '4': '#ede0c8', '8': '#f2b179'};
  this.next_color = {'2': '#776E65', '4': '#776E65', '8': '#f9f6f2'};
}

HTMLActuator.prototype.actuate = function (grid, metadata) {
  var self = this;

  window.requestAnimationFrame(function () {
    self.clearContainer(self.tileContainer);

    grid.cells.forEach(function (column) {
      column.forEach(function (cell) {
        if (cell) {
          self.addTile(cell);
        }
      });
    });

    self.updateNextTile(metadata.tileValue);
    self.updateScore(metadata.score);
    self.updateBestScore(metadata.bestScore);

    if (metadata.terminated) {
      if (metadata.over) {
        self.message(false); // You lose
      } else if (metadata.won) {
        self.message(true); // You win!
      }
    }

  });
};

// Continues the game (both restart and keep playing)
HTMLActuator.prototype.continue = function () {
  if (typeof ga !== "undefined") {
    ga("send", "event", "game", "restart", "restart-game");
  }

  this.clearMessage();
};

HTMLActuator.prototype.clearContainer = function (container) {
  while (container.firstChild) {
    container.removeChild(container.firstChild);
  }
};

HTMLActuator.prototype.addTile = function (tile) {
  var self = this;

  var wrapper   = document.createElement("div");
  var inner     = document.createElement("div");
  var position  = tile.previousPosition || { x: tile.x, y: tile.y };
  var positionClass = this.positionClass(position);

  // We can't use classlist because it somehow glitches when replacing classes
  var classes = ["tile", "tile-" + tile.value, positionClass];

  if (tile.value > 2048) classes.push("tile-super");

  if (typeof tile.sclass === "undefined") tile.sclass = Math.floor(Math.random()*8);
  classes.push("tile-s" + tile.sclass);

  this.applyClasses(wrapper, classes);

  inner.classList.add("tile-inner");
  inner.textContent = tile.value;

  if (tile.previousPosition) {
    // Make sure that the tile gets rendered in the previous position first
    window.requestAnimationFrame(function () {
      classes[2] = self.positionClass({ x: tile.x, y: tile.y });
      self.applyClasses(wrapper, classes); // Update the position
    });
  } else if (tile.mergedFrom) {
    classes.push("tile-merged");
    this.applyClasses(wrapper, classes);

    // Render the tiles that merged
    tile.mergedFrom.forEach(function (merged) {
      self.addTile(merged);
    });
  } else {
    classes.push("tile-new");
    this.applyClasses(wrapper, classes);
  }

  // Add the inner part of the tile to the wrapper
  wrapper.appendChild(inner);

  // Put the tile on the board
  this.tileContainer.appendChild(wrapper);
};

HTMLActuator.prototype.applyClasses = function (element, classes) {
  element.setAttribute("class", classes.join(" "));
};

HTMLActuator.prototype.normalizePosition = function (position) {
  return { x: position.x + 1, y: position.y + 1 };
};

HTMLActuator.prototype.positionClass = function (position) {
  position = this.normalizePosition(position);
  return "tile-position-" + position.x + "-" + position.y;
};

HTMLActuator.prototype.updateScore = function (score) {
  this.clearContainer(this.scoreContainer);

  var difference = score - this.score;
  this.score = score;

  this.scoreContainer.textContent = this.score;

  if (difference > 0) {
    var addition = document.createElement("div");
    addition.classList.add("score-addition");
    addition.textContent = "+" + difference;

    this.scoreContainer.appendChild(addition);
  }
};

HTMLActuator.prototype.updateNextTile = function (nextTile) {
    this.clearContainer(this.nextTileContainer);
    this.nextTileContainer.textContent = nextTile;
    this.nextTileContainer.classList.remove("next-tile-2");
    this.nextTileContainer.classList.remove("next-tile-4");
    this.nextTileContainer.classList.remove("next-tile-8");
    this.nextTileContainer.classList.add("next-tile-" + nextTile);
};

HTMLActuator.prototype.updateBestScore = function (bestScore) {
  this.bestContainer.textContent = bestScore;
};

HTMLActuator.prototype.message = function (won) {
  var type    = won ? "game-won" : "game-over";

  if (typeof game.atlantis_b !== "undefined" && game.atlantis_b) {
    return atlantis_bonus_finish(won);
  }

  var message = '';
  var largestTile = 0;
  if (won) {
    message = '<img class="atlantis-place" src="./img/atlantis.png" alt="Atlantis" title="Atlantis" />';
    message += '<br />Du kom ända fram!';
  } else {
    largestTile = game.largestTile();
    if (largestTile > 4096) largestTile = 4096;
    if (typeof atlantis_places[largestTile] !== "undefined") {
      var place = atlantis_places[largestTile];
      message = '<img class="atlantis-place" src="./img/' + place['img'] + '" alt="' + place['title'] + '" title="' + place['title'] + '" />';
      message += '<br />Nästan... Du kom till ' + place['title'];
    } else {
      message = 'Nästan...';
    }
  }
  message += ' <a href="http://atlantis2014.fi" target="_blank">#visespåatlantis</a>';

  if (largestTile >= 512) {
    message += '<br /><a style="font-size: 20px; " onclick="atlantis_bonus_round()">starta bonus-runda</a>';
  }

  if (typeof ga !== "undefined") {
    ga("send", "event", "game", "end", type, this.score);
    if (largestTile) {
      ga("send", "event", "atlantis", "place", "place", largestTile);
    }
  }

  this.messageContainer.classList.add(type);
  this.messageContainer.getElementsByTagName("p")[0].innerHTML = message;

  this.clearContainer(this.sharingContainer);
};

HTMLActuator.prototype.clearMessage = function () {
  // IE only takes one value to remove at a time.
  this.messageContainer.classList.remove("game-won");
  this.messageContainer.classList.remove("game-over");
};
