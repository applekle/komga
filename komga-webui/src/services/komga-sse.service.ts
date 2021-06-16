import urls from '@/functions/urls'
import {
  BOOK_ADDED,
  BOOK_CHANGED,
  BOOK_DELETED,
  COLLECTION_ADDED,
  COLLECTION_CHANGED,
  COLLECTION_DELETED,
  LIBRARY_ADDED,
  LIBRARY_CHANGED,
  LIBRARY_DELETED,
  READLIST_ADDED,
  READLIST_CHANGED,
  READLIST_DELETED,
  SERIES_ADDED,
  SERIES_CHANGED,
  SERIES_DELETED,
} from "@/types/events";
import Vue from "vue";
import {BookSseDto, CollectionSseDto, LibrarySseDto, ReadListSseDto, SeriesSseDto} from "@/types/komga-sse";

const API_SSE = '/api/v1/sse'

export default class KomgaSseService {
  private eventSource: EventSource
  private eventHub: Vue
  private store: any

  constructor(eventHub: Vue, store: any) {
    this.eventHub = eventHub
    this.store = store
    this.eventSource = new EventSource(urls.originNoSlash + API_SSE, {withCredentials: true})

    // Libraries
    this.eventSource.addEventListener('LibraryAdded', (event: any) => this.emitLibrary(LIBRARY_ADDED, event))
    this.eventSource.addEventListener('LibraryChanged', (event: any) => this.emitLibrary(LIBRARY_CHANGED, event))
    this.eventSource.addEventListener('LibraryDeleted', (event: any) => this.emitLibrary(LIBRARY_DELETED, event))

    // Series
    this.eventSource.addEventListener('SeriesAdded', (event: any) => this.emitSeries(SERIES_ADDED, event))
    this.eventSource.addEventListener('SeriesChanged', (event: any) => this.emitSeries(SERIES_CHANGED, event))
    this.eventSource.addEventListener('SeriesDeleted', (event: any) => this.emitSeries(SERIES_DELETED, event))

    // Books
    this.eventSource.addEventListener('BookAdded', (event: any) => this.emitBook(BOOK_ADDED, event))
    this.eventSource.addEventListener('BookChanged', (event: any) => this.emitBook(BOOK_CHANGED, event))
    this.eventSource.addEventListener('BookDeleted', (event: any) => this.emitBook(BOOK_DELETED, event))

    // Collections
    this.eventSource.addEventListener('CollectionAdded', (event: any) => this.emitCollection(COLLECTION_ADDED, event))
    this.eventSource.addEventListener('CollectionChanged', (event: any) => this.emitCollection(COLLECTION_CHANGED, event))
    this.eventSource.addEventListener('CollectionDeleted', (event: any) => this.emitCollection(COLLECTION_DELETED, event))

    // Read Lists
    this.eventSource.addEventListener('ReadListAdded', (event: any) => this.emitReadList(READLIST_ADDED, event))
    this.eventSource.addEventListener('ReadListChanged', (event: any) => this.emitReadList(READLIST_CHANGED, event))
    this.eventSource.addEventListener('ReadListDeleted', (event: any) => this.emitReadList(READLIST_DELETED, event))
  }

  private me(): UserDto {
    return this.store.state.komgaUsers.me
  }

  private emitLibrary(name: string, event: any) {
    const data = JSON.parse(event.data) as LibrarySseDto
    this.eventHub.$emit(name, {
      libraryId: data.libraryId,
    } as EventLibrary)
  }

  private emitSeries(name: string, event: any) {
    const data = JSON.parse(event.data) as SeriesSseDto
    this.eventHub.$emit(name, {
      seriesId: data.seriesId,
      libraryId: data.libraryId,
    } as EventSeries)
  }

  private emitBook(name: string, event: any) {
    const data = JSON.parse(event.data) as BookSseDto
    if (!data.userId || data.userId === this.me().id) {
      this.eventHub.$emit(name, {
        bookId: data.bookId,
        seriesId: data.seriesId,
        libraryId: data.libraryId,
      } as EventBook)
    }
  }

  private emitCollection(name: string, event: any) {
    const data = JSON.parse(event.data) as CollectionSseDto
    this.eventHub.$emit(name, {
      collectionId: data.collectionId,
      seriesIds: data.seriesIds,
    } as EventCollection)
  }

  private emitReadList(name: string, event: any) {
    const data = JSON.parse(event.data) as ReadListSseDto
    this.eventHub.$emit(name, {
      readListId: data.readListId,
      bookIds: data.bookIds,
    } as EventReadList)
  }
}
