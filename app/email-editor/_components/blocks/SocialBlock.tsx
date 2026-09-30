type Props = {
    links: { platform: string, href: string }[],
}

export default function SocialBlock({ links }: Props) {
    return (
        <div style={{ display: 'flex', gap: 8 }}>
            {links.map((link) => (
                <a key={link.platform} href={link.href}>{link.platform}</a>
            ))}
        </div>
    );
}
