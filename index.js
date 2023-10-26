// Initialize budget tracker state
const entries = document.querySelector(".entries");
const totalElement = document.querySelector(".total");
let total = 0;

// Load initial data from Local Storage
function load() {
  const entriesData = JSON.parse(
    localStorage.getItem("budget-entries") || "[]"
  );
  entriesData.forEach(addEntry);
  updateSummary();
}

// Save data to Local Storage and update the summary
function save() {
  const entriesData = Array.from(entries.querySelectorAll("tr")).map((row) => ({
    date: row.querySelector(".input-date").value,
    description: row.querySelector(".input-description").value,
    type: row.querySelector(".input-type").value,
    amount: parseFloat(row.querySelector(".input-amount").value) || 0,
  }));

  localStorage.setItem("budget-entries", JSON.stringify(entriesData));
  updateSummary();
}
///////
// Add a new entry row
function addEntry(entry = {}) {
  entries.insertAdjacentHTML("beforeend", entryHtml());

  const row = entries.querySelector("tr:last-of-type");
  const inputs = ["date", "description", "type", "amount"];

  inputs.forEach((input) => {
    const inputElement = row.querySelector(`.input-${input}`);
    inputElement.value = entry[input] || (input === "date" ? new Date().toISOString().split("T")[0] : "");

    // Add event listener to check for input validation
    inputElement.addEventListener("change", () => {
      // Check if any required input is empty, and disable the "New Entry" button accordingly
      const disableNewEntry = inputs.some((input) => {
        const inputElement = row.querySelector(`.input-${input}`);
        return (input === "amount" && parseFloat(inputElement.value) <= 0) || inputElement.value.trim() === "";
      });

      document.querySelector(".new-entry").disabled = disableNewEntry;
    });
  });

  row.querySelector(".delete-entry").addEventListener("click", onDeleteEntryBtnClick);
  inputs.forEach((input) => {
    row.querySelector(`.input-${input}`).addEventListener("change", save);
  });
}
/*

// Add a new entry row
function addEntry(entry = {}) {
  entries.insertAdjacentHTML("beforeend", entryHtml());

  const row = entries.querySelector("tr:last-of-type");
  const inputs = ["date", "description", "type", "amount"];

  inputs.forEach((input) => {
    row.querySelector(`.input-${input}`).value =
      entry[input] ||
      (input === "date" ? new Date().toISOString().split("T")[0] : "");
  });
  row
    .querySelector(".delete-entry")
    .addEventListener("click", onDeleteEntryBtnClick);
  inputs.forEach((input) => {
    row.querySelector(`.input-${input}`).addEventListener("change", save);
  });
}*/



// Remove an entry row
function onDeleteEntryBtnClick(e) {
  e.target.closest("tr").remove();
  save();
}

// Update the summary total
function updateSummary() {
  total = Array.from(entries.querySelectorAll("tr")).reduce((acc, row) => {
    const amount = parseFloat(row.querySelector(".input-amount").value) || 0;
    const isExpense = row.querySelector(".input-type").value === "expense";
    const modifier = isExpense ? -1 : 1;
    return acc + amount * modifier;
  }, 0);

  const totalFormatted = new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
  }).format(total);

  totalElement.textContent = totalFormatted;
}

// HTML template for a new entry row
function entryHtml() {
  return `
        <tr>
            <td><input class="input input-date" type="date"></td>
            <td><input class="input input-description" type="text" placeholder="Add a Description (e.g. Bills )"></td>
            <td><select class="input input-type" ><option value="income">Income</option><option value="expense">Expense</option></select></td>
            <td><input type="number" class="input input-amount"></td>
            <td><button type="button" class="delete-entry">&#10005;</button></td>
        </tr>
    `;
}
// seach button
// event listener to the search button
document
  .querySelector("#search-button")
  .addEventListener("click", searchEntries);

// Function to filter entries by date
function searchEntries() {
  const searchDate = document.querySelector("#search-date").value;
  const rows = Array.from(entries.querySelectorAll("tr"));

  if (searchDate) {
    rows.forEach((row) => {
      const dateInput = row.querySelector(".input-date");

      if (dateInput.value === searchDate) {
        row.style.display = "flex";
      } else {
        row.style.display = "none";
      }
    });
  }
}
// event listener to the clear button
document.querySelector("#clear-button").addEventListener("click", clearFilter);
const searchDate = document.querySelector("#search-date").value;

// Function to clear the filter and display all entries
function clearFilter() {
  const rows = Array.from(entries.querySelectorAll("tr"));
  rows.forEach((row) => {
    row.style.display = "flex";
  });
}

// Event listener for adding a new entry
document.querySelector(".new-entry").addEventListener("click", () => {
  addEntry();
});

// Initial load
load();
