const depositInputAll = $('.deposit-calc__input');
const depositOptionsAll = $('.deposit-calc__select');
const depositCheckboxAll = $('.calc-input__checkbox');
const inputDeadlinesAll = $('.calc-input__deadlines');
const inputDeadlinesDays = $('#input__checkbox--days');
const inputDeadlinesMonth = $('#input__checkbox--month');
depositCheckboxAll[1].checked = true;
const deadlinesDays = $('#calc-input__deadline--days');
const deadlinesMonth = $('#calc-input__deadline--month');
const calcDepositBtn = $('.calc-deposit-btn');
const finalSum = $('.deposit__result__out--final-sum');
const outPercentAll = $('.deposit__result__out--all-percents');
const sumAllDeposits = $('.deposit__result__out--sum-all-deposits');
const calcInputCapitalization = document.querySelectorAll('.calc-input__capitalizations .capitalization');
const calcInputDepositPeriod = document.querySelectorAll('.calc-input__deposit_period .deposit_period__val');

function clearFieldsResult(e) {
    finalSum.text("")
    outPercentAll.text("")
    sumAllDeposits.text("")
};
function checkedDeadline(e) {
    for (let i = 0; i < depositCheckboxAll.length; i++) {
        if (depositCheckboxAll[i].checked) {
            if (depositCheckboxAll[i].dataset.deadlinecheck) {
                depositCheckboxAll[i].checked = false
                return depositCheckboxAll[i];
            }
        } else {
        }
    }
};
function returnCheckDeadline(e) {
    const checkDeadline = checkedDeadline();
    console.log(checkDeadline);
    if (checkDeadline) {
        for (let i = 0; i < inputDeadlinesAll.length; i++) {
            depositCheckboxAll[i].checked = false;
            console.log(depositCheckboxAll[i], '////////////');
            if (checkDeadline.id == inputDeadlinesAll[i].id) {
                depositCheckboxAll[i].checked = true;
                // checkDeadline.checked = true;
                inputDeadlinesAll[i].style.display = 'flex';
            } else {
                inputDeadlinesAll[i].style.display = 'none';
            }
        }
    }
}
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
function pushResult(finalSumVal, outPercentVal, sumAllDepositsVal) {
    finalSum.append(finalSumVal.toLocaleString('ru', { maximumFractionDigits: 2, minimumFractionDigits: 2 }));
    outPercentAll.append(outPercentVal.toLocaleString('ru', { maximumFractionDigits: 2, minimumFractionDigits: 2 }));
    sumAllDeposits.append(sumAllDepositsVal.toLocaleString('ru', { maximumFractionDigits: 2, minimumFractionDigits: 2 }));
};

calculateFunction();
depositInputAll.on('input', function (e) {
    const numInput = this.value.replace(/\s/g, '');
    if (this.value.length <= 0) {
        this.value = 0;
    } else {
        this.value = (parseFloat(numInput)).toLocaleString('ru')
    }
    calculateFunction();
});
depositOptionsAll.on('change', function (e) { calculateFunction() });

function calculateFunction(e) {
        clearFieldsResult();
        const initialSum = parseFloat($('.calc-input__sum').val().replace(/\s/g, ""));
        // const deadlinesDays = $('#calc-input__deadline--days').val().replace(/\s/g, "");
        // const deadlinesMonth = $('#calc-input__deadline--month').val().replace(/\s/g, "");
        const deadlinesDaysV = deadlinesDays.val().replace(/\s/g, "");
        const deadlinesMonthV = deadlinesMonth.val().replace(/\s/g, "");

        
        const deadlinesDaysVal = parseFloat((deadlinesDaysV / 30) / 12);
        const deadlinesMonthVal = parseFloat(deadlinesMonthV / 12);
        const deadlinesAll = parseFloat(deadlinesDaysVal + deadlinesMonthVal);
        returnCheckDeadline(); 

        const bet = (parseFloat($('.calc-input__bet').val().replace(/\s/g, "")) / 100);
        const capitalization = selectCapit();
        const addDeposit = parseFloat($('.calc-input__adds-deposit').val().replace(/\s/g, ""));
        const addDepositOption = selectDeposit();

        const finalSumVal = initialSum * Math.pow((1 + bet / capitalization), deadlinesAll * capitalization);
        const outPercentVal = finalSumVal - initialSum;
        const sumAllDepositsVal = (addDeposit * (deadlinesAll *  12)) / addDepositOption;
        const sumAllDepositsWithDeposit = sumAllDepositsVal * Math.pow((1 + bet / capitalization), deadlinesAll * capitalization);

        const finalSumWithDeposit = finalSumVal + sumAllDepositsWithDeposit;
    
        // формула 'Начислено процентов:' без пополнения вкладов готова.
        // формула 'Начислено процентов:' вместе с поплнением вкладов не готова:
        const outPercentWithDeposit  = outPercentVal;
        // const outPercentWithDeposit =  (finalSumWithDeposit  / (deadlinesAll / capitalization)); 


        pushResult(finalSumWithDeposit, outPercentWithDeposit, sumAllDepositsVal)
};