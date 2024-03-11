import { React, useState, useEffect, useRef } from 'react';
import 'vidstack/styles/defaults.css';
import 'vidstack/styles/community-skin/video.css';
import { MediaCommunitySkin, MediaOutlet, MediaPlayer, MediaPoster } from '@vidstack/react';
import './Player.css';
import List from '../List/List.js';

import testTrack from "./test.vtt";

const Player = ({ src, title, page, vid }) => { /* *** src&title für den Player; page als "type" und vid für die Interaktionen(Liste) *** */
    const playerRef = useRef(); // Erstellen Sie eine Referenz

    // Die folgenden useStates befinden sich alle in der nachfolgenden Player-Komponente für page="edit"
    const [durationValue, setDurationValue] = useState("");
    const [questionValue, setQuestionValue] = useState("");
    const [answer1Value, setAnswer1Value] = useState("");
    const [answer2Value, setAnswer2Value] = useState("");
    const [answer3Value, setAnswer3Value] = useState("");
    const [answer4Value, setAnswer4Value] = useState("");
    const [realAnswer, setRealAnswer] = useState("");
    const [checked1, setChecked1] = useState(false);
    const [checked2, setChecked2] = useState(false);
    const [checked3, setChecked3] = useState(false);
    const [checked4, setChecked4] = useState(false);
    const [openAnswer, setOpenAnswerValue] = useState("");
    const [interactions, setInteractions] = useState("");

    const multipleSelected = [];
    const durationPaused = [];
    const alreadyAnswered = [];
    const interactionClicked = new Map();

    useEffect(() => { /* *** Interaktionen werden vid-spezifisch geladen *** */
        getInteractions(vid);
    }, [vid]);

    useEffect(() => {
        if (interactions.length > 0) {/* *** Sobald ein Video ausgewählt wird, welches ÜBERHAUPT Interaktionen hat: *** */
            const interval = setInterval(() => {/* *** prüft ein Intervall jede ms, ob... *** */
                if (!playerRef.current.paused) { /* *** ... das Video nicht pausiert ist und dann ob eine Interaktion stattfindet *** */
                    if (playerRef.current) {
                        if (playerRef.current.currentTime < 0.15) { //Fragen Reset, wenn Slider 0Sek     /* *** Interaktionen Reset, wenn zum Beginn gespult wird *** */
                            alreadyAnswered.length = 0;
                            durationPaused.length = 0;
                        }
                        if (checkPause(playerRef.current.currentTime)) { //Pause wenn innerhalb der Toleranz 
                            playerRef.current.pause()
                        }
                    }
                }
            }, 1); // Update jede ms

            return () => {
                clearInterval(interval);
            };
        }
    }, [interactions]);

    useEffect(() => { /* *** aktueller Timestamp *** */
        const interval = setInterval(() => {
            setDurationValue(playerRef.current.currentTime.toFixed(2))
        }, 1);

        return () => {
            clearInterval(interval);
        };
    })

    function handleAnswer(value, type) {
        if (alreadyAnswered.includes(durationValue)) { /* *** Button Spam wird verhindert *** */

        }
        else { /* *** 1.5 Sekunden lang Feedback mit Farbe, dann wird das Video weiter abgespielt *** */
            if (type === "Single") {
                alreadyAnswered.push(durationValue)
                if (value.toString() === realAnswer) {
                    document.getElementById("fs-Single-Fragen-Antwort" + value).style.backgroundColor = "green";
                }
                else {
                    document.getElementById("fs-Single-Fragen-Antwort" + value).style.backgroundColor = "red";
                }
                setTimeout(function () {
                    playerRef.current.play()
                    document.getElementById("fs-Single-Fragen-Antwort" + value).style.backgroundColor = "";
                }, 1500);
            }
            else if (type === "Multiple") {
                if (multipleSelected.includes(value)) {

                }
                else {
                    multipleSelected.push(value)
                    if (interactionClicked.get(durationValue) < eval(realAnswer).length || interactionClicked.get(durationValue) === undefined) {
                        if (eval(realAnswer).includes(value.toString())) {
                            document.getElementById("fs-Multiple-Fragen-Antwort" + value).style.backgroundColor = "green";

                        }
                        else {
                            document.getElementById("fs-Multiple-Fragen-Antwort" + value).style.backgroundColor = "red";

                        }
                        if (interactionClicked.get(durationValue) === undefined) {
                            interactionClicked.set(durationValue, 1)
                        }
                        else {
                            interactionClicked.set(durationValue, interactionClicked.get(durationValue) + 1)
                        }
                    }
                    if (interactionClicked.get(durationValue) === eval(realAnswer).length) {
                        alreadyAnswered.push(durationValue);
                        multipleSelected.length = 0;
                        interactionClicked.clear()
                        setTimeout(function () {
                            playerRef.current.play()
                            document.getElementById("fs-Multiple-Fragen-Antwort1").style.backgroundColor = "";
                            document.getElementById("fs-Multiple-Fragen-Antwort2").style.backgroundColor = "";
                            document.getElementById("fs-Multiple-Fragen-Antwort3").style.backgroundColor = "";
                            document.getElementById("fs-Multiple-Fragen-Antwort4").style.backgroundColor = "";
                        }, 1500);
                    }
                }

            }
            else if (type === "Open") {
                alreadyAnswered.push(durationValue)
                if (openAnswer === realAnswer) {
                    document.getElementById("fs-Open-Answer-Box").style.backgroundColor = "green"
                }
                else {
                    document.getElementById("fs-Open-Answer-Box").style.backgroundColor = "red"
                }
                setTimeout(function () {
                    playerRef.current.play()
                    document.getElementById("fs-Open-Answer-Box").style.backgroundColor = "";
                }, 1500);
            }
        }
    }

    // >>> Wird nicht benutzt <<<
    // Zu Beginn sollte erst überprüft werden, ob der Videoplayer im Vollbild genutzt wird, damit die Komponenten für die Interaktion für den Vollbild-Modus angepasst werden
    // Da die Interaktion Komponenten ein Teil vom Player sind, werden diese sowohl im Vollbild als auch in der Standardansicht angezeigt
    // const isFullscreen = () => {
    //     return (
    //         document.fullscreenElement || // moderne Browser
    //         document.webkitFullscreenElement || //Webkit Browser: Safari
    //         document.mozFullScreenElement || //älteres Firefox
    //         document.msFullscreenElement // MS Edge und Internet Explorer
    //     );
    // }

    const checkPause = (time) => {
        // Überprüfe alle duration-Werte in interactions
        for (let interaction of interactions) { /* *** Alle Interaktionen werden in einer ms durchsucht *** */
            if (time.toFixed(2) === interaction.duration) { /* *** Es wird auf 2 Nachkommastellen geprüft *** */
                console.log("Toleranz")
                if (durationPaused.includes(interaction.duration)) { /* *** Array durationPaused wird benötigt, weil das schnelle Intervall manchmal zu schnell sit *** */
                    console.log("Bereits vorhanden: " + interaction.duration)
                    return false;
                }
                else { /* *** useStated werden mit Inhalten gefüllt, if(Interaktion) *** */
                    console.log("Neu hinzugefügt: " + interaction.duration)
                    durationPaused.push(interaction.duration)

                    setDurationValue(interaction.duration)
                    setQuestionValue(interaction.question)
                    setAnswer1Value(interaction.answer1)
                    setAnswer2Value(interaction.answer2)
                    setAnswer3Value(interaction.answer3)
                    setAnswer4Value(interaction.answer4)
                    setRealAnswer(interaction.realAnswer)

                    if (interaction.type === "Single") {
                        document.getElementById("fs-Single-Screen").style.display = "flex";
                    }
                    else if (interaction.type === "Multiple") {
                        document.getElementById("fs-Multiple-Screen").style.display = "flex";
                    }
                    else if (interaction.type === "Open") {
                        setOpenAnswerValue("");
                        document.getElementById("fs-Open-Screen").style.display = "flex";
                    }

                    return true; // Pausiere, wenn eine der duration-Werte passt /* *** useEffect wird pausiert *** */
                }
            }
            else {
                if (document.getElementById("fs-Single-Screen").style.display === "flex") {
                    document.getElementById("fs-Single-Screen").style.display = "none";
                }
                else if (document.getElementById("fs-Multiple-Screen").style.display === "flex") {
                    document.getElementById("fs-Multiple-Screen").style.display = "none";
                }
                else if (document.getElementById("fs-Open-Screen").style.display === "flex") {
                    document.getElementById("fs-Open-Screen").style.display = "none";
                }
            }
        }
        return false; // Kein Treffer, nicht pausieren
    }

    const getInteractions = async (vid) => {
        let response = await fetch('http://localhost:8000/interaction/');
        let data = await response.json();
        setInteractions(data.filter(interaction => interaction.videoid === vid));
    };

    // Kriterien wieviele Checkboxen angeklickt sein dürfen
    const handleCheckboxChange = (event, type, value) => {
        if (type === "Single") { // Es darf nur eine angeklickt sein
            if (value === "1") {
                if (event.target.checked) {
                    setChecked1(true);
                    setChecked2(false);
                    setChecked3(false);
                    setChecked4(false);
                }
                else {
                    setChecked1(false);
                }
            }
            else if (value === "2") {
                if (event.target.checked) {
                    setChecked1(false);
                    setChecked2(true);
                    setChecked3(false);
                    setChecked4(false);
                }
                else {
                    setChecked2(false);
                }
            }
            else if (value === "3") {
                if (event.target.checked) {
                    setChecked1(false);
                    setChecked2(false);
                    setChecked3(true);
                    setChecked4(false);
                }
                else {
                    setChecked3(false);
                }
            }
            else {
                if (event.target.checked) {
                    setChecked1(false);
                    setChecked2(false);
                    setChecked3(false);
                    setChecked4(true);
                }
                else {
                    setChecked4(false);
                }
            }
        }
        else if (type === "Multiple") { // Es dürfen mehrere angeklickt sein
            if (value === "1") {
                if (event.target.checked) {
                    setChecked1(true);
                }
                else {
                    setChecked1(false);
                }
            }
            else if (value === "2") {
                if (event.target.checked) {
                    setChecked2(true);
                }
                else {
                    setChecked2(false);
                }
            }
            else if (value === "3") {
                if (event.target.checked) {
                    setChecked3(true);
                }
                else {
                    setChecked3(false);
                }
            }
            else {
                if (event.target.checked) {
                    setChecked4(true);
                }
                else {
                    setChecked4(false);
                }
            }
        }
    };

    const setInteraction = (type) => { /* *** Anzeige durch Button-onClick *** */
        if (type === "Single") {
            document.getElementById('Single-Interaction').style.display = "contents";
            document.getElementById('Multiple-Interaction').style.display = "none";
            document.getElementById('Open-Interaction').style.display = "none";
        }
        else if (type === "Multiple") {
            document.getElementById('Single-Interaction').style.display = "none";
            document.getElementById('Multiple-Interaction').style.display = "contents";
            document.getElementById('Open-Interaction').style.display = "none";
        }
        else if (type === "Open") {
            document.getElementById('Single-Interaction').style.display = "none";
            document.getElementById('Multiple-Interaction').style.display = "none";
            document.getElementById('Open-Interaction').style.display = "contents";
        }
        else {

        }
        setChecked1(false);
        setChecked2(false);
        setChecked3(false);
        setChecked4(false);
        setAnswer1Value("");
        setAnswer2Value("");
        setAnswer3Value("");
        setAnswer4Value("");
        setQuestionValue("");
    }
    const createInteraction = (type) => {
        if (vid.length !== 36) { // Die UUID der vid ist genau 36 Zeichen lang. Falls dies nicht erfüllt sein sollte, dann ist kein Video ausgewählt

        }
        else {
            if (type === "Single") {
                const realAnswer = checked1 ? "1" : checked2 ? "2" : checked3 ? "3" : checked4 ? "4" : "5"; /* *** Lösung *** */

                if (!(parseFloat(durationValue) >= 0) | questionValue.length === 0 | (answer1Value.length === 0 && answer2Value.length === 0 && answer3Value.length === 0 && answer4Value.length === 0) | realAnswer === "5") {
                    /* *** 1) Keinte Interaktion bei 0Sek; 2) Frage > 0; 3) Mindestens eine Antwort; 4) Mindestens eine Checkbox angeklickt *** */
                }
                else {
                    const fetchInteraction = async () => {
                        await fetch("http://localhost:8000/interaction/", {
                            method: "POST",
                            headers: { "Content-Type": "application/json" },
                            body: JSON.stringify({
                                duration: durationValue,
                                type: "Single",
                                question: questionValue,
                                answer1: answer1Value,
                                answer2: answer2Value,
                                answer3: answer3Value,
                                answer4: answer4Value,
                                realAnswer: realAnswer,
                                videoid: vid,
                            }),
                        })
                            .then((response) => response.json())
                    }
                    fetchInteraction();
                }
            }
            else if (type === "Multiple") {
                const realAnswer = []; /* *** Lösung ist ein Array, welches in handleAnswer() ausgewertet wird *** */
                if (checked1) realAnswer.push("1");
                if (checked2) realAnswer.push("2");
                if (checked3) realAnswer.push("3");
                if (checked4) realAnswer.push("4");

                if (!(parseFloat(durationValue) >= 0) | questionValue.length === 0 | (answer1Value.length === 0 && answer2Value.length === 0 && answer3Value.length === 0 && answer4Value.length === 0) | realAnswer.length === 0) {
                    /* *** 1) Keinte Interaktion bei 0Sek; 2) Frage > 0; 3) Mindestens eine Antwort; 4) Mindestens eine Checkbox angeklickt (anders als Single) *** */
                }
                else {
                    const fetchInteraction = async () => {
                        await fetch("http://localhost:8000/interaction/", {
                            method: "POST",
                            headers: { "Content-Type": "application/json" },
                            body: JSON.stringify({
                                duration: durationValue,
                                type: "Multiple",
                                question: questionValue,
                                answer1: answer1Value,
                                answer2: answer2Value,
                                answer3: answer3Value,
                                answer4: answer4Value,
                                realAnswer: realAnswer,
                                videoid: vid,
                            }),
                        })
                            .then((response) => response.json())
                    }
                    fetchInteraction();
                }
            }
            else if (type === "Open") {
                if (!(parseFloat(durationValue) >= 0) | questionValue.length === 0 | answer1Value.length === 0) {
                    /* *** 1) Keinte Interaktion bei 0Sek; 2) Frage > 0; 3) Antwort > 0 *** */
                }
                else {
                    const fetchInteraction = async () => {
                        await fetch("http://localhost:8000/interaction/", {
                            method: "POST",
                            headers: { "Content-Type": "application/json" },
                            body: JSON.stringify({
                                duration: durationValue,
                                type: "Open",
                                question: questionValue,
                                answer1: answer1Value,
                                answer2: "",
                                answer3: "",
                                answer4: "",
                                realAnswer: answer1Value,
                                videoid: vid,
                            }),
                        })
                            .then((response) => response.json())
                    }
                    fetchInteraction();
                }
            }
            else {

            }
        }
    }

    const setInteractionInfo = (durationValue, type, question, answer1, answer2, answer3, answer4, realAnswer) => { /* *** Wird von der Interaction-List aufgerufen *** */
        setDurationValue(durationValue)
        setInteraction(type)
        setQuestionValue(question)
        setAnswer1Value(answer1)
        setAnswer2Value(answer2)
        setAnswer3Value(answer3)
        setAnswer4Value(answer4)

        if (realAnswer === "1") {
            setChecked1(true)
            setChecked2(false);
            setChecked3(false);
            setChecked4(false);
        }
        else if (realAnswer === "2") {
            setChecked1(false)
            setChecked2(true)
            setChecked3(false)
            setChecked4(false)
        }
        else if (realAnswer === "3") {
            setChecked1(false)
            setChecked2(false)
            setChecked3(true)
            setChecked2(false)
        }
        else {
            setChecked1(false)
            setChecked2(false)
            setChecked3(false)
            setChecked4(true)
        }
    }

    // Die nachfolgenden Player für die verschiedenen "Pages" sind unterschiedlich in Hinblick auf die Komponenten und ihrer CSS. Die Edit Seite verfügt über zusätzliche Liste für die Interaktionen und bietet
    // das Hinzufügen von Interaktionen an. Die Popout-Seite hat einen Player, welches den gesamten Bildschirm füllt.
    return (
        <>
            {page === "Video" ? ( // > Video-Seite <
                <div id='Player'>
                    <MediaPlayer
                        title={title}
                        ref={playerRef}
                        src={src}
                        poster={src}
                        // thumbnails=
                        aspectRatio={16 / 9}
                        crossorigin=""
                    >
                        <MediaOutlet>
                            <MediaPoster
                            // alt="Girl walks into sprite gnomes around her friend on a campfire in danger!"
                            />
                            <track
                                src={testTrack}
                                srcLang="en-US"
                                kind="chapters"
                                default
                            />
                        </MediaOutlet>
                        <MediaCommunitySkin />
                        <div id="fs-Single-Screen">
                            <div className="fs-Interaction-Question-box">
                                <label className="fs-Interaction-Fragen-Label">{questionValue}</label>
                            </div>
                            <div className="fs-Interaction-Fragen-Button-Div">
                                <div className="fs-Interaction-Fragen-Button-Row">
                                    <button id="fs-Single-Fragen-Antwort1" className="fs-Interaction-Fragen-Antwort1" onClick={() => handleAnswer(1, "Single")}>{answer1Value}</button>
                                    <button id="fs-Single-Fragen-Antwort2" className="fs-Interaction-Fragen-Antwort2" onClick={() => handleAnswer(2, "Single")}>{answer2Value}</button>
                                </div>
                                <div className="fs-Interaction-Fragen-Button-Row">
                                    <button id="fs-Single-Fragen-Antwort3" className="fs-Interaction-Fragen-Antwort3" onClick={() => handleAnswer(3, "Single")}>{answer3Value}</button>
                                    <button id="fs-Single-Fragen-Antwort4" className="fs-Interaction-Fragen-Antwort4" onClick={() => handleAnswer(4, "Single")}>{answer4Value}</button>
                                </div>
                            </div>
                        </div>
                        <div id="fs-Multiple-Screen">
                            <div className="fs-Interaction-Question-box">
                                <label className="fs-Interaction-Fragen-Label">{questionValue}</label>
                            </div>
                            <div className="fs-Interaction-Fragen-Button-Div">
                                <div className="fs-Interaction-Fragen-Button-Row">
                                    <button id="fs-Multiple-Fragen-Antwort1" className="fs-Interaction-Fragen-Antwort1" onClick={() => handleAnswer(1, "Multiple")}>{answer1Value}</button>
                                    <button id="fs-Multiple-Fragen-Antwort2" className="fs-Interaction-Fragen-Antwort2" onClick={() => handleAnswer(2, "Multiple")}>{answer2Value}</button>
                                </div>
                                <div className="fs-Interaction-Fragen-Button-Row">
                                    <button id="fs-Multiple-Fragen-Antwort3" className="fs-Interaction-Fragen-Antwort3" onClick={() => handleAnswer(3, "Multiple")}>{answer3Value}</button>
                                    <button id="fs-Multiple-Fragen-Antwort4" className="fs-Interaction-Fragen-Antwort4" onClick={() => handleAnswer(4, "Multiple")}>{answer4Value}</button>
                                </div>
                            </div>
                        </div>
                        <div id="fs-Open-Screen">
                            <div className="fs-Interaction-Question-box">
                                <label className="fs-Interaction-Fragen-Label">{questionValue}</label>

                            </div>
                            <div id="fs-Open-Answer-Box">
                                <input
                                    type="text"
                                    value={openAnswer}
                                    onChange={(e) => setOpenAnswerValue(e.target.value)}
                                    id="fs-Question"
                                />
                                <button onClick={() => handleAnswer(1, "Open")}>Enter</button>
                            </div>
                        </div>
                    </MediaPlayer>
                </div>
            ) : page === "Edit" ? ( // > Edit-Seite <
                <div id='Player-and-Interaction'>
                    <div id='Player'>
                        <MediaPlayer
                            title={title}
                            ref={playerRef}
                            src={src}
                            poster={src}
                            // thumbnails=
                            aspectRatio={16 / 9}
                            crossorigin=""
                        >
                            <MediaOutlet>
                                <MediaPoster
                                // alt="Girl walks into sprite gnomes around her friend on a campfire in danger!"
                                />
                                <track
                                    src={testTrack}
                                    srcLang="en-US"
                                    kind="chapters"
                                    default
                                />
                            </MediaOutlet>
                            <MediaCommunitySkin />
                            <div id="fs-Single-Screen">
                                <div className="fs-Interaction-Question-box">
                                    <label className="fs-Interaction-Fragen-Label">{questionValue}</label>
                                </div>
                                <div className="fs-Interaction-Fragen-Button-Div">
                                    <div className="fs-Interaction-Fragen-Button-Row">
                                        <button id="fs-Single-Fragen-Antwort1" className="fs-Interaction-Fragen-Antwort1" onClick={() => handleAnswer(1, "Single")}>{answer1Value}</button>
                                        <button id="fs-Single-Fragen-Antwort2" className="fs-Interaction-Fragen-Antwort2" onClick={() => handleAnswer(2, "Single")}>{answer2Value}</button>
                                    </div>
                                    <div className="fs-Interaction-Fragen-Button-Row">
                                        <button id="fs-Single-Fragen-Antwort3" className="fs-Interaction-Fragen-Antwort3" onClick={() => handleAnswer(3, "Single")}>{answer3Value}</button>
                                        <button id="fs-Single-Fragen-Antwort4" className="fs-Interaction-Fragen-Antwort4" onClick={() => handleAnswer(4, "Single")}>{answer4Value}</button>
                                    </div>
                                </div>
                            </div>
                            <div id="fs-Multiple-Screen">
                                <div className="fs-Interaction-Question-box">
                                    <label className="fs-Interaction-Fragen-Label">{questionValue}</label>
                                </div>
                                <div className="fs-Interaction-Fragen-Button-Div">
                                    <div className="fs-Interaction-Fragen-Button-Row">
                                        <button id="fs-Multiple-Fragen-Antwort1" className="fs-Interaction-Fragen-Antwort1" onClick={() => handleAnswer(1, "Multiple")}>{answer1Value}</button>
                                        <button id="fs-Multiple-Fragen-Antwort2" className="fs-Interaction-Fragen-Antwort2" onClick={() => handleAnswer(2, "Multiple")}>{answer2Value}</button>
                                    </div>
                                    <div className="fs-Interaction-Fragen-Button-Row">
                                        <button id="fs-Multiple-Fragen-Antwort3" className="fs-Interaction-Fragen-Antwort3" onClick={() => handleAnswer(3, "Multiple")}>{answer3Value}</button>
                                        <button id="fs-Multiple-Fragen-Antwort4" className="fs-Interaction-Fragen-Antwort4" onClick={() => handleAnswer(4, "Multiple")}>{answer4Value}</button>
                                    </div>
                                </div>
                            </div>
                            <div id="fs-Open-Screen">
                                <div className="fs-Interaction-Question-box">
                                    <label className="fs-Interaction-Fragen-Label">{questionValue}</label>

                                </div>
                                <div id="fs-Open-Answer-Box">
                                    <input
                                        type="text"
                                        value={openAnswer}
                                        onChange={(e) => setOpenAnswerValue(e.target.value)}
                                        id="fs-Question"
                                    />
                                    <button onClick={() => handleAnswer(1, "Open")}>Enter</button>
                                </div>
                            </div>
                        </MediaPlayer>
                    </div>
                    <div id="Interaction-List-and-List">
                        <List type="Interaction" vid={vid} setInteractionInfo={setInteractionInfo} />
                        <div id="Interaction">
                            <label>Duration</label>
                            <input
                                type="text"
                                value={Math.floor(durationValue / 60).toString().padStart(2, "0") + ":" + Math.floor(durationValue % 60).toString().padStart(2, "0") + ":" + Math.round((durationValue - Math.floor(durationValue)) * 100)}
                                onChange={(e) => setDurationValue(e.target.value)}
                                id="DurationValue"
                            />
                            <div id="Interaction-type">
                                <button id="single-button" onClick={() => setInteraction("Single")} >Single</button>
                                <button id="multiple-button" onClick={() => setInteraction("Multiple")} >Multiple</button>
                                <button id="open-button" onClick={() => setInteraction("Open")} >Open</button>
                            </div>
                            <div id="Single-Interaction">
                                <label>Single-Choice Frage</label>
                                <div className='Question'>
                                    <label>Frage: </label>
                                    <input
                                        type="text"
                                        value={questionValue}
                                        onChange={(e) => setQuestionValue(e.target.value)}
                                        id="Question"
                                    />
                                </div>
                                <div className='Answer'>
                                    <label>A1: </label>
                                    <input
                                        type="text"
                                        value={answer1Value}
                                        onChange={(e) => setAnswer1Value(e.target.value)}
                                        id="Answer1"
                                    />
                                    <input
                                        type="checkbox"
                                        id="A1-Checkbox"
                                        name="A1-Checkbox"
                                        checked={checked1}
                                        onChange={(e) => handleCheckboxChange(e, "Single", "1")}
                                    />
                                </div>
                                <div className='Answer'>
                                    <label>A2: </label>
                                    <input
                                        type="text"
                                        value={answer2Value}
                                        onChange={(e) => setAnswer2Value(e.target.value)}
                                        id="Answer2"
                                    />
                                    <input
                                        type="checkbox"
                                        id="A2-Checkbox"
                                        name="A2-Checkbox"
                                        checked={checked2}
                                        onChange={(e) => handleCheckboxChange(e, "Single", "2")}
                                    />
                                </div>
                                <div className='Answer'>
                                    <label>A3: </label>
                                    <input
                                        type="text"
                                        value={answer3Value}
                                        onChange={(e) => setAnswer3Value(e.target.value)}
                                        id="Answer3"
                                    />
                                    <input
                                        type="checkbox"
                                        id="A3-Checkbox"
                                        name="A3-Checkbox"
                                        checked={checked3}
                                        onChange={(e) => handleCheckboxChange(e, "Single", "3")}
                                    />
                                </div>
                                <div className='Answer'>
                                    <label>A4: </label>
                                    <input
                                        type="text"
                                        value={answer4Value}
                                        onChange={(e) => setAnswer4Value(e.target.value)}
                                        id="Answer4"
                                    />
                                    <input
                                        type="checkbox"
                                        id="A4-Checkbox"
                                        name="A4-Checkbox"
                                        checked={checked4}
                                        onChange={(e) => handleCheckboxChange(e, "Single", "4")}
                                    />
                                </div>
                                <button className="Answer" onClick={() => createInteraction("Single")}>Hinzufügen</button>
                            </div>
                            <div id="Multiple-Interaction">
                                <label>Multiple-Choice Frage</label>
                                <div className='Question'>
                                    <label>Frage: </label>
                                    <input
                                        type="text"
                                        value={questionValue}
                                        onChange={(e) => setQuestionValue(e.target.value)}
                                        id="Question"
                                    />
                                </div>
                                <div className='Answer'>
                                    <label>A1: </label>
                                    <input
                                        type="text"
                                        value={answer1Value}
                                        onChange={(e) => setAnswer1Value(e.target.value)}
                                        id="Answer1"
                                    />
                                    <input
                                        type="checkbox"
                                        id="A1-Checkbox"
                                        name="A1-Checkbox"
                                        checked={checked1}
                                        onChange={(e) => handleCheckboxChange(e, "Multiple", "1")}
                                    />
                                </div>
                                <div className='Answer'>
                                    <label>A2: </label>
                                    <input
                                        type="text"
                                        value={answer2Value}
                                        onChange={(e) => setAnswer2Value(e.target.value)}
                                        id="Answer2"
                                    />
                                    <input
                                        type="checkbox"
                                        id="A2-Checkbox"
                                        name="A2-Checkbox"
                                        checked={checked2}
                                        onChange={(e) => handleCheckboxChange(e, "Multiple", "2")}
                                    />
                                </div>
                                <div className='Answer'>
                                    <label>A3: </label>
                                    <input
                                        type="text"
                                        value={answer3Value}
                                        onChange={(e) => setAnswer3Value(e.target.value)}
                                        id="Answer3"
                                    />
                                    <input
                                        type="checkbox"
                                        id="A3-Checkbox"
                                        name="A3-Checkbox"
                                        checked={checked3}
                                        onChange={(e) => handleCheckboxChange(e, "Multiple", "3")}
                                    />
                                </div>
                                <div className='Answer'>
                                    <label>A4: </label>
                                    <input
                                        type="text"
                                        value={answer4Value}
                                        onChange={(e) => setAnswer4Value(e.target.value)}
                                        id="Answer4"
                                    />
                                    <input
                                        type="checkbox"
                                        id="A4-Checkbox"
                                        name="A4-Checkbox"
                                        checked={checked4}
                                        onChange={(e) => handleCheckboxChange(e, "Multiple", "4")}
                                    />
                                </div>
                                <button className="Answer" onClick={() => createInteraction("Multiple")}>Hinzufügen</button>
                            </div>
                            <div id="Open-Interaction">
                                <label>offene Frage</label>
                                <div className='Question'>
                                    <label>Frage: </label>
                                    <input
                                        type="text"
                                        value={questionValue}
                                        onChange={(e) => setQuestionValue(e.target.value)}
                                        id="Question"
                                    />
                                </div>
                                <div className='Answer'>
                                    <label>A: </label>
                                    <input
                                        type="text"
                                        value={answer1Value}
                                        onChange={(e) => setAnswer1Value(e.target.value)}
                                        id="Open-Answer1"
                                    />
                                </div>
                                <button className="Answer" onClick={() => createInteraction("Open")}>Hinzufügen</button>
                            </div>
                        </div>
                    </div>
                </div>
            ) : ( // > Popout-Seite <
                <div id='Popout-Player'>
                    <MediaPlayer
                        title={title}
                        ref={playerRef}
                        src={src}
                        poster={src}
                        // thumbnails=
                        aspectRatio={16 / 9}
                        crossorigin=""
                    >
                        <MediaOutlet>
                            <MediaPoster
                            // alt="Girl walks into sprite gnomes around her friend on a campfire in danger!"
                            />
                            <track
                                src={testTrack}
                                srcLang="en-US"
                                kind="chapters"
                                default
                            />
                        </MediaOutlet>
                        <MediaCommunitySkin />
                        <div id="fs-Single-Screen">
                            <div className="fs-Interaction-Question-box">
                                <label className="fs-Interaction-Fragen-Label">{questionValue}</label>
                            </div>
                            <div className="fs-Interaction-Fragen-Button-Div">
                                <div className="fs-Interaction-Fragen-Button-Row">
                                    <button id="fs-Single-Fragen-Antwort1" className="fs-Interaction-Fragen-Antwort1" onClick={() => handleAnswer(1, "Single")}>{answer1Value}</button>
                                    <button id="fs-Single-Fragen-Antwort2" className="fs-Interaction-Fragen-Antwort2" onClick={() => handleAnswer(2, "Single")}>{answer2Value}</button>
                                </div>
                                <div className="fs-Interaction-Fragen-Button-Row">
                                    <button id="fs-Single-Fragen-Antwort3" className="fs-Interaction-Fragen-Antwort3" onClick={() => handleAnswer(3, "Single")}>{answer3Value}</button>
                                    <button id="fs-Single-Fragen-Antwort4" className="fs-Interaction-Fragen-Antwort4" onClick={() => handleAnswer(4, "Single")}>{answer4Value}</button>
                                </div>
                            </div>
                        </div>
                        <div id="fs-Multiple-Screen">
                            <div className="fs-Interaction-Question-box">
                                <label className="fs-Interaction-Fragen-Label">{questionValue}</label>
                            </div>
                            <div className="fs-Interaction-Fragen-Button-Div">
                                <div className="fs-Interaction-Fragen-Button-Row">
                                    <button id="fs-Multiple-Fragen-Antwort1" className="fs-Interaction-Fragen-Antwort1" onClick={() => handleAnswer(1, "Multiple")}>{answer1Value}</button>
                                    <button id="fs-Multiple-Fragen-Antwort2" className="fs-Interaction-Fragen-Antwort2" onClick={() => handleAnswer(2, "Multiple")}>{answer2Value}</button>
                                </div>
                                <div className="fs-Interaction-Fragen-Button-Row">
                                    <button id="fs-Multiple-Fragen-Antwort3" className="fs-Interaction-Fragen-Antwort3" onClick={() => handleAnswer(3, "Multiple")}>{answer3Value}</button>
                                    <button id="fs-Multiple-Fragen-Antwort4" className="fs-Interaction-Fragen-Antwort4" onClick={() => handleAnswer(4, "Multiple")}>{answer4Value}</button>
                                </div>
                            </div>
                        </div>
                        <div id="fs-Open-Screen">
                            <div className="fs-Interaction-Question-box">
                                <label className="fs-Interaction-Fragen-Label">{questionValue}</label>

                            </div>
                            <div id="fs-Open-Answer-Box">
                                <input
                                    type="text"
                                    value={openAnswer}
                                    onChange={(e) => setOpenAnswerValue(e.target.value)}
                                    id="fs-Question"
                                />
                                <button onClick={() => handleAnswer(1, "Open")}>Enter</button>
                            </div>
                        </div>
                    </MediaPlayer>
                </div>
            )}
        </>
    );
};

export default Player;
