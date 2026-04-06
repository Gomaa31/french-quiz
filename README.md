# French Picture-Book Quiz

A French vocabulary quiz app built with **React + TypeScript + Vite** using content from **Apprendre le français en image** by **Mme Sabria**.

This app lets you study the booklet page by page, filter by category, search the vocabulary, and quiz yourself with French text-to-speech.

## Features

- Full booklet-based vocabulary dataset
- Study by **page** or **category**
- Searchable **word bank**
- Multiple-choice quiz mode
- Quiz direction:
  - **French → English**
  - **English → French**
- Adjustable number of questions
- French **text-to-speech** using the browser's Speech Synthesis API
- Internal checks for duplicate handling and quiz data coverage

## Dataset

- **774 total entries**
- **45 lesson pages**
- Includes:
  - vocabulary
  - sentence patterns
  - example phrases
  - OCR-added alphabet/date support items used in validation

## Tech Stack

- React
- TypeScript
- Vite
- Web Speech API (`speechSynthesis`)

## Getting Started

### 1. Install dependencies

```bash
npm install
