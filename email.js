// Initialize EmailJS
emailjs.init('VtnbmacxYV16avRMy');

function sendBookingEmail(formElement) {
  return emailjs.sendForm('service_2brak9k', 'template_4jstrin', formElement);
}

// Export to global scope for script.js
window.sendBookingEmail = sendBookingEmail;
