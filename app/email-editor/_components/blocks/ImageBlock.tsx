type Props = {
    src: string,
    alt: string,
}

export default function ImageBlock({ src, alt }: Props) {
    return <img src={src} alt={alt} style={{ width: '100%', display: 'block', borderRadius: 8 }} />;
}
