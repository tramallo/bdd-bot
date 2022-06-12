import { EnvVarNotDefinedError } from './errors/envVarNotDefined.error'

const botToken = (): string => {
    const token = process.env.BOT_TOKEN

    if (!token) {
        throw new EnvVarNotDefinedError('Environment variable BOT_TOKEN is undefined.')
    }

    return token
}

export default { botToken }
