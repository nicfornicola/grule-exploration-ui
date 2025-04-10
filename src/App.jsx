import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import mockResponse from './mockResponse.json'
import bronzeMedal from './assets/bronze_medal.svg';
import silverMedal from './assets/silver_medal.svg';
import goldMedal from './assets/gold_medal.svg';

const medals = [goldMedal, silverMedal, bronzeMedal]

function App() {
    const [response, setResponse] = useState([]);
    console.log(response)
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
        setThemes((prevThemes) => ({
             ...prevThemes,
            [theme]: !prevThemes[theme],
        }));
    };

    const handleSubmit = async () => {
        try {
            const response = await fetch('https://v8mqj3heg5.execute-api.us-east-2.amazonaws.com/dev/songs', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(themes),
            });
            const data = await response.json();
            setResponse(data['body-json']);
            console.log('Response from AWS:', data['body-json']);
        } catch (error) {
            console.error('Error submitting themes:', error);
        }
    };
    
    return (
        <div className='appContainer'>
            <h1 className="">Themes</h1>
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
            
            <button className='submitButton' onClick={handleSubmit}>
                Submit
            </button>
            <div className='recommendedSongsContainer'>
                {response.map((songObject, index) => {
                    return (
                        <div key={songObject.RuleID} className='recommendedSong'>
                            <h3 className='songTitle'>{songObject.Title} - {songObject.Artist}</h3>
                            {index < 3 && <img className='medalIcon' src={medals[index]}/>}
                            <ul className='themesList'>
                                {Object.entries(songObject.Themes).map(([theme, desc]) => {
                                    return desc !== "" && (
                                                <li key={songObject.RuleID + theme} className='themesListItem'>
                                                    <b>{theme}</b>: {desc}
                                                </li> 
                                            ) 
                                })}
                            </ul>

                        </div>
                    )
                })}
            </div>

        </div>
    );
}

export default App
