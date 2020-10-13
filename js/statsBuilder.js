/*
stats = [0:topNumbers, 1:topNumbersFirstPlace, 2:topNumbersSecondPlace, 3:topNumbersThirdPlace, 4:topNumbersFourthPlace, 5:topNumbersFifthPlace, 6:topNumbersSixthPlace, 7:topDifferences, 8:topDifferencesFirstPlace, 9:topDifferencesSecondPlace, 10:topDifferencesThirdPlace, 11:topDifferencesFourthPlace, 12:topDifferencesFifthPlace, 13:topNumbersSum, 14:topNumberOfEvens, 15:numberOfEvensFirstPlace, 16:numberOfEvensSecondPlace, 17:numberOfEvensThirdPlace, 18:numberOfEvensFourthPlace, 19:numberOfEvensFifthPlace, 20:numberOfEvensSixthPlace, 21:numberOfEvensOverAll, 22:numbersDidn'tAppearRecently (NDAR), 23:NDARinFirstPlace, 24:NDARinSecondPlace, 25:NDARinThirdPlace, 26:NDARinFourthPlace, 27:NDARinFifthPlace, 28:NDARinSixthPlace, 29:strongNDAR, 30:topSTRONGnumbers, 31:visualizeFirstPlace, 32:visualizeSecondPlace, 33:visualizeThirdPlace, 34:visualizeFourthPlace, 35:visualizeFifthPlace, 36:visualizeSixthPlace, 37:visualizeStrongNumbers]
*/

let stats = [];
let percent;
let numPosLots = 2324784;
let repetitionLst = [{}, {}, {}, {}, {}, {}];
let numberOfRepetitions = [[], [], [], [], [], []];
let genStats = [];

function loadGenStats(fileContent) {
	let temp = fileContent.split("\n");
	genStats = temp.map(function (x) {
		return x.split("|").map(function (y) {
			return y.split(",").map(function (z) {
				if (!isNaN(parseFloat(z, 10))) {
					return parseFloat(z, 10);
				}
				return z;
			});
		});
	});
}

loadFileByPath("files/genStats.txt", loadGenStats, null, true);


/*function editGenStats() {
	for (var i = 0; i < genStats.length; i++) {
		for (var j = 0; j < genStats[i].length; j++) {
			if (i == 0) {
				genStats[i][j][1] = Math.floor(nLotteries * 6 * genStats[i][j][2] / 100);
			} else if (i == 2) {
				genStats[i][j][1] = Math.floor(nLotteries * 5 * genStats[i][j][2] / 100);
			} else {
				genStats[i][j][1] = Math.floor(nLotteries * genStats[i][j][2] / 100);
			}
		}
	}
}*/

/* choose(i, 6) */
function choose(i) {
	let factorial = [1, 1, 2, 6, 24, 120, 720];
	return factorial[6] / (factorial[6 - i] * factorial[i]);
}

function computeRepetition() {
	let values, sum, partialsArr, lottPart, n;
	if (numberOfRepetitions[0].length != 0) {
		return;
	}
	percent = (1 / nLotteries) * 100;
	/*iterate over the lottaries*/
	for (var i = 0; i < nLotteries; i++) {
		/* fill dictionary by repetition parts to count repetitions */
		partialsArr = [];
		getSuperSet(data[i].slice(1, 7), [], partialsArr);
		for (var j = 0; j < partialsArr.length; j++) {
			lottPart = partialsArr[j];
			n = lottPart.length;
			if (repetitionLst[n - 1][lottPart] == null) {
				repetitionLst[n - 1][lottPart] = 0;
			}
			repetitionLst[n - 1][lottPart] += 1;
		}
	}
	/* count repetitions of each part length */
	for (var i = 0; i < 6; i++) {
		values = Object.values(repetitionLst[i]);
		sum = 0;
		for (var j = 0; j < values.length; j++) {
			sum += values[j] - 1;
		}
		numberOfRepetitions[i][0] = "חזרה על " + (i + 1) + " מספרים";
		numberOfRepetitions[i][1] = sum;
		numberOfRepetitions[i][2] = Math.ceil(sum * percent / choose(i + 1));
	}
}

function getSuperSet(lst, lstPart, partialsLst) {
	if (lst == "" && lstPart != "") {
		partialsLst.push(lstPart);
	} else if (lst != "") {
		getSuperSet(lst.slice(1, lst.length), lstPart.concat(lst[0]), partialsLst);
		getSuperSet(lst.slice(1, lst.length), lstPart, partialsLst);
	}
}

function statsBuilder(computeRep = true) {
	let number, flag, sum, nEvens;
	initLists();
	repetitionLst = [{}, {}, {}, {}, {}, {}];
	numberOfRepetitions = [[], [], [], [], [], []];
	percent = 100 / nLotteries;
	/*iterate over the lottaries*/
	for (var i = 0; i < nLotteries; i++) {
		/*iterate over the lottarie numbers (number)*/
		sum = 0;
		nEvens = 0;
		for (var j = 1; j < 7; j++) {
			/*iterate over the stats inner lists to build different stats*/
			for (var k = 0; k < stats.length; k++) {
				flag = 1;
				switch (true) {
					case (k == 0):
						number = data[i][j];
						break;
					case (k >= 1 && k <= 6):
						if (j != k) {
							flag = 0;
						}
						break;
					case (k == 7):
						flag = 0;
						if (j > 1) {
							number = data[i][j] - data[i][j - 1];
							flag = 1;
						}
						break;
					case (k >= 8 && k <= 12):
						flag = 0;
						if (j > 1 && j == k - 6) {
							number = data[i][j] - data[i][j - 1];
							flag = 1;
						}
						break;
					case (k == 13):
						sum += data[i][j];
						if (j != 6) {
							flag = 0;
						} else {
							number = sum;
						}
						break;
					case (k == 14):
						nEvens += Math.abs(data[i][j] % 2 - 1);
						if (j != 6) {
							flag = 0;
						} else {
							number = nEvens + 1;
						}
						break;
					case (k >= 15 && k <= 20):
						number = data[i][j] % 2 + 1;
						if (j != k - 14) {
							flag = 0;
						}
						break;
					case (k == 21):
						number = data[i][j] % 2 + 1;
						break;
					case (k == 22):
						number = data[i][j];
						if (stats[k][number - 1][1] != 0) {
							flag = 0;
						}
						break;
					case (k >= 23 && k <= 28):
						if (stats[k][number - 1][1] != 0 || j != k - 22) {
							flag = 0;
						}
						break;
					case (k == 29):
						number = data[i][0];
						if (stats[k][number - 1][1] != 0) {
							flag = 0;
						}
						break;
					case (k == 30):
						if (j != 1) {
							flag = 0;
						} else {
							number = data[i][j - 1];
						}
						break;
					case (k >= 31 && k <= 36):
						flag = 0;
						if (j == k - 30) {
							stats[k].unshift([data[i][8], data[i][j]]);
						}
						break;
					case (k == 37):
						flag = 0;
						if (j == 1) {
							stats[k].unshift([data[i][8], data[i][0]]);
						}
				}
				if (flag == 1) {
					if (k >= 22 && k <= 29) {
						stats[k][number - 1][1] = i + 1;
					} else {
						stats[k][number - 1][1] += 1;
					}
					if (k == 7) {
						stats[k][number - 1][2] += percent / 5;
					} else if (k != 21 && k != 0) {
						stats[k][number - 1][2] += percent;
					} else {
						stats[k][number - 1][2] += percent / 6;
					}
				}
			}
		}
	}
	buildPercintageNDAR();
	for (var i = 0; i < stats.length; i++) {
		if (i >= 31) {
			continue;
		}
		roundPercintage(stats[i]);
	}
	if (computeRep) {
		computeRepetition();
	}
}

function initLists() {
	stats = [];
	let innerLst = [];
	for (var j = 0; j < 38; j++) {
		innerLst = [];
		for (var i = 0; i < 37; i++) {
			if ((j >= 7 && j <= 12 && i == 32) || (j >= 13 && j <= 21) || ((j == 29 || j == 30) && i == 7) || j > 30) {
				break;
			}
			innerLst.push([i + 1, 0, 0]);

		}
		stats.push(innerLst);
		if (j >= 15 && j <= 21) {
			stats[j].push(["זוגי", 0, 0]);
			stats[j].push(["אי-זוגי", 0, 0]);
		}
	}
	for (var i = 0; i < 208; i++) {
		stats[13].push([i + 1, 0, 0]);
	}
	for (var i = 0; i < 7; i++) {
		stats[14].push(["זוגיים " + i, 0, 0]);
	}
}

function roundPercintage(lst) {
	for (var i = 0; i < lst.length; i++) {
		lst[i][2] = parseFloat(lst[i][2].toFixed(3));
	}
}

function buildPercintageNDAR() {
	let sum;
	for (var i = 22; i <= 29; i++) {
		sum = 0;
		for (var j = 0; j < stats[i].length; j++) {
			if (stats[i][j][1] != 0) {
				stats[i][j][1]--;
			}
			sum += stats[i][j][1];
		}
		for (var j = 0; j < stats[i].length; j++) {
			stats[i][j][2] = (stats[i][j][1] / sum) * 100;
		}
	}
}

/* THIS FUNCTION CREATES A NEW COPY */
function sortedArray(toSort, d = 0, descending = 0) {
	sorted = toSort.slice(0, toSort.length);
	if (d == 0) {
		sorted.sort(function (a, b) {
			if (descending == 1) {
				return b - a;
			}
			return a - b;
		});
	} else {
		sorted.sort(function (a, b) {
			if (descending == 1) {
				return b[d] - a[d];
			}
			return a[d] - b[d];
		});
	}
	return sorted;
}

function max(lst) {
	maxVal = lst[0][1];
	for (var i = 0; i < lst.length; i++) {
		if (lst[i][1] > maxVal) {
			maxVal = lst[i][1];
		}
	}
	return maxVal;
}

function extraChart(optNum, label) {
	let dataPoints = [["במקום הראשון"], ["במקום השני"], ["במקום השלישי"], ["במקום הרביעי"], ["במקום החמישי"], ["במקום השישי"]],
		k = 0;
	if (optNum == "4") {
		k = 7;
	}
	for (var i = 0; i < 6; i++) {
		dataPoints[i][1] = stats[k + i + 1][label - 1][1];
		dataPoints[i][2] = (dataPoints[i][1] / stats[k][label - 1][1]) * 100;
	}
	roundPercintage(dataPoints);
	return dataPoints;
}

function computeAllPosArrangements(allPosArr, lottery, posArr) {
	if (lottery.length == 0) {
		allPosArr.push(copyPosArr);
	} else {
		for (var i = 0; i < lottery.length; i++) {
			copyPosArr = posArr.slice(0, posArr.length);
			copyLottery = lottery.slice(0, lottery.length);
			copyPosArr.push(copyLottery.splice(i, 1)[0]);
			computeAllPosArrangements(allPosArr, copyLottery, copyPosArr);
		}
	}
}

function computeChanceOfOpt2(lottery) {
	let totalChance = 0,
		allPosArr = [];
	computeAllPosArrangements(allPosArr, lottery, []);
	for (var j = 0; j < allPosArr.length; j++) {
		posArr = allPosArr[j];
		denominator = nLotteries * 6;
		chance = 1;
		for (var i = 0; i < 6; i++) {
			chance *= stats[0][posArr[i] - 1][1] / denominator;
			denominator -= stats[0][posArr[i] - 1][1];
		}
		totalChance += chance;
	}
	return [totalChance, 1 / numPosLots];
}

function computeChanceOfOpt4(lottery) {
	summ = 0, ratio = 1;
	sumStats = sumLst(stats[7], 1);
	sumGen = sumLst(genStats[0], 1);
	for (var i = 1; i < 6; i++) {
		diff = lottery[i] - lottery[i - 1];
		summ += diff;
		ratio *= (stats[7][diff - 1][1] / sumStats) / (genStats[0][diff - 1][1] / sumGen);
	}
	return [((37 - summ) / 376992) * ratio, (37 - summ) / 376992];
}

function sumLst(lst, d = null) {
	sum = 0;
	if (d == null) {
		for (var i = 0; i < lst.length; i++) {
			sum += lst[i];
		}
	} else {
		for (var i = 0; i < lst.length; i++) {
			sum += lst[i][d];
		}
	}
	return sum;
}

function computeChanceOfOpt6(lottery) {
	sumStats = sumLst(stats[13], 1);
	sumGen = sumLst(genStats[1], 1);
	return [stats[13][sumLst(lottery) - 1][1] / sumStats, genStats[1][sumLst(lottery) - 1][1] / sumGen];
}

function evensChance(evens) {
	let chance = 1,
		odds = 6 - evens,
		denominator = 37;
	for (var i = 1; i <= evens; i++) {
		chance *= (18 - i + 1) / (denominator);
		denominator--;
	}
	for (var i = 1; i <= odds; i++) {
		chance *= (19 - i + 1) / (denominator);
		denominator--;
	}
	return chance * choose(evens);
}

function computeChanceOfOpt7(lottery) {
	let evens = 0;
	for (var i = 0; i < lottery.length; i++) {
		evens += (lottery[i] + 1) % 2;
	}
	return [stats[14][evens][1] / sumLst(stats[14], 1), evensChance(evens)];
}

function computeChanceOfOpt(optNum, lottery) {
	let chanceVsNormalChance, copyLot = sortedArray(lottery.slice(1, 7)),
		optNums = [2, 4, 6, 7];
	switch (true) {
		case (optNum == 1):
			let chanceFac = 0,
				normalChance = 0;
			for (var i = 0; i < optNums.length; i++) {
				chanceFac += (weights[i] / 100) * (computeChanceOfOpt(optNums[i], lottery)[0] / computeChanceOfOpt(optNums[i], lottery)[1]);
			}
			return [chanceFac / numPosLots * 7, 1 / numPosLots * 7];
		case (optNum == 2):
			chanceVsNormalChance = computeChanceOfOpt2(copyLot);
			break;
		case (optNum == 4):
			chanceVsNormalChance = computeChanceOfOpt4(copyLot);
			break;
		case (optNum == 6):
			chanceVsNormalChance = computeChanceOfOpt6(copyLot);
			break;
		case (optNum == 7):
			chanceVsNormalChance = computeChanceOfOpt7(copyLot);
			break;
		case (optNum == 8):
			partialsLst = [], maxPartLen = 0;
			getSuperSet(lottery.slice(0, 6), [], partialsLst);
			for (var i = 0; i < partialsLst.length; i++) {
				if (repetitionLst[partialsLst[i].length - 1][partialsLst[i]] != null && partialsLst[i].length > maxPartLen) {
					maxPartLen = partialsLst[i].length;
				}
			}
			chance = numberOfRepetitions[maxPartLen - 1][2];
			return [maxPartLen, chance];
			break;
	}
	if (!isNaN(lottery[0])) {
		chanceVsNormalChance[0] *= stats[30][lottery[0] - 1][1] / sumLst(stats[30], 1);
		chanceVsNormalChance[1] /= 7;
	}
	return chanceVsNormalChance;
}
