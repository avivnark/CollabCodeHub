import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import LobbyPage from './LobbyPage';
import CodeBlock from './codeBlock';
import Navbar from './Navbar';



function App() {
  return (
    <Router>
      <div className="App">
        <Navbar />
        <div className="content">
          <Routes>
            <Route path="/" element={<LobbyPage />} />
            <Route path="/code/:id" element={<CodeBlock />} />
          </Routes>
        </div>
      </div>
    </Router>
  );
}

export default App;
