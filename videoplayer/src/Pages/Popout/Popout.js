import React, { useState } from 'react';
import Player from '../../Components/Player/Player.js'

import '../../Components/Darkmode/Darkmode.css'
import './Popout.css'

const Popout = () => {
    const [src, setSrc] = useState(""); // "", weil der Player kein null, aber einen leeren String akzeptiert
    const [vid, setVid] = useState(""); // "", weil der Player kein null, aber einen leeren String akzeptiert
    const [title, setTitle] = useState("");

    const loadSpecificVideo = async (index) => {
        let response = await fetch('http://localhost:8000/video/')
        let data = await response.json()

        setVid(window.location.href.slice(22))

        for (let i = 0; i < data.length; i++) {
            if (data[i]['vid'] === vid){
                setSrc('http://localhost:8000' + data[i]['src'].slice(0, -4) + '.m3u8');
                setTitle(data[i]['title'])
                break;
            }
        }
    }
    loadSpecificVideo();

    return (
        <>
            <div id="Popout-Player-Div">
                <Player src={src} title={title} page="Popout" vid={vid} />
            </div>
        </>
    );
};

export default Popout;
