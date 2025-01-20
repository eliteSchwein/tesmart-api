import { Socket } from 'net';

class ConnectionException extends Error {
    constructor(message: string, public code: number) {
        super(message)
        this.name = "ConnectionException"
    }
}

export default class TesmartClient {
    protected ip: string;
    protected port: number;
    protected timeout: number;

    constructor(ip: string = '192.168.1.10', port: number = 5000, timeout: number = 60) {
        this.ip = ip;
        this.port = port;
        this.timeout = timeout;
    }

    public async getInput() {
        const response = await this.sendCommand(0x10)

        return parseInt(response['o2'], 16) + 1
    }

    public async setInput(input: number) {
        if(input < 1 || input > 16) {
            throw new TypeError('Invalid range for input.')
        }
        return await this.sendCommand(0x01, input)
    }

    public async setLedTimeout(seconds: number) {
        if(seconds < 0 || seconds > 255) {
            throw new TypeError('Invalid range for seconds.')
        }

        return await this.sendCommand(0x03, seconds)
    }

    public async setBuzzer(enable: boolean) {
        return await this.sendCommand(0x02, enable ? 0x01 : 0x00)
    }

    public async setAutoDetect(enable: boolean) {
        return await this.sendCommand(0x81, enable ? 0x01 : 0x00, 0x02)
    }

    public async sendCommand(command: number, param: number = 0x00, subCommand: number = 0x03) {
        return new Promise((resolve, reject) => {
            const client = new Socket()
            let responseData = Buffer.alloc(0)

            client.setTimeout(this.timeout * 1000)

            client.on('error', (err) => {
                // @ts-ignore
                reject(new ConnectionException(err.message, err.code ? parseInt(err.code) : 0))
            })

            client.on('timeout', () => {
                client.destroy()
                reject(new ConnectionException('Connection timed out', 0))
            })

            client.on('data', (data) => {
                responseData = Buffer.concat([responseData, data])

                if (responseData.length >= 6) {
                    client.destroy()

                    const result = [
                        responseData.toString('hex', 0, 3),
                        responseData.toString('hex', 3, 4),
                        responseData.toString('hex', 4, 5),
                        responseData.toString('hex', 5, 6),
                    ];
                    resolve(result);
                }
            })

            client.on('close', () => {
                if (responseData.length < 6) {
                    reject(new ConnectionException('Incomplete response', 0))
                }
            })

            client.connect(this.port, this.ip, () => {
                const data = Buffer.from([0xAA, 0xBB, subCommand, command, param, 0xEE])
                client.write(data)
            })
        })
    }
}