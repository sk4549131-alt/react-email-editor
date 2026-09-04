import {useEffect} from "react";

type Props = {
    insideIframe: boolean
}

export default function Canvas({insideIframe}: Props) {

    useEffect(() => {
        console.log(insideIframe);
    }, [insideIframe]);

    return (
        <div>
            sadsadsa
        </div>
    )
}