#!/usr/bin/env node

/**
 * JIA Application - Environment Setup Verification Script
 * Sprint Round - Ticket #1
 * 
 * This script verifies that the development environment is properly configured.
 * Run this after setting up your .env.local file to ensure everything works.
 * 
 * Usage: node verify-setup.js
 */

const fs = require('fs');
const path = require('path');
const https = require('https');

// ANSI color codes for terminal output
const colors = {
  reset: '\x1b[0m',
  green: '\x1b[32m',
  red: '\x1b[31m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  cyan: '\x1b[36m',
};

// Helper functions
const log = {
  success: (msg) => console.log(`${colors.green}✓${colors.reset} ${msg}`),
  error: (msg) => console.log(`${colors.red}✗${colors.reset} ${msg}`),
  warning: (msg) => console.log(`${colors.yellow}⚠${colors.reset} ${msg}`),
  info: (msg) => console.log(`${colors.blue}ℹ${colors.reset} ${msg}`),
  section: (msg) => console.log(`\n${colors.cyan}${msg}${colors.reset}\n${'='.repeat(60)}`),
};

// Verification results
const results = {
  passed: 0,
  failed: 0,
  warnings: 0,
};

/**
 * Check if .env.local file exists
 */
function checkEnvFile() {
  log.section('1. Checking Environment File');
  
  const envPath = path.join(__dirname, '.env.local');
  
  if (fs.existsSync(envPath)) {
    log.success('.env.local file exists');
    results.passed++;
    return true;
  } else {
    log.error('.env.local file not found');
    log.info('Create .env.local file with required environment variables');
    results.failed++;
    return false;
  }
}

/**
 * Parse and validate environment variables
 */
function checkEnvironmentVariables() {
  log.section('2. Validating Environment Variables');
  
  const envPath = path.join(__dirname, '.env.local');
  
  if (!fs.existsSync(envPath)) {
    log.error('Cannot validate - .env.local file missing');
    results.failed++;
    return false;
  }
  
  const envContent = fs.readFileSync(envPath, 'utf8');
  const envVars = {};
  
  // Parse environment variables
  envContent.split('\n').forEach(line => {
    const trimmed = line.trim();
    if (trimmed && !trimmed.startsWith('#')) {
      const [key, ...valueParts] = trimmed.split('=');
      if (key && valueParts.length > 0) {
        envVars[key.trim()] = valueParts.join('=').trim();
      }
    }
  });
  
  // Required variables
  const required = [
    'NEXT_PUBLIC_CORE_API_URL',
    'MONGODB_URI',
    'OPENAI_API_KEY',
  ];
  
  let allPresent = true;
  
  required.forEach(varName => {
    if (envVars[varName]) {
      log.success(`${varName} is set`);
      results.passed++;
    } else {
      log.error(`${varName} is missing`);
      results.failed++;
      allPresent = false;
    }
  });
  
  // Check Core API URL value
  if (envVars['NEXT_PUBLIC_CORE_API_URL']) {
    const expectedUrl = 'https://jia-jvx-1a0eba0de6dd.herokuapp.com';
    if (envVars['NEXT_PUBLIC_CORE_API_URL'] === expectedUrl) {
      log.success('Core API URL is correctly configured');
      results.passed++;
    } else {
      log.warning(`Core API URL is set but may not be correct`);
      log.info(`Expected: ${expectedUrl}`);
      log.info(`Found: ${envVars['NEXT_PUBLIC_CORE_API_URL']}`);
      results.warnings++;
    }
  }
  
  return allPresent;
}

/**
 * Check if node_modules exists
 */
function checkDependencies() {
  log.section('3. Checking Dependencies');
  
  const nodeModulesPath = path.join(__dirname, 'node_modules');
  
  if (fs.existsSync(nodeModulesPath)) {
    log.success('node_modules directory exists');
    results.passed++;
    
    // Check if package.json exists
    const packageJsonPath = path.join(__dirname, 'package.json');
    if (fs.existsSync(packageJsonPath)) {
      const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'));
      const depCount = Object.keys(packageJson.dependencies || {}).length;
      log.info(`${depCount} dependencies listed in package.json`);
      results.passed++;
    }
    
    return true;
  } else {
    log.error('node_modules directory not found');
    log.info('Run: npm install --legacy-peer-deps');
    results.failed++;
    return false;
  }
}

/**
 * Check if build directory exists
 */
function checkBuild() {
  log.section('4. Checking Build Status');
  
  const nextPath = path.join(__dirname, '.next');
  
  if (fs.existsSync(nextPath)) {
    log.success('.next build directory exists');
    log.info('Application has been built at least once');
    results.passed++;
    return true;
  } else {
    log.warning('.next build directory not found');
    log.info('Run: npm run build (to verify production build)');
    results.warnings++;
    return false;
  }
}

/**
 * Test Core API connectivity
 */
function testCoreAPI() {
  return new Promise((resolve) => {
    log.section('5. Testing Core API Connectivity');
    
    const url = 'https://jia-jvx-1a0eba0de6dd.herokuapp.com';
    
    log.info(`Testing connection to: ${url}`);
    
    https.get(url, (res) => {
      if (res.statusCode === 200 || res.statusCode === 404) {
        // 404 is okay - it means the server is responding
        log.success('Core API is reachable');
        log.info(`Status Code: ${res.statusCode}`);
        results.passed++;
        resolve(true);
      } else {
        log.warning(`Core API responded with status: ${res.statusCode}`);
        results.warnings++;
        resolve(false);
      }
    }).on('error', (err) => {
      log.error('Failed to connect to Core API');
      log.info(`Error: ${err.message}`);
      results.failed++;
      resolve(false);
    });
  });
}

/**
 * Check Node.js version
 */
function checkNodeVersion() {
  log.section('6. Checking Node.js Version');
  
  const version = process.version;
  const major = parseInt(version.slice(1).split('.')[0]);
  
  log.info(`Node.js version: ${version}`);
  
  if (major >= 18) {
    log.success('Node.js version is compatible (v18+)');
    results.passed++;
    return true;
  } else {
    log.error('Node.js version is too old');
    log.info('Required: v18.0.0 or higher');
    log.info('Recommended: v20.0.0 or higher');
    results.failed++;
    return false;
  }
}

/**
 * Print final summary
 */
function printSummary() {
  log.section('Verification Summary');
  
  console.log(`${colors.green}Passed:${colors.reset}   ${results.passed}`);
  console.log(`${colors.red}Failed:${colors.reset}   ${results.failed}`);
  console.log(`${colors.yellow}Warnings:${colors.reset} ${results.warnings}`);
  
  console.log('\n' + '='.repeat(60) + '\n');
  
  if (results.failed === 0) {
    log.success('All critical checks passed! ✨');
    log.info('Your development environment is ready.');
    log.info('Run: npm run dev (to start development server)');
    return true;
  } else {
    log.error('Some checks failed. Please fix the issues above.');
    log.info('See SETUP.md for detailed setup instructions.');
    return false;
  }
}

/**
 * Main verification function
 */
async function main() {
  console.log('\n' + '='.repeat(60));
  console.log(`${colors.cyan}JIA Application - Setup Verification${colors.reset}`);
  console.log(`${colors.cyan}Sprint Round - Ticket #1${colors.reset}`);
  console.log('='.repeat(60) + '\n');
  
  // Run all checks
  checkNodeVersion();
  checkEnvFile();
  checkEnvironmentVariables();
  checkDependencies();
  checkBuild();
  await testCoreAPI();
  
  // Print summary
  const success = printSummary();
  
  // Exit with appropriate code
  process.exit(success ? 0 : 1);
}

// Run the verification
main().catch(err => {
  console.error('Verification script error:', err);
  process.exit(1);
});
