import React, { useState } from "react";
import "./App.css";
import { Battle, Champion, getAllActiveChampions, runCommand, setup } from "./sim/battleState";

interface ChampionHUDProps {
  champion: Champion;
}

const ChampionHUD = ({ champion }: ChampionHUDProps) => {
  const { id, hp } = champion;
  return (
    <div className="item">
      <div>{id}</div>
      <div>HP: {hp}</div>
    </div>
  );
};

interface BattleDisplayProps {
  battle: Battle;
}

const BattleDisplay = ({ battle }: BattleDisplayProps) => {
  const [side1, side2] = battle.teams;

  return (
    <div style={{ display: "flex" }}>
      <div style={{ display: "flex", flexDirection: "column", margin: "5%" }}>
        {side1.activeChampions.map((c) => (
          <ChampionHUD key={c.id} champion={c} />
        ))}
      </div>
      <div style={{ display: "flex", flexDirection: "column", margin: "5%" }}>
        {side2.activeChampions.map((c) => (
          <ChampionHUD key={c.id} champion={c} />
        ))}
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

  return (
    <div
      className="App"
      style={{ display: "flex", flexDirection: "column", minHeight: "100vh", justifyContent: "center", alignItems: "center" }}
    >
      <BattleDisplay battle={battle} />
      <MyMenu battle={battle} />
    </div>
  );
}

export default App;
