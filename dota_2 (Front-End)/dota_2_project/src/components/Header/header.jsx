import logo from '/dota2_logo_horiz.png'
import {Link} from "react-router-dom";
import '../components.css'
import {SteamButton} from "../../UI/SteamButton/SteamButton.jsx";
import axios from "axios";
import {useEffect, useRef, useState} from "react";
import { useDispatch, useSelector } from 'react-redux';
import {setLanguage} from "../../store/languageSlice.js";

export default function Header(){

    const [titleHeroes, setTitleHeroes] = useState('')
    const [titleNews, setTitleNews] = useState('')
    const [titlePlay, setTitlePlay] = useState('')
    const [languages, setLanguages] = useState([])
    const selectedLanguage = useRef()
    const [headerLanguage, setHeaderLanguage] = useState('')
    const [languageOptions, setLanguageOptions] = useState([])

    const dispatch = useDispatch();
    const language = useSelector((state) => state.language);


    useEffect(() => {
        const fetchLanguageData = async () => {
            try {
                let currentLanguage = localStorage.getItem('language') || 1
                await axios.get(`http://localhost:8000/api/v1/languages/${currentLanguage}/`)
                    .then(res => {
                        setTitleHeroes(res.data.data.common_data.header_heropedia?.toUpperCase())
                        setTitleNews(res.data.data.common_data.header_news?.toUpperCase())
                        setTitlePlay(res.data.data.common_data.header_payforfree?.toUpperCase())
                        setHeaderLanguage(res.data.data.common_data.header_language?.toUpperCase())
                        console.log(res.data)

                        let lan_options = []
                        let id = 1;
                        Object.entries(res.data.data.languages_data).forEach(([key, value]) => {
                            if (key != "Bbcode_Expand_Details_Collapsed" && key != "Bbcode_Expand_Details_Expanded"){
                                lan_options.push({
                                    "id":id,
                                    "language":value
                                })
                                id ++;
                            }
                        });
                        setLanguageOptions(lan_options)
                    })
            }
            catch (e) {
                console.log(e)
            }
        }

        const fetchLanguagesData = async () => {
            try {
                let has_next = true;
                let page = 1;
                let results = [];
                while (has_next) {
                    await axios.get(`http://localhost:8000/api/v1/languages/?page=${page}`)
                        .then(res => {
                            if (!res.data.next) {
                                has_next = false
                            }
                            else{
                                page += 1;
                            }
                            let currentResult = res.data.results.map(item => {
                                return {
                                    "id":item.id,
                                    "language":item.language
                                }})
                            results = [...results,...currentResult]


                        }).then(() => {
                            setLanguages(results)
                        })

                }
            }
            catch (e) {
                console.log(e)
            }
        }
        fetchLanguagesData()
        fetchLanguageData()

        const handleChange = (e) => {
            dispatch(setLanguage(e.target.value));
            fetchLanguagesData()
            fetchLanguageData()
        };
        selectedLanguage.current.addEventListener('change', handleChange)
    }, []);

    return (
        <header>
            <div className='header-content'>
                <ul className='nav-bar'>
                    <li>
                        <Link to='/'><img src={logo} alt=""/></Link>
                    </li>
                    <li>
                        <Link to='/heroes'>{titleHeroes}</Link>
                    </li>
                    <li>
                        <Link to='/news'>{titleNews}</Link>
                    </li>
                </ul>
            </div>
            <div className='right-content'>
                <SteamButton play_free={titlePlay} />
                <select className='language-select' ref={selectedLanguage}>
                    <option value="" disabled selected hidden>{headerLanguage}</option>
                    {languageOptions && languageOptions.map(language => {
                        return <option key={language.id} className='language-select-option' value={language.id}>{language.language}</option>
                    })}
                </select>
            </div>
        </header>
    )
}