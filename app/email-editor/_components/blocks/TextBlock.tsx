type Props = {
    text: string,
}

export default function TextBlock({ text }: Props) {
    return (
        <p style={{
            margin: 0,
            fontSize: 16,
            lineHeight: 1.6,
            color: '#1f2937',
        }}>
            {text}
        </p>
    );
}
