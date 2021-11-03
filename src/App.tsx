import { useState } from 'react';
import './App.css';
import { PlayersContainer } from './features/PlayersContainer';
import logo from './logo.svg';
import { RegistrationContainer } from './RegistrationContainer';

// Execute oracle code. Change BANK_ADDRESS
// import './oracle';

function App() {
  const [logs] = useState<unknown[]>([]);

  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />

        <div className="App-logs">
          {logs.map((log) => {
            if (typeof log === 'string') {
              return (
                <p key={Math.random()} className="App-console-log">
                  {log}
                </p>
              );
            } else if (typeof log === 'object') {
              return (
                <div key={Math.random()}>
                  <pre>{JSON.stringify(log, null, 2)}</pre>
                </div>
              );
            }
            return null;
          })}
        </div>

        <RegistrationContainer />
        <PlayersContainer />

        <p>
          Edit <code>src/App.tsx</code> and save to reload.
        </p>
        <a
          className="App-link"
          href="https://reactjs.org"
          target="_blank"
          rel="noopener noreferrer"
        >
          Learn React
        </a>
      </header>
    </div>
  );
}

export default App;
