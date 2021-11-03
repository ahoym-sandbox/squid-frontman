import './App.css';
import { PlayersContainer } from './features/PlayersContainer';
import logo from './logo.svg';
import { RegistrationContainer } from './RegistrationContainer';

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <RegistrationContainer />
        <img src={logo} className="App-logo" alt="logo" />
        <PlayersContainer />
      </header>
    </div>
  );
}

export default App;
