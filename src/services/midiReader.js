let on = [];
let layer = [89];
let layers = [29,39,49,59,69,79,89];

export const onMidiMessage = (message, output, setSelected, setLayer) => {
    const {data} = message;
    if (data.length >= 3 && data[2] > 0) {
        // then it wasn't a button release
        console.log(data);
        let pad = data[1];
        if (pad === 19) {
            // send stop message
            output.send([240, 0, 32, 41, 2, 13, 7, 247])
            for (const active of on) {
                output.send([144, active, 0]);
            }
            on = [];
        } else {
            if (layers.includes(pad)) {
                // then its a layer
                for (const active of layer) {
                    output.send([144, active, 0]);
                }
                layer = [];
                layer.push(pad);
                output.send([144, pad, 10]);
                setLayer(pad);
            } else {
                for (const active of on) {
                    output.send([144, active, 0]);
                }
                on = [];
                on.push(pad);
                output.send([144, pad, 5]);
                setSelected(pad);
            }
        }

    }


}