const depositInput = $('.deposit-calc__input');
const calcDepositBtn = $('.calc-deposit-btn');
const finalSum = $('.deposit__result__out--final-sum');
const allPercents = $('.deposit__result__out--all-percents');
const sumAllDeposits = $('.deposit__result__out--sum-all-deposits');
const calcInputCapitalization = document.querySelectorAll('.calc-input__capitalizations .capitalization');
const calcInputDepositPeriod = document.querySelectorAll('.calc-input__deposit_period .deposit_period__val');

depositInput.on('input', function (e) {
    const numInput = this.value.replace(/\s/g, '');
    if (this.value.length <= 0) {
        this.value = 0;
    } else {
        this.value = (parseFloat(numInput)).toLocaleString('ru')
    }
});
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


function pushResult(finalSumVal, allPercentsVal, sumAllDepositsVal) {
    finalSum.append(finalSumVal.toLocaleString('ru', { maximumFractionDigits: 2, minimumFractionDigits: 2 }));
    allPercents.append(allPercentsVal.toLocaleString('ru', { maximumFractionDigits: 2, minimumFractionDigits: 2 }));
    sumAllDeposits.append(sumAllDepositsVal.toLocaleString('ru', { maximumFractionDigits: 2, minimumFractionDigits: 2 }));
    // console.log(finalSumVal);
// function toFixed(x) {
//   if (Math.abs(x) < 1.0) {
//     var e = parseInt(x.toString().split('e-')[1]);
//     if (e) {
//         x *= Math.pow(10, e - 1);
//     console.log(x);
        
//         x = '0.' + (new Array(e)).join('0') + x.toString().substring(2);
//     console.log(x);

//     }
//   } else {
//     var e = parseInt(x.toString().split('+')[1]);
//     if (e > 20) {
//         e -= 20;
//         x /= Math.pow(10, e);
//     }
//     }
//     console.log(x);
//     // console.log(Number.parseFloat(x).toFixed(0) );
//     return x;
//     }
//     toFixed(finalSumVal)
};

calcDepositBtn.on('click', function (e) {
    clearFieldsResult();
    const initialSum = parseFloat($('.calc-input__sum').val().replace(/\s/g, ""));

    const deadlinesAll = $('.calc-input__deadlines').val().replace(/\s/g, "");
    const deadlinesDays = $('.calc-input__deadline--days').val().replace(/\s/g, "");
    const deadlinesMonth = $('.calc-input__deadline--month').val().replace(/\s/g, "");
    //
    const deadlinesDaysVal = parseInt(deadlinesDays / 365) ;
    const deadlinesMonthVal = parseInt((deadlinesMonth) / 12);

    const bet = (parseFloat($('.calc-input__bet').val().replace(/\s/g, "")) / 100);
    const capitalization = selectCapit();
    const addDeposit = parseFloat($('.calc-input__adds-deposit').val().replace(/\s/g, ""));
    const addDepositOption = selectDeposit();

    // Основаная формула finalSumVal готова. Настроить deadlinesAll и она будет работать корректно.
    // const finalSumVal = Math.pow(initialSum * (1 + bet / capitalization), deadlinesAll * capitalization);
    const finalSumVal = initialSum * Math.pow((1 + bet / capitalization), deadlinesDaysVal * capitalization);
    const allPercentsVal = finalSumVal - initialSum;
    const sumAllDepositsVal = (addDeposit * 12) / addDepositOption;

    pushResult(finalSumVal, allPercentsVal, sumAllDepositsVal)
    // pushResult(finalSumVal / 1e44, allPercentsVal, sumAllDepositsVal)
});