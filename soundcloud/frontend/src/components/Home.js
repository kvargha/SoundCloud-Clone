import React, {useState, useEffect} from "react";
import Button from "@material-ui/core/Button";
import Grid from "@material-ui/core/Grid";
import Typography from "@material-ui/core/Typography";
import TextField from "@material-ui/core/TextField";
import FormControl from "@material-ui/core/FormControl";
import Avatar from '@material-ui/core/Avatar';
import ListItemText from '@material-ui/core/ListItemText';
import ListItem from '@material-ui/core/ListItem';
import List from '@material-ui/core/List';

const axios = require('axios');

function Home() {
    const [username, setUsername] = useState('');
    const [timestamp, setTimestamp] = useState('');
    const [content, setContent] = useState('');
    const [buttonDisabled, setButtonDisabled] = useState(true);
    const [comments, setComments] = useState([]);

    const handleCommentSubmit = () => {
        const commentInfo = {
            'username': username,
            'timestamp': timestamp,
            'content': content
        };

        axios.post('/api/post/', commentInfo)
            .then(() => {
                setContent('');
            });
    };

    const handleUsername = (e) => {
        setUsername(e.target.value);
    };

    const handleTimestamp = (e) => {
        setTimestamp(e.target.value);
    };

    const handleContent = (e) => {
        setContent(e.target.value);
    };

    useEffect(() => {
        axios.get('/api/get')
            .then((res) => {
                // Populate the comments section
                const commentList = res.data.map((comment) => {
                    return(
                        <ListItem key={comment.id}>
                            <Avatar style={{marginRight:'20px'}}>
                                {comment.username[0].toUpperCase()}
                            </Avatar>
                            <ListItemText 
                                primary={
                                    <Typography>
                                        {comment.username} at {comment.timestamp}
                                    </Typography>  
                                }
                                secondary={
                                        <Typography>
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

        setButtonDisabled(username.length > 0 && timestamp.length > 0 && content.length > 0);
    }, [username, timestamp, content, comments]);
      

    return (
        <div>
            <FormControl>
                <TextField value={username} label='Username'
                    required
                    onChange={(e) => {
                        handleUsername(e);
                    }}
                />
                <TextField value={timestamp} label='Timestamp'
                    required
                    onChange={(e) => {
                        handleTimestamp(e);
                    }}
                />
                <TextField value={content} label='Comment'
                    required
                    multiline
                    rows={5}
                    onChange={(e) => {
                        handleContent(e);
                    }}
                />
                <Button onClick={handleCommentSubmit} disabled={!buttonDisabled} color="primary">
                    Submit Comment
                </Button>
            </FormControl>
            <List style={{maxHeight: '70vh', minWidth: '100vw', overflow: 'auto'}}>
                {comments}
            </List>
        </div>
    );
}

export default Home;