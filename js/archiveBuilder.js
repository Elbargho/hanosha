let data = [];
let nLotteries;
let archivePath = "files/Lotto.csv";

function loadFileByPath(filePath, func, arg1 = null, asyn = false) {
	let xhttp = new XMLHttpRequest();
	xhttp.open("GET", filePath, asyn);
	xhttp.onload = function () {
		if (arg1 == null) {
			func(xhttp.responseText);
		} else {
			func(xhttp.responseText, arg1);
		}
	}
	xhttp.send(null);
}

function loadArchive(flag, computeRep = false) {
	fromDate = document.getElementById("fromDate").value;
	toDate = document.getElementById("toDate").value;
	if ((flag == 1 && checkDatesValid(fromDate, toDate)) || flag != 1) {
		loadFileByPath(archivePath, dataBuilder, flag);
		/*editGenStats();*/
		loadSection2(computeRep);
	}
}

function checkDatesValid(fromDate, toDate) {
	maxValid = twoMonthsShiftDown(toDate.split("-").map(function (x) {
		return parseInt(x);
	}));
	dateErrMsg = document.getElementById("dateErrMsg");
	minFromDate = document.getElementById("fromDate").min;
	maxToDate = document.getElementById("toDate").max;
	flag = 0;
	if (fromDate == toDate || isGreater(fromDate, toDate)) {
		flag = 1;
		dateErrMsg.textContent = "תאריך התחלה חייב להיות קטן מתאריך הסיום";
	} else if (isGreater(fromDate, maxValid)) {
		flag = 1;
		dateErrMsg.textContent = "טווח בין תאריך התחלה לתאריך סיום חייב להיות לפחות חודשיים";
	} else if (isLessThan(fromDate, minFromDate)) {
		flag = 1;
		dateErrMsg.textContent = "תאריך התחלה חייב להיות לפחות " + "03/05/2011";
	} else if (isGreater(toDate, maxToDate)) {
		flag = 1;
		dateErrMsg.textContent = "תאריך סיום חייב להיות לכל היותר תאריך היום";
	}
	if (flag == 1) {
		dateErrMsg.style.visibility = "visible";
		setTimeout(function () {
			dateErrMsg.style.visibility = "hidden";
			dateErrMsg.textContent = "";
		}, 6000);
		return false;
	}
	return true;
}

function dataBuilder(archive, flag) {
	data = [];
	let tempData = [],
		archiveData = archive.split('\n');
	let fromDate, toDate = document.getElementById("toDate").max;
	if (flag == 1) {
		fromDate = document.getElementById("fromDate").value;
		toDate = document.getElementById("toDate").value;
	} else if (flag == 2) {
		fromDate = "05/03/2011";
	} else {
		fromDate = "13/04/2019";
	}
	for (var i = 1; i < archiveData.length; i++) {
		archiveData[i] = archiveData[i].split(',').slice(0, 9);
		if (isGreater(archiveData[i][1], toDate)) {
			continue;
		} else if (isLessThan(archiveData[i][1], fromDate)) {
			break;
		}
		reArrangeData(archiveData[i]);
	}
	nLotteries = data.length;
}

function reArrangeData(arr) {
	innerData = [];
	innerData[0] = Number.parseInt(arr[arr.length - 1]);
	for (var i = 1; i < 7; i++) {
		innerData[i] = Number.parseInt(arr[i + 1]);
	}
	innerData[7] = arr[0];
	innerData[8] = arr[1];
	data.push(innerData);
}

function reArrangeDate(date) {
	if (date.includes("-")) {
		[year, month, day] = date.split("-").map(function (x) {
			return parseInt(x);
		});
	} else {
		[day, month, year] = date.split("/").map(function (x) {
			return parseInt(x);
		});
	}
	return [year, month, day];
}

function isGreater(big, small) {
	big = reArrangeDate(big);
	small = reArrangeDate(small);
	if (equals(small, big)) {
		return false;
	} else if (big[0] == small[0] && big[1] == small[1]) {
		return big[2] > small[2];
	} else if (big[0] == small[0]) {
		return big[1] > small[1];
	} else {
		return big[0] > small[0];
	}
}

function isLessThan(small, big) {
	nbig = reArrangeDate(big);
	nsmall = reArrangeDate(small);
	if (equals(nsmall, nbig)) {
		return false;
	}
	return !isGreater(small, big);
}