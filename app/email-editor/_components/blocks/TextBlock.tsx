type Props = {
    text: string,
}

export default function TextBlock({ text }: Props) {
    return <p style={{ margin: 0 }}>{text}</p>;
}
