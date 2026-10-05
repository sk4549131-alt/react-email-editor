type Props = {
    label: string,
    href: string,
}

export default function ButtonBlock({ label, href }: Props) {
    return (
        <div style={{ textAlign: 'center' }}>
            <a
                href={href}
                style={{
                    display: 'inline-block',
                    padding: '12px 28px',
                    background: '#111827',
                    color: '#fff',
                    borderRadius: 8,
                    fontSize: 15,
                    fontWeight: 600,
                    textDecoration: 'none',
                }}
            >
                {label}
            </a>
        </div>
    );
}
