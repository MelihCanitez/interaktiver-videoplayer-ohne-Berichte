import './App.css';

import { Routes, Route } from "react-router-dom"
import { useEffect, useState } from 'react';
import Video from './Pages/Video/Video.js';
import Edit from './Pages/Edit/Edit.js';
import Popout from './Pages/Popout/Popout';

function App() {
  const [data, setData] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      const response = await fetch('http://localhost:8000/video/');
      const videoData = await response.json();
      setData(videoData);
    }

    fetchData();
  }, []);

  return (
    <div className="App">
      <Routes>
        <Route
          path="/"
          element={<Video />} />
        <Route
          path="/edit"
          element={<Edit />} />
        {data.map((video, index) => (
          <Route
            key={index}
            path={`/${video.vid}`}
            element={<Popout />}
          />
        ))}
      </Routes>
    </div>
  );
}

export default App;
