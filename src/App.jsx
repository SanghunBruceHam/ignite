import { useState } from 'react';
import { AnimatePresence } from 'framer-motion';
import { MainMenu } from './components/MainMenu';
import { Bomb31 } from './components/Bomb31';
import { NunchiTap } from './components/NunchiTap';
import { VibeVote } from './components/VibeVote';
import { NeverHaveIEver } from './components/NeverHaveIEver';
import { KingsCup } from './components/KingsCup';
import { RedFlag } from './components/RedFlag';

function App() {
  const [activeGame, setActiveGame] = useState('menu');
  const [afterDark, setAfterDark] = useState(false);

  const renderGame = () => {
    switch (activeGame) {
      case 'bomb31': return <Bomb31 key="bomb31" onBack={() => setActiveGame('menu')} onSelectGame={setActiveGame} />;
      case 'nunchitap': return <NunchiTap key="nunchitap" onBack={() => setActiveGame('menu')} onSelectGame={setActiveGame} />;
      case 'vibevote': return <VibeVote key="vibevote" onBack={() => setActiveGame('menu')} onSelectGame={setActiveGame} afterDark={afterDark} />;
      case 'neverhave': return <NeverHaveIEver key="neverhave" onBack={() => setActiveGame('menu')} onSelectGame={setActiveGame} afterDark={afterDark} />;
      case 'kingscup': return <KingsCup key="kingscup" onBack={() => setActiveGame('menu')} onSelectGame={setActiveGame} />;
      case 'redflag': return <RedFlag key="redflag" onBack={() => setActiveGame('menu')} onSelectGame={setActiveGame} afterDark={afterDark} />;
      default: return <MainMenu key="menu" onSelectGame={setActiveGame} afterDark={afterDark} onToggleAfterDark={() => setAfterDark(v => !v)} />;
    }
  };

  return (
    <AnimatePresence mode="wait">
      {renderGame()}
    </AnimatePresence>
  );
}

export default App;
