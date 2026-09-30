type Props = {
    columns: number,
}

export default function ColumnBlock({ columns }: Props) {
    return (
        <div style={{ display: 'flex', gap: 8 }}>
            {Array.from({ length: columns }).map((_, i) => (
                <div key={i} style={{ flex: 1, minHeight: 40, border: '1px dashed #d1d5db' }} />
            ))}
        </div>
    );
}
