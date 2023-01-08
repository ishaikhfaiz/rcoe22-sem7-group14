import React, { useState } from 'react'

import useStyles from './styles';
import { Card, CardContent, CardMedia, Button, Typography, CardActions } from '@mui/material';
import ThumbUpIcon from "@mui/icons-material/ThumbUp";
import ThumbUpAltOutlinedIcon from "@mui/icons-material/ThumbUpAltOutlined";
import DeleteIcon from '@mui/icons-material/Delete';
import MoreHorizIcon from '@mui/icons-material/MoreHoriz';
import moment from 'moment';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';

import { deletePost, likePost } from '../../../actions/posts';

const Post = ({ post, setcurrentId }) => {
  const classes = useStyles();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [likes, setLikes] = useState(post?.likes)
  const user = JSON.parse(localStorage.getItem('profile'));

  

  const hasLikedPost = likes.find((like) => like === (user?.result?.sub || user?.result._id));
  const userId = user?.result?.sub || user?.result?._id;

  const handleLike = async () => {
    dispatch(likePost(post._id))

    if (hasLikedPost) {
      setLikes(likes.filter((id) => id !== (userId)));

    } else {
      setLikes([...likes, userId]);
    }

  }

  const Likes = () => {
    if (likes.length > 0) {
      return likes.find((like) => like === (user?.result?.sub || user?.result._id))
        ? (
          <><ThumbUpIcon fontSize='small' />&nbsp; {likes.length > 2 ? `You and ${likes.length - 1} others` : `${likes.length} like${likes.length > 1 ? 's' : ''}`}</>
        ) : (
          <><ThumbUpAltOutlinedIcon fontSize='small' />&nbsp; {likes.length}{likes.length === 1 ? 'Like' : 'Likes'}</>
        );
    }
    return <><ThumbUpAltOutlinedIcon fontSize='small' />&nbsp;Like</>;
  }

  const openPost = () => navigate(`/posts/${post._id}`);


  return (
    <Card className={classes.card} raised elevation={9}>
      <CardMedia style={{ cursor: 'pointer' }} onClick={openPost} className={classes.media} image={post.selectedFile} title={post.title} />

      <div className={classes.overlay}>
        <Typography variant='h6'>{post.name}</Typography>
        <Typography variant='body2'>{moment(post.createdAt).fromNow()}</Typography>
      </div>


      {(user?.result?.sub === post?.author || user?.result?._id === post?.author) && (
        <div className={classes.overlay2}>
          <Button
            style={{ color: 'white' }}
            size="Small"
            onClick={() => setcurrentId(post._id)}>
            <MoreHorizIcon fontSize='default' />
          </Button>
        </div>
      )}


      <div className={classes.details}>
        <Typography variant='body2' color="textSecondary">{post.tags.map((tag) => `#${tag} `)}</Typography>
      </div>


      <Typography style={{ cursor: 'pointer' }} onClick={openPost} className={classes.title} variant='h5' gutterBottom>{post.title}</Typography>
      <CardContent>
        <Typography variant='body2' color="textSecondary">{post.message}</Typography>
      </CardContent>





      <CardActions className={classes.cardActions}>
        <Button size="small" color="primary" disabled={!user?.result} onClick={handleLike}>&nbsp;
          <Likes />
        </Button>

        {(user?.result?.sub === post?.author || user?.result?._id === post?.author) && (
          <Button size="small" color="primary" onClick={() => dispatch(deletePost(post._id))}>
            <DeleteIcon fontSize='small' />
            Delete
          </Button>
        )}


      </CardActions>

    </Card>

  )
}

export default Post