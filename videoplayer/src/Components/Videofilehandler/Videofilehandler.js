import React, { useRef, useState } from 'react';
import './Videofilehandler.css';

import Popup from '../Popup/Popup.js';

const Videofilehandler = ({ customFunction, type, vid, title }) => {
    const fileInputRef = useRef(null);

    const [popupOverlay, setPopupOverlay] = useState(false);

    const togglePopupOverlay = () => {
        setPopupOverlay(!popupOverlay);
    }

    const checkVid = () => {
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

        const handleUploadClick = () => {
            fileInputRef.current.click();
        };

        return (
            <div id="Upload">
                <input
                    type="file"
                    accept="video/*"
                    id="fileInput"
                    onChange={handleFileChange}
                    ref={fileInputRef}
                />
                <button id="uploadButton" className="uploadButton" onClick={handleUploadClick}>
                    Video hochladen
                </button>
            </div>
        );
    }
    else if (type === "Delete") {
        return (
            <>
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
