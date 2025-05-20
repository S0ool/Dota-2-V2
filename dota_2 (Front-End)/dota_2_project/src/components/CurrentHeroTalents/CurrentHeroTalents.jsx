import './hero-talents.css';
import {useEffect} from "react";

export default function CurrentHeroTalents({ hero,languageData}) {

    return (
        <div className='current-hero-talents'>
            <h1>{languageData && languageData.data.hero_data.hero_talent_tree}</h1>
            <div className='current-hero-talent'>
                {hero && languageData && Object.values(hero.talents).map((value, index) => (
                    <div className='span-talents' key={index}>

                        <span className='span-talent'>{value[languageData.language]}</span>
                        {index % 2 === 1 && (
                            <div className="separator-border">
                                <div className='separator'>
                                    {index === 1 ? 25
                                        : index === 3 ? 20
                                            : index === 5 ? 15 : 10}
                                </div>
                            </div>
                        )}
                    </div>
                ))}
            </div>
        </div>
    );
}
