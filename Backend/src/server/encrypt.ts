import crypto from 'crypto';

// Especifica el algoritmo de cifrado que se va a utilizar
const algorithm = 'aes-256-cbc';

// Crea una clave secreta para cifrar y descifrar los datos
const password = 'miClaveSecreta';

export const encrypt = (text: string) => {
	// Crea una instancia del cifrado
	const cipher = crypto.createCipher(algorithm, password);

	// Cifra el texto proporcionado utilizando la instancia del cifrado
	let encrypted = cipher.update(text, 'utf8', 'hex');
	encrypted += cipher.final('hex');

	// Devuelve el texto cifrado
	return encrypted;
};

export const decrypt = (text: string) => {
	// Crea una instancia del descifrado
	const decipher = crypto.createDecipher(algorithm, password);

	// Descifra el texto proporcionado utilizando la instancia del descifrado
	let decrypted = decipher.update(text, 'hex', 'utf8');
	decrypted += decipher.final('utf8');

	// Devuelve el texto descifrado
	return decrypted;
};

export function encryptProducer(email: string): string {
	return encrypt(JSON.stringify({ email }));
}
