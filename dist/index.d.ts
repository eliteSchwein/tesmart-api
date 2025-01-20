export default class TesmartClient {
    protected ip: string;
    protected port: number;
    protected timeout: number;
    constructor(ip?: string, port?: number, timeout?: number);
    getInput(): Promise<number>;
    setInput(input: number): Promise<unknown>;
    setLedTimeout(seconds: number): Promise<unknown>;
    setBuzzer(enable: boolean): Promise<unknown>;
    setAutoDetect(enable: boolean): Promise<unknown>;
    sendCommand(command: number, param?: number, subCommand?: number): Promise<unknown>;
}
