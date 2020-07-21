//Create game variables including classes for players and enemies.
const game = {
  play: true,
  attack: true,
  battleOne: true,
  currentTurn: 'player',
};

//Attack Atr: Int between 1 and 10
//Defense Atr: Int between 1 and 10
//Attack Modifier: Int between 1 and 5
//Defense Modifier: Int between 1 and 5
class Player {
  constructor(
    name,
    startingWeapon,
    startingShield,
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
    this.startingWeapon = startingWeapon;
    this.startingShield = startingShield;
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

  attack(enemy) {
    const enemyDefense = enemy.defMod + enemy.defenseAtr;
    const roll = dieRolls.roll20();
    console.log(`You rolled a ${roll}`);
    if (roll + this.attMod > enemyDefense) {
      const enemyHealthLost = roll + this.attackAtr;
      enemy.health -= enemyHealthLost;
      alert(`You struck the ${enemy.name}, he lost ${enemyHealthLost} health!`);
      console.log(`Hero Health: ${this.health}`);
      console.log(`${enemy.name} Health: ${enemy.health}`);
    } else {
      alert(`You missed!`);
    }
  }

  useItem(item) {
    let itemToUse = '';
    for (let i = 0; i < this.inventory.length; i++) {
      if (this.inventory[i].name === item) {
        itemToUse = this.inventory[i];
        console.log(itemToUse.count);
        if (itemToUse.count === 0) {
          alert('You dont have enough to use that');
          return;
        } else {
          console.log(`Count gone down`, this.inventory);
          if (itemToUse.type === 'Light') {
            this.heal(itemToUse);
          } else if (itemToUse.type === 'Dark') {
            alert(`You use ${itemToUse.name} it was effective!`);
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
    }
  }
}

const hero = new Player(
  'Knight',
  'Basic Sword',
  'Basic Shield',
  [
    {
      name: 'Potion',
      count: 2,
      value: 25,
      type: 'Light',
    },
    {
      name: 'Small Bomb',
      count: 2,
      value: 25,
      type: 'Dark',
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

  attack() {
    const playerDefense = hero.defMod + hero.defenseAtr;
    const roll = dieRolls.roll20();
    if (roll + this.attMod > playerDefense) {
      const playerHealthLost = roll + this.attackAtr;
      hero.health -= playerHealthLost;
      alert(
        `The ${this.name} struck you, you lost ${playerHealthLost} health!`
      );
      console.log(`Hero Health: ${hero.health}`);
      console.log(`${this.name} Health: ${this.health}`);
    }
  }

  useItem(item) {
    let itemToUse = '';
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
            alert(`You use ${itemToUse.name} it was effective!`);
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
  'Basic Club',
  [
    {
      name: 'Potion',
      count: 2,
      value: 25,
      type: 'Light',
    },
    {
      name: 'Deadly Spell',
      count: 1,
      value: 25,
      type: 'Dark',
    },
  ],
  4,
  3,
  0,
  3,
  2,
  2
);

const dieRolls = {
  roll20() {
    return Math.floor(Math.random() * 20 + 1);
  },
};

const changeTurn = () => {
  game.currentTurn === 'player'
    ? (game.currentTurn = 'enemy')
    : (game.currentTurn = 'player');
};

// const compareRolls = (playerRoll, enemyRoll, player, enemy) => {
//   if (playerRoll > enemyRoll) {
//     const goblinHealthLost =
//       Math.round(playerRoll / enemy.defenseAtr) + enemy.defMod;
//     enemy.health -= goblinHealthLost;
//     alert(`You struck the goblin, he lost ${goblinHealthLost} health!`);
//     console.log('Hero Health', player.health);
//     console.log('Goblin Health', enemy.health);
//   } else if (playerRoll < enemyRoll) {
//     const heroHealthLost =
//       Math.round(enemyRoll / player.defenseAtr) + player.defMod;
//     player.health -= heroHealthLost;
//     alert(`The goblin struck you, you lost ${heroHealthLost} health!`);
//     console.log('Hero Health', player.health);
//     console.log('Goblin Health', enemy.health);
//   } else {
//     alert(`Your weapons meet and you both fly backwards!`);
//   }
// };

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

const playerTurn = () => {
  let userInput = prompt(
    `You've encountered a ${currentEnemy.name}, what will you do? OPTIONS: Attack or Use Item?`
  );
  userInput = userInput.toLowerCase();
  if (userInput === 'attack') {
    hero.attack(currentEnemy);
    changeTurn();
  }
};

const enemyTurn = () => {
  // if (currentEnemy.health > 30) {
  alert(`The ${currentEnemy.name} is planning his next move!`);
  currentEnemy.attack();
  changeTurn();
  // } else {

  // }
};

let currentEnemy = goblin;

const mainGame = () => {
  alert(`THE GAME HAS STARTED!`);
  while (game.play) {
    while (game.battleOne) {
      if (currentEnemy.health <= 0 || hero.health <= 0) {
        hero.health > currentEnemy.health
          ? alert(`The day is yours!`)
          : alert(`You've been defeated...`);
        game.battleOne = false;
      } else {
        if (game.currentTurn === 'player') {
          playerTurn();
        } else {
          enemyTurn();
        }
      }
    }
  }
};

mainGame();

//Create main battle sequence logic.
// -- Create functions for parts of main battle.
// -- Create player options: ATTACK/MAGIC, HEAL.
// -- Create a way for the enemy to have some sort of AI (dice roll for if the enemy will heal vs attack).
// -- Determine win conditions and what to display when player/enemy wins.
