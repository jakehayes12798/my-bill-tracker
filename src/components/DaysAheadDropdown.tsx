

export default function DaysAheadDropdown ({
    daysAhead,
    setDaysAhead
}: Readonly<{
    daysAhead: number;
    setDaysAhead: (days: number) => void;
}>)
{
    return (
    <div style={{ margin: "1rem" }}>
        <label htmlFor="daysAhead">Show bills due within: </label>
        <select
            id="daysAhead"
            value={daysAhead}
            onChange={(e) => setDaysAhead(Number(e.target.value))}
            >
            <option value={30}>30 days</option>
            <option value={60}>60 days</option>
            <option value={180}>180 days</option>
            <option value={365}>365 days</option>
            <option value={9999}>All upcoming</option>
        </select>
    </div>
    );
}