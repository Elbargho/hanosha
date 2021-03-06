setToDateMax();
setFromDateMax();
let numOfRowsInArchiveTb = 0;
let numOfRowsInChanceTb = 0;
let top1KLots = [];

function getToday() {
	let today = new Date();
	let day = padDate(today.getDate() + '');
	let month = padDate(today.getMonth() + 1 + '');
	let year = today.getFullYear();
	return year + '-' + month + '-' + day;
}

function setToDateMax() {
	let today = getToday();
	let toDate = document.getElementById('toDate');
	toDate.max = today;
	toDate.value = today;
}

function setToDateMin(fromDateVal) {
	let [year, month, day] = fromDateVal.split("-").map(function (x) {
		return parseInt(x);
	});
	if (month >= 11) {
		year += 1;
	}
	month += 2;
	if (month != 12) {
		month %= 12;
	}
	day = padDate(day + '');
	month = padDate(month + '');
	minDate = year + '-' + month + '-' + day;
	document.getElementById("toDate").setAttribute('min', minDate);
}

function twoMonthsShiftDown(date) {
	let [year, month, day] = date;
	month -= 2;
	if (month <= 0) {
		month += 12;
		year -= 1
	}
	day = padDate(day + '');
	month = padDate(month + '');
	maxDate = year + '-' + month + '-' + day;
	return maxDate;
}

function setFromDateMax() {
	let toDate = document.getElementById("toDate").value.split("-").map(function (x) {
		return parseInt(x);
	});
	maxDate = twoMonthsShiftDown(toDate);
	document.getElementById("fromDate").setAttribute('max', maxDate);
}

function padDate(date) {
	if (date.length == 1)
		return '0' + date;
	else
		return date
}

function scrollToDiv(divID) {
	let div = document.getElementById(divID);
	div.scrollIntoView();
}

function shrinkHeader() {
	let content = document.getElementById('content');
	let header = document.getElementById('header');
	header.style.fontSize = '32px';
	header.style.height = '42px';
	document.getElementById("email").style.display = "none";
	headerLogo.style.marginRight = '10px';
	headerLogo.style.textAlign = 'right';
	content.style.paddingTop = '42px';
	for (var i = 1; i <= 3; i++) {
		let icon = document.getElementById("icon" + i);
		icon.style.width = '40px';
	}
}

function expandHeader() {
	let content = document.getElementById('content');
	let header = document.getElementById('header');
	let headerLogo = document.getElementById('headerLogo');
	header.style.fontSize = '72px';
	header.style.height = '100px';
	document.getElementById("email").style.display = "";
	headerLogo.style.marginRight = '300px';
	headerLogo.style.textAlign = null;
	content.style.paddingTop = '100px';
	for (var i = 1; i <= 3; i++) {
		let icon = document.getElementById("icon" + i);
		icon.style.width = '70px';
	}
}

function isInViewport(divID) {
	let div = document.getElementById(divID);
	const rect = div.getBoundingClientRect();
	return (
		rect.top >= 0 &&
		rect.left >= 0 &&
		rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
		rect.right <= (window.innerWidth || document.documentElement.clientWidth)
	);
}

function selectIcon(selected, notSelected1, notSelected2) {
	selected.style.backgroundColor = "#223977";
	notSelected1.style.backgroundColor = null;
	notSelected2.style.backgroundColor = null;
}

window.onscroll = function () {
	let icon1 = document.getElementById("icon1Container");
	let icon2 = document.getElementById("icon2Container");
	let icon3 = document.getElementById("icon3Container");
	if (isInViewport("centerOfSection1")) {
		expandHeader();
		selectIcon(icon1, icon2, icon3);
	} else {
		shrinkHeader();
		if (isInViewport("centerOfSection2")) {
			selectIcon(icon2, icon1, icon3);
		} else {
			selectIcon(icon3, icon1, icon2);
		}
	}
}

function deleteSection3() {
	for (var optNum = 1; optNum <= 15; optNum++) {
		if (document.getElementById('option' + optNum + 'Container') != null) {
			closeStats(optNum);
		}
	}
}

function loadSection2(computeRep = false) {
	let include2 = document.getElementById("include2");
	if (include2.style.display == "none") {
		document.getElementById("icon2Container").style.visibility = "visible";
		include2.style.display = "";
	} else {
		deleteSection3();
	}
	scrollToDiv("section2");
	statsBuilder(computeRep);
}

function statsDiv(optNum, toAppendTo) {
	let chartContainer, data = [],
		dataPoints = [],
		title = "",
		pieContainer, eventListener = 1,
		skipZerros = 0;
	chartContainer = document.createElement('div');
	chartContainer.setAttribute('id', 'chart' + optNum + 'Container');
	chartContainer.setAttribute('class', 'chartContainer');
	if (optNum[0] == "7" && optNum.length == 2) {
		chartContainer.classList.add('pieQuarter');
	}
	toAppendTo.appendChild(chartContainer);
	if (optNum == "7") {
		pieContainer = document.createElement('div');
		pieContainer.setAttribute('class', 'pieContainer');
		toAppendTo.appendChild(pieContainer);
	}
	switch (optNum) {
		case "2":
			data = stats[0];
			break;
		case "3":
			optNum += 1;
			chartContainer.setAttribute('id', 'chart' + optNum + 'Container');
			statsDiv("32", toAppendTo);
			data = stats[1];
			title = "מספרים חמים ביותר במקום הראשון";
			break;
		case "32":
			statsDiv("33", toAppendTo);
			data = stats[2];
			title = "מספרים חמים ביותר במקום השני";
			break;
		case "33":
			statsDiv("34", toAppendTo);
			data = stats[3];
			title = "מספרים חמים ביותר במקום השלישי";
			break;
		case "34":
			statsDiv("35", toAppendTo);
			data = stats[4];
			title = "מספרים חמים ביותר במקום הרביעי";
			break;
		case "35":
			statsDiv("36", toAppendTo);
			data = stats[5];
			title = "מספרים חמים ביותר במקום החמישי";
			break;
		case "36":
			data = stats[6];
			title = "מספרים חמים ביותר במקום השישי";
			break;
		case "4":
			data = stats[7];
			break;
		case "5":
			optNum += 1;
			chartContainer.setAttribute('id', 'chart' + optNum + 'Container');
			statsDiv("52", toAppendTo);
			data = stats[8];
			title = "הפרשי מספרים חמים ביותר בין מקום שני ומקום ראשון";
			break;
		case "52":
			statsDiv("53", toAppendTo);
			data = stats[9];
			title = "הפרשי מספרים חמים ביותר בין מקום שלישי ומקום שני";
			break;
		case "53":
			statsDiv("54", toAppendTo);
			data = stats[10];
			title = "הפרשי מספרים חמים ביותר בין מקום רביעי ומקום שלישי";
			break;
		case "54":
			statsDiv("55", toAppendTo);
			data = stats[11];
			title = "הפרשי מספרים חמים ביותר בין מקום חמישי ומקום רביעי";
			break;
		case "55":
			data = stats[12];
			title = "הפרשי מספרים חמים ביותר בין מקום שישי ומקום חמישי";
			break;
		case "6":
			data = stats[13];
			skipZerros = 1;
			break;
		case "7":
			data = stats[14];
			statsDiv("71", pieContainer);
			break;
		case "71":
			data = stats[15];
			statsDiv("72", toAppendTo);
			title = "במקום הראשון";
			eventListener = 0;
			break;
		case "72":
			data = stats[16];
			statsDiv("73", toAppendTo);
			title = "במקום השני";
			eventListener = 0;
			break;
		case "73":
			data = stats[17];
			statsDiv("74", toAppendTo);
			title = "במקום השלישי";
			eventListener = 0;
			break;
		case "74":
			data = stats[18];
			statsDiv("75", toAppendTo);
			title = "במקום הרביעי";
			eventListener = 0;
			break;
		case "75":
			data = stats[19];
			statsDiv("76", toAppendTo);
			title = "במקום החמישי";
			eventListener = 0;
			break;
		case "76":
			data = stats[20];
			statsDiv("77", toAppendTo);
			title = "במקום השישי";
			eventListener = 0;
			break;
		case "77":
			data = stats[21];
			title = "בסך הכל";
			eventListener = 0;
			break;
		case "8":
			computeRepetition();
			data = numberOfRepetitions;
			break;
		case "9":
			data = stats[22];
			break;
		case "10":
			optNum += 1;
			chartContainer.setAttribute('id', 'chart' + optNum + 'Container');
			statsDiv("102", toAppendTo);
			data = stats[23];
			title = "מספרים שלא הופיעו לאחרונה במקום הראשון";
			break;
		case "102":
			statsDiv("103", toAppendTo);
			data = stats[24];
			title = "מספרים שלא הופיעו לאחרונה במקום השני";
			break;
		case "103":
			statsDiv("104", toAppendTo);
			data = stats[25];
			title = "מספרים שלא הופיעו לאחרונה במקום השלישי";
			break;
		case "104":
			statsDiv("105", toAppendTo);
			data = stats[26];
			title = "מספרים שלא הופיעו לאחרונה במקום הרביעי";
			break;
		case "105":
			statsDiv("106", toAppendTo);
			data = stats[27];
			title = "מספרים שלא הופיעו לאחרונה במקום החמישי";
			break;
		case "106":
			data = stats[28];
			title = "מספרים שלא הופיעו לאחרונה במקום השישי";
			break;
		case "11":
			data = stats[30];
			break;
		case "12":
			data = stats[29];
			break;
		case "14":
			optNum += 1;
			chartContainer.setAttribute('id', 'chart' + optNum + 'Container');
			statsDiv("142", toAppendTo);
			data = stats[31];
			title = "מקום ראשון";
			eventListener = 0;
			break;
		case "142":
			statsDiv("143", toAppendTo);
			data = stats[32];
			title = "מקום שני";
			eventListener = 0;
			break;
		case "143":
			statsDiv("144", toAppendTo);
			data = stats[33];
			title = "מקום שלישי";
			eventListener = 0;
			break;
		case "144":
			statsDiv("145", toAppendTo);
			data = stats[34];
			title = "מקום רביעי";
			eventListener = 0;
			break;
		case "145":
			statsDiv("146", toAppendTo);
			data = stats[35];
			title = "מקום חמישי";
			eventListener = 0;
			break;
		case "146":
			data = stats[36];
			title = "מקום שישי";
			eventListener = 0;
			break;
		case "15":
			data = stats[37];
			eventListener = 0;
			break;
	}
	dataPoints = createDataPoints(data, skipZerros);
	createChart(optNum, dataPoints, title, eventListener);
}

function closeStats(optNum) {
	let optionContainer = document.getElementById('option' + optNum + 'Container');
	let optionsContainer = document.getElementById('optionsContainer');
	optionContainer.remove();
	if (optNum == 1) {
		numOfRowsInChanceTb = 0;
	} else if (optNum == 13) {
		numOfRowsInArchiveTb = 0;
	}
	if (optionsContainer.innerHTML.length < 2) {
		let include3 = document.getElementById("include3");
		include3.style.display = "none";
		document.getElementById("icon3Container").style.visibility = "hidden";
		scrollBy(0, -1);
	}
}

function loadIntoSection3(optNum) {
	let include3 = document.getElementById("include3");
	let opt = document.getElementById("option" + optNum + "Container");
	if (include3.style.display == "none") {
		document.getElementById("icon3Container").style.visibility = "visible";
		include3.style.display = "";
	}
	if (opt == null) {
		createOptionContainer(optNum);
	}
	scrollToDiv("option" + optNum + "Container");
}

function createElement(tag, cls = null, id = null) {
	let res = document.createElement(tag);
	if (cls != null) {
		res.className = cls;
	}
	if (id != null) {
		res.id = id;
	}
	return res;
}

function createOptionContainer(optNum) {
	let optionContainer = createElement("div", "optionContainer", "option" + optNum + "Container");
	let caller = document.getElementById("option" + optNum);
	let headerOffset = createElement("div", "headerOffset");
	optionContainer.appendChild(headerOffset);
	let chrtheader = createElement("div", "chartHeaderContainer");
	let close = createElement("a", "close", "close" + optNum);
	close.setAttribute("onclick", "closeStats(" + optNum + ")");
	let h1 = createElement("h1");
	h1.innerHTML = "x";
	close.appendChild(h1);
	chrtheader.appendChild(close);
	if (optNum < 13 && optNum != 1) {
		let sort = createElement("div", "sort");
		let sortWord = createElement("div", "sortWord");
		let h2 = createElement("h2");
		h2.innerHTML = "תמיין תוצאות";
		sortWord.appendChild(h2);
		sort.appendChild(sortWord);
		let switchlbl = createElement("label", "switch");
		let checkbox = createElement("input", null, "sort" + optNum);
		checkbox.setAttribute("type", "checkbox");
		let slider = createElement("span", "slider round");
		switchlbl.appendChild(checkbox);
		switchlbl.appendChild(slider);
		sort.appendChild(switchlbl);
		chrtheader.appendChild(sort);
	}
	let chartTitle = createElement("h1", "chartTitle option" + optNum, "option" + optNum + "Title");
	chartTitle.innerHTML = caller.innerHTML;
	chrtheader.appendChild(chartTitle);
	optionContainer.appendChild(chrtheader);
	if (optNum == 1 || optNum == 2 || optNum == 4 || optNum == 6 || optNum == 7 || optNum == 8) {
		let inputs = ["I", "II", "III", "V", "IV", "VI"];
		let checkchnc = createElement("div", "checkChanceContainer", "checkChance" + optNum);
		let checkChanceTitle = createElement("div", "checkChanceTitle");
		let h2 = createElement("h2");
		h2.innerHTML = "בדיקת סיכויי זכיה לפי מודל זה";
		checkChanceTitle.appendChild(h2);
		checkchnc.appendChild(checkChanceTitle);
		for (var i = 0; i < 7; i++) {
			var input = createElement("input", null, optNum + "input" + (i + 1));
			input.setAttribute("type", "text");
			input.setAttribute("onchange", "checkChanceInputValue(this.id)");
			if (i != 6) {
				input.setAttribute("placeholder", "מספר " + inputs[i]);
				checkchnc.appendChild(input);
			}
		}
		let lastInpt = createElement("div", "lastInputContainer");
		let h5 = createElement("h5", "lastInputIsOptional");
		h5.innerHTML = "שדה אופציונלי";
		input.setAttribute("placeholder", "חזק");
		lastInpt.appendChild(h5);
		lastInpt.appendChild(input);
		checkchnc.appendChild(lastInpt);
		let btn = createElement("button", "checkChanceButton", optNum);
		btn.setAttribute("onclick", "checkChance(this.id)");
		btn.innerHTML = "בדיקה";
		checkchnc.appendChild(btn);
		let chanceResult = createElement("h2", null, optNum + "chanceResult");
		chanceResult.style.marginTop = "12px";
		chanceResult.style.visibility = "hidden";
		checkchnc.appendChild(chanceResult);
		optionContainer.appendChild(checkchnc);
	}
	let statsContainer = createElement("div", null, "option" + optNum + "StatsContainer");
	if (optNum == 13) {
		let opts = ["", 10, 20, 50, 100, 200, 500, 1000, "כל התוצאות"];
		let tbshow = createElement("div", "tableRowsNum", "tableRowsNum" + optNum);
		let h2r = createElement("h2");
		h2r.innerHTML = "כמות תוצאות להצגה:";
		tbshow.appendChild(h2r);
		let select = createElement("select", "tableRowsnumSelect", "archiveSelect");
		select.setAttribute("onchange", "loadMoreToArchiveTb(this.value)");
		for (var i = 0; i < 9; i++) {
			let opt = createElement("option");
			if (i == 0) {
				opt.id = "emptyOpt";
			} else if (i == 1) {
				opt.selected = true;
			} else if (i == 8) {
				opt.setAttribute("value", "all");
			}
			opt.innerHTML = opts[i];
			select.appendChild(opt);
		}
		tbshow.appendChild(select);
		optionContainer.appendChild(tbshow);
		let table = createElement("div", "archiveTable");
		let headerRow = createElement("div", "headerRow");
		let a = createElement("div", "lotID");
		let a_clone = createElement("div", "lotID data");
		a.innerHTML = "מס' הגרלה";
		let b = createElement("div", "lotDate");
		let b_clone = createElement("div", "lotDate data");
		b.innerHTML = "תאריך הגרלה";
		let c = createElement("div", "strongNumContainer");
		let c_clone = createElement("div", "strongNumContainer data");
		c.innerHTML = "מס' חזק";
		let d = createElement("div", "lotNumbers");
		let d_clone = createElement("div", "lotNumbers data");
		d.innerHTML = "המספרים שעלו בגורל";
		headerRow.appendChild(a);
		headerRow.appendChild(b);
		headerRow.appendChild(c);
		headerRow.appendChild(d);
		table.appendChild(headerRow);
		let row = createElement("div", "row");
		row.appendChild(a_clone);
		row.appendChild(b_clone);
		let strongNum = createElement("div", "strongNum");
		c_clone.appendChild(strongNum);
		row.appendChild(c_clone);
		for (var i = 0; i < 6; i++) {
			d_clone.appendChild(createElement("div", "lotNum"));
		}
		row.appendChild(d_clone);
		table.appendChild(row);
		let showMore = createElement("button", "tableShowMore", "archiveShowMore");
		showMore.setAttribute("onclick", "loadMoreToArchiveTb('+10')");
		showMore.innerHTML = "הצג עוד - ";
		let ten = createElement("div", "ten");
		ten.innerHTML = "10";
		showMore.appendChild(ten);
		table.appendChild(showMore);
		statsContainer.appendChild(table);
	}
	if (optNum == 1) {
		let table = createElement("div", "chanceTable");
		let headerRow = createElement("div", "headerRow");
		let a = createElement("div", "lotRank padUp");
		let a_clone = createElement("div", "lotRank data");
		a.innerHTML = "דרגת הגרלה";
		let c = createElement("div", "lotNumbers padUp");
		let c_clone = createElement("div", "lotNumbers data");
		c.innerHTML = "מספרי ההגרלה";
		let b = createElement("div", "strongNumContainer padUp");
		let b_clone = createElement("div", "strongNumContainer data");
		b.innerHTML = "מס' חזק";
		let d = createElement("div", "lotChance padUp");
		let d_clone = createElement("div", "lotChance data");
		d.innerHTML = "סיכויי זכיה (1 ב)"
		let e = createElement("div", "chanceFac");
		let e_clone = createElement("div", "chanceFac data");
		e.innerHTML = "פי X<br>מסיכוי רגיל";
		let f = createElement("div", "chanceRep");
		let f_clone = createElement("div", "chanceRep data");
		f.innerHTML = "חזרה על<br>X (סיכו)";
		headerRow.appendChild(a);
		headerRow.appendChild(b);
		headerRow.appendChild(c);
		headerRow.appendChild(d);
		headerRow.appendChild(e);
		headerRow.appendChild(f);
		table.appendChild(headerRow);
		let row = createElement("div", "row");
		row.appendChild(a_clone);
		row.appendChild(b_clone);
		let strongNum = createElement("div", "strongNum");
		b_clone.appendChild(strongNum);
		row.appendChild(c_clone);
		for (var i = 0; i < 6; i++) {
			c_clone.appendChild(createElement("div", "lotNum"));
		}
		row.appendChild(d_clone);
		row.appendChild(e_clone);
		row.appendChild(f_clone);
		table.appendChild(row);
		let showMore = createElement("button", "tableShowMore", "archiveShowMore");
		showMore.setAttribute("onclick", "loadChanceTable()");
		showMore.innerHTML = "הצג עוד - ";
		let ten = createElement("div", "ten");
		ten.innerHTML = "10";
		showMore.appendChild(ten);
		table.appendChild(showMore);
		statsContainer.appendChild(table);
	}
	optionContainer.appendChild(statsContainer);
	document.getElementById("optionsContainer").appendChild(optionContainer);
	if (optNum == 1) {
		option1Builder();
	} else if (optNum == 13) {
		option13Builder();
	} else {
		statsDiv(optNum, statsContainer);
	}
}

function loadTop1KLots(fileContent) {
	let temp = fileContent.split("|"),
		chance;
	top1KLots = temp.map(function (x) {
		return x.split(",");
	});
	for (var i = 0; i < top1KLots.length; i++) {
		chance = top1KLots[i].slice(8, top1KLots[i].length - 1).join();
		top1KLots[i] = top1KLots[i].slice(0, 8).concat(chance, top1KLots[i][top1KLots[i].length - 1]);
	}
}

function option1Builder() {
	if (top1KLots.length == 0) {
		loadFileByPath("files/top1KLots.txt", loadTop1KLots);
	}
	loadChanceTable(1);
}

function option13Builder() {
	loadIntoArchiveTb(1, 10);
}

function fillRowData(ithRow, i) {
	ithRow.getElementsByClassName("lotID")[0].innerHTML = data[i][7];
	ithRow.getElementsByClassName("lotDate")[0].innerHTML = data[i][8];
	ithRow.getElementsByClassName("strongNum")[0].innerHTML = data[i][0];
	for (var j = 1; j <= 6; j++) {
		ithRow.getElementsByClassName("lotNum")[j - 1].innerHTML = data[i][j];
	}
}

function loadIntoArchiveTb(firstTimeFlag, numberOfRows) {
	let tb = document.getElementsByClassName("archiveTable")[0];
	let tbButton = tb.getElementsByClassName("tableShowMore")[0];
	let dataRow = tb.getElementsByClassName("row")[0];
	if (firstTimeFlag == 1) {
		let temp = dataRow;
		dataRow = dataRow.cloneNode(true);
		temp.remove();
	}
	if (numberOfRows < numOfRowsInArchiveTb) {
		dif = numOfRowsInArchiveTb - numberOfRows;
		for (var i = 0; i < dif; i++) {
			tb.getElementsByClassName("row")[numOfRowsInArchiveTb - 1].remove();
			numOfRowsInArchiveTb--;
		}
	} else if (numOfRowsInArchiveTb < numberOfRows) {
		for (var i = numOfRowsInArchiveTb; i < Math.min(numberOfRows, nLotteries); i++) {
			ithRow = dataRow.cloneNode(true);
			fillRowData(ithRow, i);
			tbButton.insertAdjacentHTML("beforeBegin", ithRow.outerHTML);
			numOfRowsInArchiveTb++;
		}
	}
}

function loadMoreToArchiveTb(opt) {
	if (opt == "+10") {
		loadIntoArchiveTb(0, numOfRowsInArchiveTb + 10);
		document.getElementById("emptyOpt").selected = true;
	} else if (opt != "") {
		if (opt == "all") {
			opt = nLotteries;
		}
		loadIntoArchiveTb(0, opt);
	}
}

function fillChanceRowData(ithRow, i) {
	ithRow.getElementsByClassName("lotRank")[0].innerHTML = i + 1;
	ithRow.getElementsByClassName("chanceFac")[0].innerHTML = top1KLots[i][7];
	ithRow.getElementsByClassName("lotChance")[0].innerHTML = top1KLots[i][8];
	ithRow.getElementsByClassName("chanceRep")[0].innerHTML = top1KLots[i][9];
	ithRow.getElementsByClassName("strongNum")[0].innerHTML = top1KLots[i][0];
	for (var j = 1; j <= 6; j++) {
		ithRow.getElementsByClassName("lotNum")[j - 1].innerHTML = top1KLots[i][j];
	}
}

function loadChanceTable(firstTimeFlag = 0) {
	let tb = document.getElementsByClassName("chanceTable")[0];
	let tbButton = tb.getElementsByClassName("tableShowMore")[0];
	let dataRow = tb.getElementsByClassName("row")[0];
	let temp = dataRow,
		ind = numOfRowsInChanceTb;
	dataRow = dataRow.cloneNode(true);
	if (firstTimeFlag == 1) {
		temp.remove();
	}
	for (var i = ind; i < Math.min(ind + 10, top1KLots.length); i++) {
		ithRow = dataRow.cloneNode(true);
		fillChanceRowData(ithRow, i);
		tbButton.insertAdjacentHTML("beforeBegin", ithRow.outerHTML);
		numOfRowsInChanceTb++;
	}
}

function addToChart(optNum, label) {
	let optionContainer, pieContainer,
		chartContainer,
		dataPoints, id, chartTitle;
	id = optNum + "-" + label;
	chartContainer = document.getElementById('chart' + id + 'Container');
	if (chartContainer != null) {
		chartContainer.remove();
	} else {
		optionContainer = document.getElementById("option" + optNum + "StatsContainer");
		console.log(optionContainer, optNum);
		dataPoints = extraChart(optNum, label);
		chartContainer = document.createElement('div');
		chartContainer.setAttribute('id', 'chart' + id + 'Container');
		chartContainer.setAttribute('class', 'chartContainer pieThird');
		pieContainer = document.getElementById("option" + optNum + "PieContainer");
		if (pieContainer == null) {
			pieContainer = document.createElement('div');
			pieContainer.setAttribute('class', 'pieContainer');
			pieContainer.setAttribute('id', 'option' + optNum + 'PieContainer');
		}
		pieContainer.appendChild(chartContainer);
		optionContainer.appendChild(pieContainer);
		dataPoints = createDataPoints(dataPoints, 1);
		if (optNum == "2") {
			chartTitle = "מספר ";
		} else {
			chartTitle = "הפרש של ";
		}
		createChart(id, dataPoints, chartTitle + label, 0);
	}
}

function checkChanceInputValue(id) {
	let currentPos = document.getElementById(id),
		len = id.length - 1,
		checkRange;
	checkRange = checkChanceInputRange(currentPos, id[len], currentPos.value);
	if (id[len] != 7) {
		checkChanceInputsRepetition(id);
	} else {
		currentPos.style.border = "";
	}
	if (checkRange == 1) {
		currentPos.style.border = "1px solid red";
	}
}

function checkChanceInputRange(element, place, value) {
	if (place == 7) {
		if (value != "" && (isNaN(parseInt(value)) || (value < 1 || value > 7))) {
			return 1;
		}
	} else {
		if (value != "" && (isNaN(parseInt(value)) || (value < 1 || value > 37))) {
			return 1;
		}
	}
	return 0;
}

function checkChanceInputsRepetition(id) {
	let currentVals = new Array(37).fill(0);
	let invalid = [];
	for (i = 1; i <= 6; i++) {
		val = document.getElementById(id.split("input")[0] + "input" + i).value;
		if (val == "") {
			continue;
		}
		if (currentVals[val - 1] != 0) {
			invalid.push(i);
			if (invalid.includes(currentVals[val - 1]) == false) {
				invalid.push(currentVals[val - 1]);
			}
		} else {
			currentVals[val - 1] = i;
		}
	}
	for (var i = 1; i <= 6; i++) {
		currentPos = document.getElementById(id.split("input")[0] + "input" + i);
		if (invalid.includes(i)) {
			currentPos.style.border = "1px solid red";
		} else {
			currentPos.style.border = "";
		}
	}
}

/* CHANGE WEIGHTS */
function checkChance(id) {
	let flag = 0,
		currentPos, lottery = [];
	for (var i = 1; i <= 7; i++) {
		currentPos = document.getElementById(id + "input" + i);
		if (currentPos.style.border != "" || (currentPos.value == "" && i != 7)) {
			flag = 1;
			currentPos.style.border = "1px solid red";
		}
		if (i != 7) {
			lottery[i - 1] = Number.parseInt(currentPos.value);
		}
	}
	if (flag == 0) {
		lottery.unshift(Number.parseInt(currentPos.value));
		if (id == 8) {
			writeChance(computeChanceOfOpt(id, lottery), id);
		} else {
			writeChance(reFurmulateChance(computeChanceOfOpt(id, lottery), currentPos.value != ""), id);
		}
	}
}

/* returns [fraction, by] such that chance = 1/fraction, chance = normalChance * by */
function reFurmulateChance(chanceVsNormalChance, strongNum) {
	if (chanceVsNormalChance[0] == 0) {
		return [0, "0.00"];
	}
	if (strongNum == 1) {
		return [addCommas(Math.round(numPosLots * 7 / (chanceVsNormalChance[0] / chanceVsNormalChance[1]))), (chanceVsNormalChance[0] / chanceVsNormalChance[1]).toFixed(2)];
	}
	return [addCommas(Math.round(numPosLots / (chanceVsNormalChance[0] / chanceVsNormalChance[1]))), (chanceVsNormalChance[0] / chanceVsNormalChance[1]).toFixed(2)];
}

function addCommas(num) {
	let lstNum,
		res = [],
		c = 1;
	lstNum = (num + '').split('');
	for (i = lstNum.length - 1; i >= 0; i--) {
		res.unshift(lstNum[i]);
		if (c % 3 == 0 && i != 0) {
			res.unshift(',');
		}
		c++;
	}
	return res.join('');
}

function writeChance(fractionByLst, optID) {
	let number = document.createElement('div');
	let chanceResult = document.getElementById(optID + "chanceResult");
	number.setAttribute('class', 'chanceNumber');
	number.innerHTML = fractionByLst[0];
	if (fractionByLst[0] == 0) {
		chanceResult.innerHTML = "סיכוי זכיה: ";
	} else if (optID == 8) {
		chanceResult.innerHTML = "חזרה על ";
		chanceResult.appendChild(number);
		chanceResult.innerHTML += " מספרים ";
		number = number.cloneNode(true);
		number.innerHTML = fractionByLst[1] + '%';
		chanceResult.innerHTML += '(';
		chanceResult.appendChild(number);
		chanceResult.innerHTML += ')';
	} else {
		chanceResult.innerHTML = "סיכוי זכיה: 1 ב ";
		chanceResult.appendChild(number);
		chanceResult.innerHTML += " - ";
		number = number.cloneNode(true);
		number.innerHTML = fractionByLst[1] + " ";
		chanceResult.innerHTML += "פי ";
		chanceResult.appendChild(number);
		chanceResult.innerHTML += "מסיכוי רגיל";
	}
	chanceResult.style.visibility = "visible";
}
