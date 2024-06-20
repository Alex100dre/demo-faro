import {Button} from "@/components/ui/button"
import './App.css'
import {FC, PropsWithChildren, useState} from "react";
import {formatDate} from "@/utils/date.ts";
import {Label} from "@/components/ui/label.tsx";
import {Input} from "@/components/ui/input.tsx";
import {Select, SelectContent, SelectItem, SelectTrigger, SelectValue} from "@/components/ui/select.tsx";
import {faro} from "@grafana/faro-react";
import {APM} from "@/application-performance-manager/APM.ts";
import {Configuration} from "@/configuration";

enum EVENT_TYPE {
    ERROR = 'error',
    CUSTOM_EVENT = 'custom-event',
    CUSTOM_LOG = 'custom-log',
    CUSTOM_ERROR = 'custom-error',
    CRASH = 'crash',
}

type Event = {
    type: EVENT_TYPE;
    message: string;
    date: Date;
}

interface AppProps {
    apm: APM
    configuration: Configuration
}

const App: FC<PropsWithChildren<AppProps>> = ({apm, configuration}) => {
    const [events, setEvents] = useState<Event[]>([]);
    const [type, setType] = useState<EVENT_TYPE>(EVENT_TYPE.ERROR);
    const [message, setMessage] = useState<string>("Une erreur générée manuellement");

    const generateEvent = () => {
        const event: Event = {type: type, message: message, date: new Date()};
        setEvents([...events, event]);

        switch (type) {
            case EVENT_TYPE.ERROR:
                console.error(new Error(message));
                break;
            case EVENT_TYPE.CUSTOM_EVENT:
                faro.api.pushEvent(type, {message: message});
                break;
            case EVENT_TYPE.CUSTOM_LOG:
                apm.log(message, { reason: "C'est pour une démo" });
                break;
            case EVENT_TYPE.CUSTOM_ERROR:
                faro.api.pushError(new Error(message));
                break;
            case EVENT_TYPE.CRASH:
                toto.demoFaro = 'Un crash volontaire (catch automatique)';
                break;
            default:
                break;
        }
    }

    const handleTypeChange = (value: EVENT_TYPE) => {
        setType(value);
    }

    const handleMessageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setMessage(e.target.value);
    }

    const clear = () => {
        setEvents([]);
    }
    return (
        <div key="1" className="flex flex-col h-screen">
            <header className="bg-gray-900 text-white py-4 px-6">
                <h1 className="text-2xl font-bold">Démonstration Faro 🐞</h1>
            </header>
            <main className="flex-1 p-8 grid grid-cols-12 gap-6">
                <div className="bg-white p-6 rounded-lg shadow col-span-9">
                    <h2 className="text-xl font-bold mb-4">Évènements</h2>
                    <div className="bg-gray-100 p-4 rounded-md min-h-[200px]">
                        <div>
                            <ul className="space-y-2">
                                {events.length === 0 && (
                                    <div
                                        className="p-4 min-h-[200px] flex items-center justify-center text-gray-500">Aucun
                                        évènement disponible</div>
                                )}
                                {events.map((event, index) => (
                                    <li className="flex items-center justify-between transition-colors duration-300 ease-in-out hover:bg-gray-200"
                                        key={`event-${index}-${event.type}`}>
                                        <div>
                                            <span className="font-semibold">{event.type} : </span>
                                            {event.message}
                                        </div>
                                        <div className="text-gray-500 text-sm">{formatDate(event.date)}</div>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </div>
                </div>
                <div className="bg-white p-6 rounded-lg shadow col-span-3">
                    <h2 className="text-xl font-bold mb-4">Informations APM</h2>
                    <div className="bg-gray-100 p-4 rounded-md min-h-[200px]">
                        <ul className="space-y-2">
                            <li className="flex items-center justify-between">
                                <div><span className="font-semibold">Application : </span></div>
                                <div className="text-gray-500">{configuration.app_name}</div>
                            </li>
                            <li className="flex items-center justify-between">
                                <div><span className="font-semibold">Version : </span></div>
                                <div className="text-gray-500">{configuration.app_version}</div>
                            </li>
                            <li className="flex items-center justify-between">
                                <div><span className="font-semibold">Environnement : </span></div>
                                <div className="text-gray-500">{configuration.environment}</div>
                            </li>
                            <li className="flex items-center justify-between">
                                <div><span className="font-semibold">Statut : </span></div>
                                <div className="text-gray-500">
                                    <span className={`w-3 h-3 ${configuration.apm.enabled === true ? 'bg-green-500' : 'bg-red-500'} rounded-full mr-2 inline-block`}/>
                                    {configuration.apm.enabled === true ? 'Actif' : 'Inactif'}
                                </div>
                            </li>
                        </ul>
                    </div>
                </div>
                <div className="col-span-12 grid grid-cols-12">
                    <h2 className="text-xl font-bold mb-4 col-span-12">Générer un évènement</h2>
                    <div className="col-span-9">
                        <div className="grid grid-cols-12 gap-4">
                            <div className="col-span-8">
                                <Label htmlFor="content">Contenu</Label>
                                <Input id="content" placeholder="Entrez le contenu" defaultValue={message}
                                       onChange={handleMessageChange}/>
                            </div>
                            <div className="col-span-4">
                                <Label htmlFor="type">Type</Label>
                                <Select defaultValue={type} onValueChange={handleTypeChange}>
                                    <SelectTrigger className="w-full">
                                        <SelectValue placeholder="Sélectionnez un type"/>
                                    </SelectTrigger>
                                    <SelectContent>
                                        {Object.values(EVENT_TYPE).map((eventType) => (
                                            <SelectItem key={eventType} value={eventType}>{eventType}</SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>
                    </div>
                    <div className="flex justify-end items-end col-span-3 space-x-4">
                        <Button variant="destructive" onClick={generateEvent}>Générer</Button>
                        <Button variant="outline" onClick={clear}>Réinitialiser</Button>
                    </div>
                </div>
            </main>
        </div>
    )
};

export default App
