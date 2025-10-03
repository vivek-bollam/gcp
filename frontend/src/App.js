import React, { useState, useEffect } from 'react';
import './App.css';

function App() {
  const [healthStatus, setHealthStatus] = useState('Checking...');

  useEffect(() => {
    fetch('/api/health')
      .then(response => response.json())
      .then(data => setHealthStatus(data.status))
      .catch(() => setHealthStatus('Error'));
  }, []);

  return (
    <div className="App">
      <header className="App-header">
        <h1>Hello World!</h1>
        <p>Backend Health: {healthStatus}</p>
      </header>
    </div>
  );
}

export default App;
