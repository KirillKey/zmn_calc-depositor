const depositInput = $('.deposit-calc__input');
// const initialSum = parseFloat($('.calc-input--sum').val());
const initialSum = $('.calc-input--sum').val();
const deadlines = $('.calc-input--deadlines').val();
const bet = $('.calc-input--bet').val();
const period = $('.calc-input--period').val();
const addsDeposit = $('.calc-input--adds-deposit').val();
const calcDepositBtn = $('.calc-deposit-btn');  

const finalSum = $('.deposit__result__out--final-sum');
const allPercents = $('.deposit__result__out--all-percents');
const sumAllDeposits = $('.deposit__result__out--sum-all-deposits');

// const finalSumVal = initialSum - initialSum;
// const finalSumVal = Math(initialSum * (1 + bet / period));
const allPercentsVal = 1;
const sumAllDepositsVal = 1;


calcDepositBtn.on('click', function () {
    console.log(finalSumVal);

    finalSum.append(finalSumVal)
});

depositInput.on('input', function (e) {
    if (e) {
        
    }
    // alert('Вот так вот')
})