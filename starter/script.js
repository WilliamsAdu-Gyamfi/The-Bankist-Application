"use strict";

/////////////////////////////////////////////////
/////////////////////////////////////////////////
// BANKIST APP

// Data
const account1 = {
  owner: "Jonas Schmedtmann",
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
const displayMovements = function (movements) {
  containerMovements.innerHTML = "";
  movements.forEach(function (move, i) {
    const type = move > 0 ? "deposit" : "withdrawal";
    const html = `
   <div class="movements__row">
          <div class="movements__type movements__type--${type}">${
      i + 1
    } ${type}</div>
         
          <div class="movements__value">${move}</div>
        </div>
      </div>
    `;
    containerMovements.insertAdjacentHTML("afterbegin", html);
  });
};
displayMovements(account1.movements);

const customerName = function (accts) {
  accts.forEach(function (acct) {
    acct.customerName = acct.owner
      .toLowerCase()
      .split(" ")
      .map(function (customer) {
        return customer[0];
      })
      .join("");
  });
};

customerName(accounts);
console.log(accounts);
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
