import re, requests, time
from app.models import Hero, HeroRoles, Aspects, Skills, LanguagesData

# 41:29 parse time

def is_in_bd(name):
    for hero in Hero.objects.all():
        if hero.name_url == name:
            return True
    return False

def get_max_id(heroes):
    max_id = 0
    for hero in heroes:
        if hero.get('id') > max_id:
            max_id = hero.get('id')
    return max_id

def find_cycles(obj, seen=None):
    if seen is None:
        seen = set()
    obj_id = id(obj)
    if obj_id in seen:
        print(f"{obj=}")
        print(f"{obj_id=}")
        print(f"{seen=}")
        raise ValueError("Циклическая ссылка найдена!")
    seen.add(obj_id)
    if isinstance(obj, dict):
        for k, v in obj.items():
            find_cycles(v, seen)
    elif isinstance(obj, list):
        for i in obj:
            find_cycles(i, seen)

# Проверка


ROLES = [
    'hero_carry',
    'hero_support',
    'hero_nuker',
    'hero_disabler',
    'hero_jungler',
    'hero_durable',
    'hero_escape',
    'hero_pusher',
    'hero_initiator'
]


COLORS = {
    "red0": 'linear-gradient(to right, #9F3C3C, #4A2040)',
    "red1": 'linear-gradient(to right, #954533, #452732)',
    "red2": 'linear-gradient(to right, #A3735E, #4F2A25)',
    "yellow0": 'linear-gradient(to right, #C8A45C, #6F3D21)',
    "yellow1": 'linear-gradient(to right, #C6A158, #604928)',
    "yellow2": 'linear-gradient(to right, #CAC194, #433828)',
    "yellow3": 'linear-gradient(to right, #C3A99A, #4D352B)',
    "green0": 'linear-gradient(to right, #A2B23E, #2D5A18)',
    "green1": 'linear-gradient(to right, #7EC2B2, #29493A)',
    "green2": 'linear-gradient(to right, #538564, #1C3D3F)',
    "green3": 'linear-gradient(to right, #9A9F6A, #223824)',
    "green4": 'linear-gradient(to right, #9FAD8E, #3F4129)',
    "blue0": 'linear-gradient(to right, #727CB2, #342D5B)',
    "blue1": 'linear-gradient(to right, #547EA6, #2A385E)',
    "blue2": 'linear-gradient(to right, #6BAEBC, #135459)',
    "blue3": 'linear-gradient(to right, #94B5BA, #385B59)',
    "purple0": 'linear-gradient(to right, #B57789, #412755)',
    "purple1": 'linear-gradient(to right, #9C70A4, #282752)',
    "purple2": 'linear-gradient(to right, #675CAE, #261C44)',
    "gray0":'linear-gradient(to right, #565C61, #1B1B21)',
    "gray1": 'linear-gradient(to right, #6A6D73, #29272C)',
    "gray2": 'linear-gradient(to right, #95A9B1, #3E464F)',
    "gray3": 'linear-gradient(to right, #ADB6BE, #4E5557)',
}
def get_linear_gradient(color,gradient):
    current_color = ''
    if color == 0:
        current_color = "red"
    elif color == 1:
        current_color = "yellow"
    elif color == 2:
        current_color = "green"
    elif color == 3:
        current_color = "blue"
    elif color == 4:
        current_color = "purple"
    elif color == 5:
        current_color = "gray"
    current_color += str(gradient)
    return COLORS[current_color]

def get_damage_type(damage_type):
    if damage_type == 8:
        return 'ability_damage_hpremoval'
    elif damage_type == 4:
        return 'ability_damage_pure'
    elif damage_type == 2:
        return 'ability_damage_magical'
    elif damage_type == 1:
        return 'ability_damage_physical'
    else:
        return None

def get_target(behavior):
    if behavior & 65536:
        return "ability_behavior_aura"
    elif behavior & 4:
        return "ability_behavior_no_target"
    elif behavior & 8:
        return "ability_behavior_unit_target"
    elif behavior & 16:
        return "ability_behavior_point_target"
    elif behavior & 32:
        return "ability_behavior_point_aoe"
    elif behavior & 128:
        return "ability_behavior_channeled"
    elif behavior & 512:
        return "ability_behavior_toggle"
    elif behavior & 4096:
        return "ability_behavior_autocast"
    elif behavior & 2:
        return "ability_behavior_passive"
    else:
        return None

def get_affects(target_type, target_team):
    if target_team == 1:
        if (target_type & 7) == 7:
            return "ability_target_alliedunitsandubildings"
        elif (target_type & 3) == 3:
            return "ability_target_alliedunits"
        elif (target_type & 5) == 5:
            return "ability_target_alliedheroesandbuildings"
        elif (target_type & 1) == 1:
            return "ability_target_alliedheroes"
        elif (target_type & 2) == 2:
            return "ability_target_alliedcreeps"
        else:
            return "ability_target_allies"
    elif target_team == 2:
        if (target_type & 7) == 7:
            return "ability_target_enemyunitsandubildings"
        elif (target_type & 3) == 3:
            return "ability_target_enemyunits"
        elif (target_type & 5) == 5:
            return "ability_target_enemyheroesandbuildings"
        elif (target_type & 1) == 1:
            return "ability_target_enemyheroes"
        elif (target_type & 2) == 2:
            return "ability_target_enemycreeps"
        else:
            return "ability_target_enemies"
    elif target_team == 3:
        if (target_type & 1) == 1:
            return "ability_target_heroes"
        else:
            return "ability_target_units"
    else:
        return None

def get_dispellable(dispellable):
    if dispellable == 3 or dispellable == 1:
        return 'no'
    elif dispellable == 4 or dispellable == 2:
        return 'yes'
    elif dispellable == 0:
        return None
    elif dispellable == 1:
        return 'ability_dispellable_strong'

def get_spell_immunity(spell_immunity):
    if spell_immunity == 3 or spell_immunity == 1:
        return 'yes'
    elif spell_immunity == 2 or spell_immunity == 4:
        return 'no'
    elif spell_immunity == 0:
        return None
    elif spell_immunity == 5:
        return 'ability_immunity_alliesyesenemiesno'


def process_special_values(description, ability_, is_shard_=None, ):
    values = []

    for special_value in ability_.get('special_values', []):
        shard_scepter = f'{"values_shard" if is_shard_ == 'True' else "values_scepter"}'
        heading_loc = special_value['heading_loc']
        if is_shard_ is None or is_shard_ == "notes":
            values.append({
                'value': str(special_value['values_float'][0]) if special_value.get('values_float') else '0',
                'name': special_value['name']
            })
        elif is_shard_ == 'facet':
            value = special_value['facet_bonus']['values']
            if value:
                values.append({
                    'value': str(value[0]),
                    'name': heading_loc if heading_loc else special_value['name']
                })
        elif special_value.get(shard_scepter):
            values.append({
                'value': str(special_value[shard_scepter][0]),
                'name': heading_loc if heading_loc else special_value['name']
            })

    for param in values:
        pattern = r'%{}%'.format(re.escape(param['name']))
        # if is_shard_ != 'notes':
        #     description = re.sub(pattern, param['value'], description)
        # else:
        description = re.sub(pattern, r"<span style='color: #eee'>"+param['value']+"</span>", description)
        percentage_pattern = r'%{}%'.format(re.escape(param['name']))
        description = re.sub(percentage_pattern, param['value'], description)

        bonus_pattern = r'%bonus_{}%'.format(re.escape(param['name']))
        description = re.sub(bonus_pattern, param['value'], description)
    description = re.sub(r'%%', '%', description)
    return description


def get_facet_bonuses(ability,facet_data):
    facet_bonuses = {}
    for special_value in ability.get('special_values', []):
        facet_bonus_values = []
        if special_value.get('facet_bonus').get('name') == facet_data.get('name'):
            for facet_bonus_value in special_value.get('facet_bonus').get('values'):
                facet_bonus_values.append(str(facet_bonus_value))
            facet_bonuses[special_value.get('heading_loc')] = facet_bonus_values
    return facet_bonuses

def draw_facet(ability, facet_data,facets,language,count_languages,facets_full_description=None):
    if count_languages == 0:
        if facets_full_description:
            facets.append({
                'title': {language:facet_data.get('title_loc')},
                'description': {language:facet_data.get('description_loc')},
                'icon': f"https://cdn.akamai.steamstatic.com/apps/dota2/images/dota_react/icons/facets/"
                        f"{facet_data.get('icon')}.png",
                'ability_description': {language:None},
                'ability_name': None,
                'ability_icon': None,
                'full_description': {language:facets_full_description},
                'facet_bonuses': {language:""},
                'color': get_linear_gradient(facet_data.get('color'), facet_data.get('gradient_id')),
                'full_name': facet_data.get('name'),
            })
            return
        if not ability or ability.get('ability_is_innate'):
            facets.append({
                'title': {language: facet_data.get('title_loc')},
                'description': {language: facet_data.get('description_loc')},
                'icon': f"https://cdn.akamai.steamstatic.com/apps/dota2/images/dota_react/icons/facets/"
                        f"{facet_data.get('icon')}.png",
                'ability_description': {language: None},
                'ability_name': None,
                'ability_icon': None,
                'full_description': {language: None},
                'facet_bonuses': {language: ""},
                'color': get_linear_gradient(facet_data.get('color'), facet_data.get('gradient_id')),
                'full_name': facet_data.get('name'),
            })
            return
        if ability.get('ability_is_granted_by_scepter') or ability.get('ability_is_granted_by_shard'):
            return

        ability_desc = ability.get('facets_loc')
        ability_desc = ability_desc[0] if ability_desc[0] else ability_desc[1]
        ability_desc = process_special_values(ability_desc, ability, 'facet')
        ability_name = ability['name_loc']
        ability_icon = "https://cdn.akamai.steamstatic.com/apps/dota2/images/dota_react"
        if ability.get('ability_is_innate'):
            ability_icon = f"{ability_icon}/icons/innate_icon.png"
        else:
            ability_icon = f"{ability_icon}/abilities/{ability.get('name')}.png"
        facet_bonuses = get_facet_bonuses(ability,facet_data)

        facets.append({
            'title': {language:facet_data.get('title_loc')},
            'description': {language:facet_data.get('description_loc')},
            'icon': f"https://cdn.akamai.steamstatic.com/apps/dota2/images/dota_react/icons/facets/"
                    f"{facet_data.get('icon')}.png",
            'ability_description': {language:ability_desc},
            'ability_name': ability_name,
            'ability_icon': ability_icon,
            'full_description': {language:None},
            'facet_bonuses': {language:facet_bonuses},
            "color": get_linear_gradient(facet_data.get('color'), facet_data.get('gradient_id')),
            'full_name': facet_data.get('name'),
        })
    else:

        if facets_full_description:
            facet = None
            for f in facets:
                if f.get('full_name') == facet_data.get('name'):
                    facet = f
            if not facet:
                raise ValueError(f"Facet {facet_data.get('name')} not found in facets list")
            facet['full_description'][language] = facets_full_description
            facet['description'][language] = None
            facet['ability_description'][language] = None
            facet['facet_bonuses'][language] = ""
            facet['title'][language] = facet_data.get('title_loc')
            return
        if not ability:
            facet = None
            for f in facets:
                if f.get('full_name') == facet_data.get('name'):
                    facet = f
            facet['title'][language] =  facet_data.get('title_loc')
            facet['description'][language] = facet_data.get('description_loc')
            facet['ability_description'][language] = None
            facet['full_description'][language] = None
            facet['facet_bonuses'][language] = ""
            return
        ability_desc = ability.get('facets_loc')
        ability_desc = ability_desc[0] if ability_desc[0] else ability_desc[1]
        ability_desc = process_special_values(ability_desc, ability, 'facet')


        facet = None
        for f in facets:
            if f.get('full_name') == facet_data.get('name'):
                facet = f
                break
        facet['title'][language] = facet_data.get('title_loc')
        facet['description'][language] = facet_data.get('description_loc')
        facet['ability_description'][language] = ability_desc
        facet['full_description'][language] = None
        facet_bonuses = get_facet_bonuses(ability, facet_data)
        facet['facet_bonuses'][language] = facet_bonuses


def process_value(request_values, item_value=None):
    if item_value is None:
        item_value = {}
    response_values = ''
    for index_value, value in enumerate(request_values):
        if index_value > 0:
            response_values += '/'
        if item_value.get('is_percentage', False):
            if '%' not in str(value):
                response_values += f'{value}%'
            else:
                response_values += str(value)
        else:
            response_values += str(value)
    return response_values


def process_ability(ability_,hero,first_ability_data,language,abilities, is_scepter=False, is_shard=False, is_facet=False):
    if not first_ability_data:
        ability_data = {
            'is_innate': ability_.get('ability_is_innate'),
            'name': {language:ability_.get('name_loc')},
            'description': {language:process_special_values(ability_.get('desc_loc'), ability_)},
            'tip': {language:ability_.get('lore_loc')},
            'cast_ranges': ability_.get('cast_ranges'),
            'durations': ability_.get('durations'),
            'cooldowns': ability_.get('cooldowns'),
            'mana_cost': ability_.get('mana_costs'),
            'damages': ability_.get('damages'),
            'target_team': ability_.get('target_team'),
            'target_type': ability_.get('target_type'),
            'immunity': ability_.get('immunity'),
            'dispellable': ability_.get('dispellable'),
            'damage_type': ability_.get('damage'),
            'behavior': ability_.get('behavior'),
            'scepter_description': {language: ''},
            'shard_description': {language: ''},
            'aghs_icon': '',
            'is_facet': is_facet,
            'full_name': ability_.get('name')
        }
        hero_name_loc = hero.get('name')
        hero_name = hero_name_loc.replace('npc_dota_hero_', '')
        if is_scepter :
            video_skill_tag = f'{hero_name}_aghanims_scepter'
        elif is_shard :
            video_skill_tag = f'{hero_name}_aghanims_shard'
        else:
            video_skill_tag = ability_.get('name')
        ability_data[
            'video'] = (f'https://cdn.akamai.steamstatic.com/apps/dota2/videos/dota_react/abilities/'
                        f'{hero_name}/{video_skill_tag}.mp4')
        if is_scepter:
            scepter_loc = ability_.get('scepter_loc')
            ability_data['scepter_description'][language] = process_special_values(scepter_loc, ability_, 'False')
        if is_shard:
            shard_loc = ability_.get('shard_loc')
            ability_data['shard_description'][language] = process_special_values(shard_loc, ability_, 'True')
        ability_data['ability_is_granted_by_shard'] = ability_.get('ability_is_granted_by_shard')
        ability_data['ability_is_granted_by_scepter'] = ability_.get('ability_is_granted_by_scepter')
        ability_data['ability_has_scepter'] = ability_.get('ability_has_scepter')
        ability_data['ability_has_shard'] = ability_.get('ability_has_shard')
        # Обработка специальных значений
        special_values = []
        for special_value_ in ability_.get('special_values'):
            if special_value_.get('heading_loc'):
                special_values.append({
                    'heading_loc': {language:special_value_.get('heading_loc')},
                    'values_float': special_value_.get('values_float'),
                    'is_percentage': special_value_.get('is_percentage')
                })
        ability_data['special_values'] = special_values
        # print("process_ability 1")
        # print(special_values)
        ability_icon_base_url = "https://cdn.akamai.steamstatic.com/apps/dota2/images/dota_react"
        if ability_.get('ability_is_innate'):
            ability_icon = f"{ability_icon_base_url}/icons/innate_icon.png"
        else:
            ability_icon = f"{ability_icon_base_url}/abilities/{ability_.get('name')}.png"
        aghs_icon = ''
        if ability_data.get('scepter_description') or ability_data.get('ability_is_granted_by_scepter'):
            aghs_icon = f"{ability_icon_base_url}/heroes/stats/aghs_scepter.png"
        elif ability_data.get('shard_description') or ability_data.get('ability_is_granted_by_shard'):
            aghs_icon = f"{ability_icon_base_url}/heroes/stats/aghs_shard.png"
        ability_data['icon'] = ability_icon
        ability_data['aghs_icon'] = aghs_icon
        abilities.append(ability_data)
        return
    else:
        ability_data = first_ability_data
        ability_data['name'][language] = ability_.get('name_loc')
        ability_data['description'][language] = process_special_values(ability_.get('desc_loc'), ability_)
        ability_data['tip'][language] = ability_.get('lore_loc')
        if is_scepter:
            scepter_loc = ability_.get('scepter_loc')
            ability_data['scepter_description'][language] = process_special_values(scepter_loc, ability_, 'False')
        else:
            ability_data['scepter_description'][language] = ''
        if is_shard:
            shard_loc = ability_.get('shard_loc')
            ability_data['shard_description'][language] = process_special_values(shard_loc, ability_, 'True')
        else:
            ability_data['shard_description'][language] = ''

        index = 0
        for special_value_ in ability_['special_values']:
            if special_value_.get('heading_loc'):
                ability_data['special_values'][index]['heading_loc'][language] = special_value_.get('heading_loc')
                index += 1

def process_ability_status(ability_,abilities,first_ability_data,language,hero, is_facet=False):
    if is_facet:
        process_ability(ability_, is_facet=True,hero=hero,first_ability_data=first_ability_data,language=language,abilities=abilities)
        return
    if (ability_.get('ability_has_scepter') and ability_.get('scepter_loc')) or ability_.get('ability_is_granted_by_scepter'):
        process_ability(ability_,is_scepter=True,hero=hero,first_ability_data=first_ability_data,language=language,abilities=abilities)
        if ability_.get('ability_has_scepter') and not ability_.get('ability_is_granted_by_scepter'):
            process_ability(ability_,hero=hero,first_ability_data=first_ability_data,language=language,abilities=abilities)
    elif (ability_.get('shard_loc') and ability_.get('ability_has_shard')) or ability_.get('ability_is_granted_by_shard'):
        process_ability(ability_, is_shard=True, hero=hero,first_ability_data=first_ability_data,language=language,abilities=abilities)
        if ability_.get('ability_has_shard') and not ability_.get('ability_is_granted_by_shard'):
            process_ability(ability_,hero=hero,first_ability_data=first_ability_data,language=language,abilities=abilities)
    else:
        process_ability(ability_,hero=hero,first_ability_data=first_ability_data,language=language,abilities=abilities)



def change_talent_name_loc(talent, language):
    pattern = r"\{s:(.*?)\}"

    value = str(talent["values_float"][0]) if talent["values_float"] else ""

    # Обновляем name_loc для указанного языка
    talent['name_loc'][language] = re.sub(pattern, value, talent['name_loc'][language])



def get_hero_info():
    start_time = time.time()  # 51:33 my time
    languages_data = LanguagesData.objects.all()
    heroes = requests.get(f'https://www.dota2.com/datafeed/herolist?language=english').json().get('result').get('data').get(
            'heroes')
    len_heroes = len(heroes)
    last_hero_id = get_max_id(heroes)

    hero_id = 0 # default 0
    heroes_count = 0
    while heroes_count != len_heroes:
        is_hero = False
        hero_data = None
        abilities = []
        facets = []
        talents = []
        count_languages = 0
        hero_id += 1
        name_hero = ''
        if hero_id == 127:
            continue
        if hero_id > last_hero_id:
            print("End")
            break
        print(hero_id)
        for language_data in languages_data:
            language = language_data.language
            response = requests.get(f'https://www.dota2.com/datafeed/herodata?language={language}&hero_id={hero_id}')
            data = response.json().get('result').get('data').get('heroes')

            if not data:
                print("Skip. No data")
                break
            is_hero = True
            hero = data[0]
            if is_in_bd(hero.get('name')):
                print(hero.get('name') + " in bd")
                break
            if count_languages == 0:
                name_hero_loc = hero.get('name_loc')
                for char in name_hero_loc:
                    if char == ' ':
                        continue
                    else:
                        name_hero += char.lower()
            if count_languages == 0:
                hero_data = {
                    'advice': {},
                    "name_loc": {},
                    'agi_base': hero.get('agi_base'),
                    'agi_gain': hero.get('agi_gain'),
                    'armor': hero.get('armor'),
                    'attack_range': hero.get('attack_range'),
                    'attack_rate': hero.get('attack_rate'),
                    'damage_max': hero.get('damage_max'),
                    'damage_min': hero.get('damage_min'),
                    'difficulty': hero.get('complexity'),
                    'history': {},
                    'health_regen': round(hero.get('health_regen'),1),
                    'description': {},
                    'int_base': hero.get('int_base'),
                    'int_gain': hero.get('int_gain'),
                    'magic_resistance': hero.get('magic_resistance'),
                    'mana_regen': round(hero.get('mana_regen'),1),
                    'max_health': hero.get('max_health'),
                    'max_mana': hero.get('max_mana'),
                    'movement_speed': hero.get('movement_speed'),
                    'name': hero.get('name'),
                    'primary_attr': hero.get('primary_attr'),
                    'projectile_speed': hero.get('projectile_speed'),
                    'str_base': hero.get('str_base'),
                    'str_gain': hero.get('str_gain'),
                    'turn_rate': hero.get('turn_rate'),
                    "role_levels": hero.get('role_levels'),
                    'attack_type': hero.get('attack_capability'),  # 1,2
                    'sight_range_day': hero.get('sight_range_day'),
                    'sight_range_night': hero.get('sight_range_night'),
                }
                hero_data['description'][language] = hero.get('hype_loc')
                hero_data['history'][language] = hero.get('bio_loc')
                hero_data['advice'][language] = hero.get('npe_desc_loc')
                hero_data['name_loc'][language] = hero.get('name_loc')

                for facet_ability in hero.get('facet_abilities'):
                    for ability in facet_ability.get('abilities'):
                        if ability:
                            process_ability_status(ability,language=language, is_facet=True, abilities=abilities, hero=hero,
                                                   first_ability_data=None)
                for ability in hero.get('abilities'):
                    process_ability_status(ability,language=language, abilities=abilities, hero=hero,first_ability_data=None)
                for i in hero.get('talents'):
                    talent = {
                        'name_loc': {language:i.get('name_loc')},
                        'name':i.get('name'),
                        'values_float':None
                    }
                    find_values_float = False
                    for u in i.get('special_values'):
                        get_values_float = u.get('values_float')
                        if get_values_float != 0:
                            talent['values_float'] = get_values_float
                            find_values_float = True
                            break
                    find_abilities_values_float = False
                    if not find_values_float:
                        for u in hero.get('abilities'):
                            if find_abilities_values_float:
                                break
                            for y in u.get('special_values'):
                                if find_abilities_values_float:
                                    break
                                for o in y.get('bonuses'):
                                    if find_abilities_values_float:
                                        break
                                    elif o.get('name') == talent.get('name'):
                                        talent['values_float'] = y.get('value')
                                        find_abilities_values_float = True
                    change_talent_name_loc(talent,language)
                    talents.append(talent)
                hero_name = hero.get('name')
                name_hero_icon = hero_name[len("npc_dota_hero_"):]
                hero_data[
                    'hero_video_src'] = f"https://cdn.akamai.steamstatic.com/apps/dota2/videos/dota_react/heroes/renders/{name_hero_icon}.webm?undefined"
                hero_data[
                    'hero_image_src'] = f"https://cdn.akamai.steamstatic.com/apps/dota2/videos/dota_react/heroes/renders/{name_hero_icon}.png"
                hero_data[
                    'hero_icon_src'] = f'https://cdn.akamai.steamstatic.com/apps/dota2/images/dota_react/heroes/{name_hero_icon}.png'
            else:
                hero_data['advice'][language] = hero.get('npe_desc_loc')
                hero_data['history'][language] = hero.get('bio_loc')
                hero_data['description'][language] = hero.get('hype_loc')
                hero_data['name_loc'][language] = hero.get('name_loc')

                count_facet_abilities = 0
                for facet_ability in hero.get('facet_abilities'):
                    for ability in facet_ability.get('abilities'):
                        if ability:
                            process_ability_status(ability,language=language, is_facet=True, abilities=abilities, hero=hero,
                                                    first_ability_data=abilities[count_facet_abilities])
                            count_facet_abilities += 1
                index = 0
                for ability in hero.get('abilities'):
                    process_ability_status(ability,language=language, abilities=abilities, hero=hero,
                                           first_ability_data=abilities[index+count_facet_abilities])
                    if len(abilities) != index+count_facet_abilities + 1:
                        if abilities[index+count_facet_abilities + 1].get('full_name') == ability.get('name'):
                            process_ability_status(ability, language=language, abilities=abilities, hero=hero,
                                                   first_ability_data=abilities[index + count_facet_abilities+1])
                            index += 1
                    index += 1
                for index,i in enumerate(hero.get('talents')):
                    talents[index]['name_loc'][language] = i.get('name_loc')
                    change_talent_name_loc(talents[index],language)


            facets_data = hero.get('facets')
            for index,facet_data in enumerate(facets_data):
                add = False
                lists = hero.get('abilities')
                for ability in lists:
                    for index_,loc in enumerate(ability.get('facets_loc')):
                        if loc and index == index_:
                            draw_facet(ability, facet_data, facets,language, count_languages)
                            add = True
                if not add:
                    facet_abilities = []
                    for facet_ability in hero.get('facet_abilities'):
                        if facet_ability.get('abilities'):
                            facet_abilities.append(facet_ability.get('abilities')[0])
                    for ability in facet_abilities:
                        facets_full_description = ability.get('notes_loc')[0] if ability.get('notes_loc') else ''
                        if facets_full_description:
                            facets_full_description = process_special_values(facets_full_description, ability, 'notes')
                            draw_facet(None, facet_data, facets, language, count_languages,facets_full_description)
                        else:
                            draw_facet(None, facet_data, facets, language, count_languages)

            count_languages += 1

        if not is_hero:
            print("Skip. No hero")
            continue
        if not hero_data:

            continue
        new_hero = Hero(
            name_url = hero_data['name'],
            icon=hero_data['hero_icon_src'],
            name=hero_data['name_loc'],
            main_attribute=hero_data['primary_attr'],
            complexity=hero_data['difficulty'],
            advice=hero_data['advice'],
            history=hero_data['history'],
            attack={
                'attack_rate': hero_data['attack_rate'],
                'attack_range': hero_data['attack_range'],
                'projectile_speed': hero_data['projectile_speed'],
                'damage': f'{hero_data["damage_min"]} - {hero_data["damage_max"]}'
            },
            defense={
                'armor': round(hero_data['armor'],1),
                'magic_resistance': hero_data['magic_resistance']
            },
            mobility={
                'movement_speed': hero_data['movement_speed'],
                'visibly': f'{hero_data["sight_range_day"]}/{hero_data["sight_range_night"]}',
                'turn_rate': hero_data['turn_rate']
            },
            hp={
                'health': hero_data['max_health'],
                'health_regen': hero_data['health_regen']
            },
            mp={
                'mana': hero_data['max_mana'],
                'mana_regen': hero_data['mana_regen']
            },
            attributes={
                'agi_base': hero_data['agi_base'],
                'int_base': hero_data['int_base'],
                'str_base': hero_data['str_base'],
                'agi_gain': hero_data['agi_gain'],
                'int_gain': hero_data['int_gain'],
                'str_gain': hero_data['str_gain']
            },
            attack_type='hero_attack_type_melee' if hero_data['attack_type'] == 1 else 'hero_attack_type_ranged',
            talents={f'talent_{i+1}': talents[i]["name_loc"] for i in range(8)},
            description=hero_data['description'],
            video=hero_data['hero_video_src'],
            image=hero_data['hero_image_src']
        )
        new_hero.save()
        for index, ability in enumerate(abilities):
            new_skill = Skills(
                name=ability['name'],
                icon=ability['icon'],
                description=ability['description'],
                hero=new_hero,
                number=index,
                tip=ability['tip'],
                cooldown=process_value(ability['cooldowns']),
                mana_cost=process_value(ability['mana_cost']),
                video=ability['video'],
                is_innate=ability['is_innate'],
                ability_is_granted_by_shard=ability['ability_is_granted_by_shard'],
                ability_is_granted_by_scepter=ability['ability_is_granted_by_scepter'],
                ability_has_scepter=ability['ability_has_scepter'],
                ability_has_shard=ability['ability_has_shard'],
                scepter_description=ability['scepter_description'],
                shard_description=ability['shard_description'],
                aghs_icon=ability['aghs_icon'],
                is_facet=ability['is_facet']
            )
            spell_immunity = get_spell_immunity(int(ability.get('immunity')))
            dispellable = get_dispellable(int(ability.get('dispellable')))
            affects = get_affects(int(ability.get('target_type')),int(ability.get('target_team')))
            target = get_target(int(ability.get('behavior')))
            damage_type = get_damage_type(ability['damage_type'])
            skill_spell_effects ={'top': {'hero_spell_immunity': spell_immunity, 'hero_dispellable': dispellable,
                                   'hero_affects': affects, 'hero_ability': target, 'hero_damage_type': damage_type},'reverse_data':{}}
            for index,special_value in enumerate(ability['special_values']):
                values_float = special_value['values_float']
                status = False
                for value in values_float:
                    if value == 0:
                        status = True
                if status:
                    continue
                values = process_value(values_float, special_value)
                heading_loc = special_value['heading_loc']
                skill_spell_effects['reverse_data'][f'{values}'] = heading_loc
            new_skill.spell_effects = skill_spell_effects

            new_skill.save()

        for aspect in facets:
            Aspects.objects.create(
                title=aspect['title'],
                description=aspect['description'],
                icon=aspect['icon'],
                ability_description=aspect['ability_description'],
                ability_name=aspect['ability_name'],
                ability_icon=aspect['ability_icon'],
                full_description=aspect['full_description'],
                hero=new_hero,
                facet_bonuses=aspect['facet_bonuses'],
                color = aspect['color']
            )
        for index, role in enumerate(hero_data['role_levels']):

            HeroRoles.objects.create(
                hero=new_hero,
                level=role,
                role=ROLES[index]
            )
        heroes_count += 1
    end_time = time.time()
    execution_time = end_time - start_time
    print(f"Время выполнения: {execution_time // 3600}:{(execution_time // 60) % 60}:{execution_time % 60}")
    return 'ok'

