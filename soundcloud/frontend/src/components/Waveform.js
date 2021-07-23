import React, { useEffect, useRef, useState } from "react";
import WaveSurfer from "wavesurfer.js";

import {
    IconButton,
    Grid,
    makeStyles,
    Typography
} from '@material-ui/core/';

import PlayCircleFilledIcon from '@material-ui/icons/PlayCircleFilled';
import PauseCircleFilledIcon from '@material-ui/icons/PauseCircleFilled';
import Slider from '@material-ui/core/Slider';
import VolumeDown from '@material-ui/icons/VolumeDown';
import VolumeUp from '@material-ui/icons/VolumeUp';

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

const useStyles = makeStyles((theme) => ({
    root: {
        color: 'orangered'
    },
    thumb : {
        backgroundColor: 'orangered',
    },
    rail: {
        color: 'orangered'
    },
    button: {
        color: 'orangered',
        display: 'block',
        margin: 'auto',
    },
    waveFormContainer: {
        display: 'flex',
        maxHeight: '30vh'
    },
    songInfo: {
        width: '10vw',
        marginRight: '10px',
        marginLeft: '10px',
        position: 'relative'
    },
    waveForm: {
        flexGrow: 1,
        display: 'block',
        margin: 'auto'
    },
    thumbnail: {
        float: 'right',
        marginTop: '10px',
        marginRight: '10px',
        marginLeft: '10px',
        maxHeight: '90%',
    },
    artist: {
        background: 'black',
        color: '#CDCDCD',
        marginBottom: '10px',
        marginTop: '10px',
    },
    songName: {
        background: 'black',
        color: 'white',
        marginBottom: '20px'
    },
    volumeSlider: {
        position: 'absolute',
        bottom: 0,
        marginBottom: '10px',
    }
}));


export default function Waveform() {
    const waveformRef = useRef(null);
    const wavesurfer = useRef(null);
    const [playing, setPlay] = useState(false);
    const [volume, setVolume] = useState(0.5);

    const thumbnail = 'http://localhost:8000/static/thumbnail.jpeg';
    
    const classes = useStyles();

    // create new WaveSurfer instance
    // On component mount and when url changes
    useEffect(() => {
        setPlay(false);

        const options = formWaveSurferOptions(waveformRef.current);
        wavesurfer.current = WaveSurfer.create(options);
        
        wavesurfer.current.load('static/song.mp3');

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

    const onVolumeChange = (event, newVolume) => {
        setVolume(newVolume);
        wavesurfer.current.setVolume(newVolume || 1);
    };

    return (
        <div className = {classes.waveFormContainer}>
            <div className = {classes.songInfo}> 
                <Typography align='center' className={classes.artist}>Noisestorm</Typography>
                <Typography align='center' className={classes.songName}>Crab Rave</Typography>
                <IconButton
                    color='primary'
                    align='center'
                    onClick = {handlePlayPause}
                    classes={{
                        root: classes.button,
                    }}
                >
                    {!playing ? <PlayCircleFilledIcon style={{ fontSize: 80 }}/> : <PauseCircleFilledIcon style={{ fontSize: 80 }}/>}
                </IconButton>
                <Grid container spacing={2} className = {classes.volumeSlider}>
                    <Grid item>
                        <VolumeDown />
                    </Grid>
                    <Grid item xs>
                        <Slider
                            min={0.01}
                            max={1}
                            value={volume}
                            step={0.025}
                            onChange={onVolumeChange}
                            aria-labelledby="continuous-slider"
                            classes={{
                                root: classes.root,
                                thumb: classes.thumb,
                                rail: classes.rail,
                            }}
                        />
                    </Grid>
                    <Grid item>
                        <VolumeUp />
                    </Grid>
                </Grid>
            </div>
            <div id="waveform" ref={waveformRef} className = {classes.waveForm}/>
            <div>
                <img src = {thumbnail} className = {classes.thumbnail}/>
            </div>
        </div>
    );
}
