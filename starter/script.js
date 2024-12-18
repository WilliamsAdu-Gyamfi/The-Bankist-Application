"use strict";

/////////////////////////////////////////////////
/////////////////////////////////////////////////
// BANKIST APP

// Data
const account1 = {
  owner: "Williams Gyamfi",
  movements: [200, 450, -400, 3000, -650, -130, 70, 1300],
  interestRate: 1.2, // %
  pin: 1111,
};

const account2 = {
  owner: "Jessica Davis",
  movements: [5000, 3400, -150, -790, -3210, -1000, 8500, -30],
  interestRate: 1.5,
  pin: 2222,
};

const account3 = {
  owner: "Steven Thomas Williams",
  movements: [200, -200, 340, -300, -20, 50, 400, -460],
  interestRate: 0.7,
  pin: 3333,
};

const account4 = {
  owner: "Sarah Smith",
  movements: [430, 1000, 700, 50, 90],
  interestRate: 1,
  pin: 4444,
};

const accounts = [account1, account2, account3, account4];

// Elements
const labelWelcome = document.querySelector(".welcome");
const labelDate = document.querySelector(".date");
const labelBalance = document.querySelector(".balance__value");
const labelSumIn = document.querySelector(".summary__value--in");
const labelSumOut = document.querySelector(".summary__value--out");
const labelSumInterest = document.querySelector(".summary__value--interest");
const labelTimer = document.querySelector(".timer");

const containerApp = document.querySelector(".app");
const containerMovements = document.querySelector(".movements");

const btnLogin = document.querySelector(".login__btn");
const btnTransfer = document.querySelector(".form__btn--transfer");
const btnLoan = document.querySelector(".form__btn--loan");
const btnClose = document.querySelector(".form__btn--close");
const btnSort = document.querySelector(".btn--sort");

const inputLoginUsername = document.querySelector(".login__input--user");
const inputLoginPin = document.querySelector(".login__input--pin");
const inputTransferTo = document.querySelector(".form__input--to");
const inputTransferAmount = document.querySelector(".form__input--amount");
const inputLoanAmount = document.querySelector(".form__input--loan-amount");
const inputCloseUsername = document.querySelector(".form__input--user");
const inputClosePin = document.querySelector(".form__input--pin");

//DOM MANIPULATION BY SELF
const displayMovements = function (movements, sort = false) {
  containerMovements.innerHTML = "";

  const moves = sort ? movements.slice().sort((a, b) => a - b) : movements;

  moves.forEach(function (move, i) {
    const type = move > 0 ? "deposit" : "withdrawal";
    const html = `
   <div class="movements__row">
          <div class="movements__type movements__type--${type}">${
      i + 1
    } ${type}</div>
         
          <div class="movements__value">${move}€</div>
        </div>
      </div>
    `;
    containerMovements.insertAdjacentHTML("afterbegin", html);
  });
};
//displayMovements(account1.movements);

//creating usernames
const createUsernames = function (accts) {
  accts.forEach(function (acct) {
    acct.user = acct.owner
      .toLowerCase()
      .split(" ")
      .map(function (customer) {
        return customer[0];
      })
      .join("");
  });
};

createUsernames(accounts);
console.log(accounts);

//TOTAL BALANCE
const calcBalance = function (acct) {
  acct.balance = acct.movements.reduce(function (acc, move) {
    return acc + move;
  }, 0);
  labelBalance.textContent = `${acct.balance}€`;
};

//calcBalance(account1.movements);

//const calcDisplaySummary = function (movements) {
const calcDisplaySummary = function (acct) {
  //INCOME
  //const displayIncome = function (movements) {
  //const incomeSummary = movements
  const incomeSummary = acct.movements
    .filter(move => move > 0)
    .reduce((acc, move) => acc + move, 0);
  labelSumIn.textContent = `${incomeSummary}€`;

  //displayIncome(account1.movements);

  //OUTCOME
  //const displayOutcome = function (movemen ts) {
  //const outcomeSummary = movements
  const outcomeSummary = acct.movements
    .filter(move => move < 0)
    .reduce((acc, move) => acc + move, 0);
  labelSumOut.textContent = `${Math.abs(outcomeSummary)}€`;

  //displayOutcome(account1.movements);

  //INTEREST
  //const displayInterest = function (movements) {
  //const interestSummary = movements
  const interestSummary = acct.movements
    .filter(move => move > 0)
    .map(move => (move * acct.interestRate) / 100)
    .filter(move => move >= 1)
    .reduce((acc, move) => acc + move);
  labelSumInterest.textContent = `${interestSummary}€`;
};
//displayInterest(account1.movements);
//calcDisplaySummary(account1.movements)

const updatateUI = function (acct) {
  displayMovements(acct.movements);
  calcBalance(acct);
  calcDisplaySummary(acct);
};

//Event Handlers
let currentAccount;
btnLogin.addEventListener("click", function (e) {
  e.preventDefault();
  currentAccount = accounts.find(
    acct => acct.user === inputLoginUsername.value
  );
  console.log(currentAccount);

  if (currentAccount?.pin === Number(inputLoginPin.value)) {
    //Display UI and welcome message
    labelWelcome.textContent = `Welcome Back, ${
      currentAccount.owner.split(" ")[0]
    }`;
    containerApp.style.opacity = 100;

    //clear user inputs after logging in
    inputLoginUsername.value = "";
    inputLoginPin.value = "";
    inputLoginPin.blur();

    updatateUI(currentAccount); //calcDisplaySummary(currentAccount.movements);
  }
});

btnTransfer.addEventListener("click", function (e) {
  e.preventDefault();
  const transferAmount = Number(inputTransferAmount.value);
  const recieverAcct = accounts.find(
    acct => acct.user === inputTransferTo.value
  );
  console.log(transferAmount, recieverAcct);

  inputTransferAmount.value = "";
  inputTransferTo.value = "";
  if (
    transferAmount > 0 &&
    recieverAcct &&
    currentAccount.balance >= transferAmount &&
    recieverAcct?.user !== currentAccount.user
  ) {
    console.log("Valid");
    //Doing the Transfer
    currentAccount.movements.push(-transferAmount);
    recieverAcct.movements.push(transferAmount);
    //Update UI
    updatateUI(currentAccount);
  }
});

//REQUEST A LOAN
btnLoan.addEventListener("click", function (e) {
  e.preventDefault();

  const loanAmount = Number(inputLoanAmount.value);
  if (
    loanAmount > 0 &&
    currentAccount.movements.some(move => move >= loanAmount / 10)
  ) {
    //add movements
    currentAccount.movements.push(loanAmount);
    //update UI
    updatateUI(currentAccount);
  }
  inputLoanAmount.value = "";
});
//closing account
btnClose.addEventListener("click", function (e) {
  e.preventDefault();
  //console.log("Delete");
  if (
    inputCloseUsername.value === currentAccount.user &&
    Number(inputClosePin.value) === currentAccount.pin
  ) {
    console.log("Delete?");
    const index = accounts.findIndex(acct => acct.user === currentAccount.user);
    console.log(index);
    accounts.splice(index, 1);
    inputCloseUsername.value = "";
    inputClosePin.value = "";
    inputClosePin.blur();
  }
  containerApp.style.opacity = 0;
});

let sorted = false;
btnSort.addEventListener("click", function (e) {
  e.preventDefault();
  console.log("sorted");
  displayMovements(currentAccount.movements, !sorted);
  sorted = !sorted;

  //labelWelcome.addEventListener("click", function () {
  console.log("ok");
  [...document.querySelectorAll(".movements__row")].forEach(function (row, i) {
    if (i % 2 === 0) row.style.backgroundColor = "#FFD700";

    if (i % 3 === 0) row.style.backgroundColor = "#D4AF37";

    // if (i % 4 === 0) row.style.backgroundColor = "#FFD700";
  });
});

/////////////////////////////////////////////////
/////////////////////////////////////////////////
// LECTURES

const currencies = new Map([
  ["USD", "United States dollar"],
  ["EUR", "Euro"],
  ["GBP", "Pound sterling"],
]);

const movements = [200, 450, -400, 3000, -650, -130, 70, 1300];

/////////////////////////////////////////////////
/*
//for (const move of movements) {
console.log("---for of loop---");
const movements2 = [200, 450, -400, 3000, -650, -130, 70, 1300];
for (const [i, move] of movements2.entries()) {
  if (move > 0) {
    console.log(`Movement${i + 1}: You depoiteted ${move}`);
  } else {
    console.log(`Movement${i + 1}: You witdrew ${Math.abs(move)}`);
  }
}

console.log("---forEach---");
movements.forEach(function (move, i, arr) {
  if (move > 0) {
    console.log(`Movement${i + 1}: You depoiteted ${move}`);
  } else {
    console.log(`Movement${i + 1}: You witdrew ${Math.abs(move)}`);
  }
});

//forEach With Maps
const currencies2 = new Map([
  ["USD", "United States dollar"],
  ["EUR", "Euro"],
  ["GBP", "Pound sterling"],
]);
console.log("-----for of loop----");
for (const [key, value] of currencies2) {
  console.log(`${key}: ${value}`);
}
console.log("----forEach loop----");
currencies2.forEach(function (value, key, map) {
  console.log(`${key}: ${value}`);
});

//With Sets
console.log("----with Sets---");
const currencies2Unique = new Set(["USD", "EUR", "USD", "GBP", "GBP", "EUR"]);
currencies2Unique.forEach(function (value, key, map) {
  console.log(`${key}: ${value}`);
});

/*
Coding Challenge #1
Julia and Kate are doing a study on dogs. So each of them asked 5 dog owners 
about their dog's age, and stored the data into an array (one array for each). For 
now, they are just interested in knowing whether a dog is an adult or a puppy.
A dog is an adult if it is at least 3 years old, and it's a puppy if it's less than 3 years 
old.
Your tasks:
Create a function 'checkDogs', which accepts 2 arrays of dog's ages 
('dogsJulia' and 'dogsKate'), and does the following things:
1. Julia found out that the owners of the first and the last two dogs actually have 
cats, not dogs! So create a shallow copy of Julia's array, and remove the cat 
ages from that copied array (because it's a bad practice to mutate function 
parameters)
2. Create an array with both Julia's (corrected) and Kate's data
3. For each remaining dog, log to the console whether it's an adult ("Dog number 1 
is an adult, and is 5 years old") or a puppy ("Dog number 2 is still a puppy 
�
")
4. Run the function for both test datasets
Test data:
§ Data 1: Julia's data [3, 5, 2, 12, 7], Kate's data [4, 1, 15, 8, 3]
§ Data 2: Julia's data [9, 16, 6, 8, 3], Kate's data [10, 5, 6, 1, 4]
*/

/*
const julia1 = [3, 5, 2, 12, 7];
const kate1 = [4, 1, 15, 8, 3];
const julia2 = [9, 16, 6, 8, 3];
const kate2 = [10, 5, 6, 1, 4];

const checkDogs = function (dogsJulia, dogsKate) {
  const expecteddogjulia = dogsJulia.slice();
  expecteddogjulia.splice(0, 1);
  expecteddogjulia.splice(-2);
  const dogs = expecteddogjulia.concat(dogsKate);
  console.log(dogs);
  dogs.forEach(function (dog, i) {
    if (dog < 4) {
      console.log(`Dog number ${i + 1} is still a puppy`);
    } else {
      console.log(`Dog number ${i + 1} 
is an adult, and is ${dog} years old`);
    }
  });
};

checkDogs(julia1, kate1);
checkDogs(julia2, kate2);

const julia3 = [3, 5, 2, 12, 7];
//const test = julia3.splice(0, 1);
//console.log(test);
//console.log(julia3.splice(-2));
console.log(julia3.splice(0, 1));
console.log(julia3);

//small challenge
//const movements = [200, 450, -400, 3000, -650, -130, 70, 1300];
//const movementUSD = movements.map(function(movements){
//return movements * eurToUsd})

//OR(ARROW FUNCTION)
const eurToUsd = 1.1;
const movementsUSD = movements.map(movements => movements * eurToUsd);
console.log(movements);
console.log(movementsUSD);
*/

/*
//FILTER METHOD
//small challlenge bySelf
const deposits = movements.filter(function (move) {
  return move > 0;
});
console.log(movements);
console.log(deposits);

const withdrawal = movements.filter(function (move) {
  return move < 0;
});
console.log(movements);
console.log(withdrawal);

//REDUCE METHOD
const balance = movements.reduce(function (acc, curr, i, arr) {
  return acc + curr;
}, 10);
console.log(balance);

//MAXIMUM VALUE
const max = movements.reduce(function (acc, move) {
  if (acc > move) return acc;
  else return move;
}, movements[0]);
console.log(max);

//MINIMUM VALUE
const min = movements.reduce(function (acc, move) {
  if (acc < move) return acc;
  else return move;
}, movements[0]);
console.log(min);

/*
Coding Challenge #2
Let's go back to Julia and Kate's study about dogs. This time, they want to convert 
dog ages to human ages and calculate the average age of the dogs in their study.
Your tasks:
Create a function 'calcAverageHumanAge', which accepts an arrays of dog's 
ages ('ages'), and does the following things in order:
1. Calculate the dog age in human years using the following formula: if the dog is 
<= 2 years old, humanAge = 2 * dogAge. If the dog is > 2 years old, 
humanAge = 16 + dogAge * 4
2. Exclude all dogs that are less than 18 human years old (which is the same as 
keeping dogs that are at least 18 years old)
3. Calculate the average human age of all adult dogs (you should already know 
from other challenges how we calculate averages �)
4. Run the function for both test datasets
Test data:
§ Data 1: [5, 2, 4, 1, 15, 8, 3]
§ Data 2: [16, 6, 10, 5, 6, 1, 4]
*/

/*
const calcAverageHumanAge = function (ages) {
  const humanAge = ages.map(function (age) {
    return age <= 2 ? 2 * age : 16 + age * 4;
  });
  const adultHumanDogs = humanAge.filter(function (adult) {
    return adult >= 18;
  });
  const averageAdult = adultHumanDogs.reduce(function (acc, sum) {
    return acc + sum / adultHumanDogs.length;
  }, 0);

  return {
    originalArray: ages,
    adultHumanDogs: adultHumanDogs,
    averageAdult: averageAdult,
  };
};
const results1 = calcAverageHumanAge([5, 2, 4, 1, 15, 8, 3]);
console.log("Original Array:", results1.originalArray);
console.log("Adults Human Dogs", results1.adultHumanDogs);
console.log("AAverage of Adult Human Ages:", results1.averageAdult);

const results2 = calcAverageHumanAge([16, 6, 10, 5, 6, 1, 4]);
console.log("Original Array:", results2.originalArray);
console.log("Adults Human Dogs", results2.adultHumanDogs);
console.log("Average of Adult Human Ages:", results2.averageAdult);

//Pipeline
const eurToUsd = 1.1;
const totalDeposits = movements
  .filter(move => move > 0)
  .map(move => move * eurToUsd)
  .reduce((acc, move) => acc + move);
console.log(totalDeposits);

/*
Coding Challenge #3
Rewrite the 'calcAverageHumanAge' function from Challenge #2, but this time 
as an arrow function, and using chaining!
Test data:
§ Data 1: [5, 2, 4, 1, 15, 8, 3]
§ Data 2: [16, 6, 10, 5, 6, 1, 4]
*/

/*
const calcAverageHumanAge1 = ages =>
  ages
    .map(age => (age <= 2 ? 2 * age : 16 + age * 4))
    .filter(age => age >= 18)
    .reduce((acc, age, i, arr) => acc + age / arr.length, 0);

console.log(calcAverageHumanAge1([5, 2, 4, 1, 15, 8, 3]));
console.log(calcAverageHumanAge1([16, 6, 10, 5, 6, 1, 4]));

const firstDebit = movements.find(acc => acc < 0);
console.log(firstDebit);

console.log(accounts);
const account = accounts.find(acc => acc.owner === "Jessica Davis");
console.log(account);
*/

//SOME AND EVERY METHODS
//some methods
console.log(movements);
console.log(movements.some(move => move > 0));

//every method
console.log(movements.every(move => move > 0));

//Flat and FlatMethod
const arr = [[1, 2], 3, 4, [5, 6]];
const normalArr = arr.flat();
console.log(normalArr);

const arrDeep = [[[1, 2], 3, 4], [[5, 6], 7], 8];
console.log(arrDeep.flat(2)); // Going Deep

/*
console.log(accounts);
const allMovements = accounts.map(acct => acct.movements);
console.log(allMovements);
const combineAllMovements = allMovements.flat();
console.log(combineAllMovements);
const totalBalance = combineAllMovements.reduce((acct, move) => acct + move, 0);
console.log(totalBalance);
*/

const totalBalance = accounts
  .map(acct => acct.movements)
  .flat()
  .reduce((acct, move) => acct + move, 0);
console.log(totalBalance);

//FLATMAP MEHOD
const totalBalance2 = accounts
  .flatMap(acct => acct.movements)
  .reduce((acct, move) => acct + move, 0);
console.log(totalBalance2);

//sorting Arrays

//return < 0, A, B(KEEP ORDER)
//return > 0, B, A(SWITCH ORDER)

//strings
const candidates = ["Williams", "Adu", "Gyamfi"];
console.log(candidates.sort());

//numbers
console.log(account1.movements);
console.log(account1.movements.sort());

//ascending order
account1.movements.sort((a, b) => {
  if (a > b) return 1;
  if (a < b) return -1;
});
console.log(account1.movements);

//descending order
account1.movements.sort((a, b) => {
  if (a > b) return -1;
  if (a < b) return 1;
});
console.log(account1.movements);

//more simple way
account1.movements.sort((a, b) => a - b);
console.log(account1.movements);

//EXERCISE
//FR0M METHOD
//Create an array of 100 random dice roll
const diceRolls = Array.from(
  { length: 100 },
  () => Math.floor(Math.random() * 6) + 1
);
console.log(diceRolls);

labelWelcome.addEventListener("click", function () {
  console.log("hey");
  const movementsUI = Array.from(
    document.querySelectorAll(".movements__value")
  );
  console.log(movementsUI.map(el => Number(el.textContent.replace("€", ""))));
});

/*
Coding Challenge #4
Julia and Kate are still studying dogs, and this time they are studying if dogs are 
eating too much or too little.
Eating too much means the dog's current food portion is larger than the 
recommended portion, and eating too little is the opposite.
Eating an okay amount means the dog's current food portion is within a range 10% 
above and 10% below the recommended portion (see hint).
Your tasks:
1. Loop over the 'dogs' array containing dog objects, and for each dog, calculate 
the recommended food portion and add it to the object as a new property. Do 
not create a new array, simply loop over the array. Forumla: 
recommendedFood = weight ** 0.75 * 28. (The result is in grams of 
food, and the weight needs to be in kg)
2. Find Sarah's dog and log to the console whether it's eating too much or too 
little. Hint: Some dogs have multiple owners, so you first need to find Sarah in 
the owners array, and so this one is a bit tricky (on purpose) �
3. Create an array containing all owners of dogs who eat too much 
('ownersEatTooMuch') and an array with all owners of dogs who eat too little 
('ownersEatTooLittle').
4. Log a string to the console for each array created in 3., like this: "Matilda and 
Alice and Bob's dogs eat too much!" and "Sarah and John and Michael's dogs eat 
too little!"
5. Log to the console whether there is any dog eating exactly the amount of food 
that is recommended (just true or false)
6. Log to the console whether there is any dog eating an okay amount of food 
(just true or false)
7. Create an array containing the dogs that are eating an okay amount of food (try 
to reuse the condition used in 6.)
8. Create a shallow copy of the 'dogs' array and sort it by recommended food 
portion in an ascending order (keep in mind that the portions are inside the 
array's objects �)
The Complete JavaScript Course 26
Hints:
§ Use many different tools to solve these challenges, you can use the summary 
lecture to choose between them �
§ Being within a range 10% above and below the recommended portion means: 
current > (recommended * 0.90) && current < (recommended * 
1.10). Basically, the current portion should be between 90% and 110% of the 
recommended portion.
Test data:
 const dogs = [
 { weight: 22, curFood: 250, owners: ['Alice', 'Bob'] },
 { weight: 8, curFood: 200, owners: ['Matilda'] },
 { weight: 13, curFood: 275, owners: ['Sarah', 'John'] },
 { weight: 32, curFood: 340, owners: ['Michael'] },
 ];
GOOD LUCK 
*/

const dogs = [
  { weight: 22, curFood: 250, owners: ["Alice", "Bob"] },
  { weight: 8, curFood: 200, owners: ["Matilda"] },
  { weight: 13, curFood: 275, owners: ["Sarah", "John"] },
  { weight: 32, curFood: 340, owners: ["Michael"] },
];

//1
dogs.forEach(dog =>
  Math.trunc((dog.recommendedFood = dog.weight ** 0.75 * 28))
);
console.log(dogs);

//2
const sarahDog = dogs.find(dog => dog.owners.includes("Sarah"));
console.log(
  `Sarah's dog eats too ${
    sarahDog.curFood > sarahDog.recommendedFood ? "much" : "little"
  } `
);

//3
const ownersEatTooMuch = dogs

  .filter(dog => dog.curFood > dog.recommendedFood)
  .flatMap(dog => dog.owners);
//.flat();
console.log(ownersEatTooMuch);

//3
const ownersEatTooLittle = dogs

  .filter(dog => dog.curFood < dog.recommendedFood)
  .flatMap(dog => dog.owners);
//.flat();
console.log(ownersEatTooLittle);

//4
const ownersEatTooMuchNames = dogs

  .filter(dog => dog.curFood > dog.recommendedFood)
  .map(dog => dog.owners)
  .flat();
console.log(`${ownersEatTooMuchNames.join(" and ")}'s dog eat too much!`);

const ownersEatTooLittleNames = dogs

  .filter(dog => dog.curFood < dog.recommendedFood)
  .flatMap(dog => dog.owners);
//.flat();
console.log(`${ownersEatTooLittle.join(" and ")}'s dog eat too little!`);

//5
const dogsEatExactly = dogs.some(dog => dog.curFood === dog.recommendedFood);
console.log(dogsEatExactly);

//6
const dogsEatOkay = dogs.some(
  dog =>
    dog.curFood > dog.recommendedFood * 0.9 &&
    dog.curFood < dog.recommendedFood * 1.1
);
console.log(dogsEatOkay);

//7
const dogsEatOkayOwners = dogs.filter(
  dog =>
    dog.curFood > dog.recommendedFood * 0.9 &&
    dog.curFood < dog.recommendedFood * 1.1
);
console.log(dogsEatOkayOwners);

//8
const dogsSorted = dogs
  .slice()
  .sort((a, b) => a.recommendedFood - b.recommendedFood);
console.log(dogsSorted);
