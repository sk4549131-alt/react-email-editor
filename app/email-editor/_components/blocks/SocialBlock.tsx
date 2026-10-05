type Props = {
    links: { platform: string, href: string }[],
}

export default function SocialBlock({ links }: Props) {
    return (
        <div style={{ display: 'flex', justifyContent: 'center', flexWrap: 'wrap', gap: 8 }}>
            {links.map((link) => (
                <a
                    key={link.platform}
                    href={link.href}
                    style={{
                        padding: '6px 14px',
                        borderRadius: 999,
                        background: '#f3f4f6',
                        color: '#374151',
                        fontSize: 13,
                        fontWeight: 500,
                        textDecoration: 'none',
                        textTransform: 'capitalize',
                    }}
                >
                    {link.platform}
                </a>
            ))}
        </div>
    );
}
