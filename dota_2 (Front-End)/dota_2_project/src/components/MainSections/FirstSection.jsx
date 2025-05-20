import React, {useEffect, useState} from "react";
import {SteamButton} from "../../UI/SteamButton/SteamButton.jsx";


export default function FirstSection({languageData}) {

    const [mainData, setMainData] = useState()
    useEffect(() => {
        setMainData(languageData?.data?.home_data)
    }, [languageData]);
    return (
        <div className='main-wrapper'>
            <div className='main-video-layer'></div>
            <video preload='auto' autoPlay loop muted>
                <source
                    src='https://cdn.akamai.steamstatic.com/apps/dota2/videos/dota_react/homepage/dota_montage_02.mp4'
                    type='video/mp4'/>
            </video>
            <div className='main-wrapper slide' style={{transition: '1s ease-out', transform: 'translateX(-50%)'}}>
                <p className='main-slogan'>{mainData?.quote_destructoid_quote}</p>
                <span>{mainData?.quote_destructoid_credit}</span>
                <SteamButton text={mainData?.download_on_steam}/>
            </div>
        </div>
    )
}