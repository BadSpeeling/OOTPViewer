import { LiveUpdate } from "../backend/types";
import { ProcessCardsStatus } from "../types"

import * as React from "react";
import { createRoot } from "react-dom/client";

addEventListener("load", async (event) => {

    const wrapper = document.getElementById("reactWrapper");
    const liveUpdates = await window.electronAPI.getLiveUpdates();

    if (wrapper) {
        const root = createRoot(wrapper);
        root.render(<CardImporter liveUpdates={liveUpdates}/>);
    }

});

type CardImporterProps = {
    liveUpdates: LiveUpdate[],
}

const CardImporter = ({liveUpdates}: CardImporterProps) => {

    const [processCardsStatus,setProcessCardsStatus] = React.useState(ProcessCardsStatus.None);
    const liveUpdatesBody = liveUpdates.map((liveUpdate) => <div>{liveUpdate.EffectiveDate}</div>);
    const writePtCardsHandler = async () => {
        const status = await window.electronAPI.writePtCards();
        setProcessCardsStatus(status)
    }

    const processCardsMessage = () => {
        switch (processCardsStatus) {
            case ProcessCardsStatus.Success:
                return "The Card Shop read and write was successful";
            case ProcessCardsStatus.Fail:
                return "There was an issue with the read and write of the Card Shop"
            default:
                return "";
        }
    }

    return (
        <div>
            <div><b>Effective Date</b></div>
            {liveUpdatesBody}
            <div>
                <div><span>{processCardsMessage()}</span></div>
                <div><button onClick={writePtCardsHandler}>Process Cards</button></div>
            </div>
        </div>
    )

}