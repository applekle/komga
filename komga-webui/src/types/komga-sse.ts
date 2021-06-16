export interface LibrarySseDto {
  libraryId: string,
}

export interface SeriesSseDto {
  seriesId: string,
  libraryId: string,
}

export interface BookSseDto {
  bookId: string,
  seriesId: string,
  libraryId: string,
}

export interface CollectionSseDto {
  collectionId: string,
  seriesIds: string[],
}

export interface ReadListSseDto {
  readListId: string,
  bookIds: string[],
}

export interface ReadProgressSseDto {
  bookId: string,
  userId: string,
}
