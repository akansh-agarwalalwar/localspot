// Utility functions to debug and fix auth issues
// Run these in the browser console

// Extend the Window interface to include authDebug
declare global {
  interface Window {
    authDebug: {
      checkAuthState: () => void;
      clearAuth: () => void;
      testAPI: () => Promise<any>;
      fixAuthIssues: () => void;
    };
  }
}

// 1. Check current auth state
function checkAuthState() {
    console.log('=== AUTH STATE DEBUG ===');
    console.log('LocalStorage token:', localStorage.getItem('token'));
    console.log('LocalStorage user:', localStorage.getItem('user'));
    
    try {
        const user = JSON.parse(localStorage.getItem('user') || 'null');
        console.log('Parsed user:', user);
        if (user) {
            console.log('User role:', user.role);
            console.log('User permissions:', user.permissions);
        }
    } catch (e) {
        console.error('Error parsing user data:', e);
    }
}

// 2. Clear all auth data
function clearAuth() {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    console.log('Auth data cleared. Please refresh the page.');
}

// 3. Test API connection
async function testAPI() {
    try {
        const response = await fetch('https://localspot-spq8.onrender.com/api/auth/profile', {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('token')}`,
                'Content-Type': 'application/json'
            }
        });
        console.log('API Response status:', response.status);
        const data = await response.json();
        console.log('API Response data:', data);
        return data;
    } catch (error) {
        console.error('API Error:', error);
        return null;
    }
}

// 4. Fix common issues
function fixAuthIssues() {
    console.log('=== FIXING AUTH ISSUES ===');
    
    // Check if we have token but no user, or vice versa
    const token = localStorage.getItem('token');
    const userStr = localStorage.getItem('user');
    
    if (token && !userStr) {
        console.log('Found token but no user data - clearing token');
        localStorage.removeItem('token');
    }
    
    if (!token && userStr) {
        console.log('Found user data but no token - clearing user data');
        localStorage.removeItem('user');
    }
    
    if (userStr) {
        try {
            const user = JSON.parse(userStr);
            if (!user.role || !['admin', 'subadmin'].includes(user.role)) {
                console.log('Invalid user role detected - clearing auth data');
                localStorage.removeItem('token');
                localStorage.removeItem('user');
            }
        } catch (e) {
            console.log('Corrupted user data detected - clearing auth data');
            localStorage.removeItem('token');
            localStorage.removeItem('user');
        }
    }
    
    console.log('Auth issues fixed. Please refresh the page.');
}

// Export functions to window for easy access
if (typeof window !== 'undefined') {
    window.authDebug = {
        checkAuthState,
        clearAuth,
        testAPI,
        fixAuthIssues
    };

    console.log('Auth debug utilities loaded. Available commands:');
    console.log('- authDebug.checkAuthState() - Check current auth state');
    console.log('- authDebug.clearAuth() - Clear all auth data');
    console.log('- authDebug.testAPI() - Test API connection');
    console.log('- authDebug.fixAuthIssues() - Fix common auth issues');
}

export {};
