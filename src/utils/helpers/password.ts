import bcrypt from 'bcrypt';

const saltRounds = 10;

export async function encrypt(password: string): Promise<string> {
    return bcrypt.hash(password, saltRounds);
}

export async function compare(password: string, hash: string): Promise<string> {
    return bcrypt.compare(password, hash);
}