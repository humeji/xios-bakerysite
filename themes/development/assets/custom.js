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
    
    const MINIMUM_ORDER_AMOUNT = Number.parseFloat($('[data-minimum-order]').attr('data-minimum-order')) || 40;
    const ENABLE_MINIMUM_ORDER = $('[data-minimum-order]').attr('data-enable-minimum-order') !== 'false';

    function validateCartItems() {
      $.getJSON('/cart.js', function(cart) {
        const cartTotal = cart.total_price / 100;
        let hasDigitalProducts = false;
        const hasItems = cart.items.length > 0;

        $(cart.items).each(function() {
          if (this.requires_shipping === false) {
            hasDigitalProducts = true;
          }
        });

        $('.custom-cart-qty-msg').hide();
        
        if (hasDigitalProducts) {
          $('.digital-no-refund-msg').show();
        } else {
          $('.digital-no-refund-msg').hide();
        }

        if (!hasItems) {
          $('.cart__checkout-button').prop('disabled', true);
          return;
        }

        if (ENABLE_MINIMUM_ORDER && cartTotal < MINIMUM_ORDER_AMOUNT) {
          const message = 'Minimum order amount is $' + MINIMUM_ORDER_AMOUNT.toFixed(2) + 
                        '. Current total: $' + cartTotal.toFixed(2);
          $('.custom-cart-qty-msg').text(message).show();
          $('.cart__checkout-button').prop('disabled', true);
        } else {
          $('.cart__checkout-button').prop('disabled', false);
        }
      });
    }

    validateCartItems();

    setInterval(validateCartItems, 5000);

    $('.btn-cart-remove-item').click(function() {
      $('.cart__checkout-button').prop('disabled', true);
      setTimeout(function () {
        validateCartItems();
      }, 2000);
    });
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
