import './App.css';
import { PlayersContainer } from './features/PlayersContainer';
import { RegistrationContainer } from './RegistrationContainer';
import { Circle } from './shapes/Circle';
import { Square } from './shapes/Square';
import { Triangle } from './shapes/Triangle';

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <RegistrationContainer />
        <div className="Squid">
          <Circle />
          <Triangle />
          <Square />
        </div>
        <PlayersContainer />
      </header>
    </div>
  );
}

export default App;
