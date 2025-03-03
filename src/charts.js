import React, { useRef, useEffect } from "react";
import { Chart } from "chart.js/auto";

const ChartComponent = ({ data, type, title }) => {
  const chartRef = useRef(null);

  // Function to generate random colors
  const generateColors = (count) => {
    const colors = [];
    for (let i = 0; i < count; i++) {
      const color = `rgba(${Math.floor(Math.random() * 256)}, ${Math.floor(
        Math.random() * 256
      )}, ${Math.floor(Math.random() * 256)}, 0.2)`;
      colors.push(color);
    }
    return colors;
  };

  useEffect(() => {
    if (chartRef.current) {
      // Destroy previous chart
      if (chartRef.current?.chart) {
        chartRef.current.chart.destroy();
      }

      // Create new chart
      const ctx = chartRef.current.getContext("2d");

      try {
        chartRef.current.chart = new Chart(ctx, {
          type: type || "bar", // Default to bar chart
          data: {
            labels: data?.labels || [],
            datasets: [
              {
                label: title || "Data",
                data: data?.values || [],
                backgroundColor: generateColors(data?.values?.length || 0),
                borderColor: generateColors(data?.values?.length || 0).map(
                  (color) => color.replace("0.2", "1")
                ),
                borderWidth: 1,
              },
            ],
          },
          options: {
            responsive: true,
            plugins: {
              legend: {
                display: true,
                position: "top",
              },
              title: {
                display: true,
                text: title || "Chart",
              },
            },
            scales: {
              y: {
                beginAtZero: true,
              },
            },
          },
        });
      } catch (error) {
        console.error("Failed to create chart:", error);
      }

      // Cleanup function
      return () => {
        if (chartRef.current?.chart) {
          chartRef.current.chart.destroy();
        }
      };
    }
  }, [data, type, title]);

  return <canvas ref={chartRef} />;
};

export default ChartComponent;