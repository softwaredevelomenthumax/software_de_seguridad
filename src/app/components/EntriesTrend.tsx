import { useMemo } from 'react';

interface EntryRecord {
id: string;
entryDate: string;
}

interface Props {
entries: EntryRecord[];
}

    export function EntriesTrend({ entries }: Props) {
    const data = useMemo(() => {
        const last7Days: Record<string, number> = {};

for (let i = 6; i >= 0; i--) {
    const d = new Date();
    d.setDate(d.getDate() - i);
    const key = d.toISOString().split('T')[0];
    last7Days[key] = 0;
}

entries.forEach((e) => {
    const date = e.entryDate?.split('T')[0];
    if (date && last7Days[date] !== undefined) {
    last7Days[date]++;
    }
});

return Object.entries(last7Days);
}, [entries]);

return (
<div className="bg-white p-6 rounded-lg shadow border mt-6">
    <h2 className="font-semibold mb-4">📈 Ingresos últimos 7 días</h2>

    <div className="space-y-2">
    {data.map(([date, count]) => (
        <div key={date} className="flex items-center justify-between">
        <span className="text-sm text-gray-500">{date}</span>

        <div className="flex items-center gap-2 w-2/3">
            <div className="h-2 bg-blue-500 rounded"
            style={{ width: `${Math.min(count * 20, 100)}%` }}
            />
            <span className="text-sm">{count}</span>
        </div>
        </div>
    ))}
    </div>
</div>
);
}