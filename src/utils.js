const evaluateFormula = (formula, data) => {
    if (formula.startsWith("=")) {
      try {
        // Extract the function name and arguments
        const functionName = formula.slice(1).split("(")[0].toUpperCase();
        const range = formula.match(/\(([^)]+)\)/)[1]; // Extract range inside parentheses
  
        // Parse the range (e.g., "A1:C1")
        const [startCell, endCell] = range.split(":");
        const startCol = startCell.charCodeAt(0) - 65; // Convert A, B, C to 0, 1, 2
        const startRow = parseInt(startCell.slice(1)) - 1;
        const endCol = endCell.charCodeAt(0) - 65;
        const endRow = parseInt(endCell.slice(1)) - 1;
  
        console.log("Parsed range:", { startCol, startRow, endCol, endRow }); // Debugging line
  
        // Extract values from the range
        const values = [];
        for (let row = startRow; row <= endRow; row++) {
          for (let col = startCol; col <= endCol; col++) {
            const value = data[row][col];
            console.log(`Cell [${row}, ${col}]:`, value); // Debugging line
            if (!isNaN(value)) {
              values.push(parseFloat(value)); // Only include numeric values
            }
          }
        }
  
        console.log("Values in range:", values); // Debugging line
  
        // Perform the calculation based on the function
        switch (functionName) {
          case "SUM":
            return values.reduce((acc, val) => acc + val, 0);
          case "AVERAGE":
            return values.reduce((acc, val) => acc + val, 0) / values.length;
          case "MAX":
            return Math.max(...values);
          case "MIN":
            return Math.min(...values);
          case "COUNT":
            return values.length;
          case "PRODUCT":
            return values.reduce((acc, val) => acc * val, 1);
          case "STDEV": {
            const mean =
              values.reduce((acc, val) => acc + val, 0) / values.length;
            const variance =
              values.reduce((acc, val) => acc + Math.pow(val - mean, 2), 0) /
              values.length;
            return Math.sqrt(variance);
          }
          case "MEDIAN": {
            const sortedValues = values.slice().sort((a, b) => a - b); // Sort the values
            const mid = Math.floor(sortedValues.length / 2); // Find the middle index
            if (sortedValues.length % 2 === 0) {
              // If even, average the two middle values
              return (sortedValues[mid - 1] + sortedValues[mid]) / 2;
            } else {
              // If odd, return the middle value
              return sortedValues[mid];
            }
          }
          default:
            return "ERROR: Unknown function";
        }
      } catch (e) {
        return "ERROR";
      }
    }
    return formula;
  };
  
  // Export evaluateFormula
  export { evaluateFormula };
  
  // Other utility functions
  export const applyDataQualityFunction = (func, value) => {
    switch (func) {
      case "TRIM":
        return value.trim();
      case "ISNUMBER":
        return !isNaN(value);
      case "ISBLANK":
        return value === "";
      default:
        return value;
    }
  };