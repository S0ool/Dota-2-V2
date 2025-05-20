import {useEffect, useState} from "react";
import melee from "../../../public/attack_type/melee.svg";
import ranged from "../../../public/attack_type/ranged.svg";


export default function HeroType({hero,show,setShow,languageData}){
    const handleClick = () => {
        setShow(!show)
    }


    return (
        <>
            <div className='hero-description'>
                <h1>{hero && languageData && hero.name[languageData.language]}</h1>
                <h2>{hero && languageData && hero.advice[languageData.language]}</h2>
                {show ? (<p className='full-history-hero' dangerouslySetInnerHTML={{__html: hero && languageData && hero.history[languageData.language]}}/>)
                    : <p dangerouslySetInnerHTML={{__html: hero && languageData && hero.description[languageData.language]}}/>}

            </div>
            <p className='full-history' onClick={(e) => handleClick(e)}>
                {show ? `${languageData && languageData.data.hero_data.hero_close_bio}` : `${languageData && languageData.data.hero_data.hero_full_bio}`}</p>

            <h2>{languageData && languageData.data.hero_data.hero_attack_type}</h2>
            <div className='hero_attack_type'>
                {hero.attack_type === 'melee' ? (
                    <>
                        <img src={melee} alt=""/>
                        <h2>{hero && languageData && languageData.data.hero_data.hero_attack_type_melee}</h2>
                    </>
                ) : (
                    <>
                        <img src={ranged} alt=""/>
                        <h2>{hero && languageData && languageData.data.hero_data.hero_attack_type_ranged}</h2>
                    </>
                )}
            </div>
            <h2>{languageData && languageData.data.hero_data.hero_complexity}</h2>
            <div className='hero-complexity'>
                <div className='comp comp-active'></div>
                <div className={`comp ${hero.complexity === (2 || 3) ? 'comp-active' : ''}`}></div>
                <div className={`comp ${hero.complexity === 3 ? 'comp-active' : ''}`}></div>
            </div>
        </>
    )
}