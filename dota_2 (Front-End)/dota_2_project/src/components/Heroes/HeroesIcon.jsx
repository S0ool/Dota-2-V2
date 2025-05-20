import './heroes.css'
import {useEffect, useState} from "react";
import {Link} from "react-router-dom";

export const HeroesIcon = ({index, hero, attr, complexity, searchedHero }) => {
    const [animationClass, setAnimationClass] = useState('')

    useEffect(() => {
        setAnimationClass('animate-exit'); // Запускаем анимацию исчезновения
        const timer = setTimeout(() => {
            setAnimationClass('animate-enter'); // После исчезновения герои появляются снова
        }, 200); // Продолжительность анимации должна совпадать с `transition` в CSS

        return () => clearTimeout(timer); // Очищаем таймер при размонтировании
    }, [attr, complexity, searchedHero]); // Запускаем эффект при изменении `attr`

    // let main = uni
    //
    // switch (hero.main_attribute) {
    //     case 1:
    //         main = str
    //         break
    //     case 2:
    //         main = agi
    //         break
    //     case 3:
    //         main = int
    //         break
    //     case 4:
    //         main = uni
    //         break
    // }

    return (
        <Link
            style={{textDecoration: 'none', color: 'black', marginBottom: '-10px'}}
            to={`/heroes/${hero.name_url}/`}>
            <img
                key={index}
                className={`heroes-icon ${animationClass}`}
                src={hero.icon}
                alt=""/>
            {/*<div style={{display:'flex', alignItems:'center', justifyContent:'center'}}>*/}
            {/*    <img src={main} alt=""/>*/}
            {/*    <p>{hero.name}</p>*/}
            {/*</div>*/}
        </Link>
    )
}