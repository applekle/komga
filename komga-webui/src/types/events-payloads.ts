interface EventLibrary {
  libraryId: string
}

interface EventBook {
  bookId: string,
  seriesId: string,
  libraryId: string,
}

interface EventSeries {
  seriesId: string,
  libraryId: string
}

interface EventCollection {
  collectionId: string,
  seriesIds: string[],
}

interface EventReadList {
  readListId: string,
  bookIds: string[],
}
