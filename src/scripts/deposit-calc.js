const depositInput = $('.deposit-calc__input');
const calcDepositBtn = $('.calc-deposit-btn');  




calcDepositBtn.on('click', function () {

const initialSum = $('.calc-input--sum').val();
const deadlines = $('.calc-input--deadlines').val();
const bet = $('.calc-input--bet').val();
const period = $('.calc-input--period').val();
const addsDeposit = $('.calc-input--adds-deposit').val();

const finalSum = $('.deposit__result__out--final-sum');
const allPercents = $('.deposit__result__out--all-percents');
const sumAllDeposits = $('.deposit__result__out--sum-all-deposits');

const finalSumVal = Math.round(initialSum * (1 + bet));
const test = bet / period;
const test2 = bet / 2;
const allPercentsVal = 1;
const sumAllDepositsVal = 1;
    
    console.log(finalSumVal);
    console.log(test);
    console.log(test2);
    // console.log(initialSum);
    // console.log(bet);

    // finalSum.append(finalSumVal)
});

depositInput.on('input', function (e) {
    if (e) {
        
    }
    // alert('Вот так вот')
})