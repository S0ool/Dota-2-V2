import HeroesHeader from "../components/Heroes/Heroes-header.jsx";
import HeroesMain from "../components/Heroes/Heroes.jsx";
import Footer from "../components/Footer/Footer.jsx";
import {useEffect, useState} from "react";
import axios from "axios";
import {useSelector} from "react-redux";


export default function Heroes(){
    const [languageData, setLanguageData] = useState('')
    const language = useSelector((state) => state.language);

    useEffect(() => {
        const fetchLanguageData = async () => {
            try {
                await axios.get(`http://localhost:8000/api/v1/languages/${language}/`)
                    .then(res => {
                        setLanguageData(res.data)
                    })
            }
            catch (e) {
                console.log(e)
            }
        }
        fetchLanguageData()
    }, [language]);
    return (
        <div className='heroes'>
            <HeroesHeader languageData={languageData}/>
            <HeroesMain languageData={languageData}/>
            <Footer/>
        </div>
    )
}