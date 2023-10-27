import { Character, Characters } from "./fct/characters/characters";
import * as readline from "readline";

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

let hero: Character = {
  name: "Link",
  hp: 60,
  hp_max: 60,
  str: 15,
};

let enemy: Character = {
  name: "Bokoblin",
  hp: 30,
  hp_max: 30,
  str: 5,
};
let boss: Character = {
  name: "Naruto",
  hp: 30,
  hp_max: 30,
  str: 5,
};

let players: Characters = {
  Link: hero,
  Villains: enemy,
};

function heroHeal() {
  if (players.Link.hp + players.Link.hp_max / 2 > players.Link.hp_max) {
    return players.Link.hp_max;
  }
  return (players.Link.hp += players.Link.hp_max / 2);
}

async function choice(
  Link: Character,
  Villains: Character
): Promise<Characters> {
  return new Promise(async (resolve) => {
    rl.question(
      "Select a skill:\n \n- Attack (1) \n- Healing (2) \n",
      async (answer) => {
        if (answer === "1") {
          Villains.hp -= Link.str;
          console.log(
            "Your attack succeeds, you deal " +
              hero.str +
              " damage to the " +
              enemy.name +
              " : \n"
          );
          resolve({ Link, Villains });
        } else if (answer === "2") {
          if (players.Link.hp + players.Link.hp_max / 2 > players.Link.hp_max) {
            Link.hp = Link.hp_max;
          } else Link.hp += Link.hp_max / 2;
          console.log("You use Healing\n");
          resolve({ Link, Villains });
        } else {
          const result = await choice(Link, Villains);
          resolve(result);
        }
      }
    );
  });
}

function displayParameters(i: number, Villains: Character, Link: Character) {
  2;

  console.log("\n========== BATTLE " + i + " ==========\n");
  console.log("\x1b[31m%s\x1b[0m", Villains.name);
  process.stdout.write("HP : ");
  for (let j = 0; j < Villains.hp_max; j++) {
    if (j < Villains.hp) {
      process.stdout.write("❤️");
    } else {
      process.stdout.write("☠️");
    }
  }
  console.log("  " + Villains.hp + "/" + Villains.hp_max);

  console.log("\n\x1b[32m%s\x1b[0m", Link.name);
  process.stdout.write("HP : ");
  for (let j = 0; j < Link.hp_max; j++) {
    if (j < Link.hp) {
      process.stdout.write("❤️");
    } else {
      process.stdout.write("☠️");
    }
  }
  console.log("  " + Link.hp + "/" + Link.hp_max);
  console.log("\n -----Options--------\n");
}

function enemyDamage(players: Characters): Characters {
  if (players.Villains.hp > 0) {
    players.Link.hp -= players.Villains.str;
  }
  return players;
}

async function main() {
  let Link: Character = hero;
  let heroAlive: boolean = true;
  let enemyLength = 1;
  for (let i = 1; enemyLength <= 10 && heroAlive; i++) {
    let Villains: Character = {
      name: "Bokoblin",
      hp: 30,
      hp_max: 30,
      str: 5,
    };
    if (enemyLength === 10) {
      Villains = {
        name: "Naruto",
        hp: 30,
        hp_max: 30,
        str: 5,
      };
    }
    let alive = true;

    while (alive && heroAlive === true) {
      displayParameters(i, Villains, Link);
      let Characters: Characters = await choice(Link, Villains);
      players = enemyDamage(players);
      Villains = Characters.Villains;
      hero = Characters.Link;
      if (Link.hp <= 0) {
        console.log("You are really bad! Start the adventure over");
        heroAlive = false;
        break;
      }
      if (Villains.hp <= 0) {
        console.log("Enemy defeated! Move on to the next level");
        alive = false;
        if (i < 9) {
          console.log("Get ready for the next enemy!");
        }
        enemyLength++;
      }
      if (enemyLength === 10) {
        console.log("\n🚨🚨🚨🚨🚨🚨🚨🚨🚨🚨🚨🚨BOSS🚨🚨🚨🚨🚨🚨🚨🚨🚨🚨🚨🚨");
      }
    }
  }
  rl.close();
}
main();
