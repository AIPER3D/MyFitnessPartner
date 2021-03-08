import React from 'react';
import './App.css';

import Board from './components/board/board';

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <p>
          Edit <code>src/App.tsx</code> and save to reload.
        </p>
        <a
          className="App-link"
          href="https://reactjs.org"
          target="_blank"
          rel="noopener noreferrer"
        >
          Learn React.
        </a>
      </header>
      {/* <Board type={ 'gallery' }></Board> */}
    </div>
  );
}

export default App;
