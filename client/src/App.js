import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import LobbyPage from './components/LobbyPage';
import CodeBlock from './components/codeBlock';
import Navbar from './components/Navbar';



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
