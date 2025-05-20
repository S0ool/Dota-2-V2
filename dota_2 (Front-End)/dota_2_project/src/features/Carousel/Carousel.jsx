import { useState, useEffect, useRef } from 'react';
import './carousel.css'
import {HeroesIcon} from "../../components/Heroes/HeroesIcon.jsx";

const Carousel = ({ heroes, side }) => {

    return (
        <div className="infinity-carousel">
            <div className="wrapper-content" style={{animation: `${side ? 'toLeft' : 'toRight'} 150s linear infinite`}}>
                <span className='heroes-icon-list'>
                    {heroes.map((hero, index) => (
                        <HeroesIcon key={index} hero={hero}/>
                    ))}
                </span>
                <span className='heroes-icon-list'>
                    {heroes.map((hero, index) => (
                        <HeroesIcon key={index} hero={hero}/>
                    ))}
                </span>
            </div>
        </div>
    )
};

export default Carousel;
