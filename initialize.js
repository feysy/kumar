conn = new Mongo();
db = conn.getDB("admin");
newDB = db.getSiblingDB('kumar')
// Champagne elements
newDB.element.insert({'name' : 'Watermellon', 'tag': 'wmellon'});
newDB.element.insert({'name' : 'Grapes', 'tag': 'grape'});
newDB.element.insert({'name' : 'Pineapple', 'tag': 'papple'});
newDB.element.insert({'name' : 'Lemon', 'tag': 'lemon'});
newDB.element.insert({'name' : 'Glass', 'tag': 'glass'});
newDB.element.insert({'name' : 'Plum', 'tag': 'plum'});
newDB.element.insert({'name' : 'Cherry', 'tag': 'cherry'});
newDB.element.insert({'name' : 'Boat', 'tag': 'boat'});
newDB.element.insert({'name' : 'Island', 'tag': 'island'});
newDB.element.insert({'name' : 'Wild', 'tag': 'wild'});

newDB.award.insert({'tag': 'wild', 'count': 2, 'award': 50});
newDB.award.insert({'tag': 'wild', 'count': 3, 'award': 500});
newDB.award.insert({'tag': 'wild', 'count': 4, 'award': 10000});
newDB.award.insert({'tag': 'wild', 'count': 5, 'award': 50000});

newDB.award.insert({'tag': 'boat', 'count': 2, 'award': 35});
newDB.award.insert({'tag': 'boat', 'count': 3, 'award': 50});
newDB.award.insert({'tag': 'boat', 'count': 4, 'award': 100});
newDB.award.insert({'tag': 'boat', 'count': 5, 'award': 5000});

newDB.award.insert({'tag': 'island', 'count': 2, 'award': 25});
newDB.award.insert({'tag': 'island', 'count': 3, 'award': 50});
newDB.award.insert({'tag': 'island', 'count': 4, 'award': 100});
newDB.award.insert({'tag': 'island', 'count': 5, 'award': 5000});

newDB.award.insert({'tag': 'cherry', 'count': 2, 'award': 15});
newDB.award.insert({'tag': 'cherry', 'count': 3, 'award': 25});
newDB.award.insert({'tag': 'cherry', 'count': 4, 'award': 100});
newDB.award.insert({'tag': 'cherry', 'count': 5, 'award': 500});

newDB.award.insert({'tag': 'plum', 'count': 2, 'award': 15});
newDB.award.insert({'tag': 'plum', 'count': 3, 'award': 25});
newDB.award.insert({'tag': 'plum', 'count': 4, 'award': 100});
newDB.award.insert({'tag': 'plum', 'count': 5, 'award': 500});

newDB.award.insert({'tag': 'glass', 'count': 3, 'award': 25});
newDB.award.insert({'tag': 'glass', 'count': 4, 'award': 100});
newDB.award.insert({'tag': 'glass', 'count': 5, 'award': 500});

newDB.award.insert({'tag': 'lemon', 'count': 3, 'award': 25});
newDB.award.insert({'tag': 'lemon', 'count': 4, 'award': 100});
newDB.award.insert({'tag': 'lemon', 'count': 5, 'award': 500});

newDB.award.insert({'tag': 'papple', 'count': 3, 'award': 25});
newDB.award.insert({'tag': 'papple', 'count': 4, 'award': 100});
newDB.award.insert({'tag': 'papple', 'count': 5, 'award': 500});

newDB.award.insert({'tag': 'grape', 'count': 3, 'award': 25});
newDB.award.insert({'tag': 'grape', 'count': 4, 'award': 100});
newDB.award.insert({'tag': 'grape', 'count': 5, 'award': 500});

newDB.award.insert({'tag': 'wmellon', 'count': 3, 'award': 25});
newDB.award.insert({'tag': 'wmellon', 'count': 4, 'award': 100});
newDB.award.insert({'tag': 'wmellon', 'count': 5, 'award': 500});

newDB.machine_element.insert({'type': 'champagne', 'element':'wmellon'});
newDB.machine_element.insert({'type': 'champagne', 'element':'grape'});
newDB.machine_element.insert({'type': 'champagne', 'element':'papple'});
newDB.machine_element.insert({'type': 'champagne', 'element':'lemon'});
newDB.machine_element.insert({'type': 'champagne', 'element':'glass'});
newDB.machine_element.insert({'type': 'champagne', 'element':'plum'});
newDB.machine_element.insert({'type': 'champagne', 'element':'cherry'});
newDB.machine_element.insert({'type': 'champagne', 'element':'boat'});
newDB.machine_element.insert({'type': 'champagne', 'element':'island'});
newDB.machine_element.insert({'type': 'champagne', 'element':'wild'});

newDB.machine_type.insert({'name': 'champagne', 'columns':5, 'rows':3});
newDB.machine.insert({'name': 'Nişantaşı', 'type': 'champagne', "assigned_user": null});

// Bar machine
newDB.machine_type.insert({'name': 'bar', 'columns':3, 'rows':1});

newDB.element.insert({'name' : 'Seven', 'tag': 'seven'});
newDB.element.insert({'name' : 'Bell', 'tag': 'bell'});
newDB.element.insert({'name' : 'Bar', 'tag': 'bar'});
//newDB.element.insert({'name' : 'Plum', 'tag': 'plum'});
newDB.element.insert({'name' : 'Orange', 'tag': 'orange'});
//newDB.element.insert({'name' : 'Cherry', 'tag': 'cherry'});

newDB.award.insert({'tag': 'seven', 'count': 3, 'award': 300});
newDB.award.insert({'tag': 'bell', 'count': 3, 'award': 60});
newDB.award.insert({'tag': 'bar', 'count': 3, 'award': 50});
newDB.award.insert({'tag': 'plum', 'count': 3, 'award': 40});
newDB.award.insert({'tag': 'orange', 'count': 3, 'award': 25});
newDB.award.insert({'tag': 'cherry', 'count': 3, 'award': 10});
newDB.award.insert({'tag': 'cherry', 'count': 2, 'award': 2});
newDB.award.insert({'tag': 'cherry', 'count': 1, 'award': 2});

newDB.path.insert({'name':'0', 'path':'0,0,0', 'type': 'bar'});

newDB.machine_element.insert({'type': 'bar', 'element':'seven'});
newDB.machine_element.insert({'type': 'bar', 'element':'bell'});
newDB.machine_element.insert({'type': 'bar', 'element':'bar'});
newDB.machine_element.insert({'type': 'bar', 'element':'plum'});
newDB.machine_element.insert({'type': 'bar', 'element':'orange'});
newDB.machine_element.insert({'type': 'bar', 'element':'cherry'});

newDB.machine.insert({'name': 'Beşiktaş', 'type': 'bar', "assigned_user": null});