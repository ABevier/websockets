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
    <div className="item" onClick={() => onClick(side, slot)}>
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
    <div style={{ display: "flex" }}>
      <div style={{ flex: 1 }}>
        <div style={{ display: "flex", flexDirection: "column", margin: "5%" }}>
          {side1.activeChampions.map((c, idx) => (
            <ChampionHUD key={c.id} champion={c} side={0} slot={idx} onClick={onChampionClick} />
          ))}
        </div>
      </div>
      <div style={{ flex: 1 }}></div>
      <div style={{ flex: 1 }}>
        <div style={{ display: "flex", flexDirection: "column", margin: "5%" }}>
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
  onClick: (s: string) => void;
}

const MoveMenu = ({ moves, onClick }: MoveMenuProps) => {
  return (
    <div style={{ display: "flex" }}>
      {moves.map((m) => (
        <button key={m} onClick={(e) => onClick(m)}>
          {m}
        </button>
      ))}
    </div>
  );
};

interface MyMenuProps {
  battle: Battle;
}

const MyMenu = ({ battle }: MyMenuProps) => {
  const [champIdx, setChampIdx] = useState(0);

  const [selectionState, setSelectionState] = useState(0);

  const champ = champByIndex(battle, champIdx);

  const clickHandler = (move: string) => {
    console.log(move);
    if (selectionState === 0) {
      setSelectionState(1);
    } else {
      setChampIdx(champIdx + 1);
      setSelectionState(0);
    }
  };

  return (
    <div>
      {selectionState === 0 && (
        <>
          <div>Select a move for {champ.id}:</div>
          <MoveMenu moves={champ.moves} onClick={clickHandler} />
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

  const onChampionClicked = (side: number, slot: number) => {
    console.log(`champ was clicked: side:${side} slot:${slot}`);
  };

  return (
    <div
      className="App"
      style={{ display: "flex", flexDirection: "column", minHeight: "100vh", justifyContent: "center", alignItems: "center" }}
    >
      <BattleDisplay battle={battle} onChampionClick={onChampionClicked} />
      <MyMenu battle={battle} />
    </div>
  );
}

export default App;
