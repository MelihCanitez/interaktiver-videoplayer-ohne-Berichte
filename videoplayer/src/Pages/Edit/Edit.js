import React, { useEffect, useState } from 'react';
import Navbar from '../../Components/Navbar/Navbar.js';
import Player from '../../Components/Player/Player.js';
import List from '../../Components/List/List.js';
import Videohandler from '../../Components/Videofilehandler/Videofilehandler.js';
import { v4 as uuidv4 } from 'uuid';

import '../../Components/Darkmode/Darkmode.css';
import './Edit.css';

const Edit = () => {
    const [src, setSrc] = useState(""); // "", weil der Player kein null, aber einen leeren String akzeptiert
    const [vid, setVid] = useState(""); // "", weil der Player kein null, aber einen leeren String akzeptiert
    const [title, setTitle] = useState("");
    const formData = new FormData();

    function checkUmlaut(title) {
        if (title.includes('Ä')) {
            title = title.replace('Ä', 'AE');
            return checkUmlaut(title)
        }
        else if ((title.includes('Ö'))) {
            title = title.replace('Ö', 'OE');
            return checkUmlaut(title)
        }
        else if (title.includes('Ü')) {
            title = title.replace('Ü', 'UE');
            return checkUmlaut(title)
        }
        else if (title.includes('ä')) {
            title = title.replace('ä', 'ae');
            return checkUmlaut(title)
        }
        else if (title.includes('ö')) {
            title = title.replace('ö', 'oe');
            return checkUmlaut(title)
        }
        else if (title.includes('ü')) {
            title = title.replace('ü', 'ue');
            return checkUmlaut(title)
        }
        else {
            return title;
        }
    }

    const handleVideoSrc = (videoSrc) => {
        formData.append('vid', uuidv4())
        formData.append('title', videoSrc.name.slice(0, -4))
        formData.append('src', videoSrc);

        formData.set('title', checkUmlaut(formData.get('title')));
        formData.set('src', new File([formData.get('src')], checkUmlaut(formData.get('src').name)))

        const fetchNew = async () => {
            console.log("Fetch started")
            await fetch("http://localhost:8000/video/", {
                method: "POST",
                body: formData
            })
                .then((response) => response.json())
                .then(() => {
                    console.log("Video wurde angelegt");
                })
                .then(() => {
                    createHLS()
                })
        }
        fetchNew()
    };

    const createHLS = async () => {
        let response = await fetch('http://localhost:8000/video/')
        let data = await response.json()

        const videoName = data[data.length - 1]['src'];

        const response2 = await fetch('http://localhost:8000/executeconvert/', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
            },
            body: `video_name=${encodeURIComponent(videoName)}`,
        });
        const data2 = await response2.json();

        window.location.reload();
    }

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
                <div id="List-and-Button">
                    <List loadIndexVideo={loadIndexVideo} />
                    <div id="Button">
                        <Videohandler customFunction={handleVideoSrc} type="Upload" />
                        <Videohandler type="Delete" vid={vid} />
                        <Videohandler type="Rename" vid={vid} title={() => src.slice(65, -5)} />
                    </div>
                </div>
                <div id="Player-Div">
                    <Player src={src} title={title} page="Edit" vid={vid} />
                </div>
            </div>
        </>
    );
};

export default Edit;
