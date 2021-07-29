import React, {useEffect} from 'react';
import './App.css';
import Video from "./components/Video/Video";
import {getVideo} from "./config/videoLoader";
import {onMidiMessage} from "./services/midiReader";

function App() {
    const [firstSrc, setFirstSrc] = React.useState(null);
    const [secondSrc, setSecondSrc] = React.useState(null);
    const [layer, setLayer] = React.useState(29);
    const [selected, setSelected] = React.useState(0);
    const [down, setDown] = React.useState(false);
    const [downOne, setDownOne] = React.useState(false);
    const [downTwo, setDownTwo] = React.useState(false)
    const [ready, setReady] = React.useState(0);
    const [flash, setFlash] = React.useState(false);

    const extractLaunchpadIO = (items, isInput) => {
        let item = items.next();
        while(!item.done) {
            if (isInput && item.value.name.indexOf("MIDIIN2") >= 0) {
                return item.value;
            } else if (!isInput && item.value.name.indexOf("MIDIOUT2") >= 0) {
                return item.value
            }
            item = items.next();
        }
        return undefined;
    }

    useEffect(() => {
        if (selected !== 0) {
            let newSrc = getVideo(selected, layer);
            if (!newSrc) {
                return;
            }
            // but is the user pressing down still
            // we still want to load the video
            // but delay its appearance until the user is not pressing down
            setReady((ready) => {
                if(ready === 0) {
                    console.log("Setting First Source")
                    setFirstSrc(newSrc);
                    return 1;
                } else if (ready === 1) {
                    console.log("Setting Second Source");
                    if (newSrc === secondSrc) {
                        return 2;
                    }
                    setSecondSrc(newSrc);
                    return 1;
                } else if (ready === 2) {
                    console.log("Setting First Source")
                    if (firstSrc === newSrc) {
                        return 1;
                    }
                    setFirstSrc(newSrc);
                    return 2;
                }
            });

        }
        // eslint-disable-next-line
    }, [selected, layer]);

    useEffect(() => {
        console.log(`setting down: ${down}`);
        if (down) {
            if (ready === 1) {
                console.log(`Setting 2nd source down`)
                setDownTwo(true);
            }
            if (ready === 2) {
                console.log(`Setting 1st source down`);
                setDownOne(true);
            }
        } else {
            console.log(`Setting sources up`)
            setDownOne(false);
            setDownTwo(false);
        }

    }, [down]);

    useEffect(() => {
        console.log(`Ready Flag: ${ready}`)
    }, [ready])

    useEffect(() => {
        window.navigator.requestMIDIAccess({sysex: true})
            .then(function(access) {

                let inputs = access.outputs.values();
                let input = inputs.next();
                while(!input.done) {
                   console.log(input.value)
                    //input.value.onmidimessage = (data) => console.log(data);
                    input = inputs.next();

                }

                return {
                    input: extractLaunchpadIO(access.inputs.values(), true),
                    output: extractLaunchpadIO(access.outputs.values(), false),
                }
            }).then(io => {
                console.log(io);
                io.output.send([144, 89, 5])
                io.input.onmidimessage = (data) => onMidiMessage(data, io.output, setSelected, setLayer, setDown);
        });
    }, []);

    // the times a video should be hidden are either whe
    // the current video is ready but the down button is still held
    // the opposite video is ready and the down button is not being held

      return (
        <div className="App">
          <header className="App-header">
              <Video src={firstSrc} onLoaded={() => {
                  console.log("1 - First Video Ready!")
                  setReady(1)
              }} hidden={(ready === 2 && !downTwo) || (ready === 1 && downOne)}/>
              <Video src={secondSrc} onLoaded={() => {
                  console.log("2 - Second Video Ready!")
                  setReady(2)
              }} hidden={(ready === 1 && !downOne) || (ready === 2 && downTwo)}/>
              <div style={{height: '100%', width: '100%', position: 'absolute', backgroundColor: 'white', display: flash ? "inherit" : "none"}}/>
          </header>
        </div>
      );
}

export default App;
