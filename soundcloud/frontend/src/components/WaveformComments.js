import React, { useEffect, useRef, useState, useContext } from 'react';
import SharedContext from './SharedContext';

import {
    List,
    ListItem,
    Avatar,
    makeStyles,
    Tooltip,
    useMediaQuery,
} from '@material-ui/core/';

import {useTheme} from '@material-ui/core/styles';

const axios = require('axios');


const useStyles = makeStyles((theme) => ({
    list: {
        display: 'flex',
        flexDirection: 'row',
        padding: 0,
        position: 'absolute',
    },
    listItem: {
        position: 'absolute',
    },
    hidden: {
        display: 'none',
    },  
}));


function WaveformComments() {
    const {songDuration} = useContext(SharedContext);
    const {openCommentDialogue} = useContext(SharedContext);
    const [waveformComments, setWaveformComments] = useState([]);

    const [waveformWidth, setWaveformWidth] = useState(0);
    const [songInfoWidth, setSongInfoWidth] = useState(0);

    const {margin} = useContext(SharedContext);
    const {windowResize} = useContext(SharedContext);

    const classes = useStyles();
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

    function timestampToSeconds(timestamp){
        const splitTimeStamp = timestamp.split(':').map(Number);
        return splitTimeStamp[0] * 60 + splitTimeStamp[1]; 
    };

    function calculateMargin(timestamp) {
        if(songDuration == 0) {
            return 0;
        }
        else {
            return ((timestampToSeconds(timestamp)/songDuration) * waveformWidth);
        }
    };

    const handleResize = () => {
        var waveformElement = document.getElementById('waveform');
        var waveformWidth = waveformElement.offsetWidth;
        setWaveformWidth(waveformWidth);

        var songInfoElement = document.getElementById('songInfo');
        var songInfoWidth = songInfoElement.offsetWidth;
        setSongInfoWidth(songInfoWidth); 
    }

    useEffect(() => {
        
        window.addEventListener('resize', handleResize);
        window.addEventListener('load', handleResize);
        

        axios.get('/api/get')
            .then((res) => {
                // Populate the waveform comments section
                const commentList = res.data.reverse().map((comment) => {
                    return(
                        <ListItem style={{marginLeft: calculateMargin(comment.timestamp)}} className={classes.listItem} key={comment.id + 'waveform'}>
                            <Tooltip title={comment.username + ': ' + comment.content}>
                                <Avatar variant='square'>
                                    {comment.username[0].toUpperCase()}
                                </Avatar>
                            </Tooltip>
                        </ListItem>
                    )
                });
                setWaveformComments(commentList);
            });
        
    }, [songDuration, openCommentDialogue, waveformWidth, windowResize, margin, isMobile, songInfoWidth]);

    return (
        <List className={!isMobile ? (classes.list) : (classes.hidden)} style={{marginLeft: songInfoWidth + margin}}>
                {waveformComments}
        </List>
        
    );
}

export default WaveformComments;