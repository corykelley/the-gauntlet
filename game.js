//Create game variables including classes for players and enemies.
let play = true;
let attack = true;

//Attack Modifier: Int between 5 and 30
//Defense Modifier: Int between 2 and 5
class Player {
  constructor(
    name,
    startingWeapon,
    startingShield,
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
    this.attackAtr = attackAtr;
    this.defenseAtr = defenseAtr;
    this.magicAtr = magicAtr;
    this.speedAtr = speedAtr;
    this.health = 100;
    this.magicLevel = magicLevel;
    this.attMod = attMod;
    this.defMod = defMod;
  }

  attack() {
    const randomNum = Math.floor(Math.random() * 10 + 1);
    return this.attackAtr * randomNum + this.attMod;
  }

  heal() {
    if (this.health === 100) {
      alert(`You're already at full health!`);
    } else {
      const randomNum = Math.floor(Math.random() * 10 + 1);
      const healingPoints = this.defMod * randomNum;
      if (this.health + healingPoints > 100) {
        this.health = 100;
        alert(
          `You've healed yourself by ${healingPoints} points. Your health is now at ${this.health}.`
        );
      } else {
        this.health += healingPoints;
        alert(
          `You've healed yourself by ${healingPoints} points. Your health is now at ${this.health}.`
        );
      }
    }
  }
}

const hero = new Player(
  'Knight',
  'Basic Sword',
  'Basic Shield',
  12,
  2,
  2,
  3,
  50,
  12,
  2
);

class Enemy {
  constructor(
    name,
    weapon,
    attackAtr,
    defenseAtr,
    magicAtr,
    speedAtr,
    attMod,
    defMod
  ) {
    this.name = name;
    this.weapon = weapon;
    this.attackAtr = attackAtr;
    this.defenseAtr = defenseAtr;
    this.magicAtr = magicAtr;
    this.speedAtr = speedAtr;
    this.health = 100;
    this.attMod = attMod;
    this.defMod = defMod;
  }

  attack() {
    const randomNum = Math.floor(Math.random() * 10 + 1);
    return this.attackAtr * randomNum + this.attMod;
  }

  heal() {
    const randomNum = Math.floor(Math.random() * 10 + 1);
    const healingPoints = this.defMod * randomNum;
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

const goblin = new Enemy('Goblin', 'Basic Club', 4, 3, 0, 3, 5, 2);

const compareRolls = (playerRoll, enemyRoll, player, enemy) => {
  if (playerRoll > enemyRoll) {
    const goblinHealthLost =
      Math.round(playerRoll / enemy.defenseAtr) + enemy.defMod;
    enemy.health -= goblinHealthLost;
    alert(`You struck the goblin, he lost ${goblinHealthLost} health!`);
    console.log('Hero Health', player.health);
    console.log('Goblin Health', enemy.health);
  } else if (playerRoll < enemyRoll) {
    const heroHealthLost =
      Math.round(enemyRoll / player.defenseAtr) + player.defMod;
    player.health -= heroHealthLost;
    alert(`The goblin struck you, you lost ${heroHealthLost} health!`);
    console.log('Hero Health', player.health);
    console.log('Goblin Health', enemy.health);
  } else {
    alert(`Your weapons meet and you both fly backwards!`);
  }
};

const battle = (player, enemy) => {
  let userInput = prompt(
    `You've encountered a ${enemy.name}, what will you do? OPTIONS: Fight or Heal?`
  );
  userInput = userInput.toLowerCase();
  if (userInput === 'fight') {
    let heroRoll = player.attack();
    if (enemy.health < 50) {
      let randomNum = Math.floor(Math.random() * 10 + 1);
      if (randomNum % 2 === 0) {
        enemy.heal();
        randomNum = Math.floor(Math.random() * 10 + 1);
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
      randomNum = Math.floor(Math.random() * 10 + 1);
      if (randomNum > 3) {
        player.heal();
        enemy.heal();
        return;
      } else {
        player.heal();
        const heroRoll = player.defenseAtr + player.defMod;
        const goblinRoll = enemy.attack();
        console.log('Hero roll', heroRoll);
        console.log('Goblin Roll', goblinRoll);
      }
    } else {
      player.heal();
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

const mainGame = () => {
  alert(`You have encountered a Goblin! Time to fight!`);
  while (play) {
    if (goblin.health <= 0 || hero.health <= 0) {
      hero.health > goblin.health
        ? alert(`The day is yours!`)
        : alert(`You've been defeated...`);
      play = false;
    } else {
      battle(hero, goblin);
    }
  }
};

mainGame();

//Create main battle sequence logic.
// -- Create functions for parts of main battle.
// -- Create player options: ATTACK/MAGIC, HEAL.
// -- Create a way for the enemy to have some sort of AI (dice roll for if the enemy will heal vs attack).
// -- Determine win conditions and what to display when player/enemy wins.
