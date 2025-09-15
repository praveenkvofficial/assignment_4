var cart = [];

// Try to get the elements from the page
var servicesList = document.getElementById('servicesList');
var cartItems = document.getElementById('cartItems');
var totalAmount = document.getElementById('totalAmount');
var bookBtn = document.getElementById('bookNow');
var fullName = document.getElementById('fullName');
var email = document.getElementById('email');
var phone = document.getElementById('phone');
var scrollServices = document.getElementById('scrollServices');
var orderForm = document.getElementById('orderForm');
var orderIdField = document.getElementById('order_id');
var servicesField = document.getElementById('servicesHidden');
var totalField = document.getElementById('totalHidden');

// add and remove functionality for the services
function setupServiceButtons() {
  var serviceRows = servicesList.querySelectorAll('.service');
  for (var i = 0; i < serviceRows.length; i++) {
    var row = serviceRows[i];
    var id = row.getAttribute('data-id');
    var name = row.querySelector('.service-name').textContent;
    var priceText = row.querySelector('.service-price').textContent;
    var price = parseInt(priceText.replace(/[^0-9]/g, ''));
    var btn = row.querySelector('button');
    var found = false;
    for (var j = 0; j < cart.length; j++) {
      if (cart[j].id === id) {
        found = true;
        break;
      }
    }
    if (found) {
      row.className = 'service selected';
      btn.textContent = 'Remove Item';
    } else {
      row.className = 'service';
      btn.textContent = 'Add Item';
    }

    btn.onclick = (function(id, name, price) {
      return function() {
        var index = -1;
        for (var k = 0; k < cart.length; k++) {
          if (cart[k].id === id) {
            index = k;
            break;
          }
        }
        if (index > -1) {
          cart.splice(index, 1);
        } else {
          cart.push({id: id, name: name, price: price});
        }
        setupServiceButtons();
        showCart();
        checkBookState();
      };
    })(id, name, price);
  }
}

// We are showing all the items in the cart
function showCart() {
  var template = cartItems.querySelector('.cart-row-template');
  var emptyDiv = cartItems.querySelector('.empty');
  cartItems.innerHTML = '';
  cartItems.appendChild(emptyDiv);
  cartItems.appendChild(template);
  if (cart.length === 0) {
    emptyDiv.style.display = '';
    totalAmount.textContent = '₹0';
    return;
  }
  emptyDiv.style.display = 'none';
  var total = 0;
  for (var i = 0; i < cart.length; i++) {
    var s = cart[i];
    total = total + s.price;
    var line = template.cloneNode(true);
    line.style.display = '';
    line.querySelector('.cart-item-name').textContent = (i + 1) + '. ' + s.name;
    line.querySelector('.cart-item-price').textContent = '₹' + s.price;
    cartItems.appendChild(line);
  }
  totalAmount.textContent = '₹' + total;
}


// Checking if we can enable the book button if all the fields are filled and service is added
function checkBookState() {
  var filled = false;
  if (fullName.value.trim() !== '' && email.checkValidity() && phone.value.trim().length >= 7) {
    filled = true;
  }
  var cartNotEmpty = false;
  if (cart.length > 0) {
    cartNotEmpty = true;
  }
  if (cartNotEmpty && filled) {
    bookBtn.disabled = false;
  } else {
    bookBtn.disabled = true;
  }
}

fullName.addEventListener('input', checkBookState);
email.addEventListener('input', checkBookState);
phone.addEventListener('input', checkBookState);

// creating a renadom order id to send in the mail.
function makeOrderId() {
  var t = Date.now();
  var r = Math.floor(Math.random() * 9000) + 1000;
  return 'ORD-' + t + '-' + r;
}


// Summary of the cart
function getCartSummary() {
  var items = '';
  var total = 0;
  for (var i = 0; i < cart.length; i++) {
    var s = cart[i];
    items = items + (i + 1) + '. ' + s.name + ' (₹' + s.price + ')\n';
    total = total + s.price;
  }
  return {items: items, total: total};
}


//booking form submit
orderForm.addEventListener('submit', function(e) {
  e.preventDefault();
  if (cart.length === 0) {
    alert('Please add at least one service before booking.');
    return;
  }

  var summary = getCartSummary();
  var orderId = makeOrderId();
  orderIdField.value = orderId;
  servicesField.value = summary.items;
  totalField.value = '₹' + summary.total;

  var prevText = bookBtn.textContent;
  bookBtn.disabled = true;
  bookBtn.textContent = 'Book now';

  var bookingMsg = document.getElementById('bookingMessage');
  var emailMsg = document.getElementById('emailMessage');
  bookingMsg.textContent = '';
  emailMsg.textContent = '';

  if (window.sendBookingEmail) {
    window.sendBookingEmail(orderForm)
      .then(function() {
        bookingMsg.textContent = 'Thank you For Booking the Service. We will get back to you soon!';
        emailMsg.textContent = 'Confirmation mail has been sent to ' + email.value + '.';
        setTimeout(function() {
          bookingMsg.textContent = '';
          emailMsg.textContent = '';
        }, 15000);
        orderForm.reset();
        cart = [];
        setupServiceButtons();
        showCart();
        checkBookState();
      })
      .catch(function(err) {
        console.log(err);
        bookingMsg.textContent = 'Failed to send booking. Please try again.';
        emailMsg.textContent = '';
        bookBtn.disabled = false;
        bookBtn.textContent = prevText;
      });
  }
});

// Newsletter subscribe
var newsletterForm = document.getElementById('newsletterForm');
if (newsletterForm) {
  var subscribeBtn = newsletterForm.querySelector('button');
  newsletterForm.addEventListener('submit', function(e) {
    e.preventDefault();
    subscribeBtn.textContent = 'Subscribed';
    subscribeBtn.disabled = true;
    subscribeBtn.style.opacity = '0.7';
  });
}

//scroll to services
function scrollToServices() {
  var servicesSection = document.getElementById('services');
  if (servicesSection) {
    servicesSection.scrollIntoView({behavior:'smooth'});
  }
}


setupServiceButtons();
showCart();
