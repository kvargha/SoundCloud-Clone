import React, {useState, useEffect, forwardRef} from 'react';
import {
    List, 
    ListItem,
    ListItemText,
    Button,
    Typography,
    TextField,
    Avatar,
    AppBar,
    Toolbar,
    IconButton,
    Dialog,
    Slide,
    makeStyles,
    Grid,
} from '@material-ui/core/';

import AddCommentIcon from '@material-ui/icons/AddComment';
import ChatBubbleIcon from '@material-ui/icons/ChatBubble';

import Waveform from './Waveform';

import SharedContext from './SharedContext';

const axios = require('axios');

const useStyles = makeStyles((theme) => ({
    toolbar: theme.mixins.toolbar,
    commentBox: {
        marginTop: '10px',
        marginBottom: '10px',
        width: '90%',
    },
    listItem: {
        width: '60vw',
        wordWrap: 'break-word'
    },
    button: {
        marginTop: '10px',
        background: 'orangered',
        '&:hover': {
            backgroundColor: 'orangered',
        },
    },
    commentIcon: {
        color: 'orangered',
    },
    commentTimeStamp: {
        display: 'inline-block',
        padding: 0,
        minHeight: 0,
        minWidth: 0
    },
    numComments: {
        color: 'grey'
    }
}));

// https://material-ui.com/components/dialogs/#dialog
const Transition = forwardRef(function Transition(props, ref) {
    return <Slide direction='up' ref={ref} {...props} />;
});

function Home() {
    const [username, setUsername] = useState('');
    const [timestamp, setTimestamp] = useState('');
    const [content, setContent] = useState('');
    const [buttonDisabled, setButtonDisabled] = useState(true);
    const [comments, setComments] = useState([]);
    const [numComments, setNumComments] = useState(0);
    const [openCommentDialogue, setOpenCommentDialogue] = useState(false);
    const [currentTimeStamp, setCurrentTimeStamp] = useState('00:00'); 
    
    const [songTimeStamp, setSongTimeStamp] = useState(0);
    const [songDuration, setSongDuration] = useState(0);
    const [invalidTimeStamp, setInvalidTimeStamp] = useState(false);
    const [timestampHelperText, setTimestampHelperText] = useState('');


    const classes = useStyles();

    const handleCommentSubmit = () => {
        const commentInfo = {
            'username': username,
            'timestamp': timestamp,
            'content': content
        };

        axios.post('/api/post/', commentInfo)
            .then(() => {
                setContent('');
                setOpenCommentDialogue(false);
            });
    };

    const handleUsername = (e) => {
        setUsername(e.target.value);
    };

    function secondsToTimestamp(timeget){
        if (!timeget) {return '00:00';}
    
        var min = Math.floor(timeget / 60);
        var sec = Math.ceil(timeget) % 60;
    
        return (min < 10 ? '0' : '') + min + ':' + (sec < 10 ? '0' : '') + sec;
    };


    const handleTimestamp = (e) => {
        const timestampInput = e.target.value;
        let reg = new RegExp('[0-5][0-9]:[0-5][0-9]').test(timestampInput);
        if (reg == false) {
            setInvalidTimeStamp(true);
            setTimestampHelperText('Invalid Timestamp');
        }
        else if (timestampInput > secondsToTimestamp(songDuration)) {
            setInvalidTimeStamp(true);
            setTimestampHelperText('Timestamp exceeds song duraiton');
        }
        else {
            setInvalidTimeStamp(false);
            setTimestampHelperText('');
        }
        setTimestamp(timestampInput);
    };

    const handleContent = (e) => {
        setContent(e.target.value);
    };

    const handleNewComment = () => {
        setOpenCommentDialogue(true);
        setTimestamp(currentTimeStamp);
    };

    const changeCommentTimeStamp = (timestamp) => {
        const splitTimeStamp = timestamp.split(':').map(Number);
        const totalSeconds = splitTimeStamp[0] * 60 + splitTimeStamp[1]; 
        setSongTimeStamp(totalSeconds);
    };

    useEffect(() => {
        axios.get('/api/get')
            .then((res) => {
                // Populate the comments section
                setNumComments(res.data.length);
                const commentList = res.data.map((comment) => {
                    return(
                        <ListItem divider key={comment.id}>
                            <Avatar style={{marginRight:'20px'}}>
                                {comment.username[0].toUpperCase()}
                            </Avatar>
                            <ListItemText 
                                primary={
                                    <Typography noWrap>
                                        {comment.username} at
                                        <Button
                                            style = {{marginLeft: '3px'}}
                                            classes={{root: classes.commentTimeStamp}}
                                            onClick = {() => changeCommentTimeStamp(comment.timestamp)}>
                                            {comment.timestamp}
                                        </Button>
                                    </Typography>  
                                    
                                }
                                secondary={
                                    <Typography className={classes.listItem}>
                                        {comment.content}
                                    </Typography>
                                } 
                            />
                            <ListItemText
                                style={{display:'flex', justifyContent:'flex-end'}}
                                primary={
                                    <Typography>
                                        {comment.date_created}
                                    </Typography>
                                }
                            />
                        </ListItem>
                    )
                });
                setComments(commentList);
            });

        setButtonDisabled(username.length > 0 && !invalidTimeStamp && content.length > 0);
    }, [username, timestamp, content, comments]);
      

    return (
        <div>
            <SharedContext.Provider value= {{
                currentTimeStamp, setCurrentTimeStamp,
                songTimeStamp, setSongTimeStamp,
                setSongDuration
            }}>
            
            <AppBar position='fixed' style={{background: '#333'}}>
                <Toolbar>
                    <Typography>Soundcloud</Typography>
                    <Typography variant='h6' style={{flexGrow: 1}}/>
                    <IconButton color='inherit' classes={{ root: classes.commentIcon}} edge='end' onClick = {() => handleNewComment()} >
                        <AddCommentIcon/>
                    </IconButton>
                </Toolbar>
            </AppBar>
            <div className={classes.toolbar} />

            <Waveform/>
            <div style = {{marginLeft: '20px', marginTop: '10px', display: 'flex'}}>
                <ChatBubbleIcon classes={{ root: classes.numComments}}/>
                <Typography style = {{marginLeft: '5px'}} classes={{ root: classes.numComments}}>{numComments} comments</Typography>
            </div>
            <List style={{maxHeight: '65vh', minWidth: '100vw', overflow: 'auto'}}>
                {comments}
            </List>
            <Dialog
                style={{zIndex: 2401}}
                fullWidth
                open={openCommentDialogue} onClose={() => {
                    setOpenCommentDialogue(false);
                }}
                TransitionComponent={Transition}>
                <Grid direction='column' container display='flex' alignItems='center'>
                    <div className={classes.commentBox}>
                        <div>
                            <TextField
                                value={username}
                                inputProps={{ maxLength: 10 }}
                                label='Username'
                                required
                                fullWidth
                                onChange={(e) => {
                                    handleUsername(e);
                                }}
                            />
                        </div>
                        <div>
                            <TextField
                                value={timestamp}
                                inputProps={{ maxLength: 5 }}
                                error={invalidTimeStamp}
                                helperText={timestampHelperText}
                                label='Timestamp'
                                required
                                fullWidth
                                onChange={(e) => {
                                    handleTimestamp(e);
                                }}
                            />
                        </div>
                        <div>
                            <TextField
                                value={content}
                                inputProps={{ maxLength: 250 }}
                                label='Comment'
                                required
                                fullWidth
                                multiline
                                rows={5}
                                onChange={(e) => {
                                    handleContent(e);
                                }}
                            />
                        </div>
                        <div>
                            <Button onClick={handleCommentSubmit} 
                                disabled={!buttonDisabled}
                                variant='contained'
                                color='primary'
                                fullWidth
                                classes={{
                                    root: classes.button,
                                }}
                            >
                                Submit Comment
                            </Button>
                        </div>
                    </div>
                </Grid>
            </Dialog>
            </SharedContext.Provider>
        </div>
    );
}

export default Home;