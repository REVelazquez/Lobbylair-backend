const { Post, Game, User, GameMode } = require('../db.js');
const { Op } = require('sequelize');

async function getPosts(req, res) {
  try {
    let posts = await Post.findAll({
      include: [
        { model: User, attributes: ['id', 'name'] },
        { model: Game, attributes: ['id', 'name', 'thumbnail'] },
        { model: GameMode, attributes: ['id', 'name'] }
      ]
    });

    return res.status(200).json(posts);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
}
async function getGameMode (req,res){
  const gameModeId = req.params;

  try {
    let gameMode = await GameMode.findAll();

    return res.status(200).json(gameMode);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
}
async function getPostsByUserId(req, res) {
  const userId = req.params.userid;

  try {
    let posts = await Post.findAll({
      where: { userId: userId }, 
      include: [
        { model: User, attributes: ['id', 'name'] },
        { model: Game, attributes: ['id', 'name', 'thumbnail'] },
        { model: GameMode, attributes: ['id', 'name'] }
      ]
    });

    return res.status(200).json(posts);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
}

  async function createPost(req, res) {
    const { text, userid, gameid, gamemodeid } = req.body;
    try {
      let newPost = await Post.create({
        text: text,
        date: new Date(),
      });
  
      let game = await Game.findByPk(gameid);  
      if (!game) {
        return res.status(404).json({ error: 'El juego no existe' });
      }
  
      let gameMode = await GameMode.findByPk(gamemodeid);
     
  
      if (!gameMode) {
        return res.status(404).json({ error: 'El modo de juego no existe' });
      }
  
      await newPost.setUser(userid);
      await newPost.setGame(gameid)
      await newPost.setGameMode(gamemodeid);

      const post = await Post.findByPk(newPost.id, {
        include: [
          { model: User, attributes: ['id', 'name'] },
          { model: Game, attributes: ['id', 'name', 'thumbnail'] },
          { model: GameMode, attributes: ['id', 'name'] }
        ]
      });
  
      return res.status(200).json(post);
    } catch (error) {
      return res.status(500).json({ error: error.message });
    }
  }

  async function deletePost(req, res) {
    const { id } = req.params; 
    try {
      const post = await Post.findByPk(id);
      if (!post) {
        return res.status(404).json({ error: 'El post no existe' });
      }
     

      await post.destroy(); 
      return res.status(200).json({ message: 'Post eliminado exitosamente' });
    } catch (error) {
      return res.status(500).json({ error: error.message });
    }
  }



  async function getPostsWithPagination(req, res) {
    const { page, userid, gameid, gamemodeid } = req.query;
    const pageSize = 5;
    let offset = 0;
    let whereClause = {};
    if (userid) {
      whereClause['$User.id$'] = userid;
    }
    if (gameid) {
      whereClause['$Game.id$'] = gameid;
    }
    if (gamemodeid) {
      whereClause['$GameMode.id$'] = gamemodeid;
    }
  
    try {
      let posts;
      let count;
      let totalPages;
      if (page) {
        offset = (parseInt(page) - 1) * pageSize;
        const result = await Post.findAndCountAll({
          where: whereClause,
          include: [
            {
              model: User,
            },
            {
              model: Game,
            },
            {
              model: GameMode,
            },
            {
              model: GameMode,
            }
          ],          
          limit: pageSize,
          offset: offset,
          distinct: true,
        });
        count = result.count;
        posts = result.rows;
        totalPages = Math.ceil(count / pageSize);
      } else {
        const result = await Post.findAndCountAll({
          where: whereClause,
          include: [
            {
              model: User,
            },
            {
              model: Game,
            },
            {
              model: GameMode,
            }
          ],
          distinct: true,
        });
  
        count = result.count;
        posts = result.rows;
        totalPages = Math.ceil(count/pageSize);
      }
  
      res.json({
        totalCount: count,
        totalPages,
        currentPage: parseInt(page) || 1,
        posts,
      });
    } catch (error) {
      return res.status(500).json({ error: 'Error getting posts with pagination' });
    }
  }





module.exports = {
  getPosts,
  getPostsByUserId,
  createPost,
  getPostsWithPagination,
  deletePost,
  getGameMode
  

};
