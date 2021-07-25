import React, { useEffect, useRef, useState, useContext } from 'react';
import SharedContext from './SharedContext';
import WaveSurfer from 'wavesurfer.js';

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
    waveColor: '#eee',
    progressColor: 'OrangeRed',
    cursorColor: 'OrangeRed',
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
        marginBottom: '20px'
    },
    waveFormContainer: {
        display: 'flex',
        maxHeight: '30vh',
        background: 'linear-gradient(135deg, rgb(151, 136, 114) 0%, rgb(35, 28, 26) 100%)'
    },
    songInfoDesktop: {
        width: '10vw',
        marginRight: '90px',
        marginLeft: '10px',
        position: 'relative'
    },
    songInfoMobile: {
        width: '20vw',
        marginRight: '50px',
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
        bottom: 5,
    }
}));


function Waveform() {
    const waveformRef = useRef(null);
    const wavesurfer = useRef(null);
    const [playing, setPlay] = useState(false);
    const [volume, setVolume] = useState(0.5);
    const {currentTimeStamp, setCurrentTimeStamp} = useContext(SharedContext);

    const thumbnail = 'http://localhost:8000/static/thumbnail.jpeg';
    
    const classes = useStyles();

    function secondsToTimestamp(timeget){
        if (!timeget) {return '00:00';}
    
        var min = Math.floor(timeget / 60);
        var sec = Math.ceil(timeget) % 60;
    
        return (min < 10 ? '0' : '') + min + ':' + (sec < 10 ? '0' : '') + sec;
    };

    function updateTimer() {
        var formattedTime = secondsToTimestamp(wavesurfer.current.getCurrentTime());
        setCurrentTimeStamp(formattedTime);
    };

    const changeTimeStamp = (seconds) => {
        console.log(seconds);
    };

    // create new WaveSurfer instance
    // On component mount and when url changes
    useEffect(() => {
        setPlay(false);

        const options = formWaveSurferOptions(waveformRef.current);
        wavesurfer.current = WaveSurfer.create(options);
        
        wavesurfer.current.load('static/song.mp3');

        wavesurfer.current.on('ready', function() {
            // https://wavesurfer-js.org/docs/methods.html 

            // make sure object stillavailable when file loaded
            if (wavesurfer.current) {
                wavesurfer.current.setVolume(volume);
                setVolume(volume);
            }
        });

        wavesurfer.current.on('ready', updateTimer);
        wavesurfer.current.on('audioprocess', updateTimer);
        wavesurfer.current.on('seek', updateTimer);

        // Removes events, elements and disconnects Web Audio nodes.
        // when component unmount
        return () => wavesurfer.current.destroy();
    }, []);

    const handlePlayPause = () => {
        setPlay(!playing);
        wavesurfer.current.playPause();
    };

    const onVolumeChange = (event, newVolume) => {
        setVolume(newVolume);
        wavesurfer.current.setVolume(newVolume || 1);
    };

    return (
        <div className = {classes.waveFormContainer}>
            <div className = {window.innerWidth >= 1200 ? classes.songInfoDesktop : classes.songInfoMobile}> 
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
                <Typography align='center'>{currentTimeStamp}</Typography>
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
                            aria-labelledby='continuous-slider'
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
            <div id='waveform' ref={waveformRef} className = {classes.waveForm}/>
            <div>
                <img src = {thumbnail} className = {classes.thumbnail}/>
            </div>
        </div>
    );
}

export default Waveform;