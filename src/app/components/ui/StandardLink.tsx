
interface StandardLinkProps {
    uri: string;
    text: string;
    new_tab: boolean;
}

export default function StandardLink({ uri, text, new_tab }: StandardLinkProps): JSX.Element {

    return (

        <a
            href={uri}
            target={new_tab ? "_blank" : "_self"}
            rel="noopener noreferrer"
            className="text-blue-600 dark:text-blue-500 hover:underline"
        >
            {text}
        </a>

    );
    
}