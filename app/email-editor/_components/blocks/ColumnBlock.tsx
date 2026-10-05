type Props = {
    columns: number,
}

export default function ColumnBlock({ columns }: Props) {
    return (
        <div style={{ display: 'flex', gap: 12 }}>
            {Array.from({ length: columns }).map((_, i) => (
                <div key={i} style={{
                    flex: 1,
                    minHeight: 64,
                    border: '1.5px dashed #cbd5e1',
                    borderRadius: 8,
                    background: '#f8fafc',
                }} />
            ))}
        </div>
    );
}
