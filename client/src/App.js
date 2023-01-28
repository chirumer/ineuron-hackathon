import "./App.css";
import alanBtn from "@alan-ai/alan-sdk-web";
import React, { useState, useEffect } from "react";

function App() {
  useEffect(() => {
    alanBtn({
      key: "b8bd8ab891cce7c43cbb48a7f7162e6d2e956eca572e1d8b807a3e2338fdd0dc/stage",
      onCommand: (commandData) => {
        if (commandData.command === "maps") {
          alert("hit chirags api");
          // Call the client code that will react to the received command
        }
      },
    });
  }, []);

  return <div className="App">Ninad Sonawane</div>;
}

export default App;
