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
//Defense Atr: Int between 1 and 10
//Attack Modifier: Int between 1 and 5
//Defense Modifier: Int between 1 and 5
class Player {
  constructor(
    name,
    weapon,
    shield,
    inventory,
    attackAtr,
    defenseAtr,
    magicAtr,
    speedAtr,
    magicLevel,
    attMod,
    defMod
  ) {
    this.name = name;
    this.weapon = weapon;
    this.shield = shield;
    this.inventory = inventory;
    this.attackAtr = attackAtr;
    this.defenseAtr = defenseAtr;
    this.magicAtr = magicAtr;
    this.speedAtr = speedAtr;
    this.health = 100;
    this.magicLevel = magicLevel;
    this.attMod = attMod;
    this.defMod = defMod;
  }

  attack(enemy, weapon) {
    const enemyDefense = enemy.defMod + enemy.defenseAtr;
    const roll20 = dieRolls.roll20();
    console.log(`You rolled a ${roll20}`);
    if (roll20 + this.attMod > enemyDefense) {
      const roll10 = dieRolls.roll10();
      const enemyHealthLost = roll10 + weapon.damage;
      console.log(`Roll10: ${roll10}, Weapon Damage: ${weapon.damage}`);
      enemy.health -= enemyHealthLost;
      if (weapon.type !== 'Weapon') {
        alert(`You used a ${weapon.name}, it dealt ${enemyHealthLost} damage!`);
        weapon.count--;
      } else {
        alert(
          `You struck the ${enemy.name}, he lost ${enemyHealthLost} health!`
        );
        console.log(`Hero Health: ${this.health}`);
        console.log(`${enemy.name} Health: ${enemy.health}`);
      }
    } else {
      alert(`You missed!`);
    }
  }

  useItem(item) {
    let itemToUse = '';
    item = toTitleCase(item);
    for (let i = 0; i < this.inventory.length; i++) {
      if (this.inventory[i].name === item) {
        itemToUse = this.inventory[i];
        console.log(itemToUse.count);
        if (itemToUse.count === 0) {
          alert('You have none of that item left!');
          return;
        } else {
          console.log(`Count gone down`, this.inventory);
          if (itemToUse.type === 'Light') {
            this.heal(itemToUse);
          } else if (itemToUse.type === 'Dark') {
            this.attack(game.currentEnemy, itemToUse);
          }
        }
      }
    }
  }

  heal(item) {
    const healingPoints = item.value;
    if (this.health === 100) {
      alert(`You're already at full health!`);
    } else if (this.health + healingPoints > 100) {
      this.health = 100;
      alert(
        `You've healed yourself by ${healingPoints} points. Your health is now at ${this.health}.`
      );
      item.count--;
      console.log(this.inventory);
    } else {
      this.health += healingPoints;
      alert(
        `You've healed yourself by ${healingPoints} points. Your health is now at ${this.health}.`
      );
      item.count--;
    }
  }
}

const hero = new Player(
  'Knight',
  playerWeapons.basicSword,
  'Basic Shield',
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
  3,
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
    speedAtr,
    attMod,
    defMod
  ) {
    this.name = name;
    this.weapon = weapon;
    this.inventory = inventory;
    this.attackAtr = attackAtr;
    this.defenseAtr = defenseAtr;
    this.magicAtr = magicAtr;
    this.speedAtr = speedAtr;
    this.health = 100;
    this.attMod = attMod;
    this.defMod = defMod;
  }

  attack(weapon) {
    const playerDefense = hero.defMod + hero.defenseAtr;
    const roll20 = dieRolls.roll20();
    if (roll20 + this.attMod > playerDefense) {
      const roll10 = dieRolls.roll10();
      const playerHealthLost = roll10 + weapon.damage;
      hero.health -= playerHealthLost;
      if (weapon.type !== 'Weapon') {
        alert(
          `The ${this.name} used a ${weapon.name}, it dealt ${playerHealthLost} damage!`
        );
      } else {
        alert(
          `The ${this.name} struck you, you lost ${playerHealthLost} health!`
        );
        console.log(`Hero Health: ${hero.health}`);
        console.log(`${this.name} Health: ${this.health}`);
      }
    } else {
      alert(`${this.name} missed!`);
    }
  }

  useItem(item) {
    let itemToUse = '';
    item = toTitleCase(item);
    for (let i = 0; i < this.inventory.length; i++) {
      if (this.inventory[i].name === item) {
        itemToUse = this.inventory[i];
        console.log(itemToUse.count);
        if (itemToUse.count === 0) {
          alert('You dont have enough to use that');
          return;
        } else {
          this.inventory[i].count--;
          console.log(`Count gone down`, this.inventory);
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
      alert(
        `The ${this.name} casts a healing spell, his health is now at ${this.health}.`
      );
    } else {
      this.health += healingPoints;
      alert(
        `The ${this.name} casts a healing spell, his health is now at ${this.health}.`
      );
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
  3,
  2,
  2
);

const battle = (player, enemy) => {
  let userInput = prompt(
    `You've encountered a ${enemy.name}, what will you do? OPTIONS: Fight or Heal?`
  );
  userInput = userInput.toLowerCase();
  if (userInput === 'fight') {
    let heroRoll = player.attack();
    if (enemy.health < 50) {
      let randomNum = generateRandomNum();
      if (randomNum % 2 === 0) {
        enemy.useItem('Potion');
        console.log('Enemy is using a potion');
        randomNum = generateRandomNum();
        randomNum % 2 === 1 ? (goblinRoll = heroRoll) : (goblinRoll = 0);
        compareRolls(heroRoll, goblinRoll, player, enemy);
      } else {
        let goblinRoll = enemy.attack();
        compareRolls(heroRoll, goblinRoll, player, enemy);
      }
    } else {
      let goblinRoll = enemy.attack();
      console.log('Hero roll', heroRoll);
      console.log('Goblin Roll', goblinRoll);
      compareRolls(heroRoll, goblinRoll, player, enemy);
    }
  } else if (userInput === 'heal') {
    if (enemy.health < 20) {
      randomNum = generateRandomNum();
      if (randomNum > 3) {
        player.useItem('Potion');
        enemy.useItem('Potion');
        return;
      } else {
        player.useItem('Potion');
        const heroRoll = player.defenseAtr + player.defMod;
        const goblinRoll = enemy.attack();
        console.log('Hero roll', heroRoll);
        console.log('Goblin Roll', goblinRoll);
      }
    } else {
      player.useItem('Potion');
      const heroRoll = player.defenseAtr + player.defMod;
      const goblinRoll = enemy.attack();
      console.log('Hero roll', heroRoll);
      console.log('Goblin Roll', goblinRoll);
      if (heroRoll < goblinRoll) {
        const heroHealthLost =
          Math.round(goblinRoll / player.defenseAtr) + player.defMod;
        player.health -= heroHealthLost;
        alert(`The goblin struck you, you lost ${heroHealthLost} health!`);
        console.log('Hero Health', player.health);
        console.log('Goblin Health', enemy.health);
      }
    }
  }
};

//GAME OBJECT
const game = {
  play: true,
  currentTurn: 'player',
  currentEnemy: goblin,
  currentBattle: 1,
};

//HELPER FUNCTIONS
const toTitleCase = function (str) {
  return str
    .toLowerCase()
    .split(' ')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
};

//MAIN GAME FUNCTIONS
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

const changeTurn = () => {
  game.currentTurn === 'player'
    ? (game.currentTurn = 'enemy')
    : (game.currentTurn = 'player');
};

const playerTurn = () => {
  let userInput = prompt(
    `You've encountered a ${game.currentEnemy.name}, what will you do? OPTIONS: Attack or Use Item?`
  );
  userInput = userInput.toLowerCase();
  if (userInput === 'attack') {
    hero.attack(game.currentEnemy, hero.weapon);
    changeTurn();
  } else if (userInput === 'use item') {
    userInput = prompt(`What item would you like to use?`);
    userInput = userInput.toLowerCase();
    hero.useItem(`${userInput}`);
    changeTurn();
  }
};

const enemyTurn = () => {
  alert(`The ${game.currentEnemy.name} is planning his next move!`);
  if (game.currentEnemy.health > 35) {
    const roll5 = dieRolls.roll5();
    if (roll5 === 1) {
      game.currentEnemy.useItem(game.currentEnemy.inventory[1].name);
      changeTurn();
    } else {
      game.currentEnemy.attack(game.currentEnemy.weapon);
      changeTurn();
    }
  } else {
    const roll10 = dieRolls.roll10();
    if (roll10 % 2 === 1 && game.currentEnemy.inventory[0].count > 0) {
      game.currentEnemy.useItem(game.currentEnemy.inventory[0].name);
      changeTurn();
    } else {
      if (roll10 <= 5 && game.currentEnemy.inventory[1].count > 0) {
        game.currentEnemy.useItem(game.currentEnemy.inventory[1].name);
        changeTurn();
      } else {
        game.currentEnemy.attack(game.currentEnemy.weapon);
        changeTurn();
      }
    }
  }
};

const mainGame = () => {
  alert(`THE GAME HAS STARTED!`);
  while (game.play) {
    if (game.currentBattle === 1) {
      while (game.currentBattle === 1) {
        alert(
          `${hero.name} has ${hero.health} points of health. ${game.currentEnemy.name} has ${game.currentEnemy.health} points of health.`
        );
        //vvv change this statement to either advance and change enemy or to end game vvvvv
        if (game.currentEnemy.health <= 0 || hero.health <= 0) {
          hero.health > game.currentEnemy.health
            ? alert(`The day is yours!`)
            : alert(`You've been defeated...`);
          game.play = false;
          game.currentBattle = 0;
        } else {
          if (game.currentTurn === 'player') {
            playerTurn();
          } else {
            enemyTurn();
          }
        }
      }
    }
  }
};

mainGame();
