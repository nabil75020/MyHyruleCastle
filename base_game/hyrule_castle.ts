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

let ennemi: Character = {
  name: "Bokoblin",
  hp: 30,
  hp_max: 30,
  str: 5,
};

let players: Characters = {
  Link: hero,
  Vilains: ennemi,
};

async function choice(
  Link: Character,
  Vilains: Character
): Promise<Characters> {
  return new Promise(async (resolve) => {
    rl.question(
      "Select a skill :\n \n- Attack (1) \n- Healing (2) \n",
      async (answer) => {
        if (answer === "1") {
          Vilains.hp -= Link.str;
          console.log(
            "Your attack succeeds you do " +
              hero.str +
              " damages to " +
              ennemi.name +
              " : \n"
          );
          resolve({ Link, Vilains });
        } else if (answer === "2") {
          if (players.Link.hp + players.Link.hp_max / 2 > players.Link.hp_max) {
            Link.hp = Link.hp_max;
          } else Link.hp += Link.hp_max / 2;
          console.log("You use Healing\n");
          resolve({ Link, Vilains });
        } else {
          console.log('You have to press "1" or "2", if you press another key you cannot advance in the game.😤');
          const result = await choice(Link, Vilains);
          resolve(result);
        }
      }
    );
  });
}

function displayParameters(i: number, Vilains: Character, Link: Character) {
  2;

  console.log("\n========== BATTLE " + i + " ==========\n");
  console.log("\x1b[31m%s\x1b[0m", Vilains.name);
  process.stdout.write("HP : ");
  for (let j = 0; j < Vilains.hp_max; j++) {
    if (j < Vilains.hp) {
      process.stdout.write("❤️");
    } else {
      process.stdout.write("☠️");
    }
  }
  console.log("  " + Vilains.hp + "/" + Vilains.hp_max);

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

function ennemiDamage(players: Characters): Characters {
  if (players.Vilains.hp > 0) {
    players.Link.hp -= players.Vilains.str;
  }
  return players;
}

async function main() {
  let Link: Character = hero;
  let heroAlive: boolean = true;
  let ennemiLength = 1;
  console.log('\nIn a bewitched kingdom, the inhabitants have lost their dreams. You play as an intrepid adventurer tasked with finding his lost dreams. You will venture into forgotten dreams to restore the magic of the kingdom. Every dream is a mysterious world with its own challenges. You will encounter fantastical creatures, solve puzzles, and discover buried memories. The ultimate goal is to restore the light of dreams to the realm. However, beware of nightmares that seek to stop you. Your courage and ingenuity will be tested. Will you succeed in giving the inhabitants back their lost dreams and restoring the magic of the kingdom? Your adventure begins now.\n');
  
  for (let i = 1; ennemiLength <= 10 && heroAlive; i++) {
    let Vilains: Character = {
      name: "Bokoblin",
      hp: 30,
      hp_max: 30,
      str: 5,
    };
    if (ennemiLength === 10) {
      Vilains = {
        name: "Ganon",
        hp: 30,
        hp_max: 30,
        str: 5,
      };
    }
    let alive = true;
    

    while (alive && heroAlive === true) {
      displayParameters(i, Vilains, Link);
      let Characters: Characters = await choice(Link, Vilains);
      players = ennemiDamage(players);
      Vilains = Characters.Vilains;
      hero = Characters.Link;
      if (Link.hp <= 0) {
        console.log("You are really bad. If you want to restart the game recompile and play again.");
        heroAlive = false;
        break;
      }
      if (Vilains.hp <= 0) {
        console.log("Enemi defeated ! Go to the next stage");
        alive = false;
        if (i < 9) {
          console.log("Get ready for the next fight Hero ⚔️");
        }
        ennemiLength++;
      }
      if (ennemiLength === 10) {
        console.log("\n🚨🚨🚨🚨🚨🚨🚨🚨🚨🚨🚨🚨BOSS🚨🚨🚨🚨🚨🚨🚨🚨🚨🚨🚨🚨");
      }
    }
  }
  rl.close();
}
main();
