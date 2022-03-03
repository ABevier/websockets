export interface ChampionSpec {
  id: string;
}

export interface MoveSpec {
  id: string;
}

export interface Champion {
  id: string;

  specId: string;
  moves: string[];

  hp: number;
  energy: number;
}

export interface Team {
  id: string;
  activeChampions: Champion[];
  benchedChampions: Champion[];
}

export interface Battle {
  teams: Team[];
}

// Command -> Action -> apply -> Event

export interface Position {
  side: number;
  slot: number;
}

export interface Command {
  source: Position;
  moveSlot: number;
  target: Position;
}

export function setup(): Battle {
  const champ1: Champion = { id: "champ1", specId: "samurai", moves: ["tackle", "slash"], hp: 100, energy: 100 };
  const champ2: Champion = { id: "champ2", specId: "ninja", moves: ["tackle", "swords_dance"], hp: 100, energy: 100 };

  const champ3: Champion = { id: "champ3", specId: "knight", moves: ["tackle"], hp: 100, energy: 100 };
  const champ4: Champion = { id: "champ4", specId: "wizard", moves: ["tackle"], hp: 100, energy: 100 };

  const team1: Team = { id: "team1", activeChampions: [champ1, champ2], benchedChampions: [] };

  const team2: Team = { id: "team2", activeChampions: [champ3, champ4], benchedChampions: [] };

  return { teams: [team1, team2] };
}

//TODO: use IMMER

export function runCommand(battle: Battle, cmd: Command): string {
  const champ = getChampionAtPosition(battle, cmd.source);
  if (!champ) {
    return "invalid command";
  }

  const target = getChampionAtPosition(battle, cmd.target);
  if (!target) {
    return "no target";
  }

  const move = champ.moves[cmd.moveSlot];
  return `champion ${champ.id} used ${move} on ${target.id}`;
}

export function getChampionAtPosition(battle: Battle, pos: Position): Champion {
  //todo: bounds checking?
  const side = battle.teams[pos.side];
  return side.activeChampions[pos.slot];
}

export function getAllActiveChampions(battle: Battle): Champion[] {
  return [...battle.teams[0].activeChampions, ...battle.teams[1].activeChampions];
}

// export function findActiveChampionById(battle: Battle, teamId: number, id: string): Champion | undefined {
//   const team = battle.teams[teamId];
//   return team.activeChampions.find((c) => c.id === id);
// }

// ChampionSpecs
// MoveSpecs
