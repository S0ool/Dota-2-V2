import React, {useEffect, useState} from "react";
import axios from "axios";
import '../components.css'
import {useSelector} from "react-redux";
import {Link} from "react-router-dom";
import {EventNews} from "./EventNews.jsx";
import {UpdateNews} from "./UpdateNews.jsx";


export default function NewsComponent(){
	const [allPatches, setAllPatches] = useState([])

	const [allNews, setAllNews] = useState([])
	const [news, setNews] = useState([])
	const [rawNews, setRawNews] = useState([])
	const [countNews, setCountNews] = useState(0)
	const [page, setPage] = useState(1)
	const [readMore, setReadMore] = useState("")
	const [isEvent, setIsEvent] = useState(true)

	const language = useSelector((state) => state.language);
	const [currentLanguage, setCurrentLanguage] = useState(language)

	useEffect(() => {
		const getLanguage = async () => {
			try {
				const res = await axios.get(`http://localhost:8000/api/v1/languages/${language}/`);
				setCurrentLanguage(res.data.language)
				setReadMore(res.data.data.news_data.news_readmore)
			}
			catch (e) {
				console.log(e)
			}
		}
		getLanguage()
	}, [language])

	useEffect(()=> {
		axios.get(`http://localhost:8000/api/v1/news/?page=all`)
			.then(res => {
				let data = res.data
				setRawNews(data)
			})
	}, [])
	useEffect(()=> {
		if (rawNews.length > 0) {
			const newsToSet = [];
			const patchesToSet = [];
			for (let i = 0; i < rawNews.length; i++) {
				if (rawNews[i].content[currentLanguage] == null || rawNews[i].content[currentLanguage] == "") {
					continue
				}

				let imgUrl = "https://clan.cloudflare.steamstatic.com/images/"
				let startIndex, endIndex;
				let startName = "[img]"
				let endName = "[/img]"

				startIndex = rawNews[i].content[currentLanguage].indexOf(startName)
				endIndex = rawNews[i].content[currentLanguage].indexOf(endName)
				if (startIndex != -1 && endIndex != -1) {
					let rawImgUrl = rawNews[i].content[currentLanguage].slice(startIndex + startName.length, endIndex)
					imgUrl += rawImgUrl;
					imgUrl = imgUrl.replace("{STEAM_CLAN_IMAGE}/", "").replace("{STEAM_CLAN_LOC_IMAGE}/", "")
				}
				else{
					let clan_id = rawNews[i]['data']['clanid']
					let rawImgUrl =  rawNews[i]['data']['image']
					imgUrl += clan_id + "/" + rawImgUrl
				}

				let title = rawNews[i].title[currentLanguage]

				const rawDate = new Date(rawNews[i].date * 1000);
				const options = {
					day: 'numeric',
					month: 'short',
					year: 'numeric',
				};
				let date = new Intl.DateTimeFormat(currentLanguage.slice(0, 2), options).format(rawDate)


				let content = rawNews[i].content[currentLanguage].slice(endIndex + 1)
				if (rawNews[i].data['event_type'] == 12){
					patchesToSet.push({
						title: title,
						date: date,
						image: imgUrl,
						content: content
					})
				}
				newsToSet.push({
					title: title,
					date: date,
					image: imgUrl,
					content: content
				})

			}
			setAllPatches(patchesToSet)
			setAllNews(newsToSet)
			setCountNews(newsToSet.length)
		}

	}, [currentLanguage, rawNews])
	useEffect(() => {
		let currentNews = []

		for (let i = 0; i < allNews.length; i++) {
			if (i >= (page - 1) * 15 && i < page * 15) {
				currentNews.push(allNews[i])
			}
		}
		setNews(currentNews)
		console.log(allNews[0])
	}, [allNews,page]);



	return (
		<div className="news-container">
			<header className='news-header'>
				<h3 className='header-date'>{allNews[0]?.date}</h3>
				<h1 className='header-title'>{allNews[0]?.title}</h1>
				<p className="header-text"><Link className='header-readmore' to='/news'>{readMore}<div className={"header-arrow"}></div></Link></p>
			</header>

			<div className='news-choise'>
				<button className={isEvent? 'news-choise-btn active news-choise-event' : 'news-choise-btn news-choise-event'} onClick={() => setIsEvent(true)}>
					News
				</button>
				<button className={!isEvent? 'news-choise-btn active news-choise-update' : 'news-choise-btn news-choise-update'} onClick={() => setIsEvent(false)}>
					Updates
				</button>
			</div>
			{
				isEvent?
					<EventNews news={news} page={page} setPage={setPage} countNews={countNews}/>
		        :
					<UpdateNews patches={allPatches} />
			}
		</div>
	)
}