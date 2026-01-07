/**
 * Test Utilities
 * Helper functions for logging and making API requests
 */

import { BASE_URL, colors, sessions, USERS } from './config.js';

export function log(message, color = 'reset') {
    console.log(`${colors[color]}${message}${colors.reset}`);
}

export function logSection(title) {
    console.log('\n' + '='.repeat(60));
    log(title, 'cyan');
    console.log('='.repeat(60));
}

export function logTest(name, status, details = '') {
    const icon = status === 'PASS' ? '✓' : '✗';
    const color = status === 'PASS' ? 'green' : 'red';
    log(`${icon} ${name} ${details}`, color);
}

export async function request(endpoint, options = {}) {
    const url = `${BASE_URL}${endpoint}`;
    const headers = {
        'Content-Type': 'application/json',
        ...options.headers
    };

    try {
        const response = await fetch(url, {
            ...options,
            headers
        });

        const contentType = response.headers.get('content-type');
        let data = null;

        // Get response text first
        const text = await response.text();

        // Try to parse as JSON if content-type is JSON and text is not empty
        if (contentType && contentType.includes('application/json') && text) {
            try {
                data = JSON.parse(text);
            } catch (e) {
                data = { error: 'Invalid JSON response', rawText: text };
            }
        } else {
            data = text || null;
        }

        return { response, data, status: response.status };
    } catch (error) {
        return { error: error.message, status: 0, data: null };
    }
}

export async function login(role) {
    const user = USERS[role];
    log(`\nLogging in as ${role.toUpperCase()} (${user.email})...`, 'yellow');

    const { response, data, status } = await request('/api/auth/login', {
        method: 'POST',
        body: JSON.stringify(user)
    });

    if (status === 200) {
        const cookies = response.headers.get('set-cookie');
        if (cookies) {
            const sessionMatch = cookies.match(/session_token=([^;]+)/);
            if (sessionMatch) {
                sessions[role] = sessionMatch[1];
                logTest(`Login as ${role}`, 'PASS', `- Token: ${sessions[role].substring(0, 20)}...`);
                return true;
            }
        }
    }

    logTest(`Login as ${role}`, 'FAIL', `- ${data.error || 'Unknown error'}`);
    return false;
}

export async function logout(role) {
    if (!sessions[role]) return;

    await request('/api/auth/logout', {
        method: 'POST',
        headers: {
            'Cookie': `session_token=${sessions[role]}`
        }
    });

    delete sessions[role];
    log(`Logged out ${role}`, 'yellow');
}
