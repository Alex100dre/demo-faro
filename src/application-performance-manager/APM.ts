import { TracingInstrumentation } from "@grafana/faro-web-tracing"
import {
    faro,
    LogLevel,
    getWebInstrumentations,
    initializeFaro,
    EventAttributes, LogContext,
} from "@grafana/faro-react"
import { Faro } from "@grafana/faro-core"

export enum Env {
    LOCAL = "local",
    DEVELOPMENT = "development",
    RECETTE = "recette",
    QUALIFICATION = "qualification",
    PRODUCTION = "production",
}

export enum LogNiveau {
    TRACE = "TRACE",
    DEBUG = "DEBUG",
    INFO = "INFO",
    LOG = "LOG",
    WARN = "WARN",
    ERROR = "ERROR",
}

export type APMAppConfig = {
    name: string
    version: string
    environment: Env
}

export type APMEvent = {
    name: string
    attributes?: EventAttributes
    domain?: string
}

export class APM {
    private enabled: boolean
    private app: APMAppConfig
    private url: string
    constructor(enabled: boolean, app: APMAppConfig, url: string) {
        this.enabled = enabled
        this.app = app
        this.url = url
    }

    init(): Faro | undefined {
        this.sayHello()
        if (!this.enabled) return
        return initializeFaro({
            url: this.url,
            app: {
                name: this.app.name,
                version: this.app.version,
                environment: this.app.environment,
            },

            instrumentations: [
                // Mandatory, overwriting the instrumentations array would cause the default instrumentations to be omitted
                ...getWebInstrumentations(),
                new TracingInstrumentation(),
            ],
            beforeSend: (event) => {
                event.payload.context = {
                    ...event.payload.context,
                    usedId: '001',
                    userName: "Jack O'Neill",
                    userEmail: 'jack.oneill@sgc.com',
                }

                return event;
            }
        })
    }

    private sayHello(): void {
        console.log(
            "%c" +
            "            #            \t\t\t\t\n" +
            "           ###           \t\t\t\t\n" +
            "          #####          \t\t\t\t\n" +
            "         #######         \t\t\t\t\n" +
            "        #########        \t\t\t\t\n" +
            "       ###########       \t\t\t\t\n" +
            "      ###### ######      \t\t\t\t\n" +
            "     ######   ######     \t\t\t\t\n" +
            "    ######  ## ######    \t\t\t\t\n" +
            `   ######  ###########   \t%c Bienvenue sur %c${this.app.name.toUpperCase()}\n` +
            `  ######  #############  \t%c Version : %c${this.app.version}\t\n` +
            ` ######     ############ \t%c Environnement : %c${this.app.environment}\t\n` +
            `######           ########\t%c APM : %c${this.enabled ? "actif   " : "inactif"}\t\t\n`,
            "background: black; color: green",
            "background: black; color: white",
            "background: black; color: green",
            "background: black; color: white",
            "background: black; color: green",
            "background: black; color: white",
            "background: black; color: green",
            "background: black; color: white",
            `background: black; color: ${this.enabled ? "green" : "red"}`,
        );
    }

    private processLog(message: string, niveau: LogNiveau, context?: LogContext): void {
        if (!this.enabled) return
        if (!faro) return console.error("Aucune instance Faro en cours")
        faro.api.pushLog([message], {
            level: LogLevel[niveau] ?? LogLevel.LOG,
            context: context,
        })
    }

    debug(message: string, context?: LogContext): void {
        this.processLog(message, LogNiveau.DEBUG, context)
    }

    info(message: string, context?: LogContext): void {
        this.processLog(message, LogNiveau.INFO, context)
    }

    warn(message: string, context?: LogContext): void {
        this.processLog(message, LogNiveau.WARN, context)
    }

    error(message: string, context?: LogContext): void {
        this.processLog(message, LogNiveau.ERROR, context)
    }

    log(message: string, context?: LogContext): void {
        this.processLog(message, LogNiveau.LOG, context)
    }

    trace(message: string, context?: LogContext): void {
        this.processLog(message, LogNiveau.TRACE, context)
    }

    private processEvent(event: APMEvent): void {
        if (!this.enabled) return
        if (!faro) return console.error("Aucune instance Faro en cours")
        faro.api.pushEvent(event.name, event.attributes, event.domain)
    }

    event(event: APMEvent): void {
        this.processEvent(event)
    }

    userAuthenticated(userId: string): void {
        this.processEvent({
            name: "user_authenticated",
            attributes: {
                userId: userId,
            },
            domain: "auth",
        })
    }
}
