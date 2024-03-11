import React, { useState } from 'react';
import Player from '../../Components/Player/Player.js'

import '../../Components/Darkmode/Darkmode.css'
import './Popout.css'

const Popout = () => {
    const [src, setSrc] = useState(""); // "", weil der Player kein null, aber einen leeren String akzeptiert
    const [vid, setVid] = useState(""); // "", weil der Player kein null, aber einen leeren String akzeptiert
    const [title, setTitle] = useState("");

    // Diese Funktion wird beim Aufruf der Seite aufgerufen. Da die Seite nur mit einer Video-ID (vid) erreichbar ist, wird die vid dem Befehl window.location.href.slice(22) erreicht -> In der Datenbank wird dann nach dem Video mit der vid gesucht.
    const loadSpecificVideo = async (index) => {
        let response = await fetch('http://localhost:8000/video/')
        let data = await response.json()

        setVid(window.location.href.slice(22)) // vid aus dem Link

        for (let i = 0; i < data.length; i++) {
            if (data[i]['vid'] === vid){ // Suche nach dem Video mit der vid
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
