import HeroAttr from "../CurrentHero/Hero_attr.jsx";
import {useEffect, useRef, useState} from "react";

export const NextHero = ({hero,languageData}) => {
    const [mainAttrImg, setMainAttrImg] = useState('')
    const urlNextHero = `/heroes/${hero?.name}/`
    const nextVideoRef = useRef(null)
    const handleNextMouseEnter = () => {
        if (nextVideoRef.current) {
            nextVideoRef.current.play()
        }
    }
    const handleNextMouseLeave = () => {
        if (nextVideoRef.current) {
            nextVideoRef.current.pause()
        }
    }
    useEffect(() => {
        let attrsImgs = languageData.attributes_img;
        let count = 0;
        for (let i in attrsImgs) {
            if (count>=4)break
            if (count == hero.main_attribute){
                setMainAttrImg(attrsImgs[i])
                break
            }
            count++;
        }
    }, [hero, languageData]);
    return (
        <div className='next-heroes next' onClick={() => window.location.href = urlNextHero}
                       onMouseEnter={handleNextMouseEnter}
                        onMouseLeave={handleNextMouseLeave}
        >

            <div className='textHero nextText'>
                <h5 style={{color: 'gray'}}>{languageData?.data?.hero_data?.hero_next?.toUpperCase()}</h5>
                <h1>{hero?.name?.toUpperCase()}</h1>
                <span className={'hero-attr'}>
                    <div className="attrImg">
                       {mainAttrImg && <HeroAttr id={mainAttrImg} languageData={languageData}/>}
                    </div>
                    <h4>{languageData?.data?.hero_data[`hero_attack_type_${hero.attack_type}`]}</h4>
                </span>
            </div>
            {hero.video && (
                <video className='video' loop muted preload='auto'
                       ref={nextVideoRef}>
                    <source src={hero.video} type='video/webm'/>
                </video>
            )}
        </div>
    )
}