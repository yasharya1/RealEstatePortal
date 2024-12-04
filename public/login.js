// Check database connection status
async function checkDatabaseConnection() {
    const dbStatus = document.getElementById('dbStatus');
    
    try {
        const response = await fetch('/api/check-connection');
        const data = await response.json();
        
        if (data.success) {
            dbStatus.textContent = 'Connected';
            dbStatus.className = 'connected';
        } else {
            dbStatus.textContent = 'Disconnected';
            dbStatus.className = 'disconnected';
        }
    } catch (error) {
        dbStatus.textContent = 'Disconnected';
        dbStatus.className = 'disconnected';
    }
}
async function handleLogin(event) {
    event.preventDefault();
    const userType = document.getElementById('userType').value;
    const identifier = document.getElementById('identifier').value;
    const agentId = document.getElementById('agentId')?.value;
    
    try {
        const response = await fetch('/api/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ 
                userType: userType,
                identifier: identifier,
            })
        });
        
        const data = await response.json();
        
        if (data.success) {
            sessionStorage.setItem('userType', userType);
            sessionStorage.setItem('identifier', identifier);
            if (userType === 'agent') {
                window.location.href = '/agent.html';
            } else if (userType === 'buyer') {
                window.location.href = '/buyer.html';
            } else if (userType === 'owner') {
                window.location.href = '/owner.html';
            }
        } else {
            document.getElementById('loginError').textContent = data.error || 'Login failed';
        }
    } catch (error) {
        console.error('Login error:', error);
        document.getElementById('loginError').textContent = 'Login failed. Please try again.';
    }
}

document.addEventListener('DOMContentLoaded', () => {
    checkDatabaseConnection();
    setInterval(checkDatabaseConnection, 30000);
});


document.getElementById('loginForm').addEventListener('submit', async (event) => {
    event.preventDefault();
    
    const userType = document.getElementById('userType').value;
    const identifier = document.getElementById('identifier').value;
    
    try {
        const response = await fetch('/api/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ 
                userType: userType, 
                identifier: parseInt(identifier)
            })
        });
        
        const data = await response.json();
        console.log('Login response:', data); 
        
        if (data.success) {
            sessionStorage.setItem('userType', userType);
            sessionStorage.setItem('identifier', identifier);
            if (userType === 'agent') {
                window.location.href = '/agent.html';
            } else if (userType === 'buyer') {
                window.location.href = '/buyer.html';
            } else if (userType === 'owner') {
                window.location.href = '/owner.html';
            }
        } else {
            document.getElementById('loginError').textContent = data.error || 'Login failed';
        }
    } catch (error) {
        console.error('Login error:', error);
        document.getElementById('loginError').textContent = 'Login failed. Please try again.';
    }
});

// async function handleAgentRegistration(event) {
//     event.preventDefault();
//     const formData = {
//         agentId: document.getElementById('regAgentId').value,
//         name: document.getElementById('regName').value,
//         address: document.getElementById('regAddress').value,
//         email: document.getElementById('regEmail').value,
//         phoneNumber: document.getElementById('regPhone').value,
//     };

//     try {
//         const response = await fetch('/api/register-agent', {
//             method: 'POST',
//             headers: {
//                 'Content-Type': 'application/json'
//             },
//             body: JSON.stringify(formData)
//         });

//         const data = await response.json();

//         if (data.success) {
//             document.getElementById('agentRegistrationSuccess').style.display = 'block';
//             document.getElementById('agentRegistrationError').textContent = ''; 
//         } else {
//             document.getElementById('agentRegistrationError').textContent = data.error || 'Registration failed';
//             document.getElementById('agentRegistrationSuccess').style.display = 'none'; 
//         }
//     } catch (error) {
//         console.error('Registration error:', error);
//         document.getElementById('agentRegistrationError').textContent = 'Registration failed. Please try again.';
//         document.getElementById('agentRegistrationSuccess').style.display = 'none'; 
//     }
// }

// async function handleClientRegistration(event) {
//     event.preventDefault();
//     const formData = {
//         userType: document.getElementById('regUserType').value,
//         name: document.getElementById('regNameClient').value,
//         address: document.getElementById('regAddressClient').value,
//         email: document.getElementById('regEmailClient').value,
//         phoneNumber: document.getElementById('regPhoneClient').value,
//     };

//     try {
//         const response = await fetch('/api/register-client', {
//             method: 'POST',
//             headers: {
//                 'Content-Type': 'application/json'
//             },
//             body: JSON.stringify(formData)
//         });

//         const data = await response.json();

//         if (data.success) {
//             document.getElementById('clientRegistrationSuccess').style.display = 'block';
//             document.getElementById('clientRegistrationError').textContent = '';
//         } else {
//             document.getElementById('clientRegistrationError').textContent = data.error || 'Registration failed';
//             document.getElementById('clientRegistrationSuccess').style.display = 'none'; 
//         }
//     } catch (error) {
//         console.error('Registration error:', error);
//         document.getElementById('clientRegistrationError').textContent = 'Registration failed. Please try again.';
//         document.getElementById('clientRegistrationSuccess').style.display = 'none';
//     }
// }

// document.getElementById('agentRegistrationForm').addEventListener('submit', handleAgentRegistration);
// document.getElementById('clientRegistrationForm').addEventListener('submit', handleClientRegistration);

document.getElementById('userType').addEventListener('change', function() {
    const agentIdGroup = document.getElementById('agentIdGroup');
    if (this.value === 'agent') {
        agentIdGroup.style.display = 'block';
    } else {
        agentIdGroup.style.display = 'none';
    }
});