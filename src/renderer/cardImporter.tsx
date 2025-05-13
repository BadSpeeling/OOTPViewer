import { LiveUpdate } from "../types";

import * as React from "react";
import { createRoot } from "react-dom/client";

addEventListener("load", async (event) => {

    const wrapper = document.getElementById("reactWrapper");

    if (wrapper) {
        const root = createRoot(wrapper);
        root.render(<Landing />);
    }

});

const Landing = () => {

    const loadPtCards = (e) => {
        window.electronAPI.loadPtCards()
    };

}

const LiveUpdates = () => {

    const [liveUpdates,setLiveUpdates] = React.useState([] as LiveUpdate[]);
    
    const liveUpdatesBody = liveUpdates.map((liveUpdate) => <div>{liveUpdate.EffectiveDate}</div>);

    return (
        <div>
            {liveUpdatesBody}
        </div>
    )

}