'use strict';

/////////////////////////////////////////////////
/////////////////////////////////////////////////
// BANKIST APP

/////////////////////////////////////////////////
// Data

// DIFFERENT DATA! Contains movement dates, currency and locale

const account1 = {
  owner: 'Jonas Schmedtmann',
  movements: [200, 455.23, -306.5, 25000, -642.21, -133.9, 79.97, 1300],
  interestRate: 1.2, // %
  pin: 1111,

  movementsDates: [
    '2019-11-18T21:31:17.178Z',
    '2019-12-23T07:42:02.383Z',
    '2020-01-28T09:15:04.904Z',
    '2020-04-01T10:17:24.185Z',
    '2020-05-08T14:11:59.604Z',
    '2020-05-26T17:01:17.194Z',
    '2020-07-28T23:36:17.929Z',
    '2020-08-01T10:51:36.790Z',
  ],
  currency: 'EUR',
  locale: 'pt-PT', // de-DE
};

const account2 = {
  owner: 'Jessica Davis',
  movements: [5000, 3400, -150, -790, -3210, -1000, 8500, -30],
  interestRate: 1.5,
  pin: 2222,

  movementsDates: [
    '2019-11-01T13:15:33.035Z',
    '2019-11-30T09:48:16.867Z',
    '2019-12-25T06:04:23.907Z',
    '2020-01-25T14:18:46.235Z',
    '2020-02-05T16:33:06.386Z',
    '2020-07-25T14:43:26.374Z',
    '2020-07-28T18:49:59.371Z',
    '2021-08-01T12:01:20.894Z',
  ],
  currency: 'USD',
  locale: 'en-US',
};

const accounts = [account1, account2];

/////////////////////////////////////////////////
// Elements
const labelWelcome = document.querySelector('.welcome');
const labelDate = document.querySelector('.date');
const labelBalance = document.querySelector('.balance__value');
const labelSumIn = document.querySelector('.summary__value--in');
const labelSumOut = document.querySelector('.summary__value--out');
const labelSumInterest = document.querySelector('.summary__value--interest');
const labelTimer = document.querySelector('.timer');

const containerApp = document.querySelector('.app');
const containerMovements = document.querySelector('.movements');

const btnLogin = document.querySelector('.login__btn');
const btnTransfer = document.querySelector('.form__btn--transfer');
const btnLoan = document.querySelector('.form__btn--loan');
const btnClose = document.querySelector('.form__btn--close');
const btnSort = document.querySelector('.btn--sort');

const inputLoginUsername = document.querySelector('.login__input--user');
const inputLoginPin = document.querySelector('.login__input--pin');
const inputTransferTo = document.querySelector('.form__input--to');
const inputTransferAmount = document.querySelector('.form__input--amount');
const inputLoanAmount = document.querySelector('.form__input--loan-amount');
const inputCloseUsername = document.querySelector('.form__input--user');
const inputClosePin = document.querySelector('.form__input--pin');

/////////////////////////////////////////////////
// Functions

const formatMovementDate = function (date, locale) {

  const calcDaysPassed = (date1, date2) =>
    Math.round(Math.abs((date2 - date1) / (1000 * 60 * 60 * 24)));

  const daysPassed = calcDaysPassed(new Date(), date);
  console.log(daysPassed);

  if (daysPassed === 0) return 'Today';
  if (daysPassed === 1) return 'Yesterday';
  if (daysPassed <= 7) return `${daysPassed} days ago`;
  else {

    // const day = `${date.getDate()}`.padStart(2, 0);
    // const month = `${date.getMonth() + 1}`.padStart(2, 0);
    // const year = date.getFullYear();
    // return `${day}/${month}/${year}`;
    return new Intl.DateTimeFormat(locale).format(date);

  };

  const displayMovements = function (acc, sort = false) {
    containerMovements.innerHTML = '';

    const movs = sort ? acc.movements.slice().sort((a, b) => a - b) : acc.movements;

    movs.forEach(function (mov, i) {
      const type = mov > 0 ? 'deposit' : 'withdrawal';

      const date = new Date(acc.movementsDates[i]);
      const displayDate = formatMovementDate(date, acc.locale);

      const html = `
      <div class="movements__row">
        <div class="movements__type movements__type--${type}">${i + 1
        } ${type}</div>
      <div class="movements__date">${displayDate}</div>
        <div class="movements__value">${mov.toFixed(2)}€</div>
      </div>
    `;

      containerMovements.insertAdjacentHTML('afterbegin', html);
    });
  };

  const calcDisplayBalance = function (acc) {
    acc.balance = acc.movements.reduce((acc, mov) => acc + mov, 0);
    labelBalance.textContent = `${acc.balance.toFixed(2)}€`;
  };

  const calcDisplaySummary = function (acc) {
    const incomes = acc.movements
      .filter(mov => mov > 0)
      .reduce((acc, mov) => acc + mov, 0);
    labelSumIn.textContent = `${incomes.toFixed(2)}€`;

    const out = acc.movements
      .filter(mov => mov < 0)
      .reduce((acc, mov) => acc + mov, 0);
    labelSumOut.textContent = `${Math.abs(out).toFixed(2)}€`;

    const interest = acc.movements
      .filter(mov => mov > 0)
      .map(deposit => (deposit * acc.interestRate) / 100)
      .filter((int, i, arr) => {
        // console.log(arr);
        return int >= 1;
      })
      .reduce((acc, int) => acc + int, 0);
    labelSumInterest.textContent = `${interest.toFixed(2)}€`;
  };

  const createUsernames = function (accs) {
    accs.forEach(function (acc) {
      acc.username = acc.owner
        .toLowerCase()
        .split(' ')
        .map(name => name[0])
        .join('');
    });
  };
  createUsernames(accounts);

  const updateUI = function (acc) {
    // Display movements
    displayMovements(acc);

    // Display balance
    calcDisplayBalance(acc);

    // Display summary
    calcDisplaySummary(acc);
  };

  ///////////////////////////////////////
  // Event handlers
  let currentAccount;


  // FAKED AlWAYS LOGGED IN
  currentAccount = account1;
  updateUI(currentAccount);
  containerApp.style.opacity = 100;


  btnLogin.addEventListener('click', function (e) {
    // Prevent form from submitting
    e.preventDefault();

    currentAccount = accounts.find(
      acc => acc.username === inputLoginUsername.value
    );
    console.log(currentAccount);

    if (currentAccount?.pin === Number(inputLoginPin.value)) {
      // Display UI and message
      labelWelcome.textContent = `Welcome back, ${currentAccount.owner.split(' ')[0]
        } `;
      containerApp.style.opacity = 100;

      // Create Current date and time
      //    const now = new Date();
      // Experimental API

      const now = new Date();
      const options = {
        hous: 'numeric',
        minute: 'numeric',
        day: 'numeric',
        month: 'numeric',
        year: 'numeric',
        ///weekday: 'long',
      };
      //const locale = navigator.language; // coming from browser

      labelDate.textContent = new Intl.DateTimeFormat(currentAccount.locale, options).format(now);

      // const day = `${now.getDate()}`.padStart(2, 0);
      // const month = `${now.getMonth() + 1}`.padStart(2, 0);
      // const year = `${now.getFullYear()}`.padStart(2, 0);
      // const hours = `${now.getHours()}`.padStart(2, 0);
      // const minutes = `${now.getMinutes()}`.padStart(2, 0);

      labelDate.textContent = `${day}/${month}/${year}, ${hours}: ${minutes} `;


      // Clear input fields
      inputLoginUsername.value = inputLoginPin.value = '';
      inputLoginPin.blur();

      // Update UI
      updateUI(currentAccount);
    }
  });

  btnTransfer.addEventListener('click', function (e) {
    e.preventDefault();
    const amount = Number(inputTransferAmount.value);
    const receiverAcc = accounts.find(
      acc => acc.username === inputTransferTo.value
    );
    inputTransferAmount.value = inputTransferTo.value = '';

    if (
      amount > 0 &&
      receiverAcc &&
      currentAccount.balance >= amount &&
      receiverAcc?.username !== currentAccount.username
    ) {
      // Doing the transfer
      currentAccount.movements.push(-amount);
      receiverAcc.movements.push(amount);

      // ADD MOVEMENTS DATE
      currentAccount.movementsDates.push(new Date().toISOString());
      receiverAcc.movementsDates.push(new Date().toISOString());

      // Update UI
      updateUI(currentAccount);
    }
  });

  btnLoan.addEventListener('click', function (e) {
    e.preventDefault();

    const amount = Math.floor(inputLoanAmount.value);

    if (amount > 0 && currentAccount.movements.some(mov => mov >= amount * 0.1)) {
      // Add movement
      currentAccount.movements.push(amount);

      //add loan date
      currentAccount.movementsDates.push(new Date().toISOString());

      // Update UI
      updateUI(currentAccount);
    }
    inputLoanAmount.value = '';
  });

  btnClose.addEventListener('click', function (e) {
    e.preventDefault();

    if (
      inputCloseUsername.value === currentAccount.username &&
      Number(inputClosePin.value) === currentAccount.pin
    ) {
      const index = accounts.findIndex(
        acc => acc.username === currentAccount.username
      );
      console.log(index);
      // .indexOf(23)

      // Delete account
      accounts.splice(index, 1);

      // Hide UI
      containerApp.style.opacity = 0;
    }

    inputCloseUsername.value = inputClosePin.value = '';
  });

  let sorted = false;
  btnSort.addEventListener('click', function (e) {
    e.preventDefault();
    displayMovements(currentAccount.movements, !sorted);
    sorted = !sorted;
  });




  /*
  
  /////////////////////////////////////////////////
  /////////////////////////////////////////////////
  // LECTURES
  
  // both return same result as a number
  
  // COVERSION
  console.log(Number('23'));
  console.log(+'23'); //In javascript + sign shows the type covertion which converts intpo numbers.
  
  // PARSING
  console.log(Number.parseInt('30px')); // this comvert into number without including alphabets.
  
  console.log(Number.parseFloat('2.5rem')); // this convert the decimal number into integers
  
  // Check if the value is not a number
  console.log(Number.isNaN(20)); // this method shows that whatever we pass value in  isNaN function it will not be integer
  console.log(Number.isNaN('20rem'));
  console.log(Number.isNaN(20 / 0));
  
  // Checking if value is number not a string
  console.log(Number.isFinite(20));
  console.log(Number.isFinite('20'));
  console.log(Number.isFinite(+'20'));
  console.log(Number.isFinite(20 / 0));
  
  //for square root
  console.log(Math.sqrt(25)); //5 is the answer
  console.log(25 ** (1 / 2)); //same as function for calculate sq.root
  console.log(8 ** (1 / 3)); // for cube root
  
  //checking for maximum value
  console.log(Math.max(10, 23, 53, 3, 6, 12));
  //checking for minimum value
  console.log(Math.min(10, 23, 53, 3, 6, 12));
  
  //FOR PI value => area of a circle
  console.log(Math.PI * Number.parseFloat('10px') ** 2);
  
  
  console.log(Math.trunc(Math.random() * 6) + 1); // will not be exceeded to 6
  
  const randomInt = (min, max) => (Math.trunc(Math.random() * (max - min) + 1) + min);
  console.log(randomInt(10, 20)); // this show that number is between 10 to 20
  
  // Rounding Integers
  //Math.trunc and Math.round work same but round always round of the value which is nearest to the rel number
  console.log(Math.round(23.4));
  console.log(Math.round(23.8));
  
  console.log(Math.ceil(24.8));
  console.log(Math.floor(24.8));
  
  console.log(Math.ceil(-23.8));
  console.log(Math.floor(-24.8));
  
  //Rounding decimals
  console.log((2.7).toFixed(0));// it is always return string
  console.log((2.7).toFixed(3));
  console.log((2.745).toFixed(2));
  console.log(+(2.745).toFixed(2));// Now it returns value
  
  // Reminder Operator
  console.log(5 % 2);
  console.log(5 / 2); // 5 =2 * 2 + 1
  
  const isEven = n => n % 2 === 0;
  console.log(isEven(8));
  console.log(isEven(15));
  console.log(isEven(24));
  
  labelBalance.addEventListener('click', function () {
    [...document.querySelectorAll('.movements__row')].forEach(function (row, i) {
      if (i % 2 === 0) {
        row.style.backgroundColor = 'orange';
      }
    });
  })
  
  
  // BigInt
  
  console.log(2 ** 53 - 1); //biggest integer
  console.log(54634565675673252345467674n);
  
  console.log(BigInt(32523465n));
  
  //Operations on bigInt
  console.log(10000n + 10000n);
  
  console.log(23523464564563635n * 1100000n);
  console.log(23523464564563635n - 1100000n);
  console.log(23523464564563635n / 1100000n);
  
  // we never apply operator on bigInt with normal operator
  const huge = 2354646n;
  const num = 25;
  
  //EXCEPTIONS
  //console.log(huge * num); //ERRROR
  console.log(huge * BigInt(num));
  
  console.log(20n === 20);
  console.log(20n > 20);
  console.log(typeof 20n);
  console.log(20n === '20');
  */

  /*
  // Dates Section
  const now = new Date();
  console.log(now);
  
  console.log(new Date('Aug 02 2020 04:18:36'));
  console.log(new Date('Aug 02 2020'));
  
  console.log(new Date(account1.movementsDates[0]));
  
  console.log(new Date(2022, 2, 19, 15, 22, 11));
  
  console.log(new Date(0)); //this shows jan 1 1970
  console.log(new Date(3 * 24 * 60 * 60 * 1000));
  
  // working with dates
  
  const future = new Date(2022, 11, 22.23, 55, 54);
  console.log(future);
  console.log(future.getFullYear());
  console.log(future.getMonth());
  console.log(future.getDay()); // day of the week
  console.log(future.getDate());
  console.log(future.getHours());
  console.log(future.getMinutes());
  console.log(future.getSeconds());
  console.log(future.toISOString());
  
  console.log(future.getTime());
  
  console.log(new Date(1671850440000));
  
  console.log(Date.now());
  
  console.log(future.setFullYear(2025));// how we get and set year also same as month day and date
  */

  const future = new Date(2022, 11, 22.23, 55, 54);
  console.log(+future);

  const calcDaysPassed = (date1, date2) => Math.abs((date2 - date1) / (1000 * 60 * 60 * 24));

  const day1 = calcDaysPassed(new Date(2022, 11, 5), new Date(2022, 11, 8));
  console.log(day1);