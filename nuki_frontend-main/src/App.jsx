import { useState } from "react";
import Table from "./components/Table";
import "./App.css";

function App() {
  return (
    <div className="container-fluid">
      <div className="mb-3 mt-5">
        <h5 className="mx-4">
          Assign Locks To Rooms
        </h5>
      </div>
      
      <Table />
    </div>
  );
}

export default App;
