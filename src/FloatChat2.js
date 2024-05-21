import React, { useEffect, useRef } from "react";
import { Chart, plugins, registerables } from "chart.js";
import ChartDataLabels from "chartjs-plugin-datalabels";


Chart.register(...registerables,);

const FloatBarChart2 = () => {
  const canvasRef = useRef(null);

  useEffect(() => {
    // setup
    const data = {
      labels: ["Unscheduled","Scheduled"],
      datasets: [
        {
          label: "Red Sales",
          data: [22,8 ],
          backgroundColor: ["#3e61b2", "#1986e5",],
          borderWidth: 1,
          datalabels : {
            color : 'black ',
            anchor :'end',
            align : 'top',
            offset : 5,
            font: {
               weight: 'bold', // You can also set other font properties here
               size: 16, // Set the font size here
             },
          }
        },
      ],
    };

    const config = {
      type: "bar",
      data,
      options: {
        plugins: {
          datalabels : {
            anchor : 'start'
          },
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
            stacked: true,

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
            max: 100, // Explicitly set the maximum value for the y-axis
            ticks: {
              color: "black",
              font: {
                weight: "bold",
                size: 16,
              },
              stepSize: 50, // Step size between ticks
              callback: function (value) {
                if (value === 0 || value === 50 || value === 100) {
                  return value; // Display only 0, 20, 40
                }
                return null; // Skip other values
              },
            },
          },
        },
      },
    plugins: [ChartDataLabels]
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

export default FloatBarChart2;
