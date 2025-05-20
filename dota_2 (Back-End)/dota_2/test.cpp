#include <iostream>
#include <set>
#include <string>
#include <tuple>
using namespace std;


struct Virus {
    string name;
    string type;
    string damage;
    int spread_speed;

    // Оператор < нужен для set
    bool operator<(const Virus& other) const {
        // Сортировка по имени, затем по скорости
        return tie(name, spread_speed) < tie(other.name, other.spread_speed);
    }
};

void findVirus(const set<Virus>& viruses, const string& name, int speed) {
    for (const auto& v : viruses) {
        if (v.name == name && v.spread_speed == speed) {
            cout << "Найден вирус:\n";
            cout << "Имя: " << v.name << "\nТип: " << v.type
                      << "\nВред: " << v.damage << "\nСкорость: " << v.spread_speed << "\n";
            return;
        }
    }
    cout << "Вирус не найден.\n";
}

int main() {
    set<Virus> virusSet = {
        {"ILOVEYOU", "червь", "удаление файлов", 9},
        {"MyDoom", "троян", "замедление сети", 7},
        {"Stuxnet", "червь", "повреждение оборудования", 8},
        {"ILOVEYOU", "червь", "удаление файлов", 5}
    };

    string name;
    int speed;

    cout << "Введите имя вируса: ";
    cin >> name;
    cout << "Введите скорость распространения: ";
    cin >> speed;

    findVirus(virusSet, name, speed);

    return 0;
}
