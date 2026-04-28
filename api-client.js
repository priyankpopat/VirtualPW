// ========================================
// API CLIENT FOR BACKEND COMMUNICATION
// ========================================

const API_URL = 'http://localhost:5000/api';
let authToken = null;

// Get token from localStorage
function getAuthToken() {
    return localStorage.getItem('authToken') || authToken;
}

// Set token in localStorage
function setAuthToken(token) {
    authToken = token;
    localStorage.setItem('authToken', token);
}

// Clear token
function clearAuthToken() {
    authToken = null;
    localStorage.removeItem('authToken');
}

// ========================================
// AUTHENTICATION API
// ========================================

async function registerUser(name, email, password) {
    try {
        const response = await fetch(`${API_URL}/auth/register`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ name, email, password })
        });

        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.error || 'Registration failed');
        }

        // Save token and user info
        setAuthToken(data.token);
        sessionStorage.setItem('user', JSON.stringify(data.user));
        
        console.log('✓ User registered:', data.user);
        return data;
    } catch(error) {
        console.error('✗ Registration error:', error);
        throw error;
    }
}

async function loginUser(email, password) {
    try {
        const response = await fetch(`${API_URL}/auth/login`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ email, password })
        });

        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.error || 'Login failed');
        }

        // Save token and user info
        setAuthToken(data.token);
        sessionStorage.setItem('user', JSON.stringify(data.user));
        
        console.log('✓ User logged in:', data.user);
        return data;
    } catch(error) {
        console.error('✗ Login error:', error);
        throw error;
    }
}

function logoutUser() {
    clearAuthToken();
    sessionStorage.removeItem('user');
    console.log('✓ User logged out');
}

function getCurrentUser() {
    const user = sessionStorage.getItem('user');
    return user ? JSON.parse(user) : null;
}

// ========================================
// VOTING API
// ========================================

async function castVoteAPI(party) {
    try {
        const token = getAuthToken();
        
        if (!token) {
            throw new Error('Not authenticated. Please login first.');
        }
        
        console.log('🗳️ Casting vote for:', party);
        
        const response = await fetch(`${API_URL}/vote`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({ party })
        });

        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.error || 'Vote failed');
        }

        console.log('✓ Vote successful:', data);
        return data;
    } catch(error) {
        console.error('✗ Vote error:', error);
        throw error;
    }
}

// ========================================
// RESULTS API
// ========================================

async function getVotesAPI() {
    try {
        const response = await fetch(`${API_URL}/votes`);
        const data = await response.json();
        console.log('✓ Votes fetched:', data);
        return data;
    } catch(error) {
        console.error('✗ Error fetching votes:', error);
        return { BJP: 0, Congress: 0, AAP: 0, total: 0 };
    }
}

// ========================================
// ADMIN API
// ========================================

async function getAdminStats() {
    try {
        const token = getAuthToken();
        const response = await fetch(`${API_URL}/admin/stats`, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });
        
        if (!response.ok) throw new Error('Failed to fetch stats');
        const data = await response.json();
        console.log('✓ Admin stats:', data);
        return data;
    } catch(error) {
        console.error('✗ Error fetching stats:', error);
        throw error;
    }
}

async function getAdminVotes() {
    try {
        const token = getAuthToken();
        const response = await fetch(`${API_URL}/admin/votes`, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });
        
        if (!response.ok) throw new Error('Failed to fetch votes');
        return await response.json();
    } catch(error) {
        console.error('✗ Error fetching votes:', error);
        throw error;
    }
}

async function getAuditLog(limit = 100, skip = 0) {
    try {
        const token = getAuthToken();
        const response = await fetch(`${API_URL}/admin/audit-log?limit=${limit}&skip=${skip}`, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });
        
        if (!response.ok) throw new Error('Failed to fetch audit log');
        return await response.json();
    } catch(error) {
        console.error('✗ Error fetching audit log:', error);
        throw error;
    }
}

async function resetElection() {
    try {
        const token = getAuthToken();
        if (!confirm('⚠️ Are you sure? This will delete ALL votes!')) {
            return null;
        }
        
        const response = await fetch(`${API_URL}/admin/reset`, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });
        
        if (!response.ok) throw new Error('Failed to reset election');
        return await response.json();
    } catch(error) {
        console.error('✗ Error resetting election:', error);
        throw error;
    }
}

// ========================================
// EXPORT FOR USE IN SCRIPT.JS
// ========================================
window.electionAPI = {
    // Auth
    register: registerUser,
    login: loginUser,
    logout: logoutUser,
    getCurrentUser: getCurrentUser,
    
    // Voting
    castVote: castVoteAPI,
    getVotes: getVotesAPI,
    
    // Admin
    getAdminStats: getAdminStats,
    getAdminVotes: getAdminVotes,
    getAuditLog: getAuditLog,
    resetElection: resetElection
};
