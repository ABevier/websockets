import React, { useState } from "react";
import "./App.css";
import { Battle, Champion, Command, getAllActiveChampions, Position, runCommand, setup } from "./sim/battleState";

type ChampionClickHandler = (side: number, slot: number) => void;

interface ChampionHUDProps {
  champion: Champion;
  side: number;
  slot: number;
  onClick: ChampionClickHandler;
}

const ChampionHUD = ({ champion, side, slot, onClick }: ChampionHUDProps) => {
  const { id, hp } = champion;
  return (
    <div className="champion" onClick={() => onClick(side, slot)}>
      <div>{id}</div>
      <div>HP: {hp}</div>
    </div>
  );
};

interface BattleDisplayProps {
  battle: Battle;
  onChampionClick: ChampionClickHandler;
}

const BattleDisplay = ({ battle, onChampionClick }: BattleDisplayProps) => {
  const [side1, side2] = battle.teams;

  return (
    <div className="battle-display">
      <div className="team-column-container">
        <div className="team-column">
          {side1.activeChampions.map((c, idx) => (
            <ChampionHUD key={c.id} champion={c} side={0} slot={idx} onClick={onChampionClick} />
          ))}
        </div>
      </div>
      <div className="team-column-container"></div>
      <div className="team-column-container">
        <div className="team-column">
          {side2.activeChampions.map((c, idx) => (
            <ChampionHUD key={c.id} champion={c} side={1} slot={idx} onClick={onChampionClick} />
          ))}
        </div>
      </div>
    </div>
  );
};

interface MoveMenuProps {
  moves: string[];
  onClick: (idx: number) => void;
}

const MoveMenu = ({ moves, onClick }: MoveMenuProps) => {
  return (
    <div style={{ display: "flex" }}>
      {moves.map((m, idx) => (
        <button key={m} onClick={(e) => onClick(idx)}>
          {m}
        </button>
      ))}
    </div>
  );
};

interface MyMenuProps {
  battle: Battle;
  selectionState: number;
  champIdx: number;
  menuClickHandler: (idx: number) => void;
}

const MyMenu = ({ battle, selectionState, champIdx, menuClickHandler }: MyMenuProps) => {
  const champ = champByIndex(battle, champIdx);
  return (
    <div>
      {selectionState === 0 && (
        <>
          <div>Select a move for {champ.id}:</div>
          <MoveMenu moves={champ.moves} onClick={menuClickHandler} />
        </>
      )}
      {selectionState === 1 && (
        <>
          <div>Select a target</div>
        </>
      )}
    </div>
  );
};

//This is jank, do it differently
const champByIndex = (battle: Battle, index: number): Champion => {
  return getAllActiveChampions(battle)[index];
};

//This is jank, do it differently
const champPosFromIndex = (battle: Battle, index: number): Position => {
  const firstTeamLen = battle.teams[0].activeChampions.length;
  const side = Math.floor(index / firstTeamLen);
  const slot = index % firstTeamLen;
  return { side, slot };
};

function App() {
  const battle = setup();

  //TODO: ....gonna want Redux or useReducer...
  const [champIdx, setChampIdx] = useState(0);
  const [moveIdx, setMoveIdx] = useState(-1);
  const [selectionState, setSelectionState] = useState(0);
  const [commands, setCommands] = useState<Command[]>([]);

  const menuClickHandler = (idx: number) => {
    const champ = champByIndex(battle, champIdx);
    console.log(`clicked on: ${champ.moves[idx]}`);
    if (selectionState === 0) {
      setMoveIdx(idx);
      setSelectionState(1);
    }
  };

  const onChampionClicked = (side: number, slot: number) => {
    if (selectionState === 1) {
      console.log(`target champ was clicked: side:${side} slot:${slot}`);
      const command = {
        source: champPosFromIndex(battle, champIdx),
        moveSlot: moveIdx,
        target: {
          side,
          slot,
        },
      };

      const newCommands = [...commands, command];

      const nextIdx = champIdx + 1;
      if (nextIdx < getAllActiveChampions(battle).length) {
        console.log("next champ");
        //now get input for the next champ
        setCommands(newCommands);
        setChampIdx(nextIdx);
        setSelectionState(0);
        setMoveIdx(-1);
      } else {
        console.log("apply moves");
        //now get input for the next champ
        // we have all the commands, run them
        //TODO: mutate the battle!!
        newCommands.forEach((cmd) => {
          const result = runCommand(battle, cmd);
          console.log(result);
        });
        setCommands([]);
        setChampIdx(0);
        setSelectionState(0);
        setMoveIdx(0);
      }
    }
  };

  return (
    <div className="app-container">
      <div className="app-content">
        <BattleDisplay battle={battle} onChampionClick={onChampionClicked} />
        <MyMenu battle={battle} selectionState={selectionState} champIdx={champIdx} menuClickHandler={menuClickHandler} />
      </div>
    </div>
  );
}

export default App;
