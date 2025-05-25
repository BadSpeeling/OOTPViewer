import { LiveUpdate } from "../types";

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

    //const [liveUpdates,setLiveUpdates] = React.useState([] as LiveUpdate[]);
    
    const liveUpdatesBody = liveUpdates.map((liveUpdate) => <div>{liveUpdate.EffectiveDate}</div>);

    return (
        <div>
            <div><b>Effective Date</b></div>
            {liveUpdatesBody}
        </div>
    )

}