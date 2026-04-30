// ========================================
// AI Election Assistant - UPGRADED VERSION
// Complete JavaScript with Smart Features
// ========================================

// ========================================
// GLOBAL VARIABLES
// ========================================
let voteChart = null;
let currentUser = null;

// Global vote data (simple & reliable)
window.votesData = {
    BJP: 0,
    Congress: 0,
    AAP: 0,
    userVoted: false
};

// Load votes on page load
if (typeof(Storage) !== "undefined") {
    try {
        const saved = localStorage.getItem('votesData');
        if (saved) {
            window.votesData = JSON.parse(saved);
        }
    } catch(e) {
        console.log('Could not load votes from storage');
    }
}

// ========================================
// INITIALIZATION
// ========================================
document.addEventListener('DOMContentLoaded', function() {
    // Restore user from session
    const savedUser = sessionStorage.getItem('currentUser');
    if (savedUser) {
        currentUser = savedUser;
    }
    
    // Check which page we're on
    const loginForm = document.getElementById('loginForm');
    const registerForm = document.getElementById('registerForm');
    const guestForm = document.getElementById('guestForm');
    const authTabs = document.querySelectorAll('.auth-tab');
    const sidebar = document.getElementById('sidebar');
    const chatForm = document.getElementById('chatForm');
    const eligibilityForm = document.getElementById('eligibilityForm');
    const boothForm = document.getElementById('boothForm');
    
    // Initialize loader
    initLoader();
    
    // Check if on dashboard
    if (sidebar) {
        initDashboard();
    }
    
    // Auth tab handlers
    authTabs.forEach(tab => {
        tab.addEventListener('click', function() {
            const tabName = this.dataset.tab;
            authTabs.forEach(t => t.classList.remove('active'));
            document.querySelectorAll('.auth-form').forEach(f => f.classList.remove('active'));
            this.classList.add('active');
            document.querySelector(`.auth-form[data-form="${tabName}"]`)?.classList.add('active');
        });
    });
    
    // Login form handler
    if (loginForm) {
        loginForm.addEventListener('submit', async function(e) {
            e.preventDefault();
            const email = document.getElementById('loginEmail').value.trim();
            const password = document.getElementById('loginPassword').value;
            
            try {
                console.log('🔑 Attempting login with:', email);
                const result = await window.electionAPI.login(email, password);
                console.log('✅ Login successful, result:', result);
                showToast('✓ Login Successful!', `Welcome ${result.user.name}!`, 'success');
                console.log('📍 Redirecting to dashboard.html');
                setTimeout(() => { 
                    window.location.href = './dashboard.html';
                }, 1000);
            } catch(error) {
                showToast('❌ Login Failed', error.message, 'error');
                document.getElementById('loginPasswordError').textContent = error.message;
            }
        });
    }
    
    // Register form handler
    if (registerForm) {
        registerForm.addEventListener('submit', async function(e) {
            e.preventDefault();
            const name = document.getElementById('registerName').value.trim();
            const email = document.getElementById('registerEmail').value.trim();
            const password = document.getElementById('registerPassword').value;
            
            try {
                const result = await window.electionAPI.register(name, email, password);
                showToast('✓ Account Created!', `Welcome ${result.user.name}!`, 'success');
                setTimeout(() => { window.location.href = 'dashboard.html'; }, 800);
            } catch(error) {
                showToast('❌ Registration Failed', error.message, 'error');
                document.getElementById('registerEmailError').textContent = error.message;
            }
        });
    }
    
    // Guest form handler
    if (guestForm) {
        guestForm.addEventListener('submit', async function(e) {
            e.preventDefault();
            const username = document.getElementById('guestName').value.trim();
            
            if (!username || username.length < 2) {
                showToast('Error', 'Please enter a valid name', 'error');
                return;
            }
            
            sessionStorage.setItem('currentUser', username);
            sessionStorage.setItem('guestMode', 'true');
            currentUser = username;
            
            showToast('✓ Welcome!', `Hello ${username}!`, 'success');
            setTimeout(() => { window.location.href = 'dashboard.html'; }, 800);
        });
    }
    
    // Chat form handler
    if (chatForm) {
        chatForm.addEventListener('submit', handleChatSubmit);
    }
    
    // Eligibility form handler
    if (eligibilityForm) {
        eligibilityForm.addEventListener('submit', handleEligibilityCheck);
    }
    
    // Booth form handler
    if (boothForm) {
        boothForm.addEventListener('submit', handleBoothSearch);
    }
    
    // Update stats on index page
    updateIndexStats();
});

// ========================================
// SESSION PERSISTENCE
// ========================================
function saveActiveSection(section) {
    try {
        localStorage.setItem('lastActiveSection', section);
    } catch(e) {
        console.log('Could not save active section');
    }
}

function getLastActiveSection() {
    try {
        return localStorage.getItem('lastActiveSection') || 'vote';
    } catch(e) {
        return 'vote';
    }
}

function restoreSession() {
    const lastSection = getLastActiveSection();
    const navItem = document.querySelector(`[data-section="${lastSection}"]`);
    if (navItem) {
        navItem.classList.add('active');
        showSection(lastSection + 'Section');
    }
}

// ========================================
// LOADER
// ========================================
function initLoader() {
    const loader = document.getElementById('loader');
    const mainContainer = document.getElementById('mainContainer');
    
    if (loader && mainContainer) {
        setTimeout(() => {
            loader.classList.add('hidden');
            mainContainer.classList.add('active');
        }, 2000);
    } else if (loader) {
        // Dashboard loader
        setTimeout(() => {
            loader.classList.add('hidden');
        }, 1500);
    }
}

// ========================================
// LOGIN SYSTEM
// ========================================
// Legacy handleLogin function (for backward compatibility)
function handleLogin(e) {
    // This is now handled by the form-specific handlers in DOMContentLoaded
}


// ========================================
// DASHBOARD INITIALIZATION
// ========================================
function initDashboard() {
    // Check authentication using sessionStorage
    currentUser = sessionStorage.getItem('currentUser');
    if (!currentUser) {
        window.location.href = 'index.html';
        return;
    }
    
    // Set user name in sidebar
    const displayName = document.getElementById('displayName');
    if (displayName) {
        displayName.textContent = currentUser;
    }
    
    // Check if user is admin and show admin link
    const user = window.electionAPI.getCurrentUser();
    if (user && user.role === 'admin') {
        const adminLink = document.getElementById('adminLink');
        if (adminLink) {
            adminLink.style.display = 'flex';
        }
    }
    
    // Initialize navigation
    initNavigation();
    
    // Restore last active section
    restoreSession();
    
    // Check if user has voted
    updateVoteStatus();
    
    // Load initial data
    loadResults();
    
    // Update recent searches
    updateRecentSearches();
}

// ========================================
// NAVIGATION
// ========================================
function initNavigation() {
    const navItems = document.querySelectorAll('.nav-item');
    
    navItems.forEach(item => {
        item.addEventListener('click', function(e) {
            e.preventDefault();
            
            // Remove active class from all nav items
            navItems.forEach(nav => nav.classList.remove('active'));
            
            // Add active class to clicked item
            this.classList.add('active');
            
            // Show corresponding section
            const sectionId = this.getAttribute('data-section') + 'Section';
            showSection(sectionId);
        });
    });
}

function showSection(sectionId) {
    const sections = document.querySelectorAll('.content-section');
    
    sections.forEach(section => {
        section.classList.remove('active');
    });
    
    const targetSection = document.getElementById(sectionId);
    if (targetSection) {
        targetSection.classList.add('active');
    }
    
    // Save active section for session persistence
    const sectionName = sectionId.replace('Section', '');
    saveActiveSection(sectionName);
    
    // Load chart if results section
    if (sectionId === 'resultsSection') {
        setTimeout(() => loadResults(), 100);
    }
}

function toggleSidebar() {
    const sidebar = document.getElementById('sidebar');
    sidebar.classList.toggle('active');
}

// ========================================
// VOTING SYSTEM (BACKEND-POWERED)
// ========================================
async function castVote(party) {
    try {
        console.log('🗳️ Vote button clicked for:', party);
        console.log('🔐 Auth token:', window.electionAPI.getAuthToken() ? 'FOUND' : 'MISSING');
        
        // Call backend API
        const result = await window.electionAPI.castVote(party);
        console.log('✅ Vote API result:', result);
        
        // Show success
        showToast('✅ Vote Recorded!', `Your vote for ${party} has been recorded!`, 'success');
        
        // Update UI
        setTimeout(() => {
            updateVoteStatus();
            loadResults();
        }, 500);
        
    } catch(error) {
        console.error('Vote error:', error);
        showToast('❌ Error', error.message || 'Failed to cast vote', 'error');
    }
}

function updateVoteStatus() {
    const voteStatusText = document.getElementById('voteStatusText');
    
    if (voteStatusText) {
        if (window.votesData.userVoted) {
            voteStatusText.textContent = '✓ You have voted';
            voteStatusText.style.color = '#10b981';
        } else {
            voteStatusText.textContent = "Select a party to vote";
            voteStatusText.style.color = '#94a3b8';
        }
    }
    
    // Disable vote buttons if already voted
    if (window.votesData.userVoted) {
        const voteButtons = document.querySelectorAll('.party-card .vote-btn');
        voteButtons.forEach(btn => {
            btn.disabled = true;
            btn.style.opacity = '0.5';
            btn.style.cursor = 'not-allowed';
            btn.textContent = '✓ Voted';
        });
    }
}

// ========================================
// RESULTS & CHART (Enhanced with Percentages)
// ========================================
function loadResults() {
    // Fetch votes from backend
    window.electionAPI.getVotes().then(votes => {
        const totalVotes = votes.total || 0;
    
    // Update stats
    const totalVotesDisplay = document.getElementById('totalVotesDisplay');
    if (totalVotesDisplay) {
        totalVotesDisplay.textContent = totalVotes;
    }
    
    // Calculate leading party
    let leadingParty = '-';
    let maxVotes = 0;
    let voteMargin = '-';
    
    const partyVotes = [votes.BJP, votes.Congress, votes.AAP];
    const parties = ['BJP', 'Congress', 'AAP'];
    
    for (let i = 0; i < parties.length; i++) {
        if (partyVotes[i] > maxVotes) {
            maxVotes = partyVotes[i];
            leadingParty = parties[i];
        }
    }
    
    // Calculate margin
    const sorted = partyVotes.slice().sort((a, b) => b - a);
    if (sorted.length >= 2 && sorted[0] > 0) {
        voteMargin = sorted[0] - sorted[1];
    }
    
    // Calculate percentages
    const bjpPercent = totalVotes > 0 ? Math.round((votes.BJP / totalVotes) * 100) : 0;
    const congressPercent = totalVotes > 0 ? Math.round((votes.Congress / totalVotes) * 100) : 0;
    const aapPercent = totalVotes > 0 ? Math.round((votes.AAP / totalVotes) * 100) : 0;
    
    // Update UI
    const leadingPartyEl = document.getElementById('leadingParty');
    const voteMarginEl = document.getElementById('voteMargin');
    const winnerText = document.getElementById('winnerText');
    const bjpPercentEl = document.getElementById('bjpPercent');
    const congressPercentEl = document.getElementById('congressPercent');
    const aapPercentEl = document.getElementById('aapPercent');
    
    if (leadingPartyEl) leadingPartyEl.textContent = leadingParty;
    if (voteMarginEl) voteMarginEl.textContent = voteMargin !== '-' ? voteMargin + ' votes' : '-';
    if (bjpPercentEl) bjpPercentEl.textContent = bjpPercent + '%';
    if (congressPercentEl) congressPercentEl.textContent = congressPercent + '%';
    if (aapPercentEl) aapPercentEl.textContent = aapPercent + '%';
    
    if (winnerText) {
        if (totalVotes > 0) {
            winnerText.textContent = `${leadingParty} is leading with ${maxVotes} votes (${bjpPercent}%)`;
        } else {
            winnerText.textContent = 'No votes yet - Be the first to vote!';
        }
    }
    
    // Create/update chart
    renderChart(votes);
    }).catch(err => {
        console.error('Error loading results:', err);
    });
}

function renderChart(votes) {
    const ctx = document.getElementById('voteChart');
    if (!ctx) return;
    
    const partyData = [votes.BJP, votes.Congress, votes.AAP];
    
    // Destroy existing chart
    if (voteChart) {
        voteChart.destroy();
    }
    
    // Create new chart
    voteChart = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: ['BJP', 'Congress', 'AAP'],
            datasets: [{
                label: 'Votes',
                data: partyData,
                backgroundColor: ['#ff9933', '#00a0e9', '#4ecdc4'],
                borderColor: ['#ff9933', '#00a0e9', '#4ecdc4'],
                borderWidth: 1,
                borderRadius: 8,
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: true,
            plugins: {
                legend: {
                    display: false
                },
                tooltip: {
                    backgroundColor: '#1e293b',
                    titleColor: '#f8fafc',
                    bodyColor: '#94a3b8',
                    borderColor: '#334155',
                    borderWidth: 1,
                    padding: 12,
                    displayColors: true,
                }
            },
            scales: {
                y: {
                    beginAtZero: true,
                    ticks: {
                        color: '#94a3b8',
                        stepSize: 1
                    },
                    grid: {
                        color: 'rgba(255, 255, 255, 0.1)'
                    }
                },
                x: {
                    ticks: {
                        color: '#94a3b8'
                    },
                    grid: {
                        display: false
                    }
                }
            }
        }
    });
}

// ========================================
// SMART ELIGIBILITY CHECKER (Enhanced)
// ========================================
function handleEligibilityCheck(e) {
    e.preventDefault();
    
    const ageInput = document.getElementById('ageInput');
    const citizenshipSelect = document.getElementById('citizenshipSelect');
    const firstTimeSelect = document.getElementById('firstTimeSelect');
    const resultDiv = document.getElementById('eligibilityResult');
    const guidancePanel = document.getElementById('guidancePanel');
    const guidanceSteps = document.getElementById('guidanceSteps');
    
    const age = parseInt(ageInput.value);
    const citizenship = citizenshipSelect.value;
    const isFirstTime = firstTimeSelect.value;
    
    // Input Validation
    let hasError = false;
    
    // Validate age
    if (!age || age < 1 || age > 150) {
        showInputError('ageInput', 'ageError', 'Please enter a valid age (1-150)');
        hasError = true;
    } else {
        clearInputError('ageInput', 'ageError');
    }
    
    // Validate citizenship
    if (!citizenship) {
        showInputError('citizenshipSelect', 'citizenshipError', 'Please select your citizenship status');
        hasError = true;
    } else {
        clearInputError('citizenshipSelect', 'citizenshipError');
    }
    
    // Validate first-time voter
    if (!isFirstTime) {
        showToast('Error', 'Please select if you are a first-time voter', 'error');
        hasError = true;
    }
    
    if (hasError) return;
    
    // Smart Decision Engine
    const isEligible = age >= 18 && citizenship === 'indian';
    
    // Update result UI
    if (resultDiv) {
        resultDiv.className = 'eligibility-result ' + (isEligible ? 'eligible' : 'not-eligible');
        
        if (isEligible) {
            resultDiv.innerHTML = `
                <div class="result-icon">
                    <i class="fas fa-check"></i>
                </div>
                <div class="result-text">
                    <h3>🎉 Congratulations! You are eligible to vote!</h3>
                    <p>You meet all the requirements to participate in elections. Make sure to register on the voter portal and carry a valid ID on voting day.</p>
                </div>
            `;
        } else {
            let message = '';
            if (age < 18) {
                message = 'You must be at least 18 years old to be eligible to vote.';
            } else if (citizenship !== 'indian') {
                message = 'Only Indian citizens are eligible to vote in Indian elections.';
            }
            
            resultDiv.innerHTML = `
                <div class="result-icon">
                    <i class="fas fa-times"></i>
                </div>
                <div class="result-text">
                    <h3>❌ Not Eligible</h3>
                    <p>${message}</p>
                </div>
            `;
        }
    }
    
    // Show personalized guidance
    if (guidancePanel && guidanceSteps) {
        guidancePanel.style.display = 'block';
        guidanceSteps.innerHTML = generateGuidanceSteps(age, citizenship, isFirstTime, isEligible);
    }
    
    showToast(
        isEligible ? 'Eligible!' : 'Not Eligible', 
        isEligible ? 'You can vote in elections' : 'You do not meet the requirements', 
        isEligible ? 'success' : 'warning'
    );
}

function generateGuidanceSteps(age, citizenship, isFirstTime, isEligible) {
    const steps = [];
    
    if (isEligible) {
        // Step 1: Check registration
        if (isFirstTime === 'yes') {
            steps.push({
                icon: 'fa-user-plus',
                title: 'Register to Vote',
                description: 'Visit nvsp.in or voterportal.eci.gov.in to register. Fill Form 6 with your details.',
                status: 'pending'
            });
        } else {
            steps.push({
                icon: 'fa-check-circle',
                title: 'Already Registered',
                description: 'Great! You are already registered as a voter.',
                status: 'completed'
            });
        }
        
        // Step 2: Find polling booth
        steps.push({
            icon: 'fa-map-marker-alt',
            title: 'Find Your Polling Booth',
            description: 'Use the Polling Booth section to locate your nearest voting center.',
            status: 'pending'
        });
        
        // Step 3: Cast vote
        steps.push({
            icon: 'fa-vote-yea',
            title: 'Cast Your Vote',
            description: 'Go to your polling station on election day with a valid photo ID.',
            status: 'pending'
        });
        
        // Step 4: View results
        steps.push({
            icon: 'fa-chart-bar',
            title: 'Track Results',
            description: 'Monitor live results in the Results section after voting closes.',
            status: 'pending'
        });
    } else {
        // Not eligible guidance
        if (age < 18) {
            steps.push({
                icon: 'fa-clock',
                title: 'Wait Until 18',
                description: `You are ${age} years old. You can register once you turn 18.`,
                status: 'pending'
            });
        }
        
        if (citizenship !== 'indian') {
            steps.push({
                icon: 'fa-passport',
                title: 'Citizenship Required',
                description: 'Only Indian citizens can vote in Indian elections.',
                status: 'pending'
            });
        }
        
        steps.push({
            icon: 'fa-info-circle',
            title: 'Learn About Voting',
            description: 'Use this time to learn about the electoral process and candidates.',
            status: 'pending'
        });
    }
    
    return steps.map(step => `
        <div class="guidance-step ${step.status}">
            <div class="guidance-step-icon">
                <i class="fas ${step.icon}"></i>
            </div>
            <div class="guidance-step-content">
                <h4>${step.title}</h4>
                <p>${step.description}</p>
            </div>
        </div>
    `).join('');
}

function showInputError(inputId, errorId, message) {
    const input = document.getElementById(inputId);
    const error = document.getElementById(errorId);
    
    if (input) input.classList.add('error');
    if (error) {
        error.textContent = message;
        error.classList.add('visible');
    }
}

function clearInputError(inputId, errorId) {
    const input = document.getElementById(inputId);
    const error = document.getElementById(errorId);
    
    if (input) input.classList.remove('error');
    if (error) error.classList.remove('visible');
}

// ========================================
// ENHANCED POLLING BOOTH FINDER
// ========================================
function handleBoothSearch(e) {
    e.preventDefault();
    
    const cityInput = document.getElementById('cityInput');
    const city = cityInput.value.trim();
    const cityError = document.getElementById('cityError');
    
    // Input Validation
    if (!city) {
        showInputError('cityInput', 'cityError', 'Please enter a city name');
        return;
    }
    
    if (city.length < 2) {
        showInputError('cityInput', 'cityError', 'City name must be at least 2 characters');
        return;
    }
    
    clearInputError('cityInput', 'cityError');
    
    // Create Google Maps URL
    const mapsUrl = `https://www.google.com/maps/search/polling+booth+${encodeURIComponent(city)}`;
    
    // Show enhanced message
    const mapsMessage = document.getElementById('mapsMessage');
    const searchedCity = document.getElementById('searchedCity');
    if (mapsMessage && searchedCity) {
        searchedCity.textContent = city;
        mapsMessage.style.display = 'flex';
    }
    
    // Open in new tab
    window.open(mapsUrl, '_blank');
    
    // Save to recent searches
    saveRecentSearch(city);
    
    showToast('Opening Maps', `Showing nearest polling booths near ${city}`, 'info');
}

function saveRecentSearch(city) {
    try {
        let searches = JSON.parse(localStorage.getItem('recentSearches') || '[]');
        
        // Remove if already exists
        searches = searches.filter(s => s.toLowerCase() !== city.toLowerCase());
        
        // Add to beginning
        searches.unshift(city);
        
        // Keep only last 5
        searches = searches.slice(0, 5);
        
        // Save
        localStorage.setItem('recentSearches', JSON.stringify(searches));
        
        // Update UI
        updateRecentSearches();
    } catch(e) {
        console.log('Could not save recent search');
    }
}

function updateRecentSearches() {
    const container = document.querySelector('.search-tags');
    if (!container) return;
    
    try {
        const searches = JSON.parse(localStorage.getItem('recentSearches') || '[]');
        
        if (searches.length === 0) {
            container.innerHTML = '<span class="search-tag">No recent searches</span>';
            return;
        }
        
        container.innerHTML = searches.map(city => 
            `<span class="search-tag" onclick="fillCity('${city}')">${city}</span>`
        ).join('');
    } catch(e) {
        container.innerHTML = '<span class="search-tag">No recent searches</span>';
    }
}

function fillCity(city) {
    const input = document.getElementById('cityInput');
    if (input) {
        input.value = city;
        // Trigger form submission
        document.getElementById('boothForm').dispatchEvent(new Event('submit'));
    }
}

// ========================================
// AI ASSISTANT
// ========================================
function handleChatSubmit(e) {
    e.preventDefault();
    
    const chatInput = document.getElementById('chatInput');
    const message = chatInput.value.trim();
    
    if (!message) return;
    
    // Add user message
    addMessage(message, 'user');
    
    // Clear input
    chatInput.value = '';
    
    // Get bot response
    setTimeout(() => {
        const response = getBotResponse(message);
        addMessage(response, 'bot');
    }, 500);
}

function sendQuickQuestion(question) {
    const chatInput = document.getElementById('chatInput');
    if (chatInput) {
        chatInput.value = question;
        chatInput.dispatchEvent(new Event('submit'));
    }
}

function addMessage(text, sender) {
    const container = document.getElementById('chatContainer');
    if (!container) return;
    
    const messageDiv = document.createElement('div');
    messageDiv.className = `chat-message ${sender}-message`;
    
    const icon = sender === 'bot' ? 'fa-robot' : 'fa-user';
    
    // Check if text contains HTML
    if (text.includes('<') && text.includes('>')) {
        messageDiv.innerHTML = `
            <div class="message-icon">
                <i class="fas ${icon}"></i>
            </div>
            <div class="message-content">
                ${text}
            </div>
        `;
    } else {
        messageDiv.innerHTML = `
            <div class="message-icon">
                <i class="fas ${icon}"></i>
            </div>
            <div class="message-content">
                <p>${text}</p>
            </div>
        `;
    }
    
    container.appendChild(messageDiv);
    
    // Scroll to bottom
    container.scrollTop = container.scrollHeight;
}

function getBotResponse(message) {
    const lowerMessage = message.toLowerCase();
    
    // Define responses
    const responses = {
        'how to vote': `
            <p>Here's how to vote:</p>
            <ul>
                <li>1. Register on the voter portal (voterportal.eci.gov.in)</li>
                <li>2. Find your polling booth using your voter ID</li>
                <li>3. Go to the polling station on election day</li>
                <li>4. Show your ID proof and get your ballot</li>
                <li>5. Mark your choice and submit</li>
            </ul>
        `,
        'what is the eligibility': `
            <p>To be eligible to vote in India, you must:</p>
            <ul>
                <li>Be at least 18 years old</li>
                <li>Be an Indian citizen</li>
                <li>Be registered on the electoral roll</li>
                <li>Not be disqualified from voting</li>
            </ul>
        `,
        'eligibility': `
            <p>To be eligible to vote in India, you must:</p>
            <ul>
                <li>Be at least 18 years old</li>
                <li>Be an Indian citizen</li>
                <li>Be registered on the electoral roll</li>
                <li>Not be disqualified from voting</li>
            </ul>
        `,
        'where is my polling booth': `
            <p>To find your polling booth:</p>
            <ul>
                <li>Go to the Polling Booth section</li>
                <li>Enter your city name</li>
                <li>Click "Find on Google Maps"</li>
                <li>Or visit voterportal.eci.gov.in</li>
            </ul>
        `,
        'polling booth': `
            <p>To find your polling booth:</p>
            <ul>
                <li>Go to the Polling Booth section</li>
                <li>Enter your city name</li>
                <li>Click "Find on Google Maps"</li>
                <li>Or visit voterportal.eci.gov.in</li>
            </ul>
        `,
        'how to register': `
            <p>To register as a voter:</p>
            <ul>
                <li>Visit nvsp.in or voterportal.eci.gov.in</li>
                <li>Fill the Form 6 for new registration</li>
                <li>Submit required documents</li>
                <li>Verify your details</li>
                <li>Get your voter ID card</li>
            </ul>
        `,
        'register': `
            <p>To register as a voter:</p>
            <ul>
                <li>Visit nvsp.in or voterportal.eci.gov.in</li>
                <li>Fill the Form 6 for new registration</li>
                <li>Submit required documents</li>
                <li>Verify your details</li>
                <li>Get your voter ID card</li>
            </ul>
        `,
        'voter id': `
            <p>About Voter ID:</p>
            <ul>
                <li>It's your unique identification for voting</li>
                <li>Apply at nvsp.in</li>
                <li>Carry it to your polling station</li>
                <li>It serves as valid ID proof</li>
            </ul>
        `,
        'election date': `
            <p>Election dates are announced by the Election Commission of India. Check:</p>
            <ul>
                <li>eci.gov.in for official updates</li>
                <li>Local news channels</li>
                <li>Newspaper announcements</li>
            </ul>
        `,
        'hello': `
            <p>Hello! 👋 How can I help you today?</p>
            <p>You can ask me about:</p>
            <ul>
                <li>How to vote</li>
                <li>Eligibility requirements</li>
                <li>Finding your polling booth</li>
                <li>Voter registration</li>
            </ul>
        `,
        'hi': `
            <p>Hello! 👋 How can I help you today?</p>
            <p>You can ask me about:</p>
            <ul>
                <li>How to vote</li>
                <li>Eligibility requirements</li>
                <li>Finding your polling booth</li>
                <li>Voter registration</li>
            </ul>
        `,
        'help': `
            <p>I'm here to help! You can ask me about:</p>
            <ul>
                <li>How to vote - Learn the voting process</li>
                <li>Eligibility - Check if you can vote</li>
                <li>Polling booth - Find your voting location</li>
                <li>Registration - How to register to vote</li>
                <li>Voter ID - About your voter ID card</li>
            </ul>
        `
    };
    
    // Find matching response
    for (const [key, value] of Object.entries(responses)) {
        if (lowerMessage.includes(key)) {
            return value;
        }
    }
    
    // Default response
    return `
        <p>I'm not sure about that. Here are some things I can help you with:</p>
        <ul>
            <li>"How to vote" - Learn the voting process</li>
            <li>"Eligibility" - Check if you can vote</li>
            <li>"Where is my polling booth" - Find your voting location</li>
            <li>"How to register" - Register to vote</li>
        </ul>
    `;
}

// ========================================
// LOGOUT
// ========================================
function logout() {
    // Clear current user session
    setStorage('currentUser', null);
    
    showToast('Logged Out', 'You have been logged out successfully', 'info');
    
    // Redirect to login page
    setTimeout(() => {
        window.location.href = 'index.html';
    }, 1000);
}

function goToAdmin() {
    const user = window.electionAPI.getCurrentUser();
    if (user && user.role === 'admin') {
        window.location.href = 'admin.html';
    } else {
        showToast('Access Denied', 'Admin access required', 'error');
    }
}

// ========================================
// INDEX PAGE STATS
// ========================================
function updateIndexStats() {
    const votes = window.votesData;
    const totalVotes = votes.BJP + votes.Congress + votes.AAP;
    
    const totalVotersEl = document.getElementById('totalVoters');
    const totalVotesEl = document.getElementById('totalVotes');
    
    if (totalVotersEl) {
        totalVotersEl.textContent = voters.length;
    }
    
    if (totalVotesEl) {
        totalVotesEl.textContent = totalVotes;
    }
}

// ========================================
// TOAST NOTIFICATIONS
// ========================================
function showToast(title, message, type = 'info') {
    const container = document.getElementById('toastContainer');
    if (!container) return;
    
    const toast = document.createElement('div');
    toast.className = `toast ${type}`;
    
    const icons = {
        success: 'fa-check',
        error: 'fa-times',
        warning: 'fa-exclamation',
        info: 'fa-info'
    };
    
    toast.innerHTML = `
        <div class="toast-icon">
            <i class="fas ${icons[type]}"></i>
        </div>
        <div class="toast-message">
            <h4>${title}</h4>
            <p>${message}</p>
        </div>
        <button class="toast-close" onclick="this.parentElement.remove()">
            <i class="fas fa-times"></i>
        </button>
    `;
    
    container.appendChild(toast);
    
    // Auto remove after 5 seconds
    setTimeout(() => {
        if (toast.parentElement) {
            toast.style.animation = 'slideOut 0.3s ease forwards';
            setTimeout(() => toast.remove(), 300);
        }
    }, 5000);
}