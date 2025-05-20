import ms from '../../../public/icons/icon_movement_speed.png'
import tr from '../../../public/icons/icon_turn_rate.png'
import vision from "../../../public/icons/icon_vision.png";
import {useEffect} from "react";

export default function CurrentHeroMobility({hero,languageData}) {
    return (
        <div className='current-hero-atack'>
            <h2>{languageData.data.hero_data.hero_mobility}</h2>
            <div>
                <img src={ms} alt=""/>
                <p>{hero && hero.mobility.movement_speed}</p>
            </div>
            <div>
                <img src={tr} alt=""/>
                <p>{hero && hero.mobility.turn_rate}</p>
            </div>
            <div>
                <img src={vision} alt=""/>
                <p>{hero && hero.mobility.visibly}</p>
            </div>


        </div>
    )
}