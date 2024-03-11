import React, { useRef, useState } from 'react';
import './Videofilehandler.css';

import Popup from '../Popup/Popup.js';

const Videofilehandler = ({ customFunction, type, vid, title }) => { // customFuction = loadIndexVideo() aus der Video.js
    const fileInputRef = useRef(null);

    // Da die Popups nur beim Hochladen, Löschen und Umbenennen angezeigt werden findet das Umschalten vom Popup in dieser Komponente statt
    const [popupOverlay, setPopupOverlay] = useState(false);

    const togglePopupOverlay = () => {
        setPopupOverlay(!popupOverlay); // standard = kein Popup
    }


    const checkVid = () => { // Überprüfung ob überhaupt ein Video ausgewählt ist
        if (vid.length === 36) {
            return true;
        }
        else {
            return false;
        }
    }

    const deleteVideo = async () => {
        await fetch(`http://localhost:8000/video/${vid}/`, {
            method: "DELETE",
        })
            .then(window.location.reload());
    }

    const renameVideo = async (newTitle) => {
        const response = await fetch(`http://localhost:8000/video/${String(vid)}/`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ title: newTitle }),
        })
            .then(window.location.reload());
    }

    if (type === "Upload") {
        const handleFileChange = (event) => {
            document.getElementById("uploadButton").style.backgroundColor = "grey";
            document.getElementById("uploadButton").style.pointerEvents = "none";
            customFunction(event.target.files[0]);
        };

        const handleUploadClick = () => { // Ein Input wird mithilfe von einem Button angeklickt
            fileInputRef.current.click();
        };

        return (
            <div id="Upload">
                {/* Der nachfolgende Input wird mithilfe der CSS ausgeblendet */}
                <input
                    type="file"
                    accept="video/*"
                    id="fileInput"
                    onChange={handleFileChange}
                    ref={fileInputRef}
                />
                {/* Der nachfolgende button ersetzt den Input (Grund: besseres Design) */}
                <button id="uploadButton" className="uploadButton" onClick={handleUploadClick}>
                    Video hochladen
                </button>
            </div>
        );
    }
    else if (type === "Delete") {
        return (
            <>
                {/* Die Popup Komponente wird erst angezeigt, sobald popupOverlay durch die onClick()-Funktion auf true gesetzt wird */}
                {popupOverlay && (<Popup title="Test" onClick={togglePopupOverlay} customFunction={deleteVideo} type={"Delete"} isVideo={checkVid()} />)} 
                <div id="Delete">
                    <button className="deleteButton" onClick={togglePopupOverlay}>
                        Video löschen
                    </button>
                </div>
            </>
        );
    }
    else if (type === "Rename") {
        return (
            <>
                {/* Die Popup Komponente wird erst angezeigt, sobald popupOverlay durch die onClick()-Funktion auf true gesetzt wird */}
                {popupOverlay && (<Popup title="Test" onClick={togglePopupOverlay} customFunction={renameVideo} type={"Rename"} isVideo={checkVid()} videoTitle={title} />)}
                <div id="Delete">
                    <button className="renameButton" onClick={togglePopupOverlay}>
                        Video umbenennen
                    </button>
                </div>
            </>
        );
    }
    else {
        <p>Null</p>
    }
};

export default Videofilehandler;
