import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import MobileApp from "./MobileApp.jsx";
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.css';
import "./index.css";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <BrowserRouter>
        <Routes>
          <Route path="/mobile" element={<MobileApp />} />
          <Route path="/" element={<App />} />
          <Route path="/*" element={<App />} />
        </Routes>
    </BrowserRouter>
  </React.StrictMode>,
);
