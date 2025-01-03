import Board from '../models/Board.js';
import Task from '../models/Task.js';

export const getBoards = async (req, res) => {
  try {
    const boards = await Board.find({ owner: req.user._id }).sort({ createdAt: -1 });
    res.json(boards);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const createBoard = async (req, res) => {
  try {
    const { title, description } = req.body;

    if (!title) {
      return res.status(400).json({ message: 'Board title is required' });
    }

    const board = await Board.create({ title, description, owner: req.user._id });
    res.status(201).json(board);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const updateBoard = async (req, res) => {
  try {
    const board = await Board.findOne({ _id: req.params.id, owner: req.user._id });
    if (!board) {
      return res.status(404).json({ message: 'Board not found' });
    }

    const { title, description } = req.body;
    if (title !== undefined) board.title = title;
    if (description !== undefined) board.description = description;

    await board.save();
    res.json(board);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const deleteBoard = async (req, res) => {
  try {
    const board = await Board.findOne({ _id: req.params.id, owner: req.user._id });
    if (!board) {
      return res.status(404).json({ message: 'Board not found' });
    }

    // Delete all tasks belonging to this board before deleting the board
    await Task.deleteMany({ board: board._id });
    await board.deleteOne();

    res.json({ message: 'Board and its tasks deleted successfully' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
