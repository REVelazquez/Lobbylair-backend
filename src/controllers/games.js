const { Game, GameMode, Genre } = require('../db.js');
const { Op } = require('sequelize');
const allGames = require('../../dataGames.js');

async function getGames(req, res) {
  try {
    let games = await Game.findAll({
      include: [
        {
          model: GameMode,
          through: { attributes: [] }, 
        },
        {
          model: Genre,
          through: { attributes: [] },
        },
      ],
    });

    if (games.length === 0) {
      for (const game of allGames) {
        const createdGame = await Game.create({
          name: game.name,
          thumbnail: game.thumbnail,
        });
        const gameModes = game.gameMode;
        const genres = game.genres;

        for (const gameMode of gameModes) {
          const [createdGameMode] = await GameMode.findOrCreate({
            where: { name: gameMode },
          });
          await createdGame.addGameMode(createdGameMode);
        }

        for (const genre of genres) {
          const [createdGenre] = await Genre.findOrCreate({
            where: { name: genre },
          });
          await createdGame.addGenre(createdGenre);
        }
      }

      games = await Game.findAll({
        include: [
          {
            model: GameMode,
            through: { attributes: [] }, 
          },
          {
            model: Genre,
            through: { attributes: [] }, 
          },
        ],
      });
      return res.status(200).json(games);
    }
    return res.status(200).json(games);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
}


async function getGamesById(req, res) {
  const { id } = req.params;
  try {
    const game = await Game.findByPk(id, {
      include: [
      {
        model: GameMode,
        through: { attributes: [] }, 
      },
      {
        model: Genre,
        through: { attributes: [] }, 
      },
    ],
    });
    if (game) {
      return res.status(200).json(game);
    }
    return res.status(404).json({ error: 'Game not found' });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
}

async function getGamesByName(req, res) {
  const { name } = req.params;
  try {
    const game = await Game.findOne({
      where: { name: name },
      include: [
      {
        model: GameMode,
        through: { attributes: [] }, 
      },
      {
        model: Genre,
        through: { attributes: [] }, 
      },
    ],
    });
    if (game) {
      return res.status(200).json(game);
    }
    return res.status(404).json({ error: 'Game not found' });
  } catch (error) {
    return res.status(500).json({ error: error.message });    
  } 
}

async function postGames(req, res) {
  const { name, thumbnail, gameMode, genres } = req.body;
  
  try {
    let game = await Game.create({
      name,
      thumbnail,
    });

    for (const mode of gameMode) {
      const [createdGameMode] = await GameMode.findOrCreate({
        where: { name: mode },
      });
      await game.addGameMode(createdGameMode);
    }

    for (const genre of genres) {
      const [createdGenre] = await Genre.findOrCreate({
        where: { name: genre },
      });
      await game.addGenre(createdGenre);
    }
    return res.status(201).json(game);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
}

async function deleteGame (req, res) {
  const { id } = req.params;
  try {
    const game = await Game.findByPk(id);
    if (game) {
      await game.destroy();
      return res.status(200).json({ message: 'Game deleted' });
    }
    return res.status(404).json({ error: 'Game not found' });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
}

async function getGamesWithPagination(req, res) {
  const { page, name, genre, gameMode } = req.query;
  const pageSize = 5; 
  let offset = 0; 
  
  let whereClause = {};
  if (name) {
    whereClause.name = { [Op.iLike]: `%${name}%` };
  }
  if (genre) {
    whereClause['$Genres.name$'] = { [Op.iLike]: `%${genre}%` };
  }
  if (gameMode) {
    whereClause['$GameModes.name$'] = { [Op.iLike]: `%${gameMode}%` };
  }

  try {
    let games;
    let count;
    let totalPages;
    
    if (page) {
      offset = (parseInt(page) - 1) * pageSize;
      const result = await Game.findAndCountAll({
        where: whereClause,
        include: [
          {
            model: GameMode,
            through: { attributes: [] },
          },
          {
            model: Genre,
            through: { attributes: [] },
          },
        ],
        limit: pageSize,
        offset: offset,
        distinct: true,
      });
  
      count = result.count;
      games = result.rows;
      totalPages = Math.ceil(count / pageSize);
    } else {
      const result = await Game.findAndCountAll({
        where: whereClause,
        include: [
          {
            model: GameMode,
            through: { attributes: [] },
          },
          {
            model: Genre,
            through: { attributes: [] },
          },
        ],
        distinct: true,
      });
  
      count = result.count;
      games = result.rows;
      totalPages = 1;
    }

    res.json({
      totalCount: count,
      totalPages,
      currentPage: parseInt(page) || 1,
      games,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'Error getting games with pagination' });
  }
}


module.exports = {
  getGames,
  getGamesById,
  getGamesByName,
  postGames,
  deleteGame,
  getGamesWithPagination,
};
