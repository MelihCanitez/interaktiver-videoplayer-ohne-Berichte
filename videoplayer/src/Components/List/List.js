import React, { useEffect, useState } from 'react';
import './List.css'

const List = ({ loadIndexVideo, type, vid, setInteractionInfo }) => {
    const [videos, setVideos] = useState([]);
    const [interactions, setInteractions] = useState([]);

    // [Videoübersicht / Interaktion] Beide Listenarten sollen aktualisiert werden ohne F5 (Neuladen der Seite)
    useEffect(() => {
        const getVideos = async () => {
            let response = await fetch('http://localhost:8000/video/');
            let data = await response.json();
            setVideos(data);
        };

        const getInteractions = async () => {
            let response = await fetch('http://localhost:8000/interaction/');
            let data = await response.json();
            setInteractions(data);
        };

        getVideos();
        getInteractions();
    }, [interactions]); //Grund für get Spam in Django

    // [Videoübersicht] Aufruf der loadIndexVideo aus Video.js -> returnIndex wird durch onClick() auf ein Listen <p> Element aufgerufen
    const returnIndex = (index) => {
        loadIndexVideo(index);
    }

    // [Interaktion] Löschen einer Interaktion nach einem onDoubleClick() - Hier gibt es keine zusätzliche Popout Seite
    const deleteInteraction = async (iid) => { 
        await fetch(`http://localhost:8000/interaction/${iid}/`, {
            method: "DELETE",
        })
    }
    return (
        <>
            {type === "Interaction" ? (
                <div id="Interaction-List-and-Interaction">
                    <div id="Interaction-Header-and-List">
                        <div id="Interaction-Header">
                            Interaktion
                        </div>
                        <div id="Interaction-List">
                            {interactions.filter((interaction) => interaction.videoid === vid).map((interaction, index) => (
                                <p title={Math.floor(interaction.duration / 60).toString().padStart(2, "0") + ":" + Math.floor(interaction.duration % 60).toString().padStart(2, "0") + ":" + Math.round((interaction.duration - Math.floor(interaction.duration)) * 100) + " - " + interaction.question + " " + "[" + interaction.type + "]"} key={index} onClick={() => setInteractionInfo(interaction.duration, interaction.type, interaction.question, interaction.answer1, interaction.answer2, interaction.answer3, interaction.answer4, interaction.realAnswer)} onDoubleClick={() => deleteInteraction(interaction.iid)}>
                                    {Math.floor(interaction.duration / 60).toString().padStart(2, "0") + ":" + Math.floor(interaction.duration % 60).toString().padStart(2, "0") + ":" + Math.round((interaction.duration - Math.floor(interaction.duration)) * 100)} - {interaction.question + " " + "[" + interaction.type + "]"}
                                </p>
                            ))}
                        </div>
                    </div>
                </div>

            ) : (
                <div id="Header-and-List">
                    <div id="Header">
                        Videoübersicht
                    </div>
                    <div id="List">
                        {videos.map((video, index) => (
                            <p key={index} onClick={() => returnIndex(index)} onDoubleClick={() => window.open(`/${videos[index]['vid']}`, '_blank')}>
                                {video.title}
                            </p>
                        ))}
                    </div>
                </div>
            )}
        </>
    );
};

export default List;