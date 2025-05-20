import {ViewButton} from "../../UI/ViewButton/ViewButton.jsx";
import {useEffect, useState} from "react";


export default function About({languageData}){
    const [mainData, setMainData] = useState()
    useEffect(() => {
        setMainData(languageData?.data?.home_data)
    }, [languageData]);
    return (
        <div className='about'>
            <div>
                <h1>{mainData?.home_join_header?.split('|')[0]}</h1>
                <h1>{mainData?.home_join_header?.split('|')[1]}</h1>
            </div>
            <ViewButton blank={true} text={mainData?.home_play_free_now} link='https://store.steampowered.com/app/570/Dota_2/'/>
        </div>
    )
}