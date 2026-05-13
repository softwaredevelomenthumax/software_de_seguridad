interface Props {
  totalEntries: number;
  todayEntries: number;
}

export function SystemStatusCard({ totalEntries, todayEntries }: Props) {
return (
<div className="bg-white p-6 rounded-lg shadow border mt-6">
    <h2 className="font-semibold mb-4">🧠 Estado del sistema</h2>

    <div className="space-y-3 text-sm">

    <div className="flex justify-between">
        <span>Total registros</span>
        <span className="font-bold">{totalEntries}</span>
    </div>

    <div className="flex justify-between">
        <span>Actividad hoy</span>
        <span className="font-bold text-green-600">{todayEntries}</span>
    </div>

    <div className="flex justify-between">
        <span>Estado servidor</span>
        <span className="text-green-600 font-bold">Activo 🟢</span>
    </div>

    </div>
</div>
);
}