# Spreadsheet Application

A Google Sheets-like web application built with React that allows users to create, edit, and manage spreadsheet data with formula support, data visualization, and data quality features.

## Technology Stack

### Frontend
- **React**: Chosen for its component-based architecture which makes it ideal for building a complex UI with reusable components like cells, rows, and toolbars
- **JavaScript (ES6+)**: Provides modern language features for handling complex spreadsheet operations
- **CSS3**: Used for styling and responsive design
- **Chart.js**: Implemented for data visualization capabilities

### Architecture & Data Structures

#### Core Data Structure
The application uses a two-dimensional array as the primary data structure for the spreadsheet grid:
```javascript
const [data, setData] = useState(Array(numRows).fill().map(() => Array(numCols).fill('')));
```

This structure was chosen for:
- Direct cell access using row and column indices (O(1) time complexity)
- Intuitive representation of the grid layout
- Easy serialization for saving/loading functionality

#### Formula Evaluation
The application implements a custom formula parser and evaluator in `utils.js` that:
- Handles cell references (A1, B2, etc.)
- Supports range references (A1:C3)
- Implements mathematical functions (SUM, AVERAGE, MAX, MIN, COUNT, etc.)
- Maintains a dependency graph for automatic recalculation

#### State Management
React's useState and useEffect hooks manage:
- Cell data and formatting
- Selected cells tracking
- Undo/redo history
- Formula bar state

#### UI Components
- **Toolbar**: Contains formatting controls and spreadsheet operations
- **Grid**: Renders the spreadsheet with row/column headers
- **FormulaBar**: Allows direct formula entry and editing
- **ContextMenu**: Provides right-click functionality

## Features

- **Cell Formatting**: Bold, italic, underline, font size, color
- **Formula Support**: Mathematical functions (SUM, AVERAGE, MAX, MIN, COUNT, PRODUCT, STDEV, MEDIAN)
- **Data Quality Functions**: TRIM, UPPER, LOWER, removal of duplicates, find and replace
- **Data Types**: Support for text, numbers, and dates
- **Row/Column Management**: Add/delete rows and columns
- **Save/Load**: Persistence of spreadsheet data
- **Data Visualization**: Chart generation based on selected data

## Implementation Details

### Cell References and Formula Evaluation
The application implements a custom algorithm to evaluate formulas:
1. Parse the formula to identify function name and arguments
2. Resolve cell references to their actual values
3. Apply the appropriate mathematical function
4. Handle errors gracefully

### Performance Considerations
- Selective re-rendering using React's memo and careful state management
- Efficient formula evaluation by caching intermediate results
- Optimized range operations for large data sets

## Future Enhancements
- Collaborative editing using WebSockets
- Advanced cell formatting options
- Mobile-responsive design
- Import/export to CSV and Excel formats
- More advanced chart types and customization options

## Available Scripts

In the project directory, you can run:

### `npm start`

Runs the app in the development mode.
Open [http://localhost:3000](http://localhost:3000) to view it in your browser.

The page will reload when you make changes.
You may also see any lint errors in the console.

### `npm test`

Launches the test runner in the interactive watch mode.
See the section about [running tests](https://facebook.github.io/create-react-app/docs/running-tests) for more information.

### `npm run build`

Builds the app for production to the `build` folder.
It correctly bundles React in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.
Your app is ready to be deployed!

See the section about [deployment](https://facebook.github.io/create-react-app/docs/deployment) for more information.

### `npm run eject`

**Note: this is a one-way operation. Once you `eject`, you can't go back!**

If you aren't satisfied with the build tool and configuration choices, you can `eject` at any time. This command will remove the single build dependency from your project.

Instead, it will copy all the configuration files and the transitive dependencies (webpack, Babel, ESLint, etc) right into your project so you have full control over them. All of the commands except `eject` will still work, but they will point to the copied scripts so you can tweak them. At this point you're on your own.

You don't have to ever use `eject`. The curated feature set is suitable for small and middle deployments, and you shouldn't feel obligated to use this feature. However we understand that this tool wouldn't be useful if you couldn't customize it when you are ready for it.

## Learn More

You can learn more in the [Create React App documentation](https://facebook.github.io/create-react-app/docs/getting-started).

To learn React, check out the [React documentation](https://reactjs.org/).

### Code Splitting

This section has moved here: [https://facebook.github.io/create-react-app/docs/code-splitting](https://facebook.github.io/create-react-app/docs/code-splitting)

### Analyzing the Bundle Size

This section has moved here: [https://facebook.github.io/create-react-app/docs/analyzing-the-bundle-size](https://facebook.github.io/create-react-app/docs/analyzing-the-bundle-size)

### Making a Progressive Web App

This section has moved here: [https://facebook.github.io/create-react-app/docs/making-a-progressive-web-app](https://facebook.github.io/create-react-app/docs/making-a-progressive-web-app)

### Advanced Configuration

This section has moved here: [https://facebook.github.io/create-react-app/docs/advanced-configuration](https://facebook.github.io/create-react-app/docs/advanced-configuration)

### Deployment

This section has moved here: [https://facebook.github.io/create-react-app/docs/deployment](https://facebook.github.io/create-react-app/docs/deployment)

### `npm run build` fails to minify

This section has moved here: [https://facebook.github.io/create-react-app/docs/troubleshooting#npm-run-build-fails-to-minify](https://facebook.github.io/create-react-app/docs/troubleshooting#npm-run-build-fails-to-minify)
