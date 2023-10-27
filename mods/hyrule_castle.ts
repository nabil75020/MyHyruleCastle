import { Character, Characters } from "../characters";
import * as readline from "readline";
import * as fs from "fs";

export function getRandomNumber(min: number, max: number) : number {
    return Math.floor(Math.random() * (max - min + 1) + min);
  }
function getRandomPlayers() {

  const data: string = fs.readFileSync("../players.json", "utf8");
  const RandomPlayers = JSON.parse(data);
  let random = getRandomNumber(0, RandomPlayers.length - 1)
  return RandomPlayers[random];  
}

function getRandomEnnemies() {

  const data: string = fs.readFileSync("../enemies.json", "utf8");
  const randomEnnemies = JSON.parse(data);
  let random = getRandomNumber(0, randomEnnemies.length - 1)
  return randomEnnemies[random];  
}
function getRandomBosses() {

  const data: string = fs.readFileSync("../bosses.json", "utf8");
  const randomBosses = JSON.parse(data);
  let random = getRandomNumber(0, randomBosses.length - 1)
  return randomBosses[random];  
}

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

let hero: Character = {
  id:  0,
  name: "",
  hp: 0,
  hp_max: 0,
  mp: 0,
  str: 0,
  int: 0,
  def: 0,
  ref: 0,
  spd: 0,
  luck: 0,
  race: 0,
  class:  0,
  rarity: 0,
};

let ennemi: Character = {
  id:  0,
  name: "",
  hp: 0,
  hp_max: 0,
  mp: 0,
  str: 0,
  int: 0,
  def: 0,
  ref: 0,
  spd: 0,
  luck: 0,
  race: 0,
  class:  0,
  rarity: 0,
};

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
              Vilains.name +
              " : \n"
          );
          resolve({ Link, Vilains });
        } else if (answer === "2") {
          if (Link.hp + Link.hp_max / 2 > Link.hp_max) {
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
  let Link: Character = getRandomPlayers();
  Link.hp_max = Link.hp;
  let heroAlive: boolean = true;
  let ennemiLength = 1;
  for (let i = 1; ennemiLength <= 11 && heroAlive; i++) {
    let Vilains = getRandomEnnemies()
    Vilains.hp_max = Vilains.hp
    if (ennemiLength === 10) {
      Vilains = getRandomBosses();
      Vilains.hp_max = Vilains.hp
    }
    let alive = true;
    if (ennemiLength === 11) {
      console.log("Félicitations !!!!");
      break;
    }
    while (alive && heroAlive === true) {
      displayParameters(i, Vilains, Link);
      let Characters: Characters = await choice(Link, Vilains);
      Characters = ennemiDamage(Characters);
      Vilains = Characters.Vilains;
      hero = Characters.Link;
      if (Link.hp <= 0) {
        console.log("Vous êtes vraiment nul ! Recommencez l'aventure");
        heroAlive = false;
        break;
      }
      if (Vilains.hp <= 0) {
        if (ennemiLength < 10)
        console.log("Ennemi vaincu ! Passez à l'étage suivant");
        alive = false;
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
