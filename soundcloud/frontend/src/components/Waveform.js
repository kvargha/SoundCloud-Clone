import React, { useEffect, useRef, useState } from "react";
import WaveSurfer from "wavesurfer.js";


const formWaveSurferOptions = ref => ({
    container: ref,
    waveColor: "#eee",
    progressColor: "OrangeRed",
    cursorColor: "OrangeRed",
    barWidth: 3,
    barRadius: 3,
    responsive: true,
    height: 150,
    // If true, normalize by the maximum peak instead of 1.0.
    normalize: true,
    // Use the PeakCache to improve rendering speed of large waveforms.
    partialRender: true
});

export default function Waveform() {
    const waveformRef = useRef(null);
    const wavesurfer = useRef(null);
    const [playing, setPlay] = useState(false);
    const [volume, setVolume] = useState(0.5);

    const thumbnail = 'https://drive.google.com/file/d/1OGQo1zdl1Ag56dZaRROgPeXX16mTpKRH/view?usp=sharing/';
    const url = 'https://drive.google.com/file/d/1vHWyjwIgt2ZFDS01Vh25_hvyGP61V4yG';
    


    // create new WaveSurfer instance
    // On component mount and when url changes
    useEffect(() => {
        setPlay(false);

        const options = formWaveSurferOptions(waveformRef.current);
        wavesurfer.current = WaveSurfer.create(options);
        
        wavesurfer.current.load('https://www.mfiles.co.uk/mp3-downloads/franz-schubert-standchen-serenade.mp3');

        wavesurfer.current.on("ready", function() {
        // https://wavesurfer-js.org/docs/methods.html
        // wavesurfer.current.play();
        // setPlay(true);

        // make sure object stillavailable when file loaded
        if (wavesurfer.current) {
            wavesurfer.current.setVolume(volume);
            setVolume(volume);
        }
        });

        // Removes events, elements and disconnects Web Audio nodes.
        // when component unmount
        return () => wavesurfer.current.destroy();
    }, []);

    const handlePlayPause = () => {
        setPlay(!playing);
        console.log(wavesurfer.current.getCurrentTime())
        wavesurfer.current.playPause();
    };

    const onVolumeChange = e => {
        const { target } = e;
        const newVolume = +target.value;

        if (newVolume) {
        setVolume(newVolume);
        wavesurfer.current.setVolume(newVolume || 1);
        }
    };

    return (
        <div>
        <div id="waveform" ref={waveformRef} />
        <div className="controls">
            <button onClick={handlePlayPause}>{!playing ? "Play" : "Pause"}</button>
            <input
            type="range"
            id="volume"
            name="volume"
            // waveSurfer recognize value of `0` same as `1`
            //  so we need to set some zero-ish value for silence
            min="0.01"
            max="1"
            step=".025"
            onChange={onVolumeChange}
            defaultValue={volume}
            />
            <label htmlFor="volume">Volume</label>
        </div>
        </div>
    );
}
