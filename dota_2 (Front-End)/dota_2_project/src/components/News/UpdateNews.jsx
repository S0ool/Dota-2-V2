import React from "react";


export const UpdateNews = ({patches}) =>{
	return(
		<>
			<div className='news patches'>

				{patches.map((patch, index) => {
					console.log(patch)
					let content = patch.content
					if (content.includes("[url=")){
						content = content.replaceAll("[url=", "<a class='a' href=")
							.replaceAll("[/url]", "</a>")
						content = content.replaceAll(/(<a\s+[^>]+)\](.*?<\/a>)/gi, '$1>$2');

					}
					if (content.includes("[list]")){
						content = content.replaceAll("[list]", "<ul class='ul'>").replaceAll("[*]", "</li><li class='li'>").replaceAll("[/list]", "</li></ul>")
					}

					content = content.replaceAll("[","<").replaceAll("]",">")
					content = content.replaceAll("\n","<br>")
					return(
					<div key={index} className='patch'>
						<p className='update-date'>{patch.date}</p>
						<h2 className='update-title'>{patch.title}</h2>
						<p className='update-content' dangerouslySetInnerHTML={{__html: content}}/>

					</div>
					)
				})}


			</div>
		</>
	)
}