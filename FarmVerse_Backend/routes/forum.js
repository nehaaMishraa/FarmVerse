const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/authMiddleware');
const ForumPost = require('../models/ForumPost');
const ForumComment = require('../models/ForumComment');

// Get all forum posts with pagination and filtering
router.get('/posts', async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const category = req.query.category;
    const search = req.query.search;
    const sortBy = req.query.sortBy || 'lastActivity';
    const sortOrder = req.query.sortOrder === 'asc' ? 1 : -1;

    // Build query
    let query = {};
    if (category && category !== 'all') {
      query.category = category;
    }
    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { content: { $regex: search, $options: 'i' } },
        { tags: { $in: [new RegExp(search, 'i')] } }
      ];
    }

    // Build sort object
    let sort = {};
    if (sortBy === 'pinned') {
      sort = { isPinned: -1, lastActivity: -1 };
    } else {
      sort[sortBy] = sortOrder;
    }

    const posts = await ForumPost.find(query)
      .populate('author', 'name tier points')
      .populate('comments')
      .sort(sort)
      .skip((page - 1) * limit)
      .limit(limit)
      .lean();

    // Add virtual fields
    const postsWithCounts = posts.map(post => ({
      ...post,
      commentCount: post.comments.length,
      likeCount: post.likes.length
    }));

    const totalPosts = await ForumPost.countDocuments(query);
    const totalPages = Math.ceil(totalPosts / limit);

    res.json({
      posts: postsWithCounts,
      pagination: {
        currentPage: page,
        totalPages,
        totalPosts,
        hasNext: page < totalPages,
        hasPrev: page > 1
      }
    });
  } catch (error) {
    console.error('Error fetching forum posts:', error);
    res.status(500).json({ message: 'Failed to fetch forum posts' });
  }
});

// Get single forum post with comments
router.get('/posts/:id', async (req, res) => {
  try {
    const post = await ForumPost.findById(req.params.id)
      .populate('author', 'name tier points')
      .populate({
        path: 'comments',
        populate: {
          path: 'author',
          select: 'name tier points'
        },
        options: { sort: { createdAt: 1 } }
      });

    if (!post) {
      return res.status(404).json({ message: 'Post not found' });
    }

    // Increment view count
    post.views += 1;
    await post.save();

    res.json({
      ...post.toObject(),
      commentCount: post.comments.length,
      likeCount: post.likes.length
    });
  } catch (error) {
    console.error('Error fetching forum post:', error);
    res.status(500).json({ message: 'Failed to fetch forum post' });
  }
});

// Create new forum post
router.post('/posts', authMiddleware, async (req, res) => {
  try {
    const { title, content, category, tags } = req.body;

    const post = new ForumPost({
      title,
      content,
      author: req.user.id,
      category,
      tags: tags || []
    });

    await post.save();
    await post.populate('author', 'name tier points');

    res.status(201).json({
      ...post.toObject(),
      commentCount: 0,
      likeCount: 0
    });
  } catch (error) {
    console.error('Error creating forum post:', error);
    res.status(500).json({ message: 'Failed to create forum post' });
  }
});

// Update forum post
router.put('/posts/:id', authMiddleware, async (req, res) => {
  try {
    const { title, content, category, tags } = req.body;
    
    const post = await ForumPost.findById(req.params.id);
    if (!post) {
      return res.status(404).json({ message: 'Post not found' });
    }

    // Check if user is the author
    if (post.author.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Not authorized to edit this post' });
    }

    post.title = title || post.title;
    post.content = content || post.content;
    post.category = category || post.category;
    post.tags = tags || post.tags;
    post.lastActivity = new Date();

    await post.save();
    await post.populate('author', 'name tier points');

    res.json({
      ...post.toObject(),
      commentCount: post.comments.length,
      likeCount: post.likes.length
    });
  } catch (error) {
    console.error('Error updating forum post:', error);
    res.status(500).json({ message: 'Failed to update forum post' });
  }
});

// Delete forum post
router.delete('/posts/:id', authMiddleware, async (req, res) => {
  try {
    const post = await ForumPost.findById(req.params.id);
    if (!post) {
      return res.status(404).json({ message: 'Post not found' });
    }

    // Check if user is the author
    if (post.author.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Not authorized to delete this post' });
    }

    // Delete all comments associated with this post
    await ForumComment.deleteMany({ post: post._id });
    
    // Delete the post
    await ForumPost.findByIdAndDelete(req.params.id);

    res.json({ message: 'Post deleted successfully' });
  } catch (error) {
    console.error('Error deleting forum post:', error);
    res.status(500).json({ message: 'Failed to delete forum post' });
  }
});

// Like/Unlike forum post
router.post('/posts/:id/like', authMiddleware, async (req, res) => {
  try {
    const post = await ForumPost.findById(req.params.id);
    if (!post) {
      return res.status(404).json({ message: 'Post not found' });
    }

    const userId = req.user.id;
    const isLiked = post.likes.includes(userId);

    if (isLiked) {
      post.likes.pull(userId);
    } else {
      post.likes.push(userId);
    }

    await post.save();
    await post.updateLastActivity();

    res.json({
      isLiked: !isLiked,
      likeCount: post.likes.length
    });
  } catch (error) {
    console.error('Error toggling like:', error);
    res.status(500).json({ message: 'Failed to toggle like' });
  }
});

// Add comment to forum post
router.post('/posts/:id/comments', authMiddleware, async (req, res) => {
  try {
    const { content, parentComment } = req.body;

    const post = await ForumPost.findById(req.params.id);
    if (!post) {
      return res.status(404).json({ message: 'Post not found' });
    }

    const comment = new ForumComment({
      content,
      author: req.user.id,
      post: post._id,
      parentComment: parentComment || null
    });

    await comment.save();
    await comment.populate('author', 'name tier points');

    // Add comment to post
    post.comments.push(comment._id);
    await post.updateLastActivity();

    res.status(201).json({
      ...comment.toObject(),
      likeCount: 0,
      replyCount: 0
    });
  } catch (error) {
    console.error('Error adding comment:', error);
    res.status(500).json({ message: 'Failed to add comment' });
  }
});

// Like/Unlike comment
router.post('/comments/:id/like', authMiddleware, async (req, res) => {
  try {
    const comment = await ForumComment.findById(req.params.id);
    if (!comment) {
      return res.status(404).json({ message: 'Comment not found' });
    }

    const userId = req.user.id;
    const isLiked = comment.likes.includes(userId);

    if (isLiked) {
      comment.likes.pull(userId);
    } else {
      comment.likes.push(userId);
    }

    await comment.save();

    res.json({
      isLiked: !isLiked,
      likeCount: comment.likes.length
    });
  } catch (error) {
    console.error('Error toggling comment like:', error);
    res.status(500).json({ message: 'Failed to toggle comment like' });
  }
});

// Get forum categories
router.get('/categories', (req, res) => {
  const categories = [
    { value: 'general', label: 'General Discussion', icon: 'fas fa-comments' },
    { value: 'crops', label: 'Crops & Farming', icon: 'fas fa-seedling' },
    { value: 'irrigation', label: 'Irrigation & Water', icon: 'fas fa-tint' },
    { value: 'equipment', label: 'Equipment & Tools', icon: 'fas fa-tools' },
    { value: 'pests', label: 'Pests & Diseases', icon: 'fas fa-bug' },
    { value: 'weather', label: 'Weather & Climate', icon: 'fas fa-cloud-sun' },
    { value: 'success-stories', label: 'Success Stories', icon: 'fas fa-trophy' },
    { value: 'questions', label: 'Q&A', icon: 'fas fa-question-circle' }
  ];

  res.json(categories);
});

module.exports = router;
