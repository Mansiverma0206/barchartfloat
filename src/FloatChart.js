import React, { useEffect, useRef } from "react";
import { Chart, registerables } from "chart.js";
import ChartDataLabels from "chartjs-plugin-datalabels";

Chart.register(...registerables, ChartDataLabels);

const FloatBarChart = () => {
  const canvasRef = useRef(null);
  const newMidValue = [22, 19];

  useEffect(() => {
    // setup
    const data = {
      labels: ["C5", "OO"],
      datasets: [
        {
          label: "Red Sales",
          data: [
            { x: "C5", y: [7, newMidValue[0]] },
            { x: "OO", y: [8, newMidValue[1]] },
          ],
          backgroundColor: ["#395bae", "#1986e5"],
          borderWidth: 0,
        },
        {
          label: "Black Sales",
          data: [
            { x: "C5", y: [newMidValue[0], 24] },
            { x: "OO", y: [newMidValue[1], 23] },
          ],
          backgroundColor: ["#939cbb", "#4a9dfb"],
          borderWidth: 0,
        },
      ],
    };

    const topLabels = {
      id: "topLabels",
      afterDatasetsDraw(chart) {
        const {
          ctx,
          scales: { x, y },
        } = chart;

        chart.data.datasets.forEach((dataset) => {
          dataset.data.forEach((datapoint) => {
            const values = datapoint.y; // Array of values
            ctx.font = "bold 11px sans-serif";
            ctx.textAlign = "center";

            // Draw background for y[0] values of Black Sales

            // Draw all values with specific colors
            values.forEach((value, index) => {
              const xPos = x.getPixelForValue(datapoint.x);
              const yPos = y.getPixelForValue(value);

              if (dataset.label === "Black Sales" && index === 1) {
                ctx.fillStyle = "#000"; // Black for index 1 of Black Sales
              } else {
                ctx.fillStyle = "#fff"; // White for other values
              }

              if (!(dataset.label === "Black Sales" && index === 0)) {
                ctx.fillText(value, xPos, yPos - 2);
              }
            });
          });
        });
      },
    };
    
    const verticalLinePlugin = {
      id : "verticalLine",
      afterDatasetsDraw(chart){
        const {
          ctx,
          scales : {x,y},
        } = chart;
        chart.data.datasets.forEach((dataset)=>{
          dataset.data.forEach((datapoint)=>{
            const xPos = x.getPixelForValue(datapoint.x);
            ctx.beginPath();
            ctx.setLineDash([5, 5]); // Set line type to dashed
            ctx.moveTo(xPos,y.top);
            ctx.lineTo(xPos,y.bottom);
            ctx.lineWidth = 2;
            ctx.strokeStyle = "rgba(0, 0, 0, 0.2)"
            ctx.stroke();
            ctx.setLineDash([]); // Reset line type to solid for subsequent lines
          })
        })
      }
    }




    const config = {
      type: "bar",
      data,
      options: {
        plugins: {
          legend: {
            display: false, // Hide the legend
          },
          labels: {
            render: "value", // Render label as the 'value' of the bar
            font: { weight: "bold", size: 16 },
            position: "start", // Position the label at the end of the bar
          },
        },

        scales: {
          x: {
            grid : {
              display : false
             },
            stacked: true,
            title: {
              display: true,
              text: "unscheduled",
              color: "#000", // X axis title color
              font: {
                weight: "bold",
                size: 16,
              },
            },

            ticks: {
              color: "black",
              font: {
                weight: "bold",
                size: 16,
              },
            },
            align: "end",
          },

          y: {
            beginAtZero: true,
            max: 40, // Explicitly set the maximum value for the y-axis
            ticks: {
              color: "black",
              font: {
                weight: "bold",
                size: 16,
              },
              stepSize: 20, // Step size between ticks
              callback: function (value) {
                if (value === 0 || value === 20 || value === 40) {
                  return value; // Display only 0, 20, 40
                }
                return null; // Skip other values
              },
            },
          },
        },
      },
      plugins: [topLabels,verticalLinePlugin],
    };

    const myChart = new Chart(canvasRef.current, config);

    // Clean up
    return () => {
      myChart.destroy();
    };
  }, []);

  return (
    <div>
      <div
        className="chartBox"
        style={{ width: "fit-content", height: "fit-content" }}
      >
        <canvas ref={canvasRef} width={"400"} height={"330"}></canvas>
      </div>
    </div>
  );
};

export default FloatBarChart;
