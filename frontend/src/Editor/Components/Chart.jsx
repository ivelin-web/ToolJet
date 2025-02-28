import React, { useState, useEffect, useMemo } from 'react';

// Use plotly basic bundle
import Plotly from 'plotly.js-basic-dist-min';
import createPlotlyComponent from 'react-plotly.js/factory';
const Plot = createPlotlyComponent(Plotly);

export const Chart = function Chart({ width, height, darkMode, properties, styles }) {
  const [loadingState, setLoadingState] = useState(false);

  const { visibility, disabledState } = styles;
  const { title, markerColor, showGridLines, type, data } = properties;

  useEffect(() => {
    const loadingStateProperty = properties.loadingState;
    if (loadingStateProperty != undefined) {
      setLoadingState(loadingStateProperty);
    }
  }, [properties.loadingState]);

  const computedStyles = {
    width: width - 4,
    height,
    display: visibility ? '' : 'none',
    background: darkMode ? '#1f2936' : 'white',
  };

  const dataString = data ?? [];

  const chartType = type;

  const fontColor = darkMode ? '#c3c3c3' : null;

  const layout = {
    width: width - 4,
    height,
    plot_bgcolor: darkMode ? '#1f2936' : null,
    paper_bgcolor: darkMode ? '#1f2936' : null,
    title: {
      text: title,
      font: {
        color: fontColor,
      },
    },
    legend: {
      text: title,
      font: {
        color: fontColor,
      },
    },
    xaxis: {
      showgrid: showGridLines,
      showline: true,
      color: fontColor,
    },
    yaxis: {
      showgrid: showGridLines,
      showline: true,
      color: fontColor,
    },
  };

  const computeChartData = (data, dataString) => {
    let rawData = data;
    if (typeof rawData === 'string') {
      try {
        rawData = JSON.parse(dataString);
      } catch (err) {
        rawData = [];
      }
    }

    if (!Array.isArray(rawData)) {
      rawData = [];
    }

    let newData = [];

    if (chartType === 'pie') {
      newData = [
        {
          type: chartType,
          values: rawData.map((item) => item['value']),
          labels: rawData.map((item) => item['label']),
        },
      ];
    } else {
      newData = [
        {
          type: chartType || 'line',
          x: rawData.map((item) => item['x']),
          y: rawData.map((item) => item['y']),
          marker: { color: markerColor },
        },
      ];
    }

    return newData;
  };

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const memoizedChartData = useMemo(() => computeChartData(data, dataString), [data, dataString]);

  return (
    <div data-disabled={disabledState} style={computedStyles}>
      {loadingState === true ? (
        <div style={{ width }} className="p-2">
          <center>
            <div className="spinner-border mt-5" role="status"></div>
          </center>
        </div>
      ) : (
        <Plot
          data={memoizedChartData}
          layout={layout}
          config={{
            displayModeBar: false,
            // staticPlot: true
          }}
        />
      )}
    </div>
  );
};
