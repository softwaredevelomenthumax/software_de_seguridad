import { useMemo } from 'react';

interface EntryRecord {
    id: string;
    collaboratorName: string;
    objectName: string;
    entryDate: string;
    entryTime: string;
    status?: string;
}

interface Props {
    entries: EntryRecord[];
}

export function RecentActivityPanel({ entries }: Props) {
const lastEntries = useMemo(() => {
return [...entries]
    .sort((a, b) => Number(b.id) - Number(a.id))
    .slice(0, 5);
}, [entries]);

return (
<div className="bg-white p-6 rounded-lg shadow border mt-6">
    <h2 className="text-lg font-semibold mb-4">
    🔔 Actividad reciente
    </h2>

    {lastEntries.length === 0 ? (
    <p className="text-gray-500">No hay registros recientes</p>
    ) : (
    <ul className="space-y-3">
        {lastEntries.map((entry) => (
        <li
            key={entry.id}
            className="flex justify-between border-b pb-2 text-sm"
        >
            <div>
            <p className="font-medium">{entry.collaboratorName}</p>
            <p className="text-gray-500">
                {entry.objectName}
            </p>
            </div>

            <div className="text-right text-gray-400">
            <p>{entry.entryDate}</p>
            <p>{entry.entryTime}</p>
            </div>
        </li>
        ))}
    </ul>
    )}
</div>
);
}