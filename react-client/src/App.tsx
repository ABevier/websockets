import React, { useState } from "react";
import "./App.css";
import { Battle, Champion, getAllActiveChampions, runCommand, setup } from "./sim/battleState";

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
  menuClickHandler: (idx: number)=>void
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

const champByIndex = (battle: Battle, index: number): Champion => {
  return getAllActiveChampions(battle)[index];
};

function App() {
  const battle = setup();

  //console.log(battle);

  // const src = { side: 0, slot: 0 };
  // const target = { side: 1, slot: 0 };
  // const cmd = { source: src, moveSlot: 0, target };

  // const result = runCommand(battle, cmd);
  // console.log(result);

  const [champIdx, setChampIdx] = useState(0);
  const [selectionState, setSelectionState] = useState(0);

  const menuClickHandler = (idx: number) => {
    //temp: 
    const champ = champByIndex(battle, champIdx)
    console.log(`clicked on: ${champ.moves[idx]}`);
    if (selectionState === 0) {
      setSelectionState(1);
    } else {
      setChampIdx(champIdx + 1);
      setSelectionState(0);
    }
  };

  const onChampionClicked = (side: number, slot: number) => {
    console.log(`champ was clicked: side:${side} slot:${slot}`);
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
