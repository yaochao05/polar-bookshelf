/**
 * Simple logger that just writes to the console.
 */
import {ILogger} from './ILogger';
import {FileLogger} from './FileLogger';
import {Directories} from '../datastore/Directories';
import {FilePaths} from '../util/FilePaths';
import {ErrorLike} from './ILogger';

/**
 * A logger which writes to disk but ONLY if they are errors.  This is needed
 * for performance reasons as electron-log isn't amazingly fast.
 */
export class PersistentErrorLogger implements ILogger {

    public readonly name: string = 'persistent-error-logger';

    private readonly delegate: ILogger;

    private constructor(delegate: ILogger) {
        this.delegate = delegate;
    }

    public notice(msg: string, ...args: any[]) {
        this.delegate.notice(msg, ...args);
    }

    public error(msg: string, err: ErrorLike, arg0?: any, arg1?: any, arg2?: any) {
        this.delegate.error(msg, err, arg0, arg1, arg2);
    }

    public info(msg: string, ...args: any[]) {
        // noop
    }

    public warn(msg: string, ...args: any[]) {
        // noop
    }

    public verbose(msg: string, ...args: any[]) {
        // noop
    }

    public debug(msg: string, ...args: any[]) {
        // noop
    }

    public async sync(): Promise<void> {
        await this.delegate.sync();
    }

    public static async create(): Promise<PersistentErrorLogger> {
        const directories = new Directories();
        const path = FilePaths.create(directories.logsDir, "error.log");
        const fileLogger = await FileLogger.create(path);
        return new PersistentErrorLogger(fileLogger);
    }

}
