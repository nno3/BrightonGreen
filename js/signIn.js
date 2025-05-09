document.addEventListener('DOMContentLoaded', () => {
    // Form toggling
    const registrationForm = document.getElementById('registrationForm');
    const signInForm = document.getElementById('signInForm');
    const showSignIn = document.getElementById('showSignIn');
    const showRegister = document.getElementById('showRegister');

    // Check URL parameters to determine which form to show
    const urlParams = new URLSearchParams(window.location.search);
    const action = urlParams.get('action') || 'signin';

    // Show the appropriate form based on the action
    if (action === 'register') {
        registrationForm.classList.add('active');
        signInForm.classList.remove('active');
    } else {
        signInForm.classList.add('active');
        registrationForm.classList.remove('active');
    }

    showSignIn.addEventListener('click', () => {
        registrationForm.classList.remove('active');
        signInForm.classList.add('active');
        // Update URL without reloading
        window.history.pushState({}, '', '?action=signin');
    });

    showRegister.addEventListener('click', () => {
        signInForm.classList.remove('active');
        registrationForm.classList.add('active');
        // Update URL without reloading
        window.history.pushState({}, '', '?action=register');
    });

    // Registration form submission
    registrationForm.addEventListener('submit', function (e) {
        e.preventDefault();
        clearErrors(['reg-usernameError', 'reg-emailError', 'reg-passwordError']);

        const username = document.getElementById('reg-username').value.trim();
        const email = document.getElementById('reg-email').value.trim();
        const password = document.getElementById('reg-password').value.trim();

        let isValid = true;

        if (username.length < 3) {
            showError('reg-usernameError', 'Username must be at least 3 characters long.');
            isValid = false;
        }
        if (!validateEmail(email)) {
            showError('reg-emailError', 'Please enter a valid email address.');
            isValid = false;
        }
        if (password.length < 6) {
            showError('reg-passwordError', 'Password must be at least 6 characters long.');
            isValid = false;
        }

        if (isValid) {
            // Save user data to localStorage
            const users = JSON.parse(localStorage.getItem('users') || '[]');
            
            // Check if email already exists
            if (users.some(user => user.email === email)) {
                showError('reg-emailError', 'This email is already registered.');
                return;
            }
            
            // Add new user
            users.push({ username, email, password });
            localStorage.setItem('users', JSON.stringify(users));
            
            // Set current user as logged in
            localStorage.setItem('currentUser', username);
            localStorage.setItem('isLoggedIn', 'true');
            localStorage.setItem('userEmail', email);
            
            alert('Registration Successful! You are now logged in.');
            
            // Check if there's a return URL
            const returnUrl = localStorage.getItem('returnUrl');
            if (returnUrl) {
                localStorage.removeItem('returnUrl');
                window.location.href = returnUrl;
            } else {
                window.location.href = 'index.html';
            }
        }
    });

    // Sign-in form submission
    signInForm.addEventListener('submit', function (e) {
        e.preventDefault();
        clearErrors(['signin-emailError', 'signin-passwordError']);

        const email = document.getElementById('signin-email').value.trim();
        const password = document.getElementById('signin-password').value.trim();

        let isValid = true;

        if (!validateEmail(email)) {
            showError('signin-emailError', 'Please enter a valid email address.');
            isValid = false;
        }
        if (password.length < 6) {
            showError('signin-passwordError', 'Password must be at least 6 characters long.');
            isValid = false;
        }

        if (isValid) {
            // Get users from localStorage
            const users = JSON.parse(localStorage.getItem('users') || '[]');
            
            // Find user by email and password
            const user = users.find(u => u.email === email && u.password === password);
            
            if (user) {
                // Set current user as logged in
                localStorage.setItem('currentUser', user.username);
                localStorage.setItem('isLoggedIn', 'true');
                localStorage.setItem('userEmail', user.email);
                
                alert('Sign In Successful!');
                
                // Check if there's a return URL
                const returnUrl = localStorage.getItem('returnUrl');
                if (returnUrl) {
                    localStorage.removeItem('returnUrl');
                    window.location.href = returnUrl;
                } else {
                    window.location.href = 'index.html';
                }
            } else {
                showError('signin-emailError', 'Invalid email or password.');
            }
        }
    });

    // Helper functions
    function validateEmail(email) {
        const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailPattern.test(email);
    }

    function showError(elementId, message) {
        document.getElementById(elementId).textContent = message;
    }

    function clearErrors(errorIds) {
        errorIds.forEach((id) => (document.getElementById(id).textContent = ''));
    }
    
    // Check if user is already logged in
    const isLoggedIn = localStorage.getItem('isLoggedIn') === 'true';
    if (isLoggedIn) {
        // If we're on the sign-in page and already logged in, redirect to homepage
        if (window.location.pathname.includes('signUp.html')) {
            window.location.href = 'index.html';
        }
    }

    // Pre-populate name field in the comment form if logged in
    const commentNameInput = document.getElementById('comment-name');
    if (commentNameInput && localStorage.getItem('isLoggedIn') === 'true') {
        const username = localStorage.getItem('currentUser');
        if (username) {
            commentNameInput.value = username;
            commentNameInput.readOnly = true;
        }
    }
});