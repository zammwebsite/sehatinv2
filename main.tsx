import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './index.css';

console.log("🔧 Sehatin App is mounting...");

const rootElement = document.getElementById('root');
if (!rootElement) {
  console.error("❌ Root element not found! Pastikan index.html memiliki <div id='root'></div>");
} else {
  const root = ReactDOM.createRoot(rootElement);
  root.render(
    <React.StrictMode>
      <App />
    </React.StrictMode>
  );
}

console.log("✅ Sehatin App mounted successfully");
