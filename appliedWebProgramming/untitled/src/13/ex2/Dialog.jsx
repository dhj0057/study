import FancyBorder from "../ex1/FancyBorder";
import  "../ex1/WelcomeDialog.css"

function Dialog(props) {
    return(
        <div className={"Dialog-container"}>
            <FancyBorder color={"blue"}>
                <h1 className={"Dialog-title"}>
                    {props.title}
                </h1>
                <p className={"Dialog-message"}>
                    {props.message}
                </p>
        </FancyBorder>
        </div>
    )
}

export default Dialog;