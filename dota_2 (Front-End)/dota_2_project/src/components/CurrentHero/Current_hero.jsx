import {useParams} from "react-router-dom";
import {GetCurrentHero} from "../../features/GetCurrentHero/GetCurrentHero.jsx";
import './current-hero.css'
import HeroVideo from "./Hero_video.jsx";
import HeroAttr from "./Hero_attr.jsx";
import HeroType from "./Hero_type.jsx";
import talents from '../../../public/talents.svg'
import {GetCurrentHeroSkills} from "../../features/GetCurrentHeroSkills/GetCurrentHeroSkills.jsx";
import HeroSkills from "./Hero_skills.jsx";
import HeroAbout from "./Hero_about.jsx";
import CurrentHeroAspects from "../CurrentHeroAspects/Current_hero_aspects.jsx";
import CurrentHeroSkillsVideo from "../CurrentHeroSkills/Current_hero_skills_video.jsx";
import CurrentHeroTalents from "../CurrentHeroTalents/CurrentHeroTalents.jsx";
import {useEffect, useState} from "react";
import allHeroes from '../../../public/pppp.bmp'
import {PrevHero} from "../nextPrevHeroes/prevHero.jsx";
import {NextHero} from "../nextPrevHeroes/nextHero.jsx";
import HeroesList from "../Heroes/Heroes-list.jsx";
import axios from "axios";
import {useSelector} from "react-redux";
export default function CurrentHero() {
    const {name} = useParams()
    const hero = GetCurrentHero(name).heroes
    const [nextHero, setNextHero] = useState({})
    const [prevHero, setPrevHero] = useState({})
    const [languageData, setLanguageData] = useState('')
    const [mainAttr, setMainAttr] = useState('')

    const language = useSelector((state) => state.language);

    useEffect(()=> {
        const fetchHeroes = async () => {
            try {
                await axios.get('http://localhost:8000/api/v1/heroes-list/')
                    .then(res => {
                        const heroes = res.data.sort((a, b) => a.name > b.name ? 1 : -1)
                        heroes.find(hero => {
                            if (hero.name === name) {
                                let index_next_hero = heroes.indexOf(hero) + 1
                                if (index_next_hero === heroes.length) {
                                    index_next_hero = 0
                                }
                                let index_prev_hero = heroes.indexOf(hero) - 1
                                if (index_prev_hero === -1) {
                                    index_prev_hero = heroes.length - 1
                                }
                                setNextHero(heroes[index_next_hero])
                                setPrevHero(heroes[index_prev_hero])
                            }
                        })
                    })
            }
            catch (e) {
                console.log(e)
            }
        }
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
        fetchHeroes()

    }, [language])


    const {skills} = GetCurrentHeroSkills({id: hero?.id})

    const [sortedSkills, setSortedSkills] = useState([])
    const [show, setShow] = useState(false)
    const [className, setClassName] = useState('')
    useEffect(() => {
    if (show) {
      setClassName('visibleClass');
    } else {
      setClassName('');
    }
  }, [show]);

    useEffect(() => {
        for (let i = 0; i < skills.length; i++) {
            if (skills[i].is_innate) {
                const without = skills.filter(skill => !skill.is_innate)
                setSortedSkills([skills[i], ...without])
            }
        }
    }, [skills]);

    useEffect(() => {
        console.log(hero)
        console.log(languageData)
    }, [hero,languageData]);


    useEffect(() => {
        let attrsImgs = languageData.attributes_img;
        let count = 0;
        for (let i in attrsImgs) {
            if (count>=4)break
            if (count == hero.main_attribute){
                setMainAttr(attrsImgs[i])
                break
            }
            count++;
        }
    }, [languageData, hero]);

    return (
        <div>
        <div className={'current-hero'}>
            <HeroVideo hero={hero}/>

            <div className={'current-hero-info'} >
                <div className='hero-info'>
                    <HeroAttr name={true} id={mainAttr} languageData={languageData}/>
                    <HeroType hero={hero} setShow={setShow} show={show} languageData={languageData}/>
                </div>

                <div className='hero-abilities'>
                    <div className='hero-talents'>
                        <img src={talents} alt="talents" className='talents' />
                        <CurrentHeroTalents hero={hero} languageData={languageData}/>
                    </div>
                    <div className='hero-skills'>
                        <h1>{languageData && languageData.data.hero_data.hero_abilities}</h1>
                        <div className='hero-skill'>

                            {sortedSkills && languageData && sortedSkills.map((skill, index) => {
                                if (!(skill.ability_is_granted_by_scepter || skill.ability_is_granted_by_shard ||
                                    skill.scepter_description[languageData.language] ||
                                    skill.shard_description[languageData.language])){

                                return(<HeroSkills key={skill.id} skill={skill} languageData={languageData}/>)
                                }
                                return null

                            })}
                        </div>
                    </div>
                </div>
            </div>
            <div className='current-hero-about'>
                <HeroAbout hero={hero} languageData={languageData}/>
            </div>
        </div>
            {hero && languageData && <CurrentHeroAspects hero={hero} languageData={languageData}/>}

        <CurrentHeroSkillsVideo skills={skills} languageData={languageData}/>

            <div className='nextPrev'>
                {prevHero && <PrevHero hero={prevHero} languageData={languageData}/>}
                <img className='allHeroes' src={allHeroes} alt="allHeroes" onClick={() => {window.location.href = '/heroes'}}/>
                {nextHero && <NextHero hero={nextHero} languageData={languageData}/>}
        </div>
    </div>
    )
}