import React, {useState} from 'react';
import './App.css';
import Video from "./components/Video/Video";
import {getVideo} from "./config/videoLoader";

function App() {
    const [src, setSrc] = React.useState(null);
    document.addEventListener('keydown', (ev => {
        setSrc(getVideo(ev.key));
    }))

  return (
    <div className="App">
      <header className="App-header">
        <Video src={src} />
      </header>
    </div>
  );
}

export default App;
