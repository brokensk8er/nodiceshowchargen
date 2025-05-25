const SHEET_ID = '1mk-KFNnnsmDKb8SEQREgG5juCjYexeTV7lRN8jIHGTk';
const API_KEY = 'AIzaSyCntxgMGOCFW34wA-AUYWMgafS-A44UXr0';
const RANGE = 'Sheet1!A:B';                 // <--- CHANGED: Now includes Column B

async function fetchSheetData() {
    document.getElementById('randomCellContent').textContent = 'Loading...';
    document.getElementById('flavorText').textContent = ''; // Clear flavor text during load
    try {
        const url = `https://sheets.googleapis.com/v4/spreadsheets/${SHEET_ID}/values/${RANGE}?key=${API_KEY}`;
        const response = await fetch(url);

        if (!response.ok) {
            const errorText = await response.text();
            throw new Error(`HTTP error! Status: ${response.status}. Message: ${errorText}. Double check your Sheet ID, API Key, and API Key restrictions.`);
        }

        const data = await response.json();
        return data.values; // This will now be an array of rows, where each row is [Column A value, Column B value]
    } catch (error) {
        console.error("Error fetching data:", error);
        document.getElementById('randomCellContent').textContent = "Error! Couldn't load. Check browser console for details.";
        document.getElementById('flavorText').textContent = '';
        return null;
    }
}

// <--- THIS FUNCTION IS REPLACED / MODIFIED ---
function getRandomRowData(data) {
    if (!data || data.length === 0) {
        return { mainIdea: "No data found.", flavor: "" };
    }

    // Filter out rows that are completely empty (no value in A or B)
    const nonEmptyRows = data.filter(row =>
        (row[0] && row[0].trim() !== '') || (row[1] && row[1].trim() !== '')
    );

    if (nonEmptyRows.length === 0) {
        return { mainIdea: "No non-empty rows found.", flavor: "" };
    }

    const randomIndex = Math.floor(Math.random() * nonEmptyRows.length);
    const selectedRow = nonEmptyRows[randomIndex];

    // Get the value from Column A (index 0) and Column B (index 1)
    const mainIdea = (selectedRow[0] || '').trim(); // Default to empty string if undefined/null
    const flavor = (selectedRow[1] || '').trim();   // Default to empty string if undefined/null

    return { mainIdea, flavor };
}
// <--- END OF REPLACED/MODIFIED FUNCTION ---


// <--- THIS FUNCTION IS REPLACED / MODIFIED ---
async function displayRandomCell() {
    document.getElementById('randomCellContent').textContent = 'Generating...'; // Update loading text
    document.getElementById('flavorText').textContent = ''; // Clear previous flavor text

    const sheetData = await fetchSheetData();
    if (sheetData) {
        const { mainIdea, flavor } = getRandomRowData(sheetData); // Destructure the returned object
        document.getElementById('randomCellContent').textContent = mainIdea;

        // Only display flavor text if it exists
        if (flavor) {
            document.getElementById('flavorText').textContent = flavor;
        } else {
            document.getElementById('flavorText').textContent = ''; // Ensure it's cleared if no flavor text
        }
    }
}
// <--- END OF REPLACED/MODIFIED FUNCTION ---

// Initial load
displayRandomCell();

// Add event listeners to the button and content
document.getElementById('generateButton').addEventListener('click', displayRandomCell);
document.getElementById('randomCellContent').addEventListener('click', displayRandomCell);
document.getElementById('flavorText').addEventListener('click', displayRandomCell); // Make flavor text clickable too