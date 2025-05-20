import React, {useEffect, useRef, useState} from "react";
import './pages.css';
import World from '/world-of-dota-2.jpg';
import { ScrollAnimation } from "../features/ScrollAnimation/ScrollAnimation.jsx";
import FirstSection from "../components/MainSections/FirstSection.jsx";
import NewsSection from "../components/MainSections/NewsSection.jsx";
import SecondSection from "../components/MainSections/SecondSection.jsx";
import {GetHeroes} from "../features/GetHeroes/GetHeroes.jsx";
import Carousel from "../features/Carousel/Carousel.jsx";
import About from "../components/About/About.jsx";
import Footer from "../components/Footer/Footer.jsx";
import axios from "axios";
import {useSelector} from "react-redux";

export default function MainPage() {
    const text = useRef();
    const secondText = useRef()
    const { heroes } = GetHeroes({page: 1});

    const { isVisible: showText } = ScrollAnimation({ element: text });
    const { isVisible: showSecondText } = ScrollAnimation({ element: secondText });
    const language = useSelector((state) => state.language);
    const [languageData, setLanguageData] = useState('')
    useEffect(() => {
        const fetchLanguageData = async () => {
            try {
                await axios.get(`http://localhost:8000/api/v1/languages/${language}/`)
                    .then(res => {
                        console.log(res.data.data.home_data)
                        setLanguageData(res.data)
                    })
            }
            catch (e) {
                console.log(e)
            }
        }
        fetchLanguageData()
    }, [language]);


    const first = {
        section: text,
        showText: showText,
        first_head: languageData?.data?.home_data?.home_battle_join?.split('|')[0],
        second_head: languageData?.data?.home_data?.home_battle_join?.split('|')[1],
        text: languageData?.data?.home_data?.home_battle_body,
        image: 'https://cdn.akamai.steamstatic.com/apps/dota2/images/dota_react//home/radiant_dire5.jpg',
        button_text: languageData?.data?.home_data?.home_battle_button,
        button_link: '/news',
    }
    const second = {
        section: secondText,
        showText: showSecondText,
        first_head: languageData?.data?.home_data?.home_choose_header?.split('|')[0],
        second_head: languageData?.data?.home_data?.home_choose_header?.split('|')[1],
        text: languageData?.data?.home_data?.home_choose_body,
        image: World,
        button_text: languageData?.data?.home_data?.home_choose_button,
        button_link: '/heroes',
    }


    return (
        <>
            <div className='main-container'>
                <FirstSection languageData={languageData}/>
            </div>
            <div className='main-news-container'>
                <NewsSection languageData={languageData}/>
            </div>
            <div>
                <SecondSection info = {first}/>
            </div>
            <div>
                <SecondSection info = {second}/>
            </div>
            <div className='main-heroes-icons'>
                <Carousel heroes={GetHeroes({page: 1}).heroes} side={true}/>
                <Carousel heroes={GetHeroes({page: 2}).heroes} side={false}/>
                <Carousel heroes={GetHeroes({page: 3}).heroes} side={true}/>
                <Carousel heroes={GetHeroes({page: 4}).heroes} side={false}/>
                <Carousel heroes={GetHeroes({page: 5}).heroes} side={true}/>
                <div className='vinete'></div>
            </div>
            <div className='main-about'>
                <About languageData={languageData}/>
            </div>
            <Footer/>
        </>
    )
}