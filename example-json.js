var person = {
	name: 'Vishu',
	age: 24
};
//convert to json
var personJson = JSON.stringify(person);
console.log(personJson);
//convert to string
var normalPerson = JSON.parse(personJson);
console.log(normalPerson);
console.log(typeof normalPerson);

//challenge
var animal = '{"name" : "leo"}';
//var animalJson = JSON.stringify(animal);
var backAnimal = JSON.parse(animal);
backAnimal.age = 23;
animal = JSON.stringify(backAnimal);
console.log(animal);