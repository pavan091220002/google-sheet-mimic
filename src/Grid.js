import React, { useState, useEffect, useRef } from "react";
import "./App.css";
import { evaluateFormula } from "./utils";
import Toolbar from "./toolbar";
import ChartComponent from "./charts";
import useClickOutside from "./useClickOutside";

const generateColumnNames = (cols) => {
  return Array.from({ length: cols }, (_, i) => String.fromCharCode(65 + i));
};

const Grid = () => {
  const getMixedState = (property, defaultValue) => {
    if (selectedCells.length === 0) return false;
    const firstValue =
      formatting[selectedCells[0].row][selectedCells[0].col][property];
    const allSame = selectedCells.every(
      ({ row, col }) => formatting[row][col][property] === firstValue
    );
    return allSame ? firstValue === defaultValue : "mixed";
  };

  const [chartData, setChartData] = useState(null);
  const [isChartVisible, setIsChartVisible] = useState(false);
  const [chartType, setChartType] = useState("bar"); // Default chart type
  const [chartTitle, setChartTitle] = useState("Chart Title"); // Chart title
  const [showChartMenu, setShowChartMenu] = useState(false);
  const [rows, setRows] = useState(25);
  const [cols, setCols] = useState(15);
  const [data, setData] = useState(
    Array.from({ length: rows }, () => Array(cols).fill(""))
  );
  const [selectedCells, setSelectedCells] = useState([]);
  const [isSelecting, setIsSelecting] = useState(false);
  const [columnWidths, setColumnWidths] = useState(
    Array.from({ length: cols }, () => 100)
  );
  const [rowHeights, setRowHeights] = useState(
    Array.from({ length: rows }, () => 30)
  );
  const [formatting, setFormatting] = useState(
    Array.from({ length: rows }, () =>
      Array(cols).fill({
        fontWeight: "normal",
        fontStyle: "normal",
        textDecoration: "none",
        fontSize: "16px",
        color: "#000000",
        backgroundColor: "#ffffff", // Default background color
      })
    )
  );

  const [showFunctionMenu, setShowFunctionMenu] = useState(false);
  const [editingCell, setEditingCell] = useState(null);
  const gridRef = useRef(null);
  const columnNames = generateColumnNames(cols);
  const [dataTypes, setDataTypes] = useState(
    Array.from({ length: rows }, () => Array(cols).fill("text")) // Default to text
  );
  const chartRef = useRef(null);

  // Close the chart when clicking outside
  useClickOutside(chartRef, () => {
    setIsChartVisible(false);
  });

  const generateChart = () => {
    if (selectedCells.length < 2) {
      alert("Please select at least two cells to generate a chart.");
      return;
    }

    const labels = [];
    const values = [];

    // Use a Set to ensure labels are unique
    const uniqueLabels = new Set();

    selectedCells.forEach(({ row, col }) => {
      const label = `${String.fromCharCode(65 + col)}${row + 1}`; // Convert column index to letter (A, B, C, etc.)
      if (!uniqueLabels.has(label)) {
        uniqueLabels.add(label);
        labels.push(label);
        values.push(parseFloat(data[row][col]) || 0); // Convert cell value to a number
      }
    });

    setChartData({ labels, values });
    setIsChartVisible(true); // Show the chart
    setShowChartMenu(false); // Hide the chart menu after generating the chart
  };
  const handleChartTypeChange = (type) => {
    setChartType(type);
  };
  const handleChartTitleChange = (e) => {
    setChartTitle(e.target.value);
  };

  const saveSpreadsheet = () => {
    const spreadsheetData = {
      rows,
      cols,
      data,
      columnWidths,
      rowHeights,
      formatting,
      dataTypes,
    };
    localStorage.setItem("spreadsheetData", JSON.stringify(spreadsheetData));
    alert("Spreadsheet saved successfully!");
  };

  // Load spreadsheet data
  const loadSpreadsheet = () => {
    const savedData = localStorage.getItem("spreadsheetData");
    if (savedData) {
      const {
        rows: savedRows,
        cols: savedCols,
        data: loadedData, // Change this variable name to avoid conflict
        columnWidths: savedColumnWidths,
        rowHeights: savedRowHeights,
        formatting: savedFormatting,
        dataTypes: savedDataTypes,
      } = JSON.parse(savedData);

      setRows(savedRows);
      setCols(savedCols);
      setData(loadedData); // Use the new variable name here
      setColumnWidths(savedColumnWidths);
      setRowHeights(savedRowHeights);
      setFormatting(savedFormatting);
      setDataTypes(savedDataTypes);

      alert("Spreadsheet loaded successfully!");
    } else {
      alert("No saved data found.");
    }
  };

  // Handle cell value change
  const handleCellChange = (row, col, value) => {
    const newData = [...data];
    const newDataTypes = [...dataTypes];

    // Validate based on data type
    const expectedType = newDataTypes[row][col];

    if (expectedType === "number" && isNaN(value)) {
      alert("Please enter a valid number.");
      return; // Prevent invalid input
    }

    if (expectedType === "date") {
      const date = new Date(value);
      if (isNaN(date.getTime())) {
        alert("Please enter a valid date.");
        return; // Prevent invalid input
      }
    }

    newData[row][col] = value;
    setData(newData);
  };
  //focus input to next cell
  const focusInput = (row, col) => {
    // Find the input element for the specified cell
    const inputElement = document.querySelector(
      `td[row="${row}"][col="${col}"] input`
    );

    // Focus on the input element if it exists
    if (inputElement) {
      inputElement.focus();
    }
  };
  // Handle Enter key press
  const handleKeyDown = (e, row, col) => {
    const { key } = e;

    // Handle arrow key navigation
    switch (key) {
      case "ArrowUp":
        if (row > 0) {
          handleCellClick(row - 1, col, false); // Move to the cell above
          focusInput(row - 1, col); // Focus on the input field of the new cell
        }
        break;
      case "ArrowDown":
        if (row < rows - 1) {
          handleCellClick(row + 1, col, false); // Move to the cell below
          focusInput(row + 1, col); // Focus on the input field of the new cell
        }
        break;
      case "ArrowLeft":
        if (col > 0) {
          handleCellClick(row, col - 1, false); // Move to the cell on the left
          focusInput(row, col - 1); // Focus on the input field of the new cell
        }
        break;
      case "ArrowRight":
        if (col < cols - 1) {
          handleCellClick(row, col + 1, false); // Move to the cell on the right
          focusInput(row, col + 1); // Focus on the input field of the new cell
        }
        break;
      case "Enter":
        // Handle Enter key (existing logic)
        const newData = [...data];
        const cellValue = newData[row][col];

        if (typeof cellValue === "string" && cellValue.startsWith("=")) {
          try {
            newData[row][col] = evaluateFormula(cellValue, newData);
          } catch (error) {
            newData[row][col] = "ERROR";
          }
        }

        setData(newData);
        setEditingCell(null);
        break;
      default:
        break;
    }
  };

  // Handle cell blur
  const handleCellBlur = (row, col) => {
    const newData = [...data];
    const cellValue = newData[row][col];

    if (typeof cellValue === "string" && cellValue.startsWith("=")) {
      try {
        newData[row][col] = evaluateFormula(cellValue, newData);
      } catch (error) {
        newData[row][col] = "ERROR";
      }
    }

    setData(newData);
    setEditingCell(null);
  };

  // Handle Delete key press
  const handleDelete = () => {
    if (selectedCells.length === 0) return;

    const newData = [...data];
    selectedCells.forEach(({ row, col }) => {
      newData[row][col] = ""; // Clear the cell value
    });
    setData(newData);
  };

  // Handle column resizing
  useEffect(() => {
    if (!gridRef.current) return;

    const resizers = gridRef.current.querySelectorAll(".resizer");

    const handleMouseDown = (index) => (e) => {
      let startX = e.clientX;
      let startWidth = columnWidths[index];

      const handleMouseMove = (e) => {
        const newWidth = Math.max(50, startWidth + (e.clientX - startX));
        const newColumnWidths = [...columnWidths];
        newColumnWidths[index] = newWidth;
        setColumnWidths(newColumnWidths);
      };

      const handleMouseUp = () => {
        document.removeEventListener("mousemove", handleMouseMove);
        document.removeEventListener("mouseup", handleMouseUp);
      };

      document.addEventListener("mousemove", handleMouseMove);
      document.addEventListener("mouseup", handleMouseUp);
    };

    resizers.forEach((resizer, index) => {
      resizer.addEventListener("mousedown", handleMouseDown(index));
    });

    return () => {
      resizers.forEach((resizer, index) => {
        resizer.removeEventListener("mousedown", handleMouseDown(index));
      });
    };
  }, [columnWidths]);

  // Handle row resizing
  useEffect(() => {
    if (!gridRef.current) return;

    const rowResizers = gridRef.current.querySelectorAll(".row-resizer");

    const handleMouseDown = (index) => (e) => {
      let startY = e.clientY;
      let startHeight = rowHeights[index];

      const handleMouseMove = (e) => {
        const newHeight = Math.max(30, startHeight + (e.clientY - startY));
        const newRowHeights = [...rowHeights];
        newRowHeights[index] = newHeight;
        setRowHeights(newRowHeights);
      };

      const handleMouseUp = () => {
        document.removeEventListener("mousemove", handleMouseMove);
        document.removeEventListener("mouseup", handleMouseUp);
      };

      document.addEventListener("mousemove", handleMouseMove);
      document.addEventListener("mouseup", handleMouseUp);
    };

    rowResizers.forEach((resizer, index) => {
      resizer.addEventListener("mousedown", handleMouseDown(index));
    });

    return () => {
      rowResizers.forEach((resizer, index) => {
        resizer.removeEventListener("mousedown", handleMouseDown(index));
      });
    };
  }, [rowHeights]);

  // Handle cell selection
  const handleCellClick = (row, col, isShiftKey) => {
    if (isShiftKey) {
      // Add to selection range
      setSelectedCells((prev) => [...prev, { row, col }]);
    } else {
      // Start new selection
      setSelectedCells([{ row, col }]);
    }
  };

  // Handle mouse drag for selection
  useEffect(() => {
    const handleMouseDown = (e) => {
      if (e.target.tagName === "INPUT") return; // Ignore clicks on input fields
      setIsSelecting(true);
    };

    const handleMouseUp = () => {
      setIsSelecting(false);
    };

    const handleMouseMove = (e) => {
      if (!isSelecting) return;

      const cell = e.target.closest("td");
      if (cell) {
        const row = parseInt(cell.parentElement.firstChild.textContent) - 1;
        const col = Array.from(cell.parentElement.children).indexOf(cell) - 1;
        handleCellClick(row, col, true); // Add to selection
      }
    };

    window.addEventListener("mousedown", handleMouseDown);
    window.addEventListener("mouseup", handleMouseUp);
    window.addEventListener("mousemove", handleMouseMove);

    return () => {
      window.removeEventListener("mousedown", handleMouseDown);
      window.removeEventListener("mouseup", handleMouseUp);
      window.removeEventListener("mousemove", handleMouseMove);
    };
  }, [isSelecting]);

  // Handle Delete key press
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "Delete") {
        handleDelete();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [selectedCells]); // Re-run effect when selectedCells changes

  // Add a new row
  const addRow = () => {
    setRows((prev) => prev + 1);
    setData((prev) => [...prev, Array(cols).fill("")]);
    setRowHeights((prev) => [...prev, 30]); // Default row height
  };

  // Delete the last row
  const deleteRow = () => {
    if (rows === 1) return; // Prevent deleting all rows
    setRows((prev) => prev - 1);
    setData((prev) => prev.slice(0, -1));
    setRowHeights((prev) => prev.slice(0, -1));
  };

  // Add a new column
  const addColumn = () => {
    setCols((prev) => prev + 1);
    setData((prev) => prev.map((row) => [...row, ""]));
    setColumnWidths((prev) => [...prev, 100]); // Default column width
  };

  // Delete the last column
  const deleteColumn = () => {
    if (cols === 1) return; // Prevent deleting all columns
    setCols((prev) => prev - 1);
    setData((prev) => prev.map((row) => row.slice(0, -1)));
    setColumnWidths((prev) => prev.slice(0, -1));
  };

  // Formatting handlers (apply to all selected cells)
  const applyFormattingToSelectedCells = (styleKey, value) => {
    const newFormatting = [...formatting];
    selectedCells.forEach(({ row, col }) => {
      newFormatting[row][col] = {
        ...newFormatting[row][col],
        [styleKey]: value,
      };
    });
    setFormatting(newFormatting);
  };

  // Grid.js

  // Define the handlers for font size, text color, and background color

  const handleBold = () => {
    const newFormatting = formatting.map((row) => [...row]);
    const currentState = selectedCells.every(
      ({ row, col }) => newFormatting[row][col].fontWeight === "bold"
    );

    selectedCells.forEach(({ row, col }) => {
      newFormatting[row][col] = {
        ...newFormatting[row][col],
        fontWeight: currentState ? "normal" : "bold",
      };
    });

    setFormatting(newFormatting);
  };

  const handleItalic = () => {
    applyFormattingToSelectedCells(
      "fontStyle",
      formatting[selectedCells[0].row][selectedCells[0].col]?.fontStyle ===
        "italic"
        ? "normal"
        : "italic"
    );
  };

  const handleUnderline = () => {
    applyFormattingToSelectedCells(
      "textDecoration",
      formatting[selectedCells[0].row][selectedCells[0].col]?.textDecoration ===
        "underline"
        ? "none"
        : "underline"
    );
  };

  const handleFontSizeChange = (size) => {
    applyFormattingToSelectedCells("fontSize", size);
  };

  const handleColorChange = (color) => {
    applyFormattingToSelectedCells("color", color);
  };

  const handleBackgroundColorChange = (backgroundColor) => {
    applyFormattingToSelectedCells("backgroundColor", backgroundColor);
  };

  // Handle insert function
  const handleInsertFunction = () => {
    setShowFunctionMenu(true); // Show function menu
  };

  // Handle function selection
  const handleFunctionSelect = (func) => {
    if (selectedCells.length === 0) return;

    const { row, col } = selectedCells[0]; // Use the first selected cell
    const newData = [...data];
    newData[row][col] = `=${func}()`; // Insert the function
    setData(newData);
    setShowFunctionMenu(false); // Hide function menu
  };

  const handleTrim = () => {
    if (selectedCells.length === 0) {
      alert("Please select cells first!");
      return;
    }

    const newData = [...data];
    selectedCells.forEach(({ row, col }) => {
      newData[row][col] = newData[row][col].trim();
    });
    setData(newData);
  };

  const handleUpper = () => {
    if (selectedCells.length === 0) {
      alert("Please select cells first!");
      return;
    }

    const newData = [...data];
    selectedCells.forEach(({ row, col }) => {
      newData[row][col] = newData[row][col].toUpperCase();
    });
    setData(newData);
  };

  const handleLower = () => {
    if (selectedCells.length === 0) {
      alert("Please select cells first!");
      return;
    }

    const newData = [...data];
    selectedCells.forEach(({ row, col }) => {
      newData[row][col] = newData[row][col].toLowerCase();
    });
    setData(newData);
  };

  const handleRemoveDuplicates = () => {
    if (selectedCells.length === 0) {
      alert("No range selected. Please select a range first.");
      return;
    }

    // Determine unique row indices in the selected range
    const selectedRows = Array.from(
      new Set(selectedCells.map(({ row }) => row))
    ).sort((a, b) => a - b);

    if (selectedRows.length === 0) {
      alert("No valid rows selected.");
      return;
    }

    // Create a set to store unique rows
    const uniqueRows = new Set();
    const newData = [...data]; // Copy of the grid

    // Track rows that should be removed
    let hasDuplicates = false;
    const filteredRows = [];

    for (const rowIndex of selectedRows) {
      const rowString = JSON.stringify(data[rowIndex]);

      if (!uniqueRows.has(rowString)) {
        uniqueRows.add(rowString);
        filteredRows.push(data[rowIndex]); // Keep unique row
      } else {
        hasDuplicates = true; // Found a duplicate
      }
    }

    if (!hasDuplicates) {
      alert("No duplicate rows found in the selected range.");
      return;
    }

    // Replace selected rows with unique ones while keeping the grid structure
    let newRowIndex = 0;
    for (const rowIndex of selectedRows) {
      newData[rowIndex] =
        filteredRows[newRowIndex] || Array(data[rowIndex].length).fill(""); // Fill removed rows with empty arrays
      newRowIndex++;
    }

    setData(newData);
  };

  const handleDataTypeChange = (type) => {
    const newDataTypes = [...dataTypes];
    selectedCells.forEach(({ row, col }) => {
      newDataTypes[row][col] = type;
    });
    setDataTypes(newDataTypes);
  };

  const handleFindAndReplace = () => {
    // Prompt the user for the text to find
    const find = prompt("Enter text to find:");
    if (!find) return; // Exit if the user cancels or enters nothing

    // Prompt the user for the text to replace with
    const replace = prompt("Enter text to replace with:");
    if (!replace) return; // Exit if the user cancels or enters nothing

    // Ask the user if they want to apply to selected cells or the entire grid
    const applyTo = prompt("Apply to: (1) Selected Cells, (2) Entire Grid");
    if (!applyTo) return; // Exit if the user cancels

    // Create a copy of the data to avoid direct state mutation
    const newData = [...data];

    if (applyTo === "1") {
      // Apply to selected cells
      if (selectedCells.length === 0) {
        alert("Please select cells first!");
        return;
      }

      selectedCells.forEach(({ row, col }) => {
        if (newData[row][col].includes(find)) {
          newData[row][col] = newData[row][col].replace(
            new RegExp(find, "g"),
            replace
          );
        }
      });
    } else if (applyTo === "2") {
      // Apply to the entire grid
      for (let row = 0; row < newData.length; row++) {
        for (let col = 0; col < newData[row].length; col++) {
          if (newData[row][col].includes(find)) {
            newData[row][col] = newData[row][col].replace(
              new RegExp(find, "g"),
              replace
            );
          }
        }
      }
    } else {
      alert("Invalid option!");
      return;
    }

    // Update the state with the modified data
    setData(newData);
  };

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e) => {
      const { row, col } = selectedCells[selectedCells.length - 1] || {
        row: 0,
        col: 0,
      };
      switch (e.key) {
        case "ArrowUp":
          if (row > 0) handleCellClick(row - 1, col, e.shiftKey);
          break;
        case "ArrowDown":
          if (row < rows - 1) handleCellClick(row + 1, col, e.shiftKey);
          break;
        case "ArrowLeft":
          if (col > 0) handleCellClick(row, col - 1, e.shiftKey);
          break;
        case "ArrowRight":
          if (col < cols - 1) handleCellClick(row, col + 1, e.shiftKey);
          break;
        default:
          break;
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [selectedCells, rows, cols]);
  const isBoldActive = getMixedState("fontWeight", "bold");
  const isItalicActive = getMixedState("fontStyle", "italic");
  const isUnderlineActive = getMixedState("textDecoration", "underline");

  return (
    <div>
      <Toolbar
        onBold={handleBold}
        onItalic={handleItalic}
        onUnderline={handleUnderline}
        onInsertFunction={handleInsertFunction}
        onAddRow={addRow}
        onDeleteRow={deleteRow}
        onAddColumn={addColumn}
        onDeleteColumn={deleteColumn}
        onFontSizeChange={handleFontSizeChange}
        onColorChange={handleColorChange}
        onBackgroundColorChange={handleBackgroundColorChange}
        onTrim={handleTrim}
        onUpper={handleUpper}
        onLower={handleLower}
        onRemoveDuplicates={handleRemoveDuplicates}
        onFindAndReplace={handleFindAndReplace}
        onDataTypeChange={handleDataTypeChange}
        onSave={saveSpreadsheet}
        onLoad={loadSpreadsheet}
        onGenerateChart={() => setShowChartMenu(true)}
        isBoldActive={isBoldActive}
        isItalicActive={isItalicActive}
        isUnderlineActive={isUnderlineActive}
      />
      {/* Chart Menu */}
      {showChartMenu && (
        <div className="chart-menu">
          <button
            className="close-chart-menu"
            onClick={() => setShowChartMenu(false)}
          >
            &times;
          </button>
          <input
            type="text"
            placeholder="Enter Chart Title"
            value={chartTitle}
            onChange={handleChartTitleChange}
          />
          <select
            value={chartType}
            onChange={(e) => handleChartTypeChange(e.target.value)}
          >
            <option value="bar">Bar Chart</option>
            <option value="line">Line Chart</option>
            <option value="pie">Pie Chart</option>
            <option value="doughnut">Doughnut Chart</option>
            <option value="radar">Radar Chart</option>
          </select>
          <button onClick={generateChart}>Generate Chart</button>
        </div>
      )}

      {isChartVisible && (
        <div ref={chartRef} className="chart-container">
          {/* Close Button */}
          <button
            className="close-chart-button"
            onClick={() => setIsChartVisible(false)}
          >
            ×
          </button>
          {/* Chart Component */}
          <ChartComponent
            data={chartData}
            type={chartType}
            title={chartTitle}
          />
        </div>
      )}
      {showFunctionMenu && (
        <div className="function-menu">
          {/* Close Button */}
          <button
            className="close-menu-button"
            onClick={() => setShowFunctionMenu(false)}
          >
            ×
          </button>

          {/* Function Buttons Container */}
          <div className="function-buttons">
            <button onClick={() => handleFunctionSelect("SUM")}>SUM</button>
            <button onClick={() => handleFunctionSelect("AVERAGE")}>
              AVERAGE
            </button>
            <button onClick={() => handleFunctionSelect("MAX")}>MAX</button>
            <button onClick={() => handleFunctionSelect("MIN")}>MIN</button>
            <button onClick={() => handleFunctionSelect("COUNT")}>COUNT</button>
            <button onClick={() => handleFunctionSelect("PRODUCT")}>
              PRODUCT
            </button>
            <button onClick={() => handleFunctionSelect("STDEV")}>STDEV</button>
            <button onClick={() => handleFunctionSelect("MEDIAN")}>
              MEDIAN
            </button>
          </div>
        </div>
      )}
      <div className="grid-container">
        <table ref={gridRef}>
          <thead>
            <tr>
              <th></th>
              {columnNames.map((name, colIndex) => (
                <th
                  key={colIndex}
                  style={{
                    width: `${columnWidths[colIndex]}px`,
                    position: "relative",
                  }}
                >
                  {name}
                  <div className="resizer"></div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {data.map((rowData, rowIndex) => (
              <tr key={rowIndex}>
                <td>{rowIndex + 1}</td>
                {rowData.map((cell, colIndex) => (
                  <td
                    key={colIndex}
                    row={rowIndex}
                    col={colIndex}
                    className={
                      selectedCells.some(
                        (cell) => cell.row === rowIndex && cell.col === colIndex
                      )
                        ? "selected"
                        : ""
                    }
                    onClick={(e) =>
                      handleCellClick(rowIndex, colIndex, e.shiftKey)
                    }
                    style={{ position: "relative" }} // Ensure the parent <td> has relative positioning
                  >
                    <input
                      value={cell}
                      onChange={(e) =>
                        handleCellChange(rowIndex, colIndex, e.target.value)
                      }
                      onKeyDown={(e) => handleKeyDown(e, rowIndex, colIndex)}
                      onBlur={() => handleCellBlur(rowIndex, colIndex)}
                      onFocus={() => {
                        handleCellClick(rowIndex, colIndex, false);
                        setEditingCell({ row: rowIndex, col: colIndex });
                      }}
                      style={{
                        width: "100%",
                        border: "none",
                        outline: "none",
                        fontWeight: formatting[rowIndex][colIndex].fontWeight,
                        fontStyle: formatting[rowIndex][colIndex].fontStyle,
                        textDecoration:
                          formatting[rowIndex][colIndex].textDecoration,
                        fontSize: formatting[rowIndex][colIndex].fontSize,
                        color: formatting[rowIndex][colIndex].color,
                        backgroundColor:
                          formatting[rowIndex][colIndex].backgroundColor,
                      }}
                    />
                    {/* Plus symbol for dragging appears at the bottom-right corner */}
                    {selectedCells.some(
                      (cell) => cell.row === rowIndex && cell.col === colIndex
                    ) && <div className="selection-indicator"></div>}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Grid;