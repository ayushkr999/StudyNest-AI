import { asyncHandler } from '../utils/asyncHandler.js';
import { ApiResponse } from '../utils/apiResponse.js';
import * as flashcardService from '../services/flashcard.service.js';

export const createDeck = asyncHandler(async (req, res) => {
  const deck = await flashcardService.createDeck(req.user._id, req.body);
  return ApiResponse.created(res, deck, 'Flashcard deck created.');
});

export const getDecks = asyncHandler(async (req, res) => {
  const decks = await flashcardService.getDecks(req.user._id);
  return ApiResponse.success(res, decks, 'Decks retrieved.');
});

export const getDeckById = asyncHandler(async (req, res) => {
  const result = await flashcardService.getDeckById(req.user._id, req.params.id);
  return ApiResponse.success(res, result, 'Deck and cards retrieved.');
});

export const deleteDeck = asyncHandler(async (req, res) => {
  await flashcardService.deleteDeck(req.user._id, req.params.id);
  return ApiResponse.success(res, null, 'Deck deleted.');
});

export const addCard = asyncHandler(async (req, res) => {
  const card = await flashcardService.addCard(req.user._id, req.params.deckId, req.body);
  return ApiResponse.created(res, card, 'Card added to deck.');
});

export const reviewCard = asyncHandler(async (req, res) => {
  const card = await flashcardService.reviewCard(req.user._id, req.params.cardId, req.body);
  return ApiResponse.success(res, card, 'Review recorded.');
});

export const generateCards = asyncHandler(async (req, res) => {
  const result = await flashcardService.generateCardsWithAi(req.user._id, req.body);
  return ApiResponse.created(res, result, 'Flashcards generated with AI.');
});
