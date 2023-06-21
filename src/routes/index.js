const { Router } = require('express');
const { body } = require('express-validator');
const { getGamesWithPagination, getGames, getGamesById, getGamesByName, postGames, deleteGame } = require('../controllers/games.js');
const { getPosts, createPost, getPostsByUserId, deletePost, getPostsWithPagination,getGameMode } = require('../controllers/post.js');
const { getFavorites, createFavorite, removeFavoriteGame } = require('../controllers/favorite.js');
const { getUsersWithPagination, getAllUsers, getUserById, getUserByName, getUserByEmail, createUser, updateUser, deleteUser} = require('../controllers/users.js');
const { handleLogin, handleSignUp } = require('../controllers/authController.js');
const { sendMessage, getMessages,} = require('../controllers/chatController.js')
const router = Router();

// Endpoint para obtener todos los games
router.get('/games', getGames);

// Endpoint para eliminar un game
router.delete('/games/:id', deleteGame);

// Ruta para obtener juegos con paginación y filtros
router.get('/games/page', getGamesWithPagination); 

router.get('/games/mode/',getGameMode);
// Endpoint para obtener un game por id
router.get('/games/:id', getGamesById);

// Endpoint para obtener un usuario por game
router.get('/games/name/:name', getGamesByName);

// Endpoint para crear un game
router.post('/games', postGames);


// Endpoint para obtener todos los usuarios
router.get('/users', getAllUsers);

// Endpoint para obtener un usuario por id
router.get('/users/:id', getUserById);

// Endpoint para obtener un usuario por nombre
router.get('/users/:name', getUserByName);       

// Endpoint para obtener un usuario por email
router.get('/users/email/:email', getUserByEmail);
// Endpoint para crear un usuario
router.post(
    '/users',
    [
      body('email').isEmail().withMessage('Invalid email'),
      body('password')
        .isLength({ min: 6 })
        .withMessage('Password must be at least 6 characters long')
        .matches(/^(?=.*[!@#$%^&*])(?=.*[A-Z])/)
        .withMessage('Password must contain special characters and uppercase letters'),
    ],
    createUser
  );

// Endpoint para actualizar un usuario
router.put('/users/:id', updateUser);

// Endpoint para eliminar un usuario
router.delete('/users/:id', deleteUser);

// Endpoint para obtener los favoritos de un usuario
router.get('/favorite/:userId', getFavorites)

// Endpoint para eliminar un juego de los favoritos de un usuario
router.delete('/favorite/:userId/:gameId', removeFavoriteGame)

// Endpoint para agregar un juego a los favoritos de un usuario
router.post('/favorite', createFavorite)

// Endpoint para obtener usuarios con paginación y filtros
router.get('/users/page/:page', getUsersWithPagination); // Ruta para obtener usuarios con paginación y filtros

//Endpoint para obtener todos los posts
router.get('/posts', getPosts);

//Endpoint para crear posts
router.post('/posts', createPost);

//Endpoint para obtener los posts por usuarios
router.get('/posts/user/:id', getPostsByUserId);

//Endpoint para borrar los posts por id
router.delete('/posts/:id', deletePost);

//Endpoint para conseguir los posts con Paginacion
router.get('/posts/page/', getPostsWithPagination );

//Endpoint para post de signup
router.post('/register', handleSignUp);

//Endpoint para login 
router.post('/login', handleLogin);

//Endpoint para chat
router.get('/chat', sendMessage, getMessages);

module.exports = router;

