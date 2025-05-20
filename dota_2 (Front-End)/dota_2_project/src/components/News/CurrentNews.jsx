import {useEffect, useState} from "react";
import axios from "axios";
import '../components.css'
import {useSelector} from "react-redux";


export default function CurrentNews(){
	const [miniNews, setMiniNews] = useState([])
	const [rawMiniNews, setRawMiniNews] = useState([])




	const language = useSelector((state) => state.language);
	const [currentLanguage, setCurrentLanguage] = useState(language)

	useEffect(() => {
		const getLanguage = async () => {
			try {
				const res = await axios.get(`http://localhost:8000/api/v1/languages/${language}/`);
				setCurrentLanguage(res.data.language)
			}
			catch (e) {
				console.log(e)
			}
		}
		getLanguage()
	}, [language])

	useEffect(()=> {
		axios.get('http://localhost:8000/api/v1/news/')
			.then(res => {
				let data = res.data.results.slice(0, 3)
				setRawMiniNews(data)
			})
	}, [])
	useEffect(()=> {
		if (rawMiniNews.length > 0) {
			const newsToSet = [];
			for (let i = 0; i < rawMiniNews.length; i++) {


				let imgUrl = "https://clan.cloudflare.steamstatic.com/images/"
				let startIndex, endIndex, startIndexContent;
				let startName = "[img]{STEAM_CLAN_IMAGE}/"
				let endName = "[/img]"

				let startNameContent = "\n\n"


				startIndex = rawMiniNews[i].content[currentLanguage].indexOf(startName)
				endIndex = rawMiniNews[i].content[currentLanguage].indexOf(endName)
				startIndexContent = rawMiniNews[i].content[currentLanguage].indexOf(startNameContent)
				if (startIndex !== -1 && endIndex !== -1 && startIndex < endIndex && startIndexContent !== -1) {
					let title = rawMiniNews[i].title[currentLanguage]

					const rawDate = new Date(rawMiniNews[i].date * 1000);
					const options = {
						day: 'numeric',
						month: 'short',
						year: 'numeric',
					};
					let date = new Intl.DateTimeFormat(currentLanguage.slice(0, 2), options).format(rawDate)

					let rawImgUrl = rawMiniNews[i].content[currentLanguage].slice(startIndex + startName.length, endIndex)
					imgUrl += rawImgUrl;
					let image = imgUrl

					let content = rawMiniNews[i].content[currentLanguage].slice(startIndexContent + startNameContent.length)
					newsToSet.push({
						title: title,
						date: date,
						image: image,
						content: content
					})

				}
			}
			setMiniNews(newsToSet)
		}

	}, [currentLanguage, rawMiniNews])
	return (
		<>
			<div className='mini-news'>
				{miniNews.map((miniNew, index) => {
					let miniNewContent = miniNew.content.slice(0, miniNew.content.indexOf('.')+1)
						.replace("[i]", "<i>").replace("[/i]", "</i>")
					if (miniNewContent.length > 200) {
						miniNewContent = miniNewContent.slice(0, 200) + '...'
					}
					return (
						<div className='mini-news-card' key={index}
							 style={{backgroundImage: `url(${miniNew.image})`}}
						>
							<div className='mini-news-card-content'>
								<p className='date'>{miniNew.date}</p>
								<h2 className='title'>{miniNew.title}</h2>
								<br/>
								<br/>
								<p className='text' dangerouslySetInnerHTML={{__html: miniNewContent}}></p>
							</div>
						</div>
					)})}
			</div>
		</>
	)
}