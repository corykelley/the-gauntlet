//Create game variables including classes for players and enemies.
// -- Variables might include a globla random number generator (function), function to lower case all inputs, etc.
let play = true;
let attack = true;

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
}

const goblin = new Enemy('Goblin', 'Basic Club', 4, 3, 0, 3, 5, 2);

const battle = (player, enemy) => {
  let userInput = prompt(
    `You've encountered a ${enemy.name}, what will you do? OPTIONS: Fight or Heal`
  );
  userInput = userInput.toLocaleLowerCase();
  if (userInput === 'fight') {
    const heroRoll = player.attack();
    const goblinRoll = enemy.attack();
    console.log('Hero roll', heroRoll);
    console.log('Goblin Roll', goblinRoll);
    if (heroRoll > goblinRoll) {
      const goblinHealthLost =
        Math.round(heroRoll / enemy.defenseAtr) + enemy.defMod;
      enemy.health -= goblinHealthLost;
      alert(`You struck the goblin, he lost ${goblinHealthLost}!`);
      console.log('Hero Health', player.health);
      console.log('Goblin Health', enemy.health);
    } else if (heroRoll < goblinRoll) {
      const heroHealthLost =
        Math.round(goblinRoll / player.defenseAtr) + player.defMod;
      player.health -= heroHealthLost;
      alert(`The goblin struck you, you lost ${heroHealthLost}!`);
      console.log('Hero Health', player.health);
      console.log('Goblin Health', enemy.health);
    } else {
      console.log(`You weapons meet and you both fly backwards!`);
    }
  } else if (userInput === 'heal') {
    player.health += 10;
    alert(
      `Your healed yourself by 10 points, your health is now at ${player.health}`
    );
    const heroRoll = player.defenseAtr + player.defMod;
    const goblinRoll = enemy.attack();
    console.log('Hero roll', heroRoll);
    console.log('Goblin Roll', goblinRoll);
    if (heroRoll < goblinRoll) {
      const heroHealthLost =
        Math.round(goblinRoll / player.defenseAtr) + player.defMod;
      player.health -= heroHealthLost;
      alert(`The goblin struck you, you lost ${heroHealthLost}!`);
      console.log('Hero Health', player.health);
      console.log('Goblin Health', enemy.health);
    }
  }
};

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

//Create main battle sequence logic.
// -- Create functions for parts of main battle.
// -- Create player options: ATTACK/MAGIC, HEAL.
// -- Create a way for the enemy to have some sort of AI (dice roll for if the enemy will heal vs attack).
// -- Determine win conditions and what to display when player/enemy wins.
