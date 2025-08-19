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
      
      const formalDates = Object.keys(formalDays).filter(date => formalDays[date].is_formal === "yes");
        

      // If no formal date exists for today, return next formal date
      for (const date of formalDates) {
        const formalDate = new Date(date.split('/').reverse().join('-'));
        if (formalDate > currentDate) {
          return { isFormal: "no", message: `${formatDateInWords(formalDate)}` };
        }
      };    
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

    // Get the lang attribute from the elements
    const lang = messageElement.getAttribute("lang") || "en"; // Default to English if lang is not set

    if (result.isFormal === "yes" || result.isFormal === "maybe") {
        messageElement.textContent = result.message;
        yesNoMaybeElement.textContent = getLocalizedStrings(lang, result.isFormal);
    } else {
        messageElement.textContent = getLocalizedStrings(lang, "isFormal", result.message);
        yesNoMaybeElement.textContent = getLocalizedStrings(lang, result.isFormal);
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

function formatDateInWords(date) {
  const options = { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' };
  return new Intl.DateTimeFormat('en-GB', options).format(date);
}

// Function to get localized strings based on the lang attribute
function getLocalizedStrings(lang, isFormal, message) {
    const translations = {
        en: {
            yes: "Yes",
            maybe: "Maybe",
            no: "No",
            nextFormal: `The next formal day is on ${message}`
        },
        mi: {
            yes: "Āe",
            maybe: "Pea",
            no: "Kahore",
            nextFormal: `Ko te rā hōtaka e whai ake nei hei te ${message}`
        },
        zh: {
            yes: "是的",
            maybe: "或许",
            no: "不",
            nextFormal: `下一个正式的日子是 ${message}`
        }
    };

    const localizedStrings = translations[lang] || translations.en; // Default to English if lang is not found
    if (isFormal === "yes") return localizedStrings.yes;
    if (isFormal === "maybe") return localizedStrings.maybe;
    if (isFormal === "no") return localizedStrings.no;
    if (isFormal === "isFormal") return localizedStrings.nextFormal.replace("${message}", message);

}


