import React, { useEffect, useState } from 'react';
import Navbar from '../../Components/Navbar/Navbar.js';
import Player from '../../Components/Player/Player.js'
import List from '../../Components/List/List.js'

import '../../Components/Darkmode/Darkmode.css'
import './Video.css';

const Video = () => {
    const [src, setSrc] = useState(""); // "", weil der Player kein null, aber einen leeren String akzeptiert
    const [vid, setVid] = useState(""); // "", weil der Player kein null, aber einen leeren String akzeptiert
    const [title, setTitle] = useState("");

    const loadIndexVideo = async (index) => {
        let response = await fetch('http://localhost:8000/video/')
        let data = await response.json()

        setSrc('http://localhost:8000' + data[index]['src'].slice(0, -4) + '.m3u8')
        setVid(data[index]['vid'])
        setTitle(data[index]['title'])
    }

    return (
        <>
            <Navbar />
            <div id="List-and-Player">
                <List loadIndexVideo={loadIndexVideo} />
                <div id="Player-Div">
                    <Player src={src} title={title} page="Video" vid={vid} />
                </div>
            </div>
        </>
    );
};

export default Video;
