type Props = {
    html: string,
}

export default function HtmlBlock({ html }: Props) {
    return <div dangerouslySetInnerHTML={{ __html: html }} />;
}
