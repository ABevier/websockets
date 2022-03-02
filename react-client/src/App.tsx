import React from "react";
import logo from "./logo.svg";
import "./App.css";
import { Battle, runCommand, setup } from "./sim/battleState";

interface BattleDisplayProps {
  battle: Battle;
}

const BattleDisplay = ({ battle }: BattleDisplayProps) => {
  const [side1, side2] = battle.teams;

  return (
    <>
      <div style={{ display: "flex" }}>
        <div style={{ display: "flex", flexDirection: "column" }}>
          {side1.activeChampions.map((c) => (
            <div>{c.id}</div>
          ))}
        </div>
        <div style={{ display: "flex", flexDirection: "column" }}>
          {side2.activeChampions.map((c) => (
            <div>{c.id}</div>
          ))}
        </div>
      </div>
    </>
  );
};

function App() {
  const battle = setup();
  console.log(battle);

  const src = { side: 0, slot: 0 };
  const target = { side: 1, slot: 0 };
  const cmd = { source: src, moveSlot: 0, target };

  const result = runCommand(battle, cmd);
  console.log(result);

  return (
    <div className="App" style={{ display: "flex", minHeight: "100vh", justifyContent: "center", alignItems: "center" }}>
      <BattleDisplay battle={battle} />
    </div>
  );
}

export default App;
