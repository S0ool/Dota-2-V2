import time

import requests

from app.models import LanguagesData, News


def get_src(language):
    return f'https://store.steampowered.com/events/ajaxgetpartnereventspageable/?clan_accountid=0&appid=570&offset=0&count=100&l={language}&origin=https:%2F%2Fwww.dota2.com'



def new_loader():
    start_time = time.time()
    first_data = True
    event_names = {}
    mod_revieweds = {}
    bodies = {}
    newsData = {}
    print("Start loading news")
    for language in LanguagesData.objects.all():
        current_language = language.language
        src = get_src(current_language)
        response = requests.get(src)
        print(current_language)
        if response.status_code != 200:
            print(f"error in {current_language}")
            continue
        data = response.json()
        for index,new in enumerate(data['events']):
            if first_data:
                event_names[index] = {}
                mod_revieweds[index] = {}
                bodies[index] = {}
                newsData[index] = {}
                newsData[index]["image"] = {}
                newsData[index]["event_type"] = {}
                newsData[index]["clanid"] = {}

            event_name = new['event_name']
            mod_reviewed = new['rtime_mod_reviewed']
            body = new['announcement_body']['body']
            event_names[index][current_language] = event_name
            mod_revieweds[index] = mod_reviewed
            bodies[index][current_language] = body

            import json
            json_data = new['jsondata']
            json_data = json.loads(json_data)
            json_data = json_data['localized_capsule_image'][0]
            newsData[index]["image"] = json_data
            newsData[index]["event_type"] = new['event_type'] # if 28 = news 12 = patch
            newsData[index]["clanid"] = new['announcement_body']['clanid']
        if first_data:
            first_data = False

    len_data = len(event_names)
    for i in range(len_data):
        current_event_names = event_names[i]
        current_mod_revieweds = mod_revieweds[i]
        current_bodies = bodies[i]
        current_newsData = newsData[i]
        News.objects.create(
            title=current_event_names,
            content=current_bodies,
            date=current_mod_revieweds,
            data=current_newsData
        )

    end_time = time.time()
    execution_time = end_time - start_time
    print(f"Время выполнения: {int(execution_time // 3600)}:{int((execution_time // 60) % 60)}:{int(execution_time % 60)}")