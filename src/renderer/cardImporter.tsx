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
    const [bypassLiveUpdateCheckFlag, setBypassLiveUpdateCheckFlag] = React.useState(false);

    const writePtCardsHandler = async () => {
        const status = await window.electronAPI.writePtCards(bypassLiveUpdateCheckFlag);
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

    const showProcessCardsButton = processCardsStatus !== ProcessCardsStatus.LiveUpdateNeeded || bypassLiveUpdateCheckFlag;

    return (
        <div className="m-8">
            <LiveUpdatePanel processCardsStatus={processCardsStatus} liveUpdates={liveUpdates} setBypassLiveUpdateCheckFlag={setBypassLiveUpdateCheckFlag}/>
            <div>
                <div><span>{processCardsMessage()}</span></div>
                {showProcessCardsButton && <div><button className="cursor-pointer bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-full" onClick={writePtCardsHandler}>Process Cards</button></div>}
            </div>
        </div>
    )

}

type LiveUpdatePanelProps = {
    processCardsStatus: ProcessCardsStatus,
    liveUpdates: LiveUpdate[],
    setBypassLiveUpdateCheckFlag: React.Dispatch<React.SetStateAction<boolean>>
}

const LiveUpdatePanel = ({processCardsStatus, liveUpdates, setBypassLiveUpdateCheckFlag}: LiveUpdatePanelProps) => {

    const liveUpdatesBody = liveUpdates.map((liveUpdate) => <div className="mb-2">{liveUpdate.EffectiveDate}</div>);

    return (
        <div>
            <div className="mb-2"><b>Effective Date</b></div>
            <div>{liveUpdatesBody}</div>
            {processCardsStatus === ProcessCardsStatus.LiveUpdateNeeded && <CreateLiveUpdatePanel setBypassLiveUpdateCheckFlag={setBypassLiveUpdateCheckFlag}/>}
        </div>
    )

}

type CreateLiveUpdatePanelProps = {
    setBypassLiveUpdateCheckFlag: React.Dispatch<React.SetStateAction<boolean>>,
}

const CreateLiveUpdatePanel = ({ setBypassLiveUpdateCheckFlag }: CreateLiveUpdatePanelProps) => {

    const [effectiveDate,setEffectiveDate] = React.useState('1970-01-01');
    const handleSubmit = async () => {
        const wasSuccessful = await window.electronAPI.upsertLiveUpdate({
            EffectiveDate: effectiveDate,
        } as LiveUpdate) as boolean
        setBypassLiveUpdateCheckFlag(wasSuccessful);
    }

    return (
        <div>
            <input className="border-gray border-1 rounded-md" value={effectiveDate} onChange={(e) => setEffectiveDate(e.currentTarget.value)} />
            <button className="cursor-pointer bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-full" onClick={handleSubmit}>Submit</button>
        </div>
    )

}