import { useState } from 'react'
import mockResponse from './mockResponse.json'
import bronzeMedal from './assets/bronze_medal.svg';
import silverMedal from './assets/silver_medal.svg';
import goldMedal from './assets/gold_medal.svg';

const medals = [silverMedal, goldMedal, bronzeMedal]

function App() {
    const [response, setResponse] = useState([]);
    const [loading, setLoading] = useState(null);
    const [themes, setThemes] = useState({
        adventure: true,
        america: true,
        carsTrucksTractors: false,
        goodtimes: false,
        grit: false,
        heartbreak: false,
        home: true,
        lessons: true,
        love: false,
        rebellion: false,
    });
    
    const toggleTheme = (theme) => {
        setLoading(null);
        setResponse([]);
        setThemes((prevThemes) => ({
             ...prevThemes,
            [theme]: !prevThemes[theme],
        }));
    };

    const handleSubmit = async () => {
        setLoading(true);
        try {
            console.log('Submitting themes:', themes);
            const response = await fetch('https://v8mqj3heg5.execute-api.us-east-2.amazonaws.com/dev/songs', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({"Themes": themes}),
            });
            const data = await response.json();
            
            setResponse(data['body-json']);
            console.log('Response from AWS:', data['body-json']);
        } catch (error) {
            console.error('Error submitting themes:', error);
        }
        setLoading(false);
    };

    // For find songs list 
    const selectedThemes = Object.keys(themes).filter((key) => themes[key]);

    // Count up the number of matches for each song and add the value to the song object
    const updatedResponse = response?.map((songObject) => {
        const matches = Object.values(songObject.Themes).filter((desc) => desc !== "").length;
        return { ...songObject, matches }; // Add the "matches" property
    });

    // Sort the response based on the number of matches
    const sortedResponse = updatedResponse?.toSorted((a, b) => b.matches - a.matches);

    if(sortedResponse?.length > 1) {
        let first = sortedResponse[0]
        let second = sortedResponse[1]
        sortedResponse[0] = second
        sortedResponse[1] = first
    }

    return (
        <div className='appContainer'>
            <h2 className="">Country Song Themes</h2>
            <div className="optionsContainer">
                <div className="buttonToggleContainer">
                    {Object.entries(themes).map(([theme, isActive]) => (
                        <div key={theme} className="buttonToggle">
                            <span className="buttonToggleLabel">{theme}</span>
                            <button onClick={() => toggleTheme(theme)}>
                                {isActive ? '✅' : '❌'}
                            </button>
                        </div>
                    ))}
                </div>
            </div>
            
            {selectedThemes.length > 0 && 
                <>
                    <div className='findMeASong'>Find songs with:</div>
                    <div className='findMeASongThemes'><i>{selectedThemes.join(', ')}</i></div>
                </>
            }
            
            <button className='submitButton' onClick={handleSubmit} disabled={selectedThemes.length === 0}>
                Submit
            </button>
            {loading ? (
                <div className='loading'>Loading...</div>
            ) : (
                sortedResponse?.length > 0 && 
                    <div className='recommendedSongsContainer'>
                        {sortedResponse.map((songObject, index) => {
                            return (
                                <div key={songObject.RuleID} className={`rSong recommendedSong${sortedResponse.length === 1 ? 1 : index}`}>
                                    {index < 3 && <img alt="medal" className='medalIcon' src={sortedResponse.length === 1 ? medals[1] : medals[index]}/>}
                                    <h3 className='songTitle'>{songObject.Title} - {songObject.Artist} <span style={{color: "lightgray"}}>({songObject?.matches})</span></h3>
                                    <ul className='themesList'>
                                        {Object.entries(songObject.Themes).map(([theme, desc]) => {
                                            return desc !== "" && (
                                                <li key={songObject.RuleID + theme} className={`themesListItem`}>
                                                    <b>{theme}</b>: {desc}
                                                </li> 
                                            )
                                        })}
                                    </ul>
                                    <div key={songObject.RuleID} className='recommendedSongVideo'>
                                        {songObject.VideoLink && (
                                            <iframe
                                                width="550"
                                                height="315"
                                                src={songObject.VideoLink.replace("watch?v=", "embed/")}
                                                title={songObject.Title}
                                                frameBorder="0"
                                                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                                allowFullScreen
                                            ></iframe>
                                        )}
                                    </div>
                                </div>
                            )
                        })}
                    </div>
            )}
        </div>
    );
}

export default App
