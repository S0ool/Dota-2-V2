from app.models import LanguagesData
import json
import re
import requests
from datetime import datetime
import time

# 0:40 parse time

def fix_key_quotes(key, json_str):
    search_str = f'"{key}":"'
    start_index = json_str.find(search_str)
    if start_index == -1:
        return json_str

    value_start = start_index + len(search_str)
    end_index = json_str.find('","', value_start)
    if end_index == -1:
        return json_str
    value = json_str[value_start:end_index]
    fixed_value = re.sub(r'(?<!\\)"', r'\"', value)
    fixed_json_str = json_str[:value_start] + fixed_value + json_str[end_index:]
    return fixed_json_str


def fill_data(raw_data, current_data,english_data=None):
    data = {}
    for index in raw_data:
        try:
            data[f'{index}'] = current_data[index]
        except:
            if english_data:
                data[f'{index}'] = english_data[index]
            else:
                print(f"Error: {index} not found in current data")
    return data


def get_json_str(response):
    match = re.search(r"JSON\.parse\('(.+?)'\)}", response.text.replace("\\'", "'").replace('\\"', "'"), re.DOTALL)
    if not match:
        print(f"Error: JSON not found")
    json_str_raw = match.group(1)
    json_str = json_str_raw.replace("\\'", "'").replace('\\"', "'")
    json_str = re.sub(r'\\(?!u[0-9A-Fa-f]{4})', '', json_str)
    json_str = re.sub(r'\[.*?\]', '|', json_str)
    json_str = json_str.replace('||', '___PIPE___')
    json_str = json_str.replace('|', '')
    json_str = json_str.replace('___PIPE___', '|')
    json_str = fix_key_quotes("battlepass_gift_desc", json_str)

    return json_str


def get_language_data():
    numbers = [4242, 2986, 3106, 7610, 8076, 8206, 4565, 470, 1773, 8927, 7168,9029, 8519, 8284, 7624, 9643, 3860, 809, 3742, 6515, 2345, 4823, 117, 5243, 6274, 1748, 2181, 4333]
    # numbers = [4242,8927]
    for number in numbers:
        # print(f"🔎 Парсинг языкового файла для {number}")
        url = f'https://www.dota2.com//public/javascript/dota_react/{number}.js'
        response = requests.get(url)
        if response.status_code != 200:
            raise Exception(f"Error: Failed to fetch language file for number {number}")


        json_str = get_json_str(response)
        try:
            json_data = json.loads(json_str)
            # print("✅ JSON успешно распарсен!")
            yield (json_data,number)
        except json.JSONDecodeError as e:
            error_pos = e.pos
            range_error = 200
            start = max(error_pos - range_error, 0)
            end = min(error_pos + range_error, len(json_str))
            problem_part = json_str[start:end]
            print(f"❌ Ошибка JSON: {e}")
            print(f"🔍 Проблемный участок: {problem_part}")
            print(f"🔍 Позиция ошибки    : {' ' * (error_pos - start)}^")
            print(f"Число: {number}")
            json_str_raw = re.search(r"JSON\.parse\('(.+?)'\)}", response.text, re.DOTALL).group(1)
            with open(f"json_{datetime.now().strftime('%Y-%m-%d_%H-%M-%S')}.txt", "w", encoding="utf-8") as f:
                f.write(json_str_raw)
            with open(f"problematic_json_{datetime.now().strftime('%Y-%m-%d_%H-%M-%S')}.txt", "w",
                      encoding="utf-8") as f:
                f.write(json_str)
            return


def load_languages_resource():
    start_time = time.time()
    print("Запуск парсера языковых файлов...")
    gen = get_language_data()
    english_data,_ = next(gen)
    current_data = english_data
    current_number = 0
    first_data = True
    try:
        while True:
            if not first_data:
                current_data,current_number = next(gen)
            else:
                first_data = False
            raw_common_data = [
                "header_game",
                "header_patches",
                "header_gameplay_updates",
                "header_previous_updates",
                "header_heropedia",
                "header_news",
                "header_esports",
                "header_language",
                "header_payforfree",
            ]
            raw_home_data = [
                "quote_destructoid_quote",
                "quote_destructoid_credit",
                "play_for_free",
                "download_on_steam",
                "home_latest_news",
                "home_view_all",
                #NEWS
                "home_battle_join",
                "home_battle_body",
                "home_battle_button",
                "home_choose_header",
                "home_choose_body",
                "home_choose_button",
                "home_dpc_header",
                "home_dpc_body",
                "home_join_header",
                "home_play_free_now",
            ]
            raw_heroes_data = [
                "herogrid_choose",
                "home_choose_body",
                "herogrid_filter",
                "herogrid_attribute",
                "herogrid_complexity",
            ]
            raw_hero_data = [
                "hero_universal",
                "hero_strength",
                "hero_agility",
                "hero_intelligence",
                "hero_full_bio",
                "hero_close_bio",
                "hero_attack_type",
                "hero_attack_type_melee",
                "hero_attack_type_ranged",
                "hero_complexity",
                "hero_abilities",
                "hero_talent_tree",
                "hero_attributes",
                "hero_roles",
                "hero_carry",
                "hero_support",
                "hero_nuker",
                "hero_disabler",
                "hero_jungler",
                "hero_durable",
                "hero_escape",
                "hero_pusher",
                "hero_initiator",
                "hero_stats",
                "hero_attack",
                "hero_defense",
                "hero_mobility",
                "hero_ability_details",
                "hero_facet_details",
                "hero_affects",
                "hero_damage_type",
                "hero_spell_immunity",
                "hero_dispellable",
                "hero_movement_slow",
                "hero_bonus_damage",
                "hero_damage",
                "ability_behavior_passive",
                "ability_behavior_no_target",
                "ability_behavior_unit_target",
                "ability_behavior_point_target",
                "ability_behavior_point_aoe",
                "ability_behavior_channeled",
                "ability_behavior_toggle",
                "ability_behavior_autocast",
                "ability_behavior_aura",
                "ability_target_alliedunitsandubildings",
                "ability_target_alliedunits",
                "ability_target_alliedheroesandbuildings",
                "ability_target_alliedheroes",
                "ability_target_alliedcreeps",
                "ability_target_allies",
                "ability_target_enemyunitsandubildings",
                "ability_target_enemyunits",
                "ability_target_enemyheroesandbuildings",
                "ability_target_enemyheroes",
                "ability_target_enemycreeps",
                "ability_target_enemies",
                "ability_target_heroes",
                "ability_target_units",
                "ability_damage",
                "ability_damage_physical",
                "ability_damage_magical",
                "ability_damage_pure",
                "ability_damage_hpremoval",
                "ability_immunity_alliesyesenemiesno",
                "ability_dispellable_strong",
                "ability_upgrade_shard",
                "ability_upgrade_scepter",
                "hero_previous",
                "hero_next",
                'hero_ability',
                'no',
                'yes',
            ]

            raw_news_data = [
                "news_featured",
                "news_readmore",
                "news_news",
                "news_updates",
                "back_to_news",
                "latest_news"
            ]

            common_data = fill_data(raw_common_data,current_data,english_data)
            home_data = fill_data(raw_home_data,current_data,english_data)
            heroes_data = fill_data(raw_heroes_data,current_data,english_data)
            hero_data = fill_data(raw_hero_data,current_data,english_data)
            news_data = fill_data(raw_news_data,current_data,english_data)

            current_lan_name = current_data["language"]
            if current_lan_name == "korean":
                current_lan_name = "koreana"
            elif current_number == 4333:
                current_lan_name = "latam"
            url = f'https://www.dota2.com//public/javascript/dota_react/shared_{current_lan_name}-json.js' # позже поработать чтобы получить список названий языков на всех языках
            # print(url)

            response = requests.get(url)
            res_text = get_json_str(response)

            json_data = {}
            try:
                json_data = json.loads(res_text)
                # print("✅ JSON для названий языков успешно распарсен!")

            except json.JSONDecodeError as e:
                print("❌ Ошибка JSON")
                error_pos = e.pos
                range_error = 200
                start = max(error_pos - range_error, 0)
                end = min(error_pos + range_error, len(res_text))
                problem_part = res_text[start:end]
                print(f"❌ Ошибка JSON: {e}")
                print(f"🔍 Проблемный участок: {problem_part}")
                print(f"🔍 Позиция ошибки    : {' ' * (error_pos - start)}^")
                json_str_raw = re.search(r"JSON\.parse\('(.+?)'\)}", response.text, re.DOTALL).group(1)
                with open(f"json_{datetime.now().strftime('%Y-%m-%d_%H-%M-%S')}.txt", "w", encoding="utf-8") as f:
                    f.write(json_str_raw)
                with open(f"problematic_json_{datetime.now().strftime('%Y-%m-%d_%H-%M-%S')}.txt", "w",
                          encoding="utf-8") as f:
                    f.write(res_text)
                return
            raw_languages_data = [
                "language_selection_english",
                "language_selection_spanish",
                "language_selection_french",
                "language_selection_italian",
                "language_selection_german",
                "language_selection_greek",
                "language_selection_koreana",
                "language_selection_schinese",
                "language_selection_tchinese",
                "language_selection_russian",
                "language_selection_thai",
                "language_selection_japanese",
                "language_selection_portuguese",
                "language_selection_brazilian",
                "language_selection_polish",
                "language_selection_danish",
                "language_selection_dutch",
                "language_selection_finnish",
                "language_selection_norwegian",
                "language_selection_swedish",
                "language_selection_czech",
                "language_selection_hungarian",
                "language_selection_romanian",
                "language_selection_bulgarian",
                "language_selection_turkish",
                "language_selection_ukrainian",
                "language_selection_vietnamese",
                "language_selection_latam",
                "Bbcode_Expand_Details_Collapsed",
                "Bbcode_Expand_Details_Expanded",
            ]
            languages_data = fill_data(raw_languages_data,json_data)

            data = {
                "common_data": common_data,
                "home_data": home_data,
                "heroes_data": heroes_data,
                "hero_data": hero_data,
                "languages_data": languages_data,
                "news_data": news_data,
            }


            LanguagesData.objects.create(
                language=current_lan_name,
                data=data
            )

    except Exception as e:
        if e.args:
            print(f"❌ Ошибка: {e} ")
            print(current_data["language"])
        print('end')
        end_time = time.time()
        execution_time = end_time - start_time
        print(f"Время выполнения: {execution_time // 3600}:{(execution_time // 60) % 60}:{execution_time % 60}")



