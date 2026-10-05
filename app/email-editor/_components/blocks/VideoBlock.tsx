type Props = {
    src: string,
}

export default function VideoBlock({ src }: Props) {
    return <video src={src} controls style={{ width: '100%', display: 'block', borderRadius: 8, background: '#111827' }} />;
}
