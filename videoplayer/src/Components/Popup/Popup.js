import React, { useState, useEffect } from 'react';
import './Popup.css'
import '../Darkmode/Darkmode.css'

const Popup = ({ type, onClick, customFunction, isVideo, videoTitle }) => {
    const [inputValue, setInputValue] = useState(videoTitle);

    if (isVideo) {
        if (type === "Delete") {
            return (
                <>
                    <div id="Background" onClick={onClick} />
                    <div id="Wrapper" style={{ backgroundColor: localStorage.getItem("Theme") }}>
                        <header id="Popup-Header">
                            <h2>Löschen bestätigen</h2>
                        </header>
                        <h1 id="Content-Header">Möchten Sie das Video wirklich löschen?</h1>
                        <div id="Popup-Buttons">
                            <button onClick={customFunction}>Bestätigen</button>
                            <button onClick={onClick}>Abbrechen</button>
                        </div>
                    </div>
                </>
            );
        }
        else if (type === "Rename") {
            // Umlaute sorgen für Probleme in Django. -> Diese Funktion wird bei der Umbenennung aufgerufen. Vor der Umbenennung wird der gewünschte Name überprüft und entsprechend angepasst.
            function checkUmlaut(title){
                if(title.includes('Ä')){
                    title = title.replace('Ä', 'AE');
                    return checkUmlaut(title)
                }
                else if((title.includes('Ö'))){
                    title = title.replace('Ö', 'OE');
                    return checkUmlaut(title)
                }
                else if(title.includes('Ü')){
                    title = title.replace('Ü', 'UE');
                    return checkUmlaut(title)
                }
                else if(title.includes('ä')){
                    title = title.replace('ä', 'ae');
                    return checkUmlaut(title)
                }
                else if(title.includes('ö')){
                    title = title.replace('ö', 'oe');
                    return checkUmlaut(title)
                }
                else if(title.includes('ü')){
                    title = title.replace('ü', 'ue');
                    return checkUmlaut(title)
                }
                else{
                    return title;
                }
            }
            
            const handleRename = async () => {
                let response = await fetch('http://localhost:8000/video/');
                let data = await response.json();
                
                const inputValue = checkUmlaut(document.getElementById('RenameValue').value); // Überprüfung der Umlaute
                
                // Keine doppelten Namen
                const foundTitle = data.find(item => item.title === inputValue);
                console.log(foundTitle)
                if (!foundTitle) {
                    customFunction(inputValue);
                } else {
                    console.log('Title already exists in data.');
                }
            }
            

            return (
                <>
                    <div id="Background" onClick={onClick} />
                    <div id="Wrapper" style={{ backgroundColor: localStorage.getItem("Theme") }}>
                        <header id="Popup-Header">
                            <h2>Video umbenennen</h2>
                        </header>
                        <h1 id="Content-Header">Titel</h1>
                        <div id="Title-and-Submit">
                            <input
                                type="text"
                                value={inputValue}
                                onChange={(e) => setInputValue(e.target.value)}
                                id="RenameValue"
                            />
                            <button onClick={handleRename}>Bestätigen</button>
                        </div>
                    </div>
                </>
            );
        }
        else {
            return (
                <>
                    <div id="Background" onClick={onClick} />
                    <div id="Wrapper" style={{ backgroundColor: localStorage.getItem("Theme") }}>
                        <header id="Popup-Header">
                            <h2>Null</h2>
                        </header>
                        <h1 id="Content-Header">Null</h1>
                        <div id="Popup-Buttons">
                        </div>
                    </div>
                </>
            );
        }
    }
    else {
        return (
            <>
                <div id="Background" onClick={onClick} />
                <div id="Wrapper" style={{ backgroundColor: localStorage.getItem("Theme") }}>
                    <header id="Popup-Header">
                        <h2>Kein Video</h2>
                    </header>
                    <h1 id="Content-Header">Sie haben kein Video ausgewählt!</h1>
                    <div id="Single-Button">
                        <button onClick={onClick}>Bestätigen</button>
                    </div>
                </div>
            </>
        );
    }
};

export default Popup;