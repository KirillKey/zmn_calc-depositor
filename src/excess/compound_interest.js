var result_block = `<hr>
<div class="compound-interest__result_result">
						<div class="first_result_block_item">
							<div class="result_block_item">
								<div class="item_label" id="result_type_text">Итоговая сумма:</div>
								<div class="result_type"></div>
							</div>
						</div>
						<div class="result_block_item" id="result_sum_shadow">
							<div class="item_label">Итоговая сумма:</div>
							<div class="result_sum"></div>
						</div>
						<div class="result_block_item">
							<div class="item_label">Начисленно процентов:</div>
							<div class="result_percent"></div>
						</div>
						<div class="result_block_item">
							<div class="item_label">Сумма всех взносов:</div>
							<div class="result_deposit"></div>
						</div>
					</div>
					</div>
`;
var result_params = {
	total_sum: 0,
	total_percent: 0,
	total_deposit: 0,
	periodic_vklad: 0,
	start_deposit: 0,
	total_srok: "",
}
var input = {
	type: "profit",
	start_capital: 0,
	time_invest: 0,
	stavka: 0,
	periodic_deposit: 0,
	periodic_deposit_inflation: 0,
	end_month: true,
	target: 0,
	inflation: 0,
	inflation_enable: false,
	periodic_deposit_period: 1,
	capitalization: "no",
	report_period: "months",
	report_view: "graph",
	url: "",
}
class TableData {
	sum_calc = 0;
	sum_table = 0;
	percent = 0;
	percent_sum = 0;
	periodic_deposit = 0;
	periodic_deposit_sum = 0;
}
data = [];
data_year = [];

$(function () {
	$('.calculate').on('click', function () {
		if (!CreateInputData()) return;
		scrollToResult();
		switch (input.type) {
			case "profit":
			case "period":
				switch (input.capitalization) {
					case "no":
						capitalization_no();
						break;
					case "day":
						capitalization_day();
						break;
					case "month":
						capitalization_month();
						break;
					case "quarter":
						capitalization_quarter();
						break;
					case "half_year":
						capitalization_half_year();
						break;
					case "year":
						capitalization_year();
						break;
				}
				break;
			case "deposit":
				start_capital();
				break;
			case "addition":
				periodic_deposit();
				break;
		}
		create_data_year();
		create_result_block();
		if (input.report_view == "graph") create_chart();
		if (input.report_view == "table") create_table();
	});
	$('.compound-interest__wrapper [name=purpose]').on('input', filters);
	$('.compound-interest__wrapper [name=start_capital]').on('input', filters);
	$('.compound-interest__wrapper [name=periodic-deposit]').on('input', filters_deposit);
	$('.compound-interest__wrapper [name=stavka]').on('input', filters_percent);
	$('.compound-interest__wrapper [name=srok_year]').on('input', filters_data);
	$('.compound-interest__wrapper [name=srok_month]').on('input', filters_data);
	$('.compound-interest__wrapper [name=inflation]').on('input', filters_percent);
	$('.compound-interest__wrapper [name=inflation_enable]').on('input', function () {
		if ($(this).prop("checked")) $('.compound-interest__item-input_inflation').css('display', 'block');
		else $('.compound-interest__item-input_inflation').css('display', 'none');
	});
	$('.compound-interest__wrapper [name=type]').on('input', function () {
		switch ($('.compound-interest__wrapper [name=type]:checked').val()) {
			case "profit":
				$('.compound-interest__item_target').css('display', 'none');
				$('.compound-interest__item_capital').css('display', 'flex');
				$('.compound-interest__item_time').css('display', 'flex');
				$('.compound-interest__wrapper [name=periodic-deposit]').css('display', 'unset');
				$('.compound-interest__wrapper [name=periodic-deposit]').trigger('input');
				break;
			case "deposit":
				$('.compound-interest__item_target').css('display', 'flex');
				$('.compound-interest__item_capital').css('display', 'none');
				$('.compound-interest__item_time').css('display', 'flex');
				$('.compound-interest__wrapper [name=periodic-deposit]').css('display', 'unset');
				$('.compound-interest__wrapper [name=periodic-deposit]').trigger('input');
				break;
			case "period":
				$('.compound-interest__item_target').css('display', 'flex');
				$('.compound-interest__item_capital').css('display', 'flex');
				$('.compound-interest__item_time').css('display', 'none');
				$('.compound-interest__wrapper [name=periodic-deposit]').css('display', 'unset');
				$('.compound-interest__wrapper [name=periodic-deposit]').trigger('input');
				break;
			case "addition":
				$('.compound-interest__item_target').css('display', 'flex');
				$('.compound-interest__item_capital').css('display', 'flex');
				$('.compound-interest__item_time').css('display', 'flex');
				$('.compound-interest__wrapper [name=periodic-deposit]').css('display', 'none');
				$('.compound-interest__item_shadow').css('display', 'block');
				break;
		}
	});
	$('.compound-interest__main input').on('dblclick', function (event) {
		$(this).select();
	});
	getParams();
});

function getParams() {

}
function CalcStart() {
	$('.calculate').trigger('click');

}
function scrollToResult() {
	$('html, body').animate({
		scrollTop: $('.compound-interest__result').offset().top
	}, {
		duration: 370,
		easing: "linear"
	});
}


function CreateInputData() {
	var result = true;
	var set_focuse = false;
	//
	// вычислить
	//
	input.type = $('.compound-interest__wrapper [name=type]:checked').val();

	//
	// ваша цель
	//
	input.target = $('.compound-interest__wrapper [name=purpose]').val().replaceAll(' ', '');
	input.target = parseFloat(input.target);
	if (input.type != 'profit') {
		if (isNaN(input.target) || input.target <= 0) {
			$('.compound-interest__wrapper [name=purpose]').css('box-shadow', '0 0 5px 2px red');
			$('.compound-interest__wrapper [name=purpose]').focus();
			$('.compound-interest__item_target .compound-interest__item-input').append('<div class="tooltip_input">Пожалуйста, введите значение</div>');
			setTimeout(() => $('.tooltip_input').animate({ opacity: 0 }, 400, function () { $(this).remove() }), 3000);
			set_focuse = true;
			result = false;
		}
		else {
			$('.compound-interest__wrapper [name=purpose]').css('box-shadow', 'none');
		}
	}

	//
	// стартовый капитал
	//
	input.start_capital = $('.compound-interest__wrapper [name=start_capital]').val().replaceAll(' ', '');
	input.start_capital = parseFloat(input.start_capital);
	if (isNaN(input.start_capital)) {
		input.start_capital = 0;
		$('.compound-interest__wrapper [name=start_capital]').val('0');
	}

	//
	// срок инвестирования
	//
	var srok = $('.compound-interest__wrapper [name=srok_year]').val();
	srok = parseInt(srok);
	if (isNaN(srok)) srok = 0;
	input.time_invest = srok * 12;
	srok = $('.compound-interest__wrapper [name=srok_month]').val();
	srok = parseInt(srok);
	if (isNaN(srok)) srok = 0;
	input.time_invest += srok;
	if (input.type != 'period') {
		if (isNaN(input.time_invest) || input.time_invest <= 0) {
			$('.compound-interest__item_time .compound-interest__item-input').css('box-shadow', '0 0 5px 2px red');
			if (!set_focuse) {
				$('.compound-interest__wrapper [name=srok_year]').focus();
				$('.compound-interest__item_time .compound-interest__item-input').append('<div class="tooltip_input">Пожалуйста, введите значение</div>');
				setTimeout(() => $('.tooltip_input').animate({ opacity: 0 }, 400, function () { $(this).remove() }), 3000);
			}
			result = false;
		}
		else {
			$('.compound-interest__item_time .compound-interest__item-input').css('box-shadow', 'none');
		}
	}

	//
	// ставка
	//
	input.stavka = $('.compound-interest__wrapper [name=stavka]').val();
	input.stavka = parseFloat(input.stavka);
	if (isNaN(input.stavka)) input.stavka = 0;
	if (input.stavka > 500) input.stavka = 500;
	$('.compound-interest__wrapper [name=stavka]').val(input.stavka);

	//
	// капитализация
	//
	input.capitalization = $('.compound-interest__wrapper [name=capitalization]').val();

	//
	// дополнительные вложения
	//
	input.periodic_deposit = $('.compound-interest__wrapper [name=periodic-deposit]').val().replaceAll(' ', '');
	input.periodic_deposit = parseFloat(input.periodic_deposit);
	if (isNaN(input.periodic_deposit)) {
		input.periodic_deposit = 0;
		$('.compound-interest__wrapper [name=periodic-deposit]').val('0');
	}

	//
	// период дополнительных вложений
	//
	input.periodic_deposit_period = $('.compound-interest__wrapper [name=periodic-deposit_period]').val();

	//
	// время внесения денег
	//
	if ($('.compound-interest__wrapper [name=end_month]:checked').val() == "begin") input.end_month = false;
	else input.end_month = true;

	//
	// инфляция
	//
	if ($('.compound-interest__wrapper [name=inflation_enable]').prop("checked")) {
		input.inflation_enable = true;
		input.inflation = $('.compound-interest__wrapper [name=inflation]').val();
		input.inflation = parseFloat(input.inflation);
		if (isNaN(input.inflation)) input.inflation = 0;
		if (input.inflation > 500) input.inflation = 500;
		$('.compound-interest__wrapper [name=inflation]').val(input.inflation);
		input.inflation = input.inflation / 100;
	}
	else input.inflation_enable = false;

	if (input.report_period != "years") input.report_period = "months";
	if (input.report_view != "table") input.report_view = "graph";
	input.url = "";

	return result;
}
function SetInputData() {
	switch (input.type) {
		case "profit":
			$('.compound-interest__wrapper [value=profit]').prop("checked", true);
			break;
		case "deposit":
			$('.compound-interest__wrapper [value=deposit]').prop("checked", true);
			break;
		case "period":
			$('.compound-interest__wrapper [value=period]').prop("checked", true);
			break;
		case "addition":
			$('.compound-interest__wrapper [value=addition]').prop("checked", true);
			break;
	}
	$('.compound-interest__wrapper [name=purpose]').val(input.target);
	$('.compound-interest__wrapper [name=purpose]').trigger('input');

	$('.compound-interest__wrapper [name=start_capital]').val(input.start_capital);
	$('.compound-interest__wrapper [name=start_capital]').trigger('input');

	input.time_invest = parseInt(input.time_invest);
	if (isNaN(input.time_invest)) input.time_invest = 0;
	var dt = Math.floor(input.time_invest / 12);
	$('.compound-interest__wrapper [name=srok_year]').val(dt);
	dt = input.time_invest % 12;
	$('.compound-interest__wrapper [name=srok_month]').val(dt);
	$('.compound-interest__wrapper [name=srok_year]').trigger('input');
	$('.compound-interest__wrapper [name=srok_month]').trigger('input');

	$('.compound-interest__wrapper [name=stavka]').val(input.stavka);
	$('.compound-interest__wrapper [name=stavka]').trigger('input');

	$('.compound-interest__wrapper [name=capitalization]').val(input.capitalization);
	if ($('.compound-interest__wrapper [name=capitalization]').val() == null) {
		$('.compound-interest__wrapper [name=capitalization]').val("no");
	}

	if (parseFloat(input.periodic_deposit) > 0) $('.compound-interest__item_shadow').css('display', 'block');
	$('.compound-interest__wrapper [name=periodic-deposit]').val(input.periodic_deposit);
	$('.compound-interest__wrapper [name=periodic-deposit]').trigger('input');

	$('.compound-interest__wrapper [name=periodic-deposit_period]').val(input.periodic_deposit_period);
	if ($('.compound-interest__wrapper [name=periodic-deposit_period]').val() == null) {
		$('.compound-interest__wrapper [name=periodic-deposit_period]').val("1");
	}

	if (input.end_month.toLowerCase() == "true") $('.compound-interest__wrapper [value=end]').prop("checked", true);
	if (input.end_month.toLowerCase() == "false") $('.compound-interest__wrapper [value=begin]').prop("checked", true);

	$('.compound-interest__wrapper [name=inflation]').val(input.inflation);
	$('.compound-interest__wrapper [name=inflation]').trigger('input');

	if (input.inflation_enable.toLowerCase() == "true") $('.compound-interest__wrapper [name=inflation_enable]').prop("checked", true);
	else $('.compound-interest__wrapper [name=inflation_enable]').prop("checked", false);
	$('.compound-interest__wrapper [name=inflation_enable]').trigger('input');

	if (input.report_period != "years") input.report_period == "months";
	if (input.report_view != "table") input.report_view == "graph";

	input.url = "";
}
function filters() {
	var data = this.value;
	$('.tooltip_input').animate({ opacity: 0 }, 100, function () { $(this).remove() });
	data = data.replace(/[^0-9\.,]/g, '');
	data = data.replace(/[,]/, '.');
	data = data.replace(/[.]+/, '.');
	if (data == ',') data = '';
	var fl = false;
	var cnt = 0;
	for (var i = 0; i < data.length; i++) {
		if (fl) {
			cnt++;
			if (cnt > 2) {
				data = data.slice(0, i);
				break;
			}
		}
		if (data[i] == '.') {
			if (fl) {
				data = data.slice(0, i);
				break;
			}
			else fl = true;
		}
	}
	if (parseFloat(data) > 100000000000000) data = "100000000000000";
	data = data.replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1 ");
	this.value = data;
}
function filters_deposit() {
	var data = this.value;
	data = data.replace(/[^0-9\.,]/g, '');
	data = data.replace(/[,]/, '.');
	data = data.replace(/[.]+/, '.');
	if (data == ',') data = '';
	var fl = false;
	var cnt = 0;
	for (var i = 0; i < data.length; i++) {
		if (fl) {
			cnt++;
			if (cnt > 2) {
				data = data.slice(0, i);
				break;
			}
		}
		if (data[i] == '.') {
			if (fl) {
				data = data.slice(0, i);
				break;
			}
			else fl = true;
		}
	}
	var depo = parseFloat(data);
	if (depo > 0) {
		$('.compound-interest__item_shadow').slideDown(300);
	}
	else {
		$('.compound-interest__item_shadow').slideUp(300);
	}
	if (depo > 100000000000000) data = "100000000000000";
	data = data.replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1 ");
	this.value = data;
}
function filters_percent() {
	var data = this.value;
	data = data.replace(/[^0-9\.,]/g, '');
	data = data.replace(/[,]/, '.');
	data = data.replace(/[.]+/, '.');
	if (data == ',') data = '';
	var fl = false;
	var cnt = 0;
	for (var i = 0; i < data.length; i++) {
		if (fl) {
			cnt++;
			if (cnt > 2) {
				data = data.slice(0, i);
				break;
			}
		}
		if (data[i] == '.') {
			if (fl) {
				data = data.slice(0, i);
				break;
			}
			else fl = true;
		}
	}
	if (parseFloat(data) > 500) data = "500";
	data = data.replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1 ");
	this.value = data;
}
function filters_data() {
	$('.tooltip_input').animate({ opacity: 0 }, 100, function () { $(this).remove() });
	var data = this.value;
	data = data.replace(/[^0-9]/g, '');
	if (this.name == "srok_year") {
		if (parseFloat(data) > 200) data = "200";
	}
	if (this.name == "srok_month") {
		if (parseFloat(data) > 60) data = "60";
	}
	this.value = data;
}


function capitalization_no() {
	var result = 0;
	data = [];
	input.periodic_deposit_inflation = input.periodic_deposit;
	var P = input.periodic_deposit;
	var r = input.stavka / (100 * 12);

	var TD_calc = new TableData();
	TD_calc.sum_calc = input.start_capital;
	TD_calc.periodic_deposit = input.periodic_deposit;
	TD_calc.percent = 0;

	if (input.type == "period") input.time_invest = 12000;

	for (let i = 1; i <= input.time_invest; i++) {
		var TD = new TableData();
		if (input.inflation_enable) {
			if (((i - 1) % 12 == 0) && (i > 1)) {
				input.periodic_deposit_inflation = input.periodic_deposit_inflation * (1 + input.inflation);
			}
		}
		TD.periodic_deposit = periodic_deposit_correct_inflation(i);
		P = TD_calc.sum_calc;
		if (!input.end_month) P += TD.periodic_deposit;
		TD.percent = P * (1 + r) - P;

		TD.sum_calc = TD_calc.sum_calc + TD.periodic_deposit;
		TD_calc.periodic_deposit_sum += TD.periodic_deposit;
		TD_calc.sum_calc = TD.sum_calc;
		TD_calc.percent_sum += TD.percent;
		TD.periodic_deposit_sum = TD_calc.periodic_deposit_sum;
		TD.percent_sum = TD_calc.percent_sum;
		TD.sum_table = TD.sum_calc + TD.percent_sum;
		result = TD.sum_table;

		data.push(TD);
		if (input.type == "period") {
			if (TD.sum_table >= input.target) {
				input.time_invest = i;
				return result;
			}
		}
	}
	return result;
}
function capitalization_day() {
	var result = 0;
	data = [];
	input.periodic_deposit_inflation = input.periodic_deposit;
	var P = input.periodic_deposit;
	var r = input.stavka / (100 * 12);
	var n = 365.25 / 12;

	var TD_main = new TableData();
	TD_main.sum_calc = input.start_capital;
	TD_main.periodic_deposit = input.periodic_deposit;
	TD_main.percent = 0;

	if (input.type == "period") input.time_invest = 12000;

	for (let i = 1; i <= input.time_invest; i++) {
		var TD = new TableData();
		if (input.inflation_enable) {
			if (((i - 1) % 12 == 0) && (i > 1)) {
				input.periodic_deposit_inflation = input.periodic_deposit_inflation * (1 + input.inflation);
			}
		}
		TD.periodic_deposit = periodic_deposit_correct_inflation(i);
		P = TD_main.sum_calc;
		if (!input.end_month) P += TD.periodic_deposit;
		TD.percent = P * (Math.pow((1 + (r / n)), n)) - P;

		TD.sum_calc = TD_main.sum_calc + TD.percent + TD.periodic_deposit;
		TD.sum_table = TD.sum_calc;
		TD_main.periodic_deposit_sum += TD.periodic_deposit;
		TD_main.sum_calc = TD.sum_calc;
		TD_main.percent_sum += TD.percent;
		TD.periodic_deposit_sum = TD_main.periodic_deposit_sum;
		TD.percent_sum = TD_main.percent_sum;
		result = TD.sum_table;
		data.push(TD);

		if (input.type == "period") {
			if (TD.sum_table >= input.target) {
				input.time_invest = i;
				return result;
			}
		}
	}
	return result;
}
function capitalization_month() {
	var result = 0;
	data = [];
	input.periodic_deposit_inflation = input.periodic_deposit;
	var P = input.periodic_deposit;
	var r = input.stavka / (100 * 12);

	var TD_main = new TableData();
	TD_main.sum_calc = input.start_capital;
	TD_main.periodic_deposit = input.periodic_deposit;
	TD_main.percent = 0;

	if (input.type == "period") input.time_invest = 12000;

	for (let i = 1; i <= input.time_invest; i++) {
		var TD = new TableData();
		if (input.inflation_enable) {
			if (((i - 1) % 12 == 0) && (i > 1)) {
				input.periodic_deposit_inflation = input.periodic_deposit_inflation * (1 + input.inflation);
			}
		}
		TD.periodic_deposit = periodic_deposit_correct_inflation(i);
		P = TD_main.sum_calc;
		if (!input.end_month) P += TD.periodic_deposit;
		TD.percent = P * (1 + r) - P;

		TD.sum_calc = TD_main.sum_calc + TD.percent + TD.periodic_deposit;
		TD.sum_table = TD.sum_calc;
		TD_main.periodic_deposit_sum += TD.periodic_deposit;
		TD_main.sum_calc = TD.sum_calc;
		TD_main.percent_sum += TD.percent;
		TD.periodic_deposit_sum = TD_main.periodic_deposit_sum;
		TD.percent_sum = TD_main.percent_sum;
		result = TD.sum_table;

		data.push(TD);

		if (input.type == "period") {
			if (TD.sum_table >= input.target) {
				input.time_invest = i;
				return result;
			}
		}
	}
	return result;
}
function capitalization_quarter() {
	var result = 0;
	data = [];
	input.periodic_deposit_inflation = input.periodic_deposit;
	var P = input.periodic_deposit;
	var r = input.stavka / (100 * 12);

	var TD_main = new TableData();
	TD_main.sum_calc = input.start_capital;
	TD_main.periodic_deposit = input.periodic_deposit;
	TD_main.percent = 0;

	if (input.type == "period") input.time_invest = 12000;

	for (let i = 1; i <= input.time_invest; i++) {
		var TD = new TableData();
		if (input.inflation_enable) {
			if (((i - 1) % 12 == 0) && (i > 1)) {
				input.periodic_deposit_inflation = input.periodic_deposit_inflation * (1 + input.inflation);
			}
		}
		TD.periodic_deposit = periodic_deposit_correct_inflation(i);
		P = TD_main.sum_calc;
		if (!input.end_month) P += TD.periodic_deposit;
		TD.percent = P * (1 + r) - P;

		TD.sum_calc = TD_main.sum_calc + TD.periodic_deposit;
		TD_main.percent += TD.percent;
		TD.sum_table = TD.sum_calc + TD_main.percent;
		if (i % 3 == 0) {
			TD.sum_calc += TD_main.percent;
			TD_main.percent = 0;
		}
		TD_main.periodic_deposit_sum += TD.periodic_deposit;
		TD_main.sum_calc = TD.sum_calc;
		TD_main.percent_sum += TD.percent;
		TD.periodic_deposit_sum = TD_main.periodic_deposit_sum;
		TD.percent_sum = TD_main.percent_sum;
		result = TD.sum_table;

		data.push(TD);

		if (input.type == "period") {
			if (TD.sum_table >= input.target) {
				input.time_invest = i;
				return result;
			}
		}
	}
	return result;
}
function capitalization_half_year() {
	var result = 0;
	data = [];
	input.periodic_deposit_inflation = input.periodic_deposit;
	var P = input.periodic_deposit;
	var r = input.stavka / (100 * 12);

	var TD_main = new TableData();
	TD_main.sum_calc = input.start_capital;
	TD_main.periodic_deposit = input.periodic_deposit;
	TD_main.percent = 0;

	if (input.type == "period") input.time_invest = 12000;

	for (let i = 1; i <= input.time_invest; i++) {
		var TD = new TableData();
		if (input.inflation_enable) {
			if (((i - 1) % 12 == 0) && (i > 1)) {
				input.periodic_deposit_inflation = input.periodic_deposit_inflation * (1 + input.inflation);
			}
		}
		TD.periodic_deposit = periodic_deposit_correct_inflation(i);
		P = TD_main.sum_calc;
		if (!input.end_month) P += TD.periodic_deposit;
		TD.percent = P * (1 + r) - P;

		TD.sum_calc = TD_main.sum_calc + TD.periodic_deposit;
		TD_main.percent += TD.percent;
		TD.sum_table = TD.sum_calc + TD_main.percent;
		if (i % 6 == 0) {
			TD.sum_calc += TD_main.percent;
			TD_main.percent = 0;
		}
		TD_main.periodic_deposit_sum += TD.periodic_deposit;
		TD_main.sum_calc = TD.sum_calc;
		TD_main.percent_sum += TD.percent;
		TD.periodic_deposit_sum = TD_main.periodic_deposit_sum;
		TD.percent_sum = TD_main.percent_sum;
		result = TD.sum_table;

		data.push(TD);

		if (input.type == "period") {
			if (TD.sum_table >= input.target) {
				input.time_invest = i;
				return result;
			}
		}
	}
	return result;
}
function capitalization_year() {
	var result = 0;
	data = [];
	input.periodic_deposit_inflation = input.periodic_deposit;
	var P = input.periodic_deposit;
	var r = input.stavka / (100 * 12);

	var TD_main = new TableData();
	TD_main.sum_calc = input.start_capital;
	TD_main.periodic_deposit = input.periodic_deposit;
	TD_main.percent = 0;

	if (input.type == "period") input.time_invest = 12000;

	for (let i = 1; i <= input.time_invest; i++) {
		var TD = new TableData();
		if (input.inflation_enable) {
			if (((i - 1) % 12 == 0) && (i > 1)) {
				input.periodic_deposit_inflation = input.periodic_deposit_inflation * (1 + input.inflation);
			}
		}
		TD.periodic_deposit = periodic_deposit_correct_inflation(i);
		P = TD_main.sum_calc;
		if (!input.end_month) P += TD.periodic_deposit;
		TD.percent = P * (1 + r) - P;

		TD.sum_calc = TD_main.sum_calc + TD.periodic_deposit;
		TD_main.percent += TD.percent;
		TD.sum_table = TD.sum_calc + TD_main.percent;
		if (i % 12 == 0) {
			TD.sum_calc += TD_main.percent;
			TD_main.percent = 0;
		}
		TD_main.periodic_deposit_sum += TD.periodic_deposit;
		TD_main.sum_calc = TD.sum_calc;
		TD_main.percent_sum += TD.percent;
		TD.periodic_deposit_sum = TD_main.periodic_deposit_sum;
		TD.percent_sum = TD_main.percent_sum;
		result = TD.sum_table;

		data.push(TD);

		if (input.type == "period") {
			if (TD.sum_table >= input.target) {
				input.time_invest = i;
				return result;
			}
		}
	}
	return result;
}


function start_capital() {
	input.target = Math.round(input.target);
	var vklad = 0;
	var add_count = 0;
	input.start_capital = 2;
	while (true) {
		if (input.start_capital >= input.target) break;
		input.start_capital *= 2;
	}
	var add = Math.round(input.start_capital / 2);
	while (true) {
		switch (input.capitalization) {
			case "no":
				vklad = Math.round(capitalization_no());
				break;
			case "day":
				vklad = Math.round(capitalization_day());
				break;
			case "month":
				vklad = Math.round(capitalization_month());
				break;
			case "quarter":
				vklad = Math.round(capitalization_quarter());
				break;
			case "half_year":
				vklad = Math.round(capitalization_half_year());
				break;
			case "year":
				vklad = Math.round(capitalization_year());
				break;
		}
		if (input.start_capital == 0) break;
		if (vklad > input.target) {
			if (vklad - input.target < 10) break;
			input.start_capital -= add;
			if (input.start_capital < 0) {
				input.start_capital = 0;
			}
		}
		else {
			if (input.target - vklad < 10) break;
			input.start_capital += add;
			if (input.start_capital < 0) {
				input.start_capital = 0;
			}
		}
		add = Math.floor(add / 2);
		if (add < 1) {
			add_count++;
			if (add_count >= 10) break;
			add = 1;
		}
	}
	if (vklad < input.target) {
		input.start_capital++;
		switch (input.capitalization) {
			case "no":
				capitalization_no();
				break;
			case "day":
				capitalization_day();
				break;
			case "month":
				capitalization_month();
				break;
			case "quarter":
				capitalization_quarter();
				break;
			case "half_year":
				capitalization_half_year();
				break;
			case "year":
				capitalization_year();
				break;
		}
	}
}


function periodic_deposit() {
	if (input.capitalization == "no") {
		input.periodic_deposit = Math.round(start_vklad_no());
	}
	else {
		input.periodic_deposit = Math.round(start_vklad_capitalization());
	}
	input.target = Math.round(input.target);
	var vklad = 0;
	var add_count = 0;
	var add = Math.round(input.periodic_deposit / 2);
	while (true) {
		switch (input.capitalization) {
			case "no":
				vklad = Math.round(capitalization_no());
				break;
			case "day":
				vklad = Math.round(capitalization_day());
				break;
			case "month":
				vklad = Math.round(capitalization_month());
				break;
			case "quarter":
				vklad = Math.round(capitalization_quarter());
				break;
			case "half_year":
				vklad = Math.round(capitalization_half_year());
				break;
			case "year":
				vklad = Math.round(capitalization_year());
				break;
		}
		if (input.periodic_deposit == 0) break;
		if (vklad > input.target) {
			if (vklad - input.target < 10) break;
			input.periodic_deposit -= add;
			if (input.periodic_deposit < 0) {
				input.periodic_deposit = 0;
			}
		}
		else {
			if (input.target - vklad < 10) break;
			input.periodic_deposit += add;
			if (input.periodic_deposit < 0) {
				input.periodic_deposit = 0;
			}
		}
		add = Math.floor(add / 2);
		if (add < 1) {
			add_count++;
			if (add_count >= 10) break;
			add = 1;
		}
	}
	if (vklad < input.target) {
		input.periodic_deposit++;
		switch (input.capitalization) {
			case "no":
				capitalization_no();
				break;
			case "day":
				capitalization_day();
				break;
			case "month":
				capitalization_month();
				break;
			case "quarter":
				capitalization_quarter();
				break;
			case "half_year":
				capitalization_half_year();
				break;
			case "year":
				capitalization_year();
				break;
		}
	}
}


function start_vklad_no() {
	var r = input.stavka / (100 * 12);
	var r1 = 0;
	var N = input.time_invest;
	var n = 0;
	n = N % input.periodic_deposit_period;
	r1 = r * n;
	N = Math.round((input.time_invest - n) / input.periodic_deposit_period);
	r = r * input.periodic_deposit_period;
	return (input.target - input.start_capital * (1 + r * N + r1)) / (N * r * (N - 1) / 2 + N + N * r1);
}
function start_vklad_capitalization() {
	var r = input.stavka / (100 * 12);
	var N = Math.round(input.time_invest / input.periodic_deposit_period);
	r = r * input.periodic_deposit_period;
	return (input.target - input.start_capital * (Math.pow((1 + r), N))) / ((Math.pow((1 + r), N) - 1) * (1 / r));
}


function periodic_deposit_correct_inflation(i) {
	var result = 0;
	if (i % input.periodic_deposit_period == 0) {
		result = input.periodic_deposit_inflation;
	}
	return result;
}


function create_data_year() {
	data_year = [];
	var TD_calc = new TableData();
	for (var i = 0; i < data.length; i++) {
		not_full = true;
		TD_calc.percent += data[i].percent;
		TD_calc.periodic_deposit += data[i].periodic_deposit;
		if (((i + 1) % 12 == 0) || (i + 1 == data.length)) {
			TD_calc.sum_table = data[i].sum_table;
			TD_calc.percent_sum = data[i].percent_sum;
			TD_calc.periodic_deposit_sum = data[i].periodic_deposit_sum;
			data_year.push(TD_calc);
			TD_calc = new TableData();
		}
	}
}
function create_result_block() {
	$('.compound-interest__result').html(result_block);
	set_result_params();
	switch ($('.compound-interest__wrapper [name=type]:checked').val()) {
		case "profit":
			$('#result_type_text').text('Итоговая сумма:');
			$('.result_type').text(result_params.total_sum);
			$('#result_sum_shadow').remove();
			break;
		case "deposit":
			$('#result_type_text').text('Начальная сумма:');
			$('.result_type').text(result_params.start_deposit);
			break;
		case "period":
			$('#result_type_text').text('Срок достижения цели:');
			$('.result_type').text(result_params.total_srok);
			break;
		case "addition":
			$('#result_type_text').text('Регулярные взносы:');
			$('.result_type').text(result_params.periodic_vklad);
			break;
	}
	$('.result_sum').text(result_params.total_sum);
	$('.result_percent').text(result_params.total_percent);
	$('.result_deposit').text(result_params.total_deposit);

	if (input.report_period.toLowerCase() == "years") $('.compound-interest__wrapper [value=years]').prop("checked", true);
	if (input.report_view.toLowerCase() == "table") $('.compound-interest__wrapper [value=table]').prop("checked", true);
	$('.compound-interest__wrapper [name=report-period]').on('input', function () {
		input.report_period = $('.compound-interest__wrapper [name=report-period]:checked').val();
		if (input.report_view == "graph") create_chart();
		if (input.report_view == "table") create_table();
	})
	$('.compound-interest__wrapper [name=report-view]').on('input', function () {
		input.report_view = $('.compound-interest__wrapper [name=report-view]:checked').val();
		if (input.report_view == "graph") create_chart();
		if (input.report_view == "table") create_table();
	})
	$('.sl_copy_button').on('click', function (event) {
		event.preventDefault();
		let text = $(this).prev('textarea');
		let content = text.val();
		text.css("background-color", "grey");
		setTimeout(() => text.css("background-color", "#f2f2f2"), 140);
		text.select();
		document.execCommand("copy");
		text.val('');
		text.val(content);
	});
}
function set_result_params() {
	if (data.length > 0) {

		result_params.total_sum = data[data.length - 1].sum_table.toLocaleString('ru-RU', { maximumFractionDigits: 2, minimumFractionDigits: 2 })
		if (data[data.length - 1].sum_table > 1000000000000000000000) result_params.total_sum = data[data.length - 1].sum_table;

		result_params.total_percent = data[data.length - 1].percent_sum.toLocaleString('ru-RU', { maximumFractionDigits: 2, minimumFractionDigits: 2 })
		if (data[data.length - 1].percent_sum > 1000000000000000000000) result_params.total_percent = data[data.length - 1].percent_sum;

		result_params.total_deposit = data[data.length - 1].periodic_deposit_sum.toLocaleString('ru-RU', { maximumFractionDigits: 2, minimumFractionDigits: 2 })
		if (data[data.length - 1].periodic_deposit_sum > 1000000000000000000000) result_params.total_deposit = data[data.length - 1].periodic_deposit_sum;

		result_params.periodic_vklad = input.periodic_deposit.toLocaleString('ru-RU', { maximumFractionDigits: 2, minimumFractionDigits: 2 })
		if (input.periodic_deposit > 1000000000000000000000) result_params.periodic_vklad = input.periodic_deposit;

		result_params.start_deposit = input.start_capital.toLocaleString('ru-RU', { maximumFractionDigits: 2, minimumFractionDigits: 2 })
		if (input.start_capital > 1000000000000000000000) result_params.start_deposit = input.start_capital;

		result_params.total_srok = "";
		var dt = Math.floor(input.time_invest / 12);
		if (dt > 0) {
			result_params.total_srok = dt.toString() + get_year_text(dt);
		}
		dt = input.time_invest % 12;
		if (dt > 0) {
			if (result_params.total_srok != "") result_params.total_srok += " ";
			result_params.total_srok += dt.toString() + get_month_text(dt);
		}


		//total_srok: 0,


	}
}
function get_year_text(dt) {
	var result = " лет";
	if ((dt > 4) && (dt < 21)) return " лет";
	var dt_c = dt % 10;
	if ((dt_c > 1) && (dt_c < 5)) return " года";
	if (dt_c == 1) return " год";
	return result;
}
function get_month_text(dt) {
	if (dt == 1) return " месяц";
	if ((dt > 1) && (dt < 5)) return " месяца";
	if ((dt > 4) && (dt < 13)) return " месяцев";
}

function create_table() {
	var columns = ['', 'Вложения', 'Процентный доход', 'Сумма вложений', 'Сумма процентов', 'Конечная сумма'];
	var rows = null;
	if (input.report_period == "months") {
		columns[0] = 'Месяц';
		rows = data;
	}
	if (input.report_period == "years") {
		columns[0] = 'Год';
		rows = data_year;
	}

	var txt = '<table class="compound-interest__result-table"><tr>';
	for (var i = 0; i < columns.length; i++) {
		txt += `<th>${columns[i]}</th>`;
	}
	txt += '</tr>';
	var val = "";
	for (var i = 0; i < rows.length; i++) {

		txt += `<tr title="${creatData(i)}">`;
		txt += `<td>${String(i + 1)}</td>`;

		val = rows[i].periodic_deposit.toLocaleString('ru-RU', { maximumFractionDigits: 2, minimumFractionDigits: 2 })
		if (rows[i].periodic_deposit > 1000000000000000000000) val = rows[i].periodic_deposit;
		txt += `<td>${val}</td>`;

		val = rows[i].percent.toLocaleString('ru-RU', { maximumFractionDigits: 2, minimumFractionDigits: 2 })
		if (rows[i].percent > 1000000000000000000000) val = rows[i].percent;
		txt += `<td>${val}</td>`;

		val = rows[i].periodic_deposit_sum.toLocaleString('ru-RU', { maximumFractionDigits: 2, minimumFractionDigits: 2 })
		if (rows[i].periodic_deposit_sum > 1000000000000000000000) val = rows[i].periodic_deposit_sum;
		txt += `<td>${val}</td>`;

		val = rows[i].percent_sum.toLocaleString('ru-RU', { maximumFractionDigits: 2, minimumFractionDigits: 2 })
		if (rows[i].percent_sum > 1000000000000000000000) val = rows[i].percent_sum;
		txt += `<td>${val}</td>`;

		val = rows[i].sum_table.toLocaleString('ru-RU', { maximumFractionDigits: 2, minimumFractionDigits: 2 })
		if (rows[i].sum_table > 1000000000000000000000) val = rows[i].sum_table;
		txt += `<td>${val}</td>`;

		txt += '</tr>';
	}
	txt += '</table>';
	$('#chart_table_div').html(txt);
}
function create_chart() {


	var c1 = input.start_capital;
	var c2 = 0;
	var c3 = 0;
	var title = "";
	if (input.report_period == "months") {
		title = "месяцы";
		for (var i = 0; i < data.length; i++) {
			c2 = data[i].periodic_deposit_sum;
			c3 = data[i].percent_sum;
		}
	}
	if (input.report_period == "years") {
		title = "годы";
		for (var i = 0; i < data_year.length; i++) {
			c2 = data_year[i].periodic_deposit_sum;
			c3 = data_year[i].percent_sum;
		}
	}

	var options = {
		isStacked: true,
		focusTarget: 'category',
		colors: ['#0E4499', '#3B9224', '#F3863D'],
		legend: { position: 'none' },
		animation: {
			duration: 200,
			easing: 'out',
			startup: true
		},
		vAxis: {
			format: 'short',
		},
		hAxis: {
			slantedText: false,
			maxAlternation: 1,
			title: title,
			titleTextStyle: {
				italic: false
			},
		},
		tooltip: {
			isHtml: true
		},
		height: 500,
	};
}
function createToolTip(i, c1, c2, c3) {
	var date = new Date();
	if (input.report_period == "months") {
		date.setMonth(date.getMonth() + i + 1);
	}
	if (input.report_period == "years") {
		date.setFullYear(date.getFullYear() + i + 1);
	}
	var formatDate = date.toLocaleString('ru', { year: 'numeric', month: 'long' });
	var c1_korr = c1.toLocaleString('ru-RU', { maximumFractionDigits: 2, minimumFractionDigits: 2 });
	if (c1 > 1000000000000000000000) c1_korr = c1;
	var c2_korr = c2.toLocaleString('ru-RU', { maximumFractionDigits: 2, minimumFractionDigits: 2 });
	if (c2 > 1000000000000000000000) c2_korr = c2;
	var c3_korr = c3.toLocaleString('ru-RU', { maximumFractionDigits: 2, minimumFractionDigits: 2 });
	if (c3 > 1000000000000000000000) c3_korr = c3;

	var element = `<div style='padding:10px;white-space:nowrap'>
					<p style='margin:0;padding:0;line-height:1;font-weight:600'>${formatDate}</p>
					<p style='margin:0;padding:0;line-height:1'><span style='color:#7FB43B;font-size:1.5em'>●</span> Доход от процентов: <span style='font-weight:600'>` + c3_korr + `</span></p>
					<p style='margin:0;padding:0;line-height:1'><span style='color:#0000FF;font-size:1.5em'>●</span> Добавленные средства: <span style='font-weight:600'>` + c2_korr + `</span></p>
					<p style='margin:0;padding:0;line-height:1'><span style='color:#000000;font-size:1.5em'>●</span> Собственные средства: <span style='font-weight:600'>` + c1_korr + `</span></p>
					</div>`;
	return element;
}