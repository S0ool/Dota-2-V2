import React from "react";


export const EventNews = ({news, page, setPage, countNews}) =>{

	return(
		<>
			<div className='news'>

				{news.map((New, index) => {
					let NewContent = New.content.slice(0, New.content.indexOf('.')+1)
						.replace("[i]", "<i>").replace("[/i]", "</i>")
					if (NewContent.length > 200) {
						NewContent = NewContent.slice(0, 200) + '...'
					}
					return (
						<div className='news-card' key={index}
							 style={{backgroundImage: `url(${New.image})`}}
						>
							<div className='mini-news-card-content'>
								<p className='date'>{New.date}</p>
								<h2 className='title'>{New.title}</h2>
								<br/>
								<br/>
								<p className='text' dangerouslySetInnerHTML={{__html: NewContent}}></p>
							</div>
						</div>
					)})}
			</div>
			<div className='news-pages'>
				{page != 1 &&
					<button className='news-page-btn' onClick={() => setPage((page)=> page - 1)}>
						&lt;
					</button>
				}
				{
					Array.from({ length: Math.ceil(countNews / 15) }, (_, i) => (
						<button key={i} className='news-page-btn' onClick={() => setPage(i + 1)}>
							{i + 1}
						</button>
					))
				}
				{page < Math.ceil(countNews / 15) &&
					<button className='news-page-btn' onClick={() => setPage((page)=> page + 1)}>
						&gt;
					</button>
				}


			</div>
		</>
	)
}