import crypto from 'crypto'

export function generateSecurePassword(): string {
  // Generate a secure random password
  // Include uppercase, lowercase, numbers, and special characters
  const uppercase = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'
  const lowercase = 'abcdefghijklmnopqrstuvwxyz'
  const numbers = '0123456789'
  const specials = '!@#$%^&*()_+-=[]{}|;:,.<>?'
  
  const allChars = uppercase + lowercase + numbers + specials
  
  // Ensure at least one character from each category
  let password = ''
  password += getRandomChar(uppercase)
  password += getRandomChar(lowercase)
  password += getRandomChar(numbers)
  password += getRandomChar(specials)
  
  // Fill the rest randomly (minimum 16 characters total)
  for (let i = 4; i < 16; i++) {
    password += getRandomChar(allChars)
  }
  
  // Shuffle the password to avoid predictable patterns
  return shuffleString(password)
}

function getRandomChar(chars: string): string {
  return chars.charAt(crypto.randomInt(0, chars.length))
}

function shuffleString(str: string): string {
  const array = str.split('')
  for (let i = array.length - 1; i > 0; i--) {
    const j = crypto.randomInt(0, i + 1)
    ;[array[i], array[j]] = [array[j], array[i]]
  }
  return array.join('')
}