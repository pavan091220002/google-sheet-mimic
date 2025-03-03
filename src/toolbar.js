import React from "react";

const Toolbar = ({
  onBold,
  onItalic,
  onUnderline,
  onInsertFunction,
  onAddRow,
  onDeleteRow,
  onAddColumn,
  onDeleteColumn,
  onFontSizeChange,
  onColorChange,
  onBackgroundColorChange,
  onTrim,
  onUpper,
  onLower,
  onRemoveDuplicates,
  onFindAndReplace,
  onDataTypeChange,
  onSave,
  onLoad,
  onGenerateChart,
  isBoldActive,
  isItalicActive,
  isUnderlineActive, // New prop for data type change
}) => {
  return (
    (
      <div className="toolbar">
        <button
          className={`toolbar-button ${
            isBoldActive === true
              ? "active"
              : isBoldActive === "mixed"
              ? "mixed"
              : ""
          }`}
          onClick={onBold}
        >
          <strong>B</strong>
        </button>

        {/* Other buttons... */}
        <button onClick={onItalic}>
          <em>I</em>
        </button>
        <button onClick={onUnderline}>
          <u>U</u>
        </button>
        <button
          className={`toolbar-button ${
            isItalicActive === true
              ? "active"
              : isItalicActive === "mixed"
              ? "mixed"
              : ""
          }`}
          onClick={onItalic}
        >
          <em>I</em>
        </button>
        <button
          className={`toolbar-button ${
            isUnderlineActive === true
              ? "active"
              : isUnderlineActive === "mixed"
              ? "mixed"
              : ""
          }`}
          onClick={onUnderline}
        >
          <u>U</u>
        </button>
        {/* ... other buttons */}
      </div>
    ),
    (
      <div className="toolbar">
        {/* Styling Buttons */}
        <button onClick={onSave} title="Save Spreadsheet">
          Save
        </button>
        <button onClick={onLoad} title="Load Spreadsheet">
          Load
        </button>
        <button onClick={onBold} title="Bold">
          <strong>B</strong>
        </button>
        <button onClick={onItalic} title="Italic">
          <em>I</em>
        </button>
        <button onClick={onUnderline} title="Underline">
          <u>U</u>
        </button>

        {/* Data Quality Buttons */}
        <button onClick={onTrim} title="Trim">
          TRIM
        </button>
        <button onClick={onUpper} title="UPPER">
          UPPER
        </button>
        <button onClick={onLower} title="LOWER">
          LOWER
        </button>
        <button onClick={onRemoveDuplicates} title="Remove Duplicates">
          REMOVE DUPLICATES
        </button>
        <button onClick={onFindAndReplace} title="Find and Replace">
          FIND & REPLACE
        </button>

        {/* Other Toolbar Buttons */}
        <button onClick={onInsertFunction} title="Insert Function">
          Insert Function
        </button>
        <button onClick={onAddRow} title="Add Row">
          Add Row
        </button>
        <button onClick={onDeleteRow} title="Delete Row">
          Delete Row
        </button>
        <button onClick={onAddColumn} title="Add Column">
          Add Column
        </button>
        <button onClick={onDeleteColumn} title="Delete Column">
          Delete Column
        </button>

        {/* Font Size Input */}
        <input
          type="number"
          min="10"
          max="72"
          defaultValue="16"
          onChange={(e) => onFontSizeChange(e.target.value + "px")}
          placeholder="Font Size"
          title="Font Size"
        />

        {/* Text Color Picker */}
        <input
          type="color"
          defaultValue="#000000"
          onChange={(e) => onColorChange(e.target.value)}
          title="Text Color"
        />

        {/* Background Color Picker */}
        <input
          type="color"
          defaultValue="#ffffff"
          onChange={(e) => onBackgroundColorChange(e.target.value)}
          title="Background Color"
        />

        {/* Data Type Selector */}
        <select
          onChange={(e) => onDataTypeChange(e.target.value)}
          title="Data Type"
        >
          <option value="text">Text</option>
          <option value="number">Number</option>
          <option value="date">Date</option>
        </select>
        <button onClick={onGenerateChart} title="Generate Chart">
          Generate Chart
        </button>
      </div>
    )
  );
};

export default Toolbar;