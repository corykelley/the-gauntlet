//DOM VARIABLES
let weaponDisplay = document.getElementById('weapon');
let healthDisplay = document.getElementById('health');
let playerInventoryDisplay = document.getElementById('inventory');
let enemyWeaponDisplay = document.getElementById('enemy-weapon');
let enemyHealthDisplay = document.getElementById('enemy-health');
let enemyNameDisplay = document.getElementById('enemy-name');
let btnDiv = document.getElementById('button-div');
let playerInput = document.getElementById('player-input');
let gameText = document.getElementById('game-text');
let gameImage = document.querySelector('.action > img');
let inputValue = '';

//PLAYER/ENEMY WEAPONS OBJECT
const playerWeapons = {
  basicSword: {
    name: 'Basic Sword',
    damage: 15,
    type: 'Weapon',
  },
  steelSword: {
    name: 'Steel Sword',
    damage: 25,
    type: 'Weapon',
  },
  knightSword: {
    name: `Knight's Sword`,
    damage: 35,
    type: 'Weapon',
  },
  masterSword: {
    name: `Master Sword`,
    damage: 45,
    type: 'Weapon',
  },
};

const enemyWeapons = {
  basicClub: {
    name: 'Basic Club',
    damage: 10,
    type: 'Weapon',
  },
};

//PLAYER/ENEMY CLASSES AND INSTANCES
//Attack Atr: Int between 1 and 10
//Defense Atr: Int between 1 and 20
//Luck Atr: Int between 1 and 20
//Attack Modifier: Int between 1 and 5
class Player {
  constructor(
    name,
    weapon,
    inventory,
    attackAtr,
    defenseAtr,
    magicAtr,
    luckAtr,
    magicLevel,
    attMod
  ) {
    this.name = name;
    this.weapon = weapon;
    this.inventory = inventory;
    this.attackAtr = attackAtr;
    this.defenseAtr = defenseAtr;
    this.magicAtr = magicAtr;
    this.luckAtr = luckAtr;
    this.health = 100;
    this.magicLevel = magicLevel;
    this.attMod = attMod;
    this.photo = `img/knight_f_idle_anim_f0.png`;
  }

  attack(enemy, weapon) {
    const roll20 = dieRolls.roll20();
    if (roll20 + this.attMod > enemy.luckAtr) {
      const roll10 = dieRolls.roll10();
      const enemyHealthLost = roll10 + weapon.damage - enemy.defenseAtr;
      enemy.health -= enemyHealthLost;
      if (weapon.type !== 'Weapon') {
        weapon.count--;
        removeAllChildNodes(btnDiv);
        const btn = createButton();
        btnDiv.append(btn);
        gameImage.setAttribute('src', photos.flaskRed);
        gameText.innerText = `You used a ${weapon.name}, it dealt ${enemyHealthLost} damage!`;
        updateStats(hero, game.currentEnemy);
        btn.addEventListener('click', () => {
          changeTurn();
        });
      } else {
        removeAllChildNodes(btnDiv);
        const btn = createButton();
        btnDiv.append(btn);
        gameImage.setAttribute('src', photos.sword);
        gameImage.style.width = `20%`;
        gameText.innerText = `You struck the ${enemy.name}, he lost ${enemyHealthLost} health!`;
        updateStats(hero, game.currentEnemy);
        btn.addEventListener('click', () => {
          changeTurn();
        });
      }
    } else {
      removeAllChildNodes(btnDiv);
      const btn = createButton();
      btnDiv.append(btn);
      updateStats(hero, game.currentEnemy);
      btn.addEventListener('click', () => {
        changeTurn();
      });
      if (weapon.type !== 'Weapon') {
        gameText.innerText = `You fumbled the ${weapon.name} and were unable to use it!`;
      } else {
        gameText.innerText = `You missed!`;
      }
    }
  }

  useItem(item) {
    let itemToUse = '';
    item = toTitleCase(item);
    for (let i = 0; i < this.inventory.length; i++) {
      if (this.inventory[i].name === item) {
        itemToUse = this.inventory[i];
        if (itemToUse.count < 1) {
          gameText.innerText = `As you quickly pull from your sack, you notice you have none of that item left! The ${game.currentEnemy.name} is angry and coming right for you!`;
          removeAllChildNodes(btnDiv);
          const btn = createButton();
          btnDiv.append(btn);
          btn.addEventListener('click', () => {
            changeTurn();
          });
        } else {
          if (itemToUse.type === 'Light') {
            this.heal(itemToUse);
          } else if (itemToUse.type === 'Dark') {
            this.attack(game.currentEnemy, itemToUse);
          }
        }
      }
    }
  }

  whichItem() {
    playerInput.value = '';
    playerInput.focus();
    gameImage.setAttribute('src', photos.flaskBlue);
    gameText.innerText =
      'Which item would you like to use? OPTIONS: (p)otion, small (b)omb?';
    removeAllChildNodes(btnDiv);
    const btn = createButton();
    btnDiv.append(btn);
    btn.addEventListener('click', () => {
      inputValue = playerInput.value.toLowerCase();
      if (inputValue === 'potion' || inputValue === 'p') {
        hero.useItem('potion');
        playerInput.value = '';
      } else if (inputValue === 'small bomb' || inputValue === 'b') {
        hero.useItem('small bomb');
        playerInput.value = '';
      }
    });
  }

  heal(item) {
    const healingPoints = item.value;
    if (this.health === 100) {
      gameImage.setAttribute('src', photos.heartFull);
      gameText.innerText = `You're already at full health!`;
      removeAllChildNodes(btnDiv);
      const btn = createButton();
      btnDiv.append(btn);
      btn.addEventListener('click', () => {
        playerTurn();
      });
    } else if (this.health + healingPoints > 100) {
      this.health = 100;
      removeAllChildNodes(btnDiv);
      const btn = createButton();
      btnDiv.append(btn);
      btn.addEventListener('click', () => {
        updateStats(hero, game.currentEnemy);
        item.count--;
        changeTurn();
      });
      gameImage.setAttribute('src', photos.heartFull);
      gameText.innerText = `You quickly turn up a ${item.name}, you instantly feel more powerful and ready to jump back into the fight! You've healed yourself by ${healingPoints} points. Your health is now at ${this.health}.`;
    } else {
      this.health += healingPoints;
      removeAllChildNodes(btnDiv);
      const btn = createButton();
      btnDiv.append(btn);
      btn.addEventListener('click', () => {
        updateStats(hero, game.currentEnemy);
        item.count--;
        changeTurn();
      });
      gameImage.setAttribute('src', photos.heartFull);
      gameText.innerText = `You quickly turn up a ${item.name}, you instantly feel more powerful and ready to jump back into the fight! You've healed yourself by ${healingPoints} points. Your health is now at ${this.health}.`;
    }
  }
}

const hero = new Player(
  'Knight',
  playerWeapons.basicSword,
  [
    {
      name: 'Potion',
      count: 2,
      value: 25,
      type: 'Light',
      display: true,
    },
    {
      name: 'Small Bomb',
      count: 2,
      type: 'Dark',
      damage: 30,
      display: true,
    },
  ],
  9,
  2,
  2,
  5,
  50,
  4,
  2
);

class Enemy {
  constructor(
    name,
    weapon,
    inventory,
    attackAtr,
    defenseAtr,
    magicAtr,
    luckAtr,
    attMod
  ) {
    this.name = name;
    this.weapon = weapon;
    this.inventory = inventory;
    this.attackAtr = attackAtr;
    this.defenseAtr = defenseAtr;
    this.magicAtr = magicAtr;
    this.luckAtr = luckAtr;
    this.health = 100;
    this.attMod = attMod;
    this.photo = `img/ogre_run_anim_f2.png`;
  }

  attack(weapon) {
    const roll20 = dieRolls.roll20();
    if (roll20 + this.attMod > hero.luckAtr) {
      const roll10 = dieRolls.roll10();
      const playerHealthLost = roll10 + weapon.damage - hero.defenseAtr;
      hero.health -= playerHealthLost;
      if (weapon.type !== 'Weapon') {
        weapon.count--;
        removeAllChildNodes(btnDiv);
        const btn = createButton();
        btnDiv.append(btn);
        updateStats(hero, game.currentEnemy);
        btn.addEventListener('click', () => {
          changeTurn();
        });
        gameImage.setAttribute('src', photos.flaskRed);
        gameText.innerText = `The ${this.name} used a ${weapon.name}, it dealt ${playerHealthLost} damage!`;
      } else {
        removeAllChildNodes(btnDiv);
        const btn = createButton();
        btnDiv.append(btn);
        updateStats(hero, game.currentEnemy);
        btn.addEventListener('click', () => {
          changeTurn();
        });
        gameImage.setAttribute('src', photos.club);
        gameImage.style.width = `20%`;
        gameText.innerText = `The ${this.name} struck you, you lost ${playerHealthLost} health!`;
      }
    } else {
      removeAllChildNodes(btnDiv);
      const btn = createButton();
      btnDiv.append(btn);
      updateStats(hero, game.currentEnemy);
      btn.addEventListener('click', () => {
        changeTurn();
      });
      gameText.innerText = `${this.name} missed!`;
    }
  }

  useItem(item) {
    let itemToUse = '';
    item = toTitleCase(item);
    for (let i = 0; i < this.inventory.length; i++) {
      if (this.inventory[i].name === item) {
        itemToUse = this.inventory[i];
        if (itemToUse.count < 1) {
          gameImage.setAttribute('src', photos.flaskRed);
          gameText.innerText = `The ${this.name} tried to use ${item}, but couldn't find one!`;
          removeAllChildNodes(btnDiv);
          const btn = createButton();
          btnDiv.append(btn);
          btn.addEventListener('click', () => {
            changeTurn();
          });
        } else {
          this.inventory[i].count--;
          if (itemToUse.type === 'Light') {
            this.heal(itemToUse);
          } else if (itemToUse.type === 'Dark') {
            this.attack(itemToUse);
          }
        }
      }
    }
  }

  heal(item) {
    const healingPoints = item.value;
    if (this.health + healingPoints > 100) {
      this.health = 100;
      updateStats(hero, game.currentEnemy);
      removeAllChildNodes(btnDiv);
      const btn = createButton();
      btnDiv.append(btn);
      btn.addEventListener('click', () => {
        updateStats(hero, game.currentEnemy);
        changeTurn();
      });
      gameImage.setAttribute('src', photos.heartFull);
      gameImage.style.width = `200px`;
      gameText.innerText = `The ${this.name} casts a healing spell, his health is now at ${this.health}.`;
    } else {
      this.health += healingPoints;
      updateStats(hero, game.currentEnemy);
      removeAllChildNodes(btnDiv);
      const btn = createButton();
      btnDiv.append(btn);
      btn.addEventListener('click', () => {
        updateStats(hero, game.currentEnemy);
        changeTurn();
      });
      gameImage.setAttribute('src', photos.heartFull);
      gameText.innerText = `The ${this.name} casts a healing spell, his health is now at ${this.health}.`;
    }
  }
}

const goblin = new Enemy(
  'Goblin',
  enemyWeapons.basicClub,
  [
    {
      name: 'Potion',
      count: 2,
      value: 25,
      type: 'Light',
      display: true,
    },
    {
      name: 'Deadly Spell',
      count: 1,
      damage: 25,
      type: 'Dark',
      display: true,
    },
  ],
  4,
  3,
  0,
  8,
  2
);

const troll = new Enemy(
  'Troll',
  enemyWeapons.basicClub,
  [
    {
      name: 'Potion',
      count: 2,
      value: 25,
      type: 'Light',
      display: true,
    },
    {
      name: 'Deadly Spell',
      count: 1,
      damage: 25,
      type: 'Dark',
      display: true,
    },
  ],
  4,
  3,
  0,
  8,
  2
);

//VARIABLES THAT DECIDE CURRENT ENEMY
const enemyArr = [goblin, troll];
let enemyIndex = 0;

//GAME OBJECT
const game = {
  play: true,
  battle: false,
  currentTurn: 'player',
  currentEnemy: enemyArr[enemyIndex],
  changeEnemy() {
    this.currentEnemy = enemyArr[enemyIndex];
  },
};

//DIALOG
const dialog = {
  spotEnemy: `You see a ${game.currentEnemy.name} running towards you with a firey rage in his eyes! It looks like you will be thrown into a battle, what will you do? OPTIONS: (a)ttack, (u)se item?`,
};

//PHOTOS
const photos = {
  sword: `img/weapon_knight_sword.png`,
  club: `img/weapon_baton_with_spikes.png`,
  heartFull: `img/ui_heart_full.png`,
  heartHalf: `img/ui_heart_half.png`,
  heartEmpty: `img/ui_heart_empty.png`,
  flaskBlue: `img/flask_big_blue.png`,
  flaskRed: `img/flask_big_red.png`,
  chest: `img/chest_full_open_anim_f2.png`,
};

//HELPER FUNCTIONS
const toTitleCase = function (str) {
  return str
    .toLowerCase()
    .split(' ')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
};

const dieRolls = {
  roll20() {
    return Math.floor(Math.random() * 20 + 1);
  },

  roll10() {
    return Math.floor(Math.random() * 10 + 1);
  },

  roll5() {
    return Math.floor(Math.random() * 5 + 1);
  },
};

const getInventory = () => {
  removeAllChildNodes(playerInventoryDisplay);
  hero.inventory.map(item => {
    const newItem = document.createElement('li');
    playerInventoryDisplay.append(newItem);
    newItem.innerText = `${item.name} x ${item.count}`;
  });
};

const updateStats = (player, enemy) => {
  if (hero.health > 0 && game.currentEnemy.health > 0) {
    weaponDisplay.innerText = player.weapon.name;
    healthDisplay.style.width = `${player.health}%`;
    getInventory();
    enemyWeaponDisplay.innerText = enemy.weapon.name;
    enemyHealthDisplay.style.width = `${enemy.health}%`;
    enemyNameDisplay.innerText = enemy.name;
  } else if (hero.health < 0) {
    weaponDisplay.innerText = player.weapon.name;
    healthDisplay.style.width = 'DEAD';
    getInventory();
    enemyWeaponDisplay.innerText = enemy.weapon.name;
    enemyHealthDisplay.style.width = `${enemy.health}%`;
    enemyNameDisplay.innerText = enemy.name;
    removeAllChildNodes(btnDiv);
    const btn = document.createElement('button');
    btn.innerText = 'PLAY AGAIN';
    btnDiv.append(btn);
    btn.addEventListener('click', () => {
      resetGame();
    });
    gameImage.setAttribute('src', photos.heartEmpty);
    gameText.innerText = `You've been defeated! All hope is lost for the kingdom...`;
  } else {
    weaponDisplay.innerText = player.weapon.name;
    healthDisplay.style.width = `${player.health}%`;
    getInventory();
    enemyWeaponDisplay.innerText = enemy.weapon.name;
    enemyHealthDisplay.style.width = `DEAD`;
    enemyNameDisplay.innerText = enemy.name;
    removeAllChildNodes(btnDiv);
    const btn = document.createElement('button');
    btn.innerText = 'PLAY AGAIN';
    btnDiv.append(btn);
    btn.addEventListener('click', () => {
      resetGame();
    });
    gameImage.setAttribute('src', photos.chest);
    gameText.innerText = `The ${game.currentEnemy.name} has perished! You live to fight another day!`;
  }
};

const changeTurn = () => {
  removeAllChildNodes(btnDiv);
  const btn = createButton();
  btnDiv.append(btn);
  btn.addEventListener('click', () => {
    if (game.currentTurn === 'player') {
      game.currentTurn = 'enemy';
      playRound();
    } else {
      game.currentTurn = 'player';
      playRound();
    }
  });
  if (game.currentTurn === 'player') {
    gameText.innerText = `It's the enemy's turn, watch out!`;
  } else {
    gameText.innerText = `You center yourself and focus on the ${game.currentEnemy.name}, it's time to do your work!`;
  }
};

const createButton = function () {
  const btn = document.createElement('button');
  btn.innerText = 'ACTION';
  btn.classList.add('progress-btn');
  return btn;
};

const removeAllChildNodes = function (parent) {
  while (parent.firstChild) {
    parent.removeChild(parent.firstChild);
  }
};

const resetGame = function () {
  gameText.innerText = 'Click the ACTION button to play again!';
  removeAllChildNodes(btnDiv);
  const btn = createButton();
  btnDiv.append(btn);
  btn.addEventListener('click', () => {
    location.reload();
  });
};

//TURNS
const playerTurn = () => {
  gameImage.setAttribute('src', hero.photo);
  gameImage.style.width = `200px`;
  playerInput.value = '';
  playerInput.focus();
  gameText.innerText = dialog.spotEnemy;
  removeAllChildNodes(btnDiv);
  const btn = createButton();
  btnDiv.append(btn);
  btn.addEventListener('click', () => {
    inputValue = playerInput.value.toLowerCase();
    if (inputValue === 'attack' || inputValue === 'a') {
      hero.attack(game.currentEnemy, hero.weapon);
      playerInput.value = '';
    } else if (inputValue === 'use item' || inputValue === 'u') {
      hero.whichItem();
      playerInput.value = '';
    }
  });
};

const enemyTurn = () => {
  gameImage.setAttribute('src', game.currentEnemy.photo);
  gameImage.style.width = `300px`;
  gameText.innerText = `The ${game.currentEnemy.name} is planning his next move!`;
  removeAllChildNodes(btnDiv);
  const btn = createButton();
  btnDiv.append(btn);
  btn.addEventListener('click', () => {
    if (game.currentEnemy.health > 35) {
      const roll5 = dieRolls.roll5();
      if (roll5 === 1) {
        game.currentEnemy.useItem(game.currentEnemy.inventory[1].name);
      } else {
        game.currentEnemy.attack(game.currentEnemy.weapon);
      }
    } else {
      const roll10 = dieRolls.roll10();
      if (roll10 % 2 === 1 && game.currentEnemy.inventory[0].count > 0) {
        game.currentEnemy.useItem(game.currentEnemy.inventory[0].name);
      } else {
        if (roll10 <= 5 && game.currentEnemy.inventory[1].count > 0) {
          game.currentEnemy.useItem(game.currentEnemy.inventory[1].name);
        } else {
          game.currentEnemy.attack(game.currentEnemy.weapon);
        }
      }
    }
  });
};

//SETTING INITIAL IMAGE
gameImage.setAttribute('src', hero.photo);

const playRound = () => {
  if (game.currentTurn !== 'player') {
    enemyTurn();
  } else {
    playerTurn();
  }
};

const mainGame = () => {
  updateStats(hero, game.currentEnemy);
  if (game.play) {
    playRound();
  }
};

mainGame();
