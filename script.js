const services = [
  {
    id:1,
    name:'Dry Cleaning',
    price:200,
    img:'https://cdn-icons-png.flaticon.com/512/3209/3209156.png'
  },
  {
    id:2,
    name:'Wash & Fold',
    price:300,
    img:'https://cdn-icons-png.flaticon.com/512/2974/2974990.png'
  },
  {
    id:3,
    name:'Ironing',
    price:150,
    img:'https://cdn-icons-png.flaticon.com/512/1047/1047717.png'
  },
  {
    id:4,
    name:'Stain Removal',
    price:250,
    img:'https://cdn-icons-png.flaticon.com/512/4903/4903428.png'
  },
  {
    id:5,
    name:'Leather & Suede Cleaning',
    price:899,
    img:'https://cdn-icons-png.flaticon.com/512/1188/1188631.png'
  },
  {
    id:6,
    name:'Wedding Dress Cleaning',
    price:2500,
    img:'https://cdn-icons-png.flaticon.com/512/2488/2488630.png'
  },
];

const cart = new Map();
const servicesList = document.getElementById('servicesList');
const cartItems = document.getElementById('cartItems');
const totalAmount = document.getElementById('totalAmount');
const bookBtn = document.getElementById('bookNow');
const fullName = document.getElementById('fullName');
const email = document.getElementById('email');
const phone = document.getElementById('phone');
const scrollServices = document.getElementById('scrollServices');

function renderServices(){
  servicesList.innerHTML='';
  services.forEach(s=>{
    const inCart = cart.has(s.id);
    const row = document.createElement('div');
    row.className='service'+(inCart?' selected':'');
    row.innerHTML=`
      <div class="service-left">
        <img class="service-icon" src="${s.img}" alt="${s.name}">
        <div class="service-name">${s.name}</div>
      </div>
      <div class="service-price">₹${s.price}</div>
      <button>${inCart?'Remove Item':'Add Item'}</button>
    `;
    row.querySelector('button').addEventListener('click',()=>{
      if(inCart) cart.delete(s.id); else cart.set(s.id,s);
      renderServices();renderCart();checkBookState();
    });
    servicesList.appendChild(row);
  });
}

function renderCart(){
  cartItems.innerHTML='';
  if(cart.size===0){
    cartItems.innerHTML='<div class="empty" style="color:var(--gray);font-size:14px">No items added yet.</div>';
    totalAmount.textContent='₹0';return;
  }
  let total=0;let idx=1;
  cart.forEach(s=>{
    total+=s.price;
    const line=document.createElement('div');
    line.className='cart-row';
    line.innerHTML=`<span>${idx++}. ${s.name}</span><span>₹${s.price}</span>`;
    cartItems.appendChild(line);
  });
  totalAmount.textContent='₹'+total;
}

function checkBookState(){
  const filled=fullName.value.trim()&&email.checkValidity()&&phone.value.trim().length>=7;
  bookBtn.disabled=!(cart.size>0 && filled);
}

[fullName,email,phone].forEach(el=>el.addEventListener('input',checkBookState));
bookBtn.addEventListener('click',e=>{
  e.preventDefault();
  alert('Booking successful for '+fullName.value+'!');
  cart.clear();renderServices();renderCart();bookBtn.disabled=true;fullName.value='';email.value='';phone.value='';
});

// Newsletter form handler
const newsletterForm = document.getElementById('newsletterForm');
if (newsletterForm) {
  const subscribeBtn = newsletterForm.querySelector('button');
  newsletterForm.addEventListener('submit', e => {
    e.preventDefault();
    subscribeBtn.textContent = 'Subscribed';
    subscribeBtn.disabled = true;
    subscribeBtn.style.opacity = '0.7';
  });
}

scrollServices?.addEventListener('click',()=>{
  document.querySelector('#services').scrollIntoView({behavior:'smooth'});
});

renderServices();renderCart();
