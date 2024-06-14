



const checkbox = document.getElementById("checkbox")
checkbox.addEventListener("change", () => {
  document.body.classList.toggle("dark")
})


document.addEventListener("DOMContentLoaded", function () {
  var archivioArrows = document.querySelectorAll(".archivio-arrow");

  archivioArrows.forEach(function (arrow) {
    arrow.addEventListener("click", function () {
      var archivioSides = document.querySelectorAll(".archivio-side,.archivio-main");

      archivioSides.forEach(function (side) {
        side.classList.toggle("active");
      });
    });
  });
});

/***** SIDEBAR ACTIVE CLASS JAVASCRIPT ******/

// Select all elements with the class .head-arrow
var headArrows = document.querySelectorAll('.head-arrow');

// Loop through each element with the class .head-arrow and attach the click event listener
headArrows.forEach(function (headArrow) {
  headArrow.addEventListener('click', function () {
    // Select all elements with the class .sidebar and toggle the class .active
    var sidebars = document.querySelectorAll('.sidebar,.dashboard-right');
    sidebars.forEach(function (sidebar) {
      sidebar.classList.toggle('active');
    });
  });
});

// Get the checkbox element and the content div
var checkbox2 = document.getElementById('toggleSwitch');
var content = document.getElementById('content');
var content2 = document.getElementById('content2');

if(checkbox2 != null) {
  // Add event listener for when the checkbox is clicked
  checkbox2.addEventListener('change', function () {
    // Check if the checkbox is checked
    if (this.checked) {
      // If checked, show the content div
      content.style.display = 'block';
      content2.style.display = 'none';
    } else {
      // If unchecked, hide the content div
      content.style.display = 'none';
      content2.style.display = 'block';
    }
  });






// Check the initial state of the checkbox based on the content div's visibility
if (content.style.display === 'block') {
  checkbox2.checked = true;
} else {
  checkbox2.checked = false;
}

}
/*******/


// Get references to the checkbox and the div
var checkbox3 = document.getElementById('default-checkbox3');
var divToToggle = document.getElementById('cliente');

if(checkbox3 != null) {
// Add an event listener to the checkbox
checkbox3.addEventListener('change', function () {
  // Check if the checkbox is checked
  if (checkbox3.checked) {
    // If checked, add the class to the div
    divToToggle.classList.add('active');
  } else {
    // If not checked, remove the class from the div
    divToToggle.classList.remove('active');
  }
});
}


// Get references to the checkbox and the div
var checkbox4 = document.getElementById('default-checkbox46');
var divToToggle4 = document.getElementById('angra');
if(checkbox4 != null) {
  // Add an event listener to the checkbox
  checkbox4.addEventListener('change', function () {
    // Check if the checkbox is checked
    if (checkbox4.checked) {
      // If checked, add the class to the div
      divToToggle4.classList.add('active');
    } else {
      // If not checked, remove the class from the div
      divToToggle4.classList.remove('active');
    }
  });
}

// Get the input field and close icon
const inputField = document.getElementById('inputField');
const closeIcon = document.getElementById('closeIcon');

// Function to clear input field value
function clearInputField() {
  inputField.value = '';
  closeIcon.style.display = 'none'; // Hide the close icon
}

// Function to toggle close icon visibility based on input field content
function toggleCloseIcon() {
  closeIcon.style.display = inputField.value ? 'block' : 'none';
}

// Add event listeners for input field events
inputField.addEventListener('input', toggleCloseIcon);
closeIcon.addEventListener('click', clearInputField);