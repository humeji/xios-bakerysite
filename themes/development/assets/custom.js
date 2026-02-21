$(document).ready(function() {

  $('.product-form__submit').click(function() { 
    gtag('event', 'add_to_cart') 
  })

  $('.custom-tybo-checkout').click(function() {   
    gtag('event', 'begin_checkout') 
  })

  $('#create_customer').find(":button").click(function() {
    gtag('event', 'generate_lead')
  })    

  if (location.pathname === '/cart') { 

    function validateCartItems() {
      $.getJSON('/cart.js', function(cart) {
        var cartHasCookies = false;
        var cookiesCount = 0;
        var selectedCookieType = null;
        var selectedCookieCount = 0; 

        $('.custom-cart-qty-msg').hide(); 

        $(cart.items).each(function() {
          if (this.product_type == 'Cookies') {
            cookiesCount += this.quantity;
            cartHasCookies = true;
            
            if (this.quantity > selectedCookieCount) {
              selectedCookieCount = this.quantity;
              selectedCookieType = this.title;
            }

            if (this.quantity > 4) {
              $('.custom-cart-qty-msg').text('Please select at least 4 cookies in order to checkout ' + selectedCookieType);
              $('.custom-cart-qty-msg').show();
              $('.cart__checkout-button').prop('disabled', true);
              return false; 
            }
          }
        });

        if (!cartHasCookies || cookiesCount < 4) {
          $('.cart__checkout-button').prop('disabled', true); 
          $('.custom-cart-qty-msg').show(); 
        } else {
          $('.cart__checkout-button').prop('disabled', false); 
          $('.custom-cart-qty-msg').hide(); 
        }
      });
    }

    validateCartItems();

    setInterval(validateCartItems, 5000);

    $('.btn-cart-remove-item').click(function() {

      $('.cart__checkout-button').prop('disabled', true);
      setTimeout(function () {
        validateCartItems();
        $('.cart__checkout-button').prop('disabled', false);
      }, 2000);
    }) 
  }

  document.addEventListener('DOMContentLoaded', function () {
    const checkoutButton = document.getElementById('checkout'); 
    const cartForm = document.getElementById('cart');

    checkoutButton.addEventListener('click', function(event) {
      if (cartForm.checkValidity() === false) {
        event.preventDefault();
        event.stopPropagation();
      }
      cartForm.classList.add('was-validated');
    });
  });

});
