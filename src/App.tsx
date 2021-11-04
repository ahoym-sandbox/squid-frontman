import './App.css';
import { ConfettiContainer } from './ConfettiContainer';
import { PlayersContainer } from './features/PlayersContainer';
import { RegistrationContainer } from './RegistrationContainer';
import { Circle } from './shapes/Circle';
import { Square } from './shapes/Square';
import { Triangle } from './shapes/Triangle';
import { BANK_ADDRESS, ORACLE_ADDRESS } from './XrplApiSandbox';

function App() {
  return (
    <div className="App">
      <ConfettiContainer />
      <div className="anchor-top-right">
        <a
          className="Squid-link"
          target="_blank"
          rel="noopener noreferrer"
          href={`https://testnet.xrpl.org/accounts/${ORACLE_ADDRESS}`}
        >
          See address
        </a>
        <a
          className="Squid-link"
          target="_blank"
          rel="noopener noreferrer"
          href={`https://testnet.xrpl.org/accounts/${BANK_ADDRESS}`}
        >
          PiggyBank address
        </a>
        <RegistrationContainer />
      </div>
      <header className="App-header">
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
