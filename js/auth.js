// DOM Elements
const title = document.getElementById('title')
const subtitle = document.getElementById('subtitle')
const toggleFormBtn = document.getElementById('toggleForm')
const submitBtn = document.getElementById('submitBtn')
const authForm = document.getElementById('authForm')
const togglePasswordBtn = document.getElementById('togglePassword')

// Form groups
const nameGroup = document.getElementById('nameGroup')
const emailGroup = document.getElementById('emailGroup')
const phoneGroup = document.getElementById('phoneGroup')
const confirmGroup = document.getElementById('confirmGroup')

let isRegister = false

// Toggle between login and register
toggleFormBtn.addEventListener('click', function (e) {
    e.preventDefault()
    isRegister = !isRegister

    if (isRegister) {
        // Switch to Register
        title.textContent = "Sign Up"
        subtitle.textContent = 'Create a new account'
        submitBtn.textContent = "Sign Up"
        toggleFormBtn.textContent = 'Login'

        // Show register fields
        nameGroup.style.display = 'block'
        emailGroup.style.display = 'block'
        confirmGroup.style.display = 'block'

        // Make fields required
        document.getElementById('name').required = true
        document.getElementById('email').required = true
        document.getElementById('confirmPassword').required = true
    } else {
        // Switch to Login
        title.textContent = 'Login'
        subtitle.textContent = 'Sign in to your account'
        submitBtn.textContent = 'Sign In'
        toggleFormBtn.textContent = "Sign Up"

        // Hide register fields
        nameGroup.style.display = 'none'
        emailGroup.style.display = 'none'
        confirmGroup.style.display = 'none'

        // Remove required
        document.getElementById('name').required = false
        document.getElementById('email').required = false
        document.getElementById('confirmPassword').required = false
    }
})

// Toggle password visibility
togglePasswordBtn.addEventListener('click', function () {
    const passwordInput = document.getElementById('password')
    const icon = this.querySelector('i')

    if (passwordInput.type === 'password') {
        passwordInput.type = 'text'
        icon.classList.remove('fa-eye')
        icon.classList.add('fa-eye-slash')
    } else {
        passwordInput.type = 'password'
        icon.classList.remove('fa-eye-slash')
        icon.classList.add('fa-eye')
    }
})

const phoneInput = document.getElementById('phone')

function validatePhone() {
    let phone = phoneInput.value.trim()

    if (phone === '') {
        alert('Phone number cannot be empty')
        return false
    }

    // + should only be at the beginning
    if (phone.includes('+') && phone[0] !== '+') {
        alert('+ symbol can only be at the beginning')
        return false
    }

    // Remove + for validation
    if (phone[0] === '+') {
        phone = phone.slice(1)
    }

    // Check for digits only
    for (let i = 0; i < phone.length; i++) {
        if (phone[i] < '0' || phone[i] > '9') {
            alert('Phone number must contain only digits')
            return false
        }
    }

    // Length validation
    if (phone.length < 9 || phone.length > 13) {
        alert('Phone number length is incorrect')
        return false
    }

    return true
}

// Show notification
function showNotification(title, message, type = 'success') {
    // Remove existing notification
    const existing = document.querySelector('.notification')
    if (existing) existing.remove()

    // Create notification
    const notification = document.createElement('div')
    notification.className = `notification ${type}`

    const icon =
        type === 'success'
            ? 'fa-check-circle'
            : type === 'error'
            ? 'fa-exclamation-circle'
            : 'fa-info-circle'

    notification.innerHTML = `
        <i class="fas ${icon}"></i>
        <div class="notification-content">
            <div class="notification-title">${title}</div>
            <div class="notification-message">${message}</div>
        </div>
    `

    document.body.appendChild(notification)

    // Remove after 3 seconds
    setTimeout(() => {
        if (notification.parentNode) {
            notification.remove()
        }
    }, 3000)
}

// Form submission
authForm.addEventListener('submit', function (e) {
    e.preventDefault()

    if (isRegister) {
        // REGISTRATION
        const name = document.getElementById('name').value.trim()
        const email = document.getElementById('email').value.trim()
        const phone = document.getElementById('phone').value.trim()
        const password = document.getElementById('password').value
        const confirmPassword = document.getElementById('confirmPassword').value

        // Validation
        if (!name || !email || !phone || !password || !confirmPassword) {
            showNotification(
                'Error',
                'Please fill in all fields',
                'error'
            )
            return
        }

        if (password !== confirmPassword) {
            showNotification('Error', 'Passwords do not match!', 'error')
            return
        }

        if (password.length < 8) {
            showNotification(
                'Error',
                'Password must be at least 8 characters long',
                'error'
            )
            return
        }

        // Check if user already exists
        let users = JSON.parse(localStorage.getItem('users')) || []
        const existingUser = users.find(u => u.email === email || u.phone === phone)

        if (existingUser) {
            showNotification(
                'Error',
                'This email or phone number is already registered',
                'error'
            )
            return
        }

        // Create user object
        const user = {
            // Alternative
            id: Date.now(),
            name: name,
            email: email,
            phone: phone,
            password: password,
        }

        // Save to localStorage
        users.push(user)
        localStorage.setItem('users', JSON.stringify(users))
        localStorage.setItem('currentUser', JSON.stringify(user))

        showNotification(
            'Success',
            'You have successfully registered!',
            'success'
        )

        // Redirect to home after 1 second
        setTimeout(() => {
            window.location.href = './index.html'
        }, 1000)
    } else {
        // LOGIN
        const phone = document.getElementById('phone').value.trim()
        const password = document.getElementById('password').value

        // Validation
        if (!phone || !password) {
            showNotification(
                'Error',
                'Please enter phone number and password',
                'error'
            )
            return
        }

        // Get users from localStorage
        const users = JSON.parse(localStorage.getItem('users')) || []

        // Find user by phone OR email
        const user = users.find(
            u => (u.phone === phone || u.email === phone) && u.password === password
        )

        if (user) {
            localStorage.setItem('currentUser', JSON.stringify(user))

            showNotification(
                'Welcome',
                `${user.name}, you have successfully logged in!`,
                'success'
            )

            setTimeout(() => {
                window.location.href = './index.html'
            }, 1000)
        } else {
            showNotification('Error', 'Incorrect phone number or password', 'error')
        }
    }
})

// Check for current User on page load
document.addEventListener('DOMContentLoaded', function () {
    const currentUser = JSON.parse(localStorage.getItem('currentUser'))
    if (currentUser && currentUser.phone) {
        document.getElementById('phone').value = currentUser.phone
    }
})