import {useEffect, useState} from "react";


export default function HeroesHeader({languageData}){
    const [chooseHero, setChooseHero] = useState()
    const [desc, setDesc] = useState()
    useEffect(() => {
        setChooseHero(languageData?.data?.heroes_data?.herogrid_choose?.toUpperCase())
        setDesc(languageData?.data?.heroes_data?.home_choose_body)

    }, [languageData]);

    return (
        <div className='heroes-headers'>
            <h1>{chooseHero}</h1>
            <p>{desc}</p>
        </div>
    )
}