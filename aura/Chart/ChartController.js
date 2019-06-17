/**
 * Created by czeleznick002 on 04.12.2018.
 */
({
    generateChart : function(component, event, helper) {
        var chartdata = {
            labels: ['Sunday','Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
            datasets: [
                {
                    label:'Day',
                    data: [110, 290, 150, 250, 500, 420, 100],
                    borderColor:'rgba(62, 159, 222, 1)',
                    fill: false,
                    pointBackgroundColor: "#FFFFFF",
                    pointBorderWidth: 4,
                    pointHoverRadius: 5,
                    pointRadius: 3,
                    bezierCurve: true,
                    pointHitRadius: 10
                }
            ]
        }
        //Get the context of the canvas element we want to select
        var ctx = component.find("chart").getElement();
        var lineChart = new Chart(ctx ,{
            type: 'line',
            data: chartdata,
            options: {
                legend: {
                    position: 'bottom',
                    padding: 10,
                },
                responsive: true
            }
        });
    }
})