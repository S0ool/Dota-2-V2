import HeroAttr from "../CurrentHero/Hero_attr.jsx";
import {useEffect, useRef, useState} from "react";

export const PrevHero = ({hero, languageData}) => {
    const [mainAttrImg, setMainAttrImg] = useState('')
    const urlPrevHero = `/heroes/${hero?.name}/`
        const prevVideoRef = useRef(null);
    const handlePrevMouseEnter = () => {
        if (prevVideoRef.current) {
            prevVideoRef.current.play()
        }
    }

    const handlePrevMouseLeave = () => {
        if (prevVideoRef.current) {
            prevVideoRef.current.pause()
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
        <div className='next-heroes prev' onClick={() => window.location.href = urlPrevHero}
             onMouseEnter={handlePrevMouseEnter}
             onMouseLeave={handlePrevMouseLeave}>
            {hero.video && (
                <video className='video' loop muted preload='auto'
                       ref={prevVideoRef}>
                    <source src={hero.video} type='video/webm'/>
                </video>
            )}
            <div className='textHero prevText'>
                <h5 style={{color: 'gray'}}>{languageData?.data?.hero_data?.hero_previous?.toUpperCase()}</h5>
                <h1>{hero?.name?.toUpperCase()}</h1>
                <span className={'hero-attr'}>
                    <div className="attrImg">
                        {mainAttrImg && <HeroAttr id={mainAttrImg} languageData={languageData}/>}

                    </div>
                    <h4>{languageData?.data?.hero_data[`hero_attack_type_${hero.attack_type}`]}</h4>
                </span>
            </div>

        </div>
    )
}