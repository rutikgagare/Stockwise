const generateRandomPassword = (size = 12) => {
    size = Math.max(size, 12);

    const lowercaseChars = 'abcdefghijklmnopqrstuvwxyz';
    const uppercaseChars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    const digitChars = '0123456789';
    const specialChars = '!@#$%^&*()_+{}|[]:;<>,.?/~';

    const allChars = lowercaseChars + uppercaseChars + digitChars + specialChars;

    let password = '';

    // Ensure each character type is included
    password += getRandomChar(lowercaseChars);
    password += getRandomChar(uppercaseChars);
    password += getRandomChar(digitChars);
    password += getRandomChar(specialChars);

    // Generate remaining characters randomly
    for (let i = 4; i < size; i++) {
        password += getRandomChar(allChars);
    }

    // Shuffle the password to mix characters
    password = password.split('').sort(() => Math.random() - 0.5).join('');

    return password;
};

const getRandomChar = (charset) => {
    return charset[Math.floor(Math.random() * charset.length)];
};

module.exports = { generateRandomPassword }