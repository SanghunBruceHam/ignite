import { useState } from 'react';
import { AnimatePresence } from 'framer-motion';
import { MainMenu } from './components/MainMenu';
import { Bomb31 } from './components/Bomb31';
import { NunchiTap } from './components/NunchiTap';
import { VibeVote } from './components/VibeVote';
import { NeverHaveIEver } from './components/NeverHaveIEver';
import { KingsCup } from './components/KingsCup';
import { RedFlag } from './components/RedFlag';
import { TruthBomb } from './components/TruthBomb';
import { MostWanted } from './components/MostWanted';
import { OrWhat } from './components/OrWhat';
import { HotSeat } from './components/HotSeat';
import { TwoLies } from './components/TwoLies';

function App() {
  const [activeGame, setActiveGame] = useState('menu');
  const [afterDark, setAfterDark] = useState(false);

  const renderGame = () => {
    const back = () => setActiveGame('menu');
    switch (activeGame) {
      case 'bomb31': return <Bomb31 key="bomb31" onBack={back} onSelectGame={setActiveGame} />;
      case 'nunchitap': return <NunchiTap key="nunchitap" onBack={back} onSelectGame={setActiveGame} />;
      case 'vibevote': return <VibeVote key="vibevote" onBack={back} onSelectGame={setActiveGame} afterDark={afterDark} />;
      case 'neverhave': return <NeverHaveIEver key="neverhave" onBack={back} onSelectGame={setActiveGame} afterDark={afterDark} />;
      case 'kingscup': return <KingsCup key="kingscup" onBack={back} onSelectGame={setActiveGame} />;
      case 'redflag': return <RedFlag key="redflag" onBack={back} onSelectGame={setActiveGame} afterDark={afterDark} />;
      case 'truthbomb': return <TruthBomb key="truthbomb" onBack={back} onSelectGame={setActiveGame} afterDark={afterDark} />;
      case 'mostwanted': return <MostWanted key="mostwanted" onBack={back} onSelectGame={setActiveGame} afterDark={afterDark} />;
      case 'orwhat': return <OrWhat key="orwhat" onBack={back} onSelectGame={setActiveGame} afterDark={afterDark} />;
      case 'hotseat': return <HotSeat key="hotseat" onBack={back} onSelectGame={setActiveGame} afterDark={afterDark} />;
      case 'twolies': return <TwoLies key="twolies" onBack={back} onSelectGame={setActiveGame} afterDark={afterDark} />;
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
