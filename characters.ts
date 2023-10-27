export interface Character {
    id:  number,
    name: string,
    hp: number,
    hp_max: number,
    mp: number,
    str: number,
    int: number,
    def: number,
    ref: number,
    spd: number,
    luck: number,
    race: number,
    class:  number,
    rarity: number,
}

export interface Characters {
    Link: Character,
    Vilains: Character,
}
