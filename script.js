const SHEET_ID = '1mk-KFNnnsmDKb8SEQREgG5juCjYexeTV7lRN8jIHGTk';
const API_KEY = 'AIzaSyCntxgMGOCFW34wA-AUYWMgafS-A44UXr0';
const RANGE = 'Sheet1!A:A';

async function fetchSheetData() {
    document.getElementById('randomCellContent').textContent = 'Loading...';
    try {
        // THIS IS THE LINE THAT'S GETTING MALFORMED:
        const url = `https://sheets.googleapis.com/v4/spreadsheets/${SHEET_ID}/values/${RANGE}?key=${API_KEY}`;
        const response = await fetch(url);

        if (!response.ok) {
            const errorText = await response.text();
            throw new Error(`HTTP error! Status: ${response.status}. Message: ${errorText}. Double check your Sheet ID, API Key, and API Key restrictions.`);
        }

        const data = await response.json();
        return data.values;
    } catch (error) {
        console.error("Error fetching data:", error);
        document.getElementById('randomCellContent').textContent = "Error! Couldn't load. Check browser console for details.";
        return null;
    }
}

function getRandomNonEmptyCell(data) {
    if (!data || data.length === 0) {
        return "No data found in your sheet's column.";
    }

    const nonEmptyCells = [];
    data.forEach(row => {
        row.forEach(cell => {
            if (typeof cell === 'string' && cell.trim() !== '') {
                nonEmptyCells.push(cell.trim());
            }
        });
    });

    if (nonEmptyCells.length === 0) {
        return "No non-empty items found in that column.";
    }

    const randomIndex = Math.floor(Math.random() * nonEmptyCells.length);
    return nonEmptyCells[randomIndex];
}

async function displayRandomCell() {
    const sheetData = await fetchSheetData();
    if (sheetData) {
        const cellContent = getRandomNonEmptyCell(sheetData);
        document.getElementById('randomCellContent').textContent = cellContent;
    }
}

displayRandomCell();

document.getElementById('generateButton').addEventListener('click', displayRandomCell);
document.getElementById('randomCellContent').addEventListener('click', displayRandomCell);