window.onload = function () {

    var options = {
      animationEnabled: true,
      title: {
        text: "GDP Growth Rate - 2020"
      },
      axisY: {
        title: "Growth Rate (in %)",
        suffix: "%",
        includeZero: false
      },
      axisX: {
        title: "Countries"
      },
      data: [{
        type: "column",
        yValueFormatString: "#,##0.0#"%"",
        dataPoints: [
          { label: "USA", y: 10.09 },
          { label: "PK", y: 9.40 },
          { label: "SP", y: 8.50 },
          { label: "UK", y: 7.96 },
          { label: "IN", y: 7.80 },
          { label: "BN", y: 7.56 },
          { label: "CN", y: 7.20 },
          { label: "IR", y: 7.1 }

        ]
      }]
    };
    $("#chartContainer").CanvasJSChart(options);
}
