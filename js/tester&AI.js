const lastUpd = "2020-09-16";
let weights = [50,30,15,5];

/* tests if sum of percentages is ~ 100% */
function testPercentage() {
	let sumOfPerc;
	for (var i = 0; i < stats.length; i++) {
		sumOfPerc = sumLst(stats[i], 2);
		if (sumOfPerc < 99 || sumOfPerc > 101) {
			console.log(i, sumOfPerc);
		}
	}
	console.log("test Done");
}

/* return all possible weights for n options */
function recComputePosWeights(i, n, w, lst, toAppendTo) {
	if (i == n - 1) {
		lst[i] = w;
		toAppendTo.push(lst.slice(0, lst.length));
	} else {
		for (var k = 0; k <= w; k += 5) {
			lst[i] = k;
			recComputePosWeights(i + 1, n, w - k, lst, toAppendTo)
		}
	}
}

function computePosWeights() {
	let posWeights = [];
	recComputePosWeights(0, 4, 100, [], posWeights);
	return posWeights;
}

/* fills toAppend with all possible lottaries */
function recAllLottaries(lottery, place, num, toAppend, strongNum) {
	if (place == 6) {
		if (strongNum == 0) {
			lotteryCopy = lottery.slice(0, lottery.length);
			toAppend.push(lotteryCopy);
		} else {
			for (var i = 1; i <= 7; i++) {
				lotteryCopy = lottery.slice(0, lottery.length);
				lotteryCopy.unshift(i);
				toAppend.push(lotteryCopy);
			}
		}
	} else {
		for (var i = num; i <= 37; i++) {
			lottery[place] = i;
			recAllLottaries(lottery, place + 1, i + 1, toAppend, strongNum);
		}
	}
}

/* returns all possible lottaries */
function computeAllLottaries(strongNum) {
	let lst = [];
	recAllLottaries([], 0, 1, lst, strongNum);
	return lst;
}

function equals(lst1, lst2) {
	return JSON.stringify(lst1) == JSON.stringify(lst2);
}

/* AI - decide which part of the archive and measuring options to consider in the prediction of the winning lotteries and what weights given to each measuring option */
/* size: experimental group size */
function AI(size) {
	let res = [],
		chance, optNums = [2, 4, 6, 7],
		optChance = [],
		c = 0,
		chanceOfLot;
	let posWeights = computePosWeights();
	loadArchive(2);
	const expGrp = data.slice(0, size); // experimental group 
	data = data.slice(size, nLotteries);
	nLotteries -= size;
	/* go over parts of the archive */
	while (nLotteries >= 150) {
		statsBuilder();
		computeRepetition();
		optChance = [];
		/* compute lotteries chances */
		for (var lot = 0; lot < size; lot++) {
			tempLst = [];
			for (var opt = 0; opt < 4; opt++) {
				chanceOfLot = computeChanceOfOpt(optNums[opt], expGrp[lot]);
				tempLst.push(chanceOfLot[0] / chanceOfLot[1]);
			}
			optChance.push(tempLst);
		}
		/* go over all possible weights */
		for (var w = 0; w < posWeights.length; w++) {
			chance = 0;
			/* go over lotteries */
			for (var lot = 0; lot < size; lot++) {
				/* go over weights */
				for (var wi = 0; wi < 4; wi++) {
					chance += posWeights[w][wi] * optChance[lot][wi] / 100;
				}
			}
			/* res.push([c * 10, posWeights[w], chance / size]); */
			if (res.length == 0 || chance / size > res[2]) {
				res = [c, posWeights[w], chance / size];
			}
		}
		/* update data[] and nLotteries */
		data = data.slice(0, nLotteries - 10);
		nLotteries -= 10;
		c += 10;
	}
	loadArchive(2);
	res[0] = data[data.length - res[0] - 1][8];
	return res;
}

function downloadTop1KLots(data) {
	let a = document.getElementById("a"),
		content1K;
	content1K = data.slice(0, 1000).join("|");
	uriContent = "data:application/octet-stream," + encodeURIComponent(content1K);
	a.setAttribute("href", uriContent);
	a.setAttribute("download", "top1KLots.txt");
	a.click();
}

/* finishes in  mins */
function computeTopLotteries(lottery = null) {
	let allLots = computeAllLottaries(1),
		optNum = [2, 4, 6, 7],
		chances, tempLst, repChance, chance,
		chanceFac, sumUp, place = 1;
	if (lottery == null) {
		loadArchive(3, true);
	} else {
		document.getElementById("fromDate").value = "2019-04-13";
		document.getElementById("toDate").value = lastUpd;
		loadArchive(1, true);
	}
	sumUp = sumLst(stats[30], 1);
	for (var i = 0; i < allLots.length; i += 7) {
		chances = [];
		tempLst = allLots[i].slice(1, 7);
		tempLst.unshift(NaN);
		for (var j = 0; j < optNum.length; j++) {
			chances.push(computeChanceOfOpt(optNum[j], tempLst));
		}
		repChance = computeChanceOfOpt(8, allLots[i]);
		for (var strong = 0; strong < 7; strong++) {
			chanceFac = 0;
			for (var w = 0; w < weights.length; w++) {
				chanceFac += (chances[w][0] * (stats[30][strong][1] / sumUp) / (chances[w][1] / 7)) * (weights[w] / 100);
			}
			allLots[i + strong].push(chanceFac.toFixed(2), addCommas(Math.round(numPosLots * 7 / chanceFac)), repChance[0] + " (" + repChance[1] + "%)");
		}
		if (i % 1000006 == 0) {
			console.log((i / 1000006) + "M");
		}
	}
	if (lottery == null) {
		allLots = sortedArray(allLots, 7, 1);
		downloadTop1KLots(allLots);
	} else {
		chanceFac = 0;
		for (var w = 0; w < weights.length; w++) {
			chanceFac += (computeChanceOfOpt(optNum[w], lottery)[0] / computeChanceOfOpt(optNum[w], lottery)[1]) * (weights[w] / 100);
		}
		for (var i = 0; i < allLots.length; i++) {
			if (parseFloat(allLots[i][7]) > chanceFac) {
				place++;
			}
		}
		/* delete the two lines */
		allLots = sortedArray(allLots, 7, 1);
		downloadTop1KLots(allLots);
		return [place, chanceFac];
	}
}
