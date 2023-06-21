const { ChatMessage } = require('../db.js');

// Función para enviar un mensaje de chat
const sendMessage = async (req, res) => {
  try {
    const { userId, message } = req.body;

    // Crea una nueva instancia de ChatMessage con los datos proporcionados
    const newMessage = await ChatMessage.create({
      userId,
      message,
    });

    // Envía la respuesta con el mensaje creado
    res.status(201).json(newMessage);
  } catch (error) {
    // Manejo de errores
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

// Función para obtener todos los mensajes de chat
const getMessages = async (req, res) => {
  try {
    // Obtiene todos los mensajes de la base de datos
    const messages = await ChatMessage.findAll();

    // Envía la respuesta con los mensajes obtenidos
    res.status(200).json(messages);
  } catch (error) {
    // Manejo de errores
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

module.exports = {
  sendMessage,
  getMessages,
};
