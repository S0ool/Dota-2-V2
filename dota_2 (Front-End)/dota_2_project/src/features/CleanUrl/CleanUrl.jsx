

export const CleanUrl = ({url}) => {
    if (url !== undefined) {
        const parts = url.split('/abilities/');
        if (parts.length > 1) {
            // Извлекаем часть после 'abilities/' и заменяем '-' на ''
            const heroPart = parts[1].split('/')[0].replace('-', '');

            // Собираем новый URL
            return parts[0] + '/abilities/' + heroPart + '/' + parts[1].split('/').slice(1).join('/');
        }
    }



    return url; // Если формат URL не подходит, возвращаем его без изменений
}