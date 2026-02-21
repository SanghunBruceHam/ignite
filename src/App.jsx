import { useState } from 'react';
import { AnimatePresence } from 'framer-motion';
import { MainMenu } from './components/MainMenu';
import { Bomb31 } from './components/Bomb31';
import { NunchiTap } from './components/NunchiTap';
import { VibeVote } from './components/VibeVote';
import { NeverHaveIEver } from './components/NeverHaveIEver';
import { KingsCup } from './components/KingsCup';

function App() {
  const [activeGame, setActiveGame] = useState('menu');

  const renderGame = () => {
    switch (activeGame) {
      case 'bomb31': return <Bomb31 key="bomb31" onBack={() => setActiveGame('menu')} onSelectGame={setActiveGame} />;
      case 'nunchitap': return <NunchiTap key="nunchitap" onBack={() => setActiveGame('menu')} onSelectGame={setActiveGame} />;
      case 'vibevote': return <VibeVote key="vibevote" onBack={() => setActiveGame('menu')} onSelectGame={setActiveGame} />;
      case 'neverhave': return <NeverHaveIEver key="neverhave" onBack={() => setActiveGame('menu')} onSelectGame={setActiveGame} />;
      case 'kingscup': return <KingsCup key="kingscup" onBack={() => setActiveGame('menu')} onSelectGame={setActiveGame} />;
      default: return <MainMenu key="menu" onSelectGame={setActiveGame} />;
    }
  };

  return (
    <AnimatePresence mode="wait">
      {renderGame()}
    </AnimatePresence>
  );
}

export default App;
