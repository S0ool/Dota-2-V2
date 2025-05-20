import {Link} from "react-router-dom";
import MiniNewsCard from "../NewsCard/mini_news_cards.jsx";
import React, {useEffect, useState} from "react";
import styles from './styles.module.css';

export default function NewsSection({languageData}) {
    const [mainData, setMainData] = useState()
    useEffect(() => {
        setMainData(languageData?.data?.home_data)
    }, [languageData]);
    return (
        <>
            <div className='main-news-button'>
                <p>{mainData?.home_latest_news}</p>
                <p className='view-all'><Link to='/news'>{mainData?.home_view_all}<div className={styles.arrow + " " + "header-arrow"}></div>
                </Link></p>
            </div>
            <div className='main-news'>
                <MiniNewsCard/>
            </div>
        </>
    )
}