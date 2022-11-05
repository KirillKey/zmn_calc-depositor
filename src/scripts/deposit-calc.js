const depositInput = $('.deposit-calc__input');
const calcDepositBtn = $('.calc-deposit-btn');
const finalSum = $('.deposit__result__out--final-sum');
const allPercents = $('.deposit__result__out--all-percents');
const sumAllDeposits = $('.deposit__result__out--sum-all-deposits');
const calcInputCapitalization = document.querySelectorAll('.calc-input__capitalizations .capitalization');
const calcInputDepositPeriod = document.querySelectorAll('.calc-input__deposit_period .deposit_period__val');

function clearFields(e) {
    finalSum.text("")
    allPercents.text("")
    sumAllDeposits.text("")
};

function selectCapit (e) {  
    for (let i = 0; i < calcInputCapitalization.length; i++) {
        if (calcInputCapitalization[i].selected) {
            if (calcInputCapitalization[i].dataset.capitalization) {
                if (calcInputCapitalization[i].value == 0) {
                    return 1;
                } else return calcInputCapitalization[i].value;
            }
        }
    }
}
function selectDeposit (e) {  
    for (let i = 0; i < calcInputDepositPeriod.length; i++) {
        if (calcInputDepositPeriod[i].selected) {
            if (calcInputDepositPeriod[i].dataset.depositperiod) {
                return calcInputDepositPeriod[i].value;
            }
        }
    }
}

function initSumTest(sum) {
    if (sum.length > 5) {
        // `.0`
   console.log(123);
    }
}

calcDepositBtn.on('click', function (e) {
    clearFields();
    
    const initialSum = parseFloat($('.calc-input__sum').val());
    const deadlines = parseFloat($('.calc-input__deadlines').val());
    const bet = parseFloat($('.calc-input__bet').val());
    const capitalization = selectCapit();
    const addDeposit = parseFloat($('.calc-input__adds-deposit').val());
    const addDepositOption = selectDeposit();
    // initSumTest(initialSum);


    const finalSumVal = Math.floor(Math.pow(initialSum * (1 + (bet * 0.01) / capitalization), deadlines * capitalization));
    const allPercentsVal = 1;
    const sumAllDepositsVal = 1;
    
    // console.log( bet * 0.01 / 12);
    finalSum.append(finalSumVal)
});

// Нужно подставить корректные значения процентов и т.п. (скоро допишу)