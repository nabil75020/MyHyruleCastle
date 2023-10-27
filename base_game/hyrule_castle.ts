import { link } from "fs";
import { Character, Characters } from "./fct/characters/characters";
import { argv } from "process";
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
let boss: Character = {
  name: "Naruto",
  hp: 30,
  hp_max: 30,
  str: 5,
};

let players: Characters = {
  Link: hero,
  Vilains: ennemi,
};

function heroHeal() {
  if (players.Link.hp + players.Link.hp_max / 2 > players.Link.hp_max) {
    return players.Link.hp_max;
  }
  return (players.Link.hp += players.Link.hp_max / 2);
}

async function choice(
  Link: Character,
  Vilains: Character
): Promise<Characters> {
  return new Promise(async (resolve) => {
    rl.question(
      "Sélectionnez une compétence :\n \n- Attaquer (1) \n- Guérison (2) \n",
      async (answer) => {
        if (answer === "1") {
          Vilains.hp -= Link.str;
          console.log(
            "Votre attaque réussit, vous faîtes " +
              hero.str +
              " de dégâts au " +
              ennemi.name +
              " : \n"
          );
          resolve({ Link, Vilains });
        } else if (answer === "2") {
          if (players.Link.hp + players.Link.hp_max / 2 > players.Link.hp_max) {
            Link.hp = Link.hp_max;
          } else Link.hp += Link.hp_max / 2;
          console.log("Vous utilisez Guérison\n");
          resolve({ Link, Vilains });
        } else {
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
  for (let i = 1; ennemiLength <= 10 && heroAlive; i++) {
    let Vilains: Character = {
      name: "Bokoblin",
      hp: 30,
      hp_max: 30,
      str: 5,
    };
    if (ennemiLength === 10) {
      Vilains = {
        name: "Naruto",
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
        console.log("Vous êtes vraiment nul ! Recommencez l'aventure");
        heroAlive = false;
        break;
      }
      if (Vilains.hp <= 0) {
        console.log("Ennemi vaincu ! Passez à l'étage suivant");
        alive = false;
        if (i < 9) {
          console.log("Préparez-vous pour le prochain ennemi !");
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
