import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import mockResponse from '../../mockResponse.json'


function App() {
    const [response, setResponse] = useState(mockResponse);
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

            <button className='submitButton'>
                Submit
            </button>

            <div className='recommendedSongsContainer'>
                {response.recommendedSongs.map(songObject => {
                    return (
                        <div className='recommendedSong'>
                            <h3 className='songTitle'>{songObject.title} - {songObject.artist}</h3>
                            <ul className='themesList'>
                                {Object.entries(songObject.themes).map(([theme, desc]) => {
                                    return <>
                                            {desc !== "" && 
                                                <li className='themesListItem'>
                                                    <b>{theme}</b>: {desc}
                                                </li>
                                            }
                                        </>
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
