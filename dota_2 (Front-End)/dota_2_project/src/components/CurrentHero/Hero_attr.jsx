import {useEffect, useState} from "react";
import str from '../../../public/attr/hero_strength.png'
import agi from '../../../public/attr/hero_agility.png'
import int from '../../../public/attr/hero_intelligence.png'
import uni from '../../../public/attr/hero_universal.png'



export default function HeroAttr({id,languageData,name=false}){

    const [attr, setAttr] = useState('')
    const [prefix, setPrefix] = useState('')
    useEffect(() => {
        const prefixLocal = id.split('.')[0];
        setPrefix(prefixLocal);
        if (prefixLocal === 'hero_strength') {
            setAttr(str)
        }
        if (prefixLocal === 'hero_agility') {
            setAttr(agi)
        }
        if (prefixLocal === 'hero_intelligence') {
            setAttr(int)
        }
        if (prefixLocal === 'hero_universal') {
            setAttr(uni)
        }

    }, [id]);

    useEffect(() => {
        console.log(attr)
    }, [attr]);
    return (
        <div className='hero-attr'>
            {attr && (<img src={attr} alt=""/>)}
             {name && <h2>{languageData?.data?.hero_data[prefix]}</h2>}
        </div>
    )
}