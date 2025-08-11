  // compare the current date with the date in the json file
async function checkFormalDays() {
    try {
      // get the current date as DD/MM/YYYY
      const currentDate = new Date();
      const options = { day: '2-digit', month: '2-digit', year: 'numeric' };
      const currentDateFormatted = currentDate.toLocaleDateString('en-GB', options);
      // loads formals days from the JSON file
      const formalDays = await loadJsonData('./js/formal_days.json');
  
      // Check if a formal date exists and returns the appropriate message
      if (formalDays[currentDateFormatted]) {
        const isFormal = formalDays[currentDateFormatted].is_formal;
        if (isFormal === "yes") {
          return { isFormal: "yes", message: formalDays[currentDateFormatted].name};
        } else if (isFormal === "maybe") {
          return { isFormal: "maybe", message: formalDays[currentDateFormatted].name };
        }
      }
      // If no formal date exists for today, return a default message
      return { isFormal: "no", message: "Today is not a formal day" };    
    } catch (error) {
      console.error("Failed to load data:", error);
    }
  }
  const dayMessage = checkFormalDays();
// Update the HTML file with the result
document.addEventListener("DOMContentLoaded", async () => {
    const result = await dayMessage;
    const messageElement = document.getElementById("formal-day-message");
    const yesNoMaybeElement = document.getElementById("yes-no-maybe");
    if (result.isFormal === "yes") {
        messageElement.textContent = result.message;
        yesNoMaybeElement.textContent = "Yes";
    } else if (result.isFormal === "maybe") {
        messageElement.textContent = result.message;
        yesNoMaybeElement.textContent = "Maybe";
    } else {
        messageElement.textContent = result.message;
        yesNoMaybeElement.textContent = "No";
    }
});

// Function to load JSON data from a file
async function loadJsonData(filePath) {
    try {
      const response = await fetch(filePath);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      return data;
    } catch (error) {
      console.error("Error loading JSON data:", error);
    }
  }
