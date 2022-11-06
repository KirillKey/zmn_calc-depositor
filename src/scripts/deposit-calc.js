const depositInput = $('.deposit-calc__input');
const calcDepositBtn = $('.calc-deposit-btn');
const finalSum = $('.deposit__result__out--final-sum');
const allPercents = $('.deposit__result__out--all-percents');
const sumAllDeposits = $('.deposit__result__out--sum-all-deposits');
const calcInputCapitalization = document.querySelectorAll('.calc-input__capitalizations .capitalization');
const calcInputDepositPeriod = document.querySelectorAll('.calc-input__deposit_period .deposit_period__val');

depositInput.on('input', function (e) {
    const numInput = this.value.replace(/\s/g, '');
    this.value = (parseFloat(numInput)).toLocaleString('ru-Ru')
})

function clearFieldsResult(e) {
    finalSum.text("")
    allPercents.text("")
    sumAllDeposits.text("")
};
function selectCapit(e) {
    for (let i = 0; i < calcInputCapitalization.length; i++) {
        if (calcInputCapitalization[i].selected) {
            if (calcInputCapitalization[i].dataset.capitalization) {
                if (calcInputCapitalization[i].value == 0) {
                    return 1;
                } else return calcInputCapitalization[i].value;
            }
        }
    }
};
function selectDeposit(e) {
    for (let i = 0; i < calcInputDepositPeriod.length; i++) {
        if (calcInputDepositPeriod[i].selected) {
            if (calcInputDepositPeriod[i].dataset.depositperiod) {
                return calcInputDepositPeriod[i].value;
            }
        }
    }
};
function initialSumTest(sum) {
    if (sum.length > 5) {
        // `.0`
        console.log(123);
    }
};
function pushResult(finalSumVal, allPercentsVal, sumAllDepositsVal) {
    finalSum.append(finalSumVal.toLocaleString('ru', { maximumFractionDigits: 2, minimumFractionDigits: 2 }));
    allPercents.append(allPercentsVal.toLocaleString('ru', { maximumFractionDigits: 2, minimumFractionDigits: 2 }));
    sumAllDeposits.append(sumAllDepositsVal.toLocaleString('ru', { maximumFractionDigits: 2, minimumFractionDigits: 2 }));
};

calcDepositBtn.on('click', function (e) {
    clearFieldsResult();
    const initialSum = parseFloat($('.calc-input__sum').val().replace(/\s/g, ""));
    const deadlines = parseFloat($('.calc-input__deadlines').val().replace(/\s/g, ""));
    const bet = (parseFloat($('.calc-input__bet').val().replace(/\s/g, "")) / 100);
    const capitalization = selectCapit();
    const addDeposit = parseFloat($('.calc-input__adds-deposit').val().replace(/\s/g, ""));
    const addDepositOption = selectDeposit();

    // Основаная формула finalSumVal готова. Настроить deadlines и она будет работаь корректно.
    const finalSumVal = Math.floor(Math.pow(initialSum * (1 + bet / capitalization), deadlines * capitalization));
    const allPercentsVal = 'no done';
    const sumAllDepositsVal = 'no done';

    pushResult(finalSumVal, allPercentsVal, sumAllDepositsVal)
});

//
//
//
//
//
// Нужно подставить корректные значения процентов и т.п. (скоро допишу)