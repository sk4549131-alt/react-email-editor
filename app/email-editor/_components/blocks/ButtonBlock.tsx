type Props = {
    label: string,
    href: string,
}

export default function ButtonBlock({ label, href }: Props) {
    return (
        <a
            href={href}
            style={{
                display: 'inline-block',
                padding: '8px 16px',
                background: '#111827',
                color: '#fff',
                borderRadius: 6,
                textDecoration: 'none',
            }}
        >
            {label}
        </a>
    );
}
