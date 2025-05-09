document.addEventListener('DOMContentLoaded', function () {
  // Elements
  const form = document.getElementById('donation-form');
  const amountInput = document.getElementById('amount');
  const cardNameInput = document.getElementById('card-name');
  const cardNumberInput = document.getElementById('card-number');
  const expiryInput = document.getElementById('expiry');
  const cvvInput = document.getElementById('cvv');
  const donateButton = document.getElementById('donate-button');
  const quickAmountButtons = document.querySelectorAll('.quick-amount');

  // Set up quick amount buttons 
  quickAmountButtons.forEach(button => {
    button.addEventListener('click', function() {
      const amount = this.getAttribute('data-amount');
      amountInput.value = amount;
      
      // Reset active state on all buttons
      quickAmountButtons.forEach(btn => {
        btn.classList.remove('active');
        btn.classList.remove('btn-primary');
        btn.classList.add('btn-outline-primary');
      });
      
      // Set active state on current button
      this.classList.remove('btn-outline-primary');
      this.classList.add('btn-primary');
      this.classList.add('active');
      
      validateAmount();
    });
  });

  // Also update active button when amount is manually changed
  amountInput.addEventListener('input', function() {
    const currentAmount = this.value;
    
    // Reset all buttons
    quickAmountButtons.forEach(btn => {
      const btnAmount = btn.getAttribute('data-amount');
      if (btnAmount === currentAmount) {
        btn.classList.remove('btn-outline-primary');
        btn.classList.add('btn-primary');
        btn.classList.add('active');
      } else {
        btn.classList.remove('active');
        btn.classList.remove('btn-primary');
        btn.classList.add('btn-outline-primary');
      }
    });
  });

  // Validation flags
  const validationState = {
    amount: false,
    cardName: false,
    cardNumber: false,
    expiry: false,
    cvv: false,
  };

  // Debugging helper
  function logValidationState() {
    console.log("Validation State:", validationState);
  }

  // Function to check all validations and enable/disable button
  function checkFormValidity() {
    const isValid = Object.values(validationState).every((value) => value === true);
    logValidationState(); // Log state for debugging
    donateButton.disabled = !isValid;
  }

  // Function to display validation error
  function showValidationError(input, errorMessage) {
    input.classList.add('is-invalid');
    input.classList.remove('is-valid');
    const fieldName = input.getAttribute('data-validation-key');
    validationState[fieldName] = false;
    checkFormValidity();
  }

  // Function to clear validation error
  function clearValidationError(input) {
    input.classList.remove('is-invalid');
    input.classList.add('is-valid');
    const fieldName = input.getAttribute('data-validation-key');
    validationState[fieldName] = true;
    checkFormValidity();
  }

  // Amount validation
  function validateAmount() {
    const amount = parseFloat(amountInput.value);
    if (isNaN(amount) || amount < 1) {
      showValidationError(amountInput, 'Invalid amount');
    } else {
      clearValidationError(amountInput);
    }
  }

  // Card name validation
  function validateCardName() {
    const cardName = cardNameInput.value.trim();
    if (cardName.length < 3) {
      showValidationError(cardNameInput, 'Name is too short');
    } else {
      clearValidationError(cardNameInput);
    }
  }

  // Card number validation
  function validateCardNumber() {
    const cardNumber = cardNumberInput.value.replace(/\D/g, '');
    if (cardNumber.length !== 16) {
      showValidationError(cardNumberInput, 'Card number must be 16 digits');
    } else {
      clearValidationError(cardNumberInput);
    }
  }

  // Expiry date validation
  function validateExpiry() {
    const expiry = expiryInput.value;
    const expiryPattern = /^(0[1-9]|1[0-2])\/\d{2}$/;

    if (!expiryPattern.test(expiry)) {
      showValidationError(expiryInput, 'Invalid expiry format');
      return;
    }

    const [month, year] = expiry.split('/');
    const expiryDate = new Date(2000 + parseInt(year, 10), parseInt(month, 10) - 1);
    const currentDate = new Date();

    if (expiryDate < currentDate) {
      showValidationError(expiryInput, 'Card has expired');
    } else {
      clearValidationError(expiryInput);
    }
  }

  // CVV validation
  function validateCVV() {
    const cvv = cvvInput.value.replace(/\D/g, '');
    if (cvv.length < 3 || cvv.length > 4) {
      showValidationError(cvvInput, 'Invalid CVV');
    } else {
      clearValidationError(cvvInput);
    }
  }

  // Add input event listeners
  amountInput.setAttribute('data-validation-key', 'amount');
  cardNameInput.setAttribute('data-validation-key', 'cardName');
  cardNumberInput.setAttribute('data-validation-key', 'cardNumber');
  expiryInput.setAttribute('data-validation-key', 'expiry');
  cvvInput.setAttribute('data-validation-key', 'cvv');

  amountInput.addEventListener('input', validateAmount);
  cardNameInput.addEventListener('input', validateCardName);
  cardNumberInput.addEventListener('input', function () {
    this.value = this.value.replace(/\D/g, '').slice(0, 16);
    validateCardNumber();
  });
  expiryInput.addEventListener('input', function () {
    this.value = this.value
        .replace(/\D/g, '')
        .replace(/^(\d{2})(\d{1,2})?$/, (match, p1, p2) => (p2 ? `${p1}/${p2}` : p1));
    validateExpiry();
  });
  cvvInput.addEventListener('input', function () {
    this.value = this.value.replace(/\D/g, '').slice(0, 4);
    validateCVV();
  });

  // Handle form submission
  form.addEventListener('submit', function (e) {
    e.preventDefault();

    validateAmount();
    validateCardName();
    validateCardNumber();
    validateExpiry();
    validateCVV();

    if (Object.values(validationState).every((value) => value)) {
      const successModal = new bootstrap.Modal(document.getElementById('successModal'));
      successModal.show();

      form.reset();
      Object.keys(validationState).forEach((key) => {
        validationState[key] = false;
      });

      document.querySelectorAll('.form-control').forEach((input) => {
        input.classList.remove('is-valid', 'is-invalid');
      });

      donateButton.disabled = true;
    }
  });
});