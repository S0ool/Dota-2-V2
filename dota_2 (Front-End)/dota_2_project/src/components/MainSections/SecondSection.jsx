import {ViewButton} from "../../UI/ViewButton/ViewButton.jsx";

export default function SecondSection({info}) {
    return (
        <>
            <div className='main-second-section'>
                <img style={{width: '100%', position: 'absolute'}}
                     src={info.image}
                     alt=""/>
            </div>
            <div ref={info.section} className={`main-first-slide ${info.showText ? 'show' : 'hide'}`}>
                <h2>{info.first_head}</h2>
                <h2>{info.second_head}</h2>
            </div>
            <div className='mini-info'>
                <p>{info.text}</p>
                <ViewButton text={info.button_text} link={info.button_link}/>
            </div>
        </>
    )
}