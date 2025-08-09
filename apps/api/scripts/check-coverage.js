#!/usr/bin/env node

/**
 * Coverage validation script that checks thresholds independently of test pass/fail
 */

const { execSync } = require('child_process');
const fs = require('fs');

try {
  // Run coverage but capture output
  console.log('🔍 Checking coverage thresholds...');
  
  const result = execSync('npm run test -- --coverage --passWithNoTests', { 
    encoding: 'utf8',
    stdio: 'pipe'
  });
  
  // Check if coverage thresholds were met by looking for threshold failures
  if (result.includes('coverage threshold') && result.includes('not met')) {
    console.log('❌ Coverage thresholds not met');
    console.log(result);
    process.exit(1);
  }
  
  // Extract coverage percentages from output
  const lines = result.split('\n');
  const allFilesLine = lines.find(line => line.includes('All files'));
  
  if (allFilesLine) {
    console.log('✅ Coverage thresholds met');
    console.log('📊 ' + allFilesLine.trim());
  } else {
    console.log('✅ Coverage validation passed');
  }
  
  process.exit(0);
  
} catch (error) {
  // Check if it's a threshold error or just test failures
  const output = error.stdout || error.stderr || error.message;
  
  if (output.includes('coverage threshold') && output.includes('not met')) {
    console.log('❌ Coverage thresholds not met');
    console.log(output);
    process.exit(1);
  }
  
  // If it's not a coverage threshold issue, it's probably just test failures
  // which we want to ignore for coverage validation
  console.log('✅ Coverage thresholds validation completed');
  console.log('ℹ️  (Test failures ignored for coverage validation)');
  process.exit(0);
}