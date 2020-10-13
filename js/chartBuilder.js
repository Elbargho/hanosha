function copyArrayOfDicts(ArrayOfDicts) {
	let res = [];
	for (var i = 0; i < ArrayOfDicts.length; i++) {
		res[i] = {};
		res[i].y = ArrayOfDicts[i].y;
		res[i].p = ArrayOfDicts[i].p;
		res[i].label = ArrayOfDicts[i].label;
		if (ArrayOfDicts[i].color != null) {
			res[i].color = ArrayOfDicts[i].color;
		}
	}
	return res;
}

function sortDataPointsArray(dataPoints) {
	let sorted;
	sorted = copyArrayOfDicts(dataPoints);
	sorted.sort(function (a, b) {
		return b.y - a.y
	});
	for (var i = 0; i < sorted.length; i++) {
		sorted[i].x = i;
	}
	return sorted;
}

function createClickablePoints(optNum, dataPoints, forColor, minAxisY, maxAxisY) {
	let clickablePoints, middleOfDataPoints = [],
		k;
	switch (true) {
		case (optNum[0] == "3"):
			k = 0;
			break;
		case (optNum[0] == "5"):
			k = 7;
			break;
	}
	if (k != null) {
		maxVal = max(stats[k]);
		maxAxisY = maxAxisY * 0.9;
	}
	for (var i = 0; i < dataPoints.length; i++) {
		middleOfDataPoints[i] = {};
	}
	for (var i = 0; i < dataPoints.length; i++) {
		if (forColor != null && forColor[i].color != null) {
			middleOfDataPoints[forColor[i].label - 1].color = "#ef8a32";
		}
		if (optNum[0] % 2 == 0) {
			middleOfDataPoints[i].y = (dataPoints[i].y + minAxisY) / 2;
			middleOfDataPoints[i].p = "לחץ כאן כדי לראות אחוז מיקום";
			middleOfDataPoints[i].label = dataPoints[i].label;
		} else if (optNum[0] % 2 == 1) {
			middleOfDataPoints[i].y = stats[k][i][1] / (maxVal / maxAxisY);
			middleOfDataPoints[i].p = "בסך הכל: " + stats[k][i][1] + ", " + stats[k][i][2] + "%";
		}
	}
	switch (true) {
		case (optNum[0] >= 2 && optNum[0] <= 5):
			clickablePoints = {
				type: "scatter",
				name: "",
				dataPoints: middleOfDataPoints
			}
	}
	return clickablePoints;
}

function createDataPoints(statsData, skipZerros) {
	let dataPoints = [];
	for (var i = 0; i < statsData.length; i++) {
		if (skipZerros == 1 && statsData[i][1] == 0) {
			continue;
		}
		dataPoints.push({
			y: statsData[i][1],
			p: statsData[i][2],
			label: statsData[i][0]
		});
	}
	return dataPoints;
}

function editChartFeatures(optNum, dataPoints) {
	let interval = 1,
		content = "{p}",
		type = "column",
		colorSet = [
					"#223977"],
		sort, clickablePoints, showInLegend = false,
		legendText = "",
		zoom = false,
		label = "{y}",
		name = "%";
	switch (true) {
		case (optNum == "6"):
			interval = 3;
			content = "{label}, {p}";
			break;
		case (optNum.length == 2 && optNum[0] == "7" || optNum.includes('-')):
			type = "pie";
			colorSet = ["#223977", "#e31d1a", "#ffc565", "#ef8a32", "limegreen", "white"];
			if (optNum == "71" || optNum.includes('-')) {
				showInLegend = true;
				legendText = "{label}";
			}
			break;
		case (optNum == "2" || (optNum[0] >= "3" && optNum[0] <= "5")):
			colorSet.push("#c0504e");
			clickablePoints = {};
			break;
		case ((optNum.length == 3 && optNum.slice(0, 2) == "14") || optNum == "15"):
			interval = 150;
			type = "area";
			zoom = true;
			label = "";
			content = "{y}, {label}";
			name = "";
			break;
	}
	sort = document.getElementById("sort" + optNum[0]);
	if (optNum[0] == "1") {
		sort = document.getElementById("sort" + optNum.slice(0, 2));
	}
	return [interval,
		content,
		type,
		colorSet,
		sort, clickablePoints, showInLegend, legendText, zoom, label, name];
}


function createChart(optNum, dataPoints, title, eventListener) {
	let [interval,
		content,
		type,
		colorSet,
		sort, clickablePoints, showInLegend, legendText, zoom, label, name] = editChartFeatures(optNum, dataPoints);
	let unsortedClickableDataPoints;
	CanvasJS.addColorSet("LabelColor", colorSet);
	var chart = new CanvasJS.Chart("chart" + optNum + "Container", {
		colorSet: "LabelColor",
		backgroundColor: "#ced8e5",
		axisX: {
			interval: interval
		},
		toolTip: {
			content: content + "{name}"
		},
		title: {
			text: title,
			horizontalAlign: "right"
		},
		legend: {
			horizontalAlign: "right",
			verticalAlign: "center",
			fontSize: 18
		},
		zoomEnabled: zoom,
		data: [{
			type: type,
			indexLabel: label,
			showInLegend: showInLegend,
			legendText: legendText,
			name: name,
			indexLabelFontColor: "#ef8a32",
			indexLabelFontWeight: "bold",
			dataPoints: dataPoints
				}]
	});
	chart.render();
	if (clickablePoints != null) {
		clickablePoints = createClickablePoints(optNum, dataPoints, null, chart.axisY[0].get("minimum"), chart.axisY[0].get("maximum"));
		chart.options.data.push(clickablePoints);
		chart.options.data[1].click = function (e) {
			if (!e.dataPoint.color) {
				e.dataPoint.color = "#ef8a32";
			} else {
				e.dataPoint.color = null;
			}
			addToChart(optNum, e.dataPoint.label);
			chart.render();
		};
		chart.render();
		sort.addEventListener("change", function () {
			if (this.checked) {
				chart.options.data[1].dataPoints = sortDataPointsArray(clickablePoints.dataPoints);
			} else {
				chart.options.data[1].dataPoints = createClickablePoints(optNum, dataPoints, clickablePoints.dataPoints, chart.axisY[0].get("minimum"), chart.axisY[0].get("maximum")).dataPoints;
			}
			chart.render();
		});
	}
	if (eventListener == 1) {
		sort.addEventListener("change", function () {
			if (this.checked) {
				chart.options.data[0].dataPoints = sortDataPointsArray(dataPoints);
			} else {
				chart.options.data[0].dataPoints = dataPoints;
			}
			chart.render();
		});
	}
}
