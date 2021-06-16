package org.gotson.komga.domain.model

import java.io.Serializable

sealed class DomainEvent : Serializable {

  data class LibraryAdded(val library: Library) : DomainEvent()
  data class LibraryUpdated(val library: Library) : DomainEvent()
  data class LibraryDeleted(val library: Library) : DomainEvent()

  data class SeriesAdded(val series: Series) : DomainEvent() // TODO: publish that event
  data class SeriesUpdated(val series: Series) : DomainEvent()
  data class SeriesDeleted(val series: Series) : DomainEvent()

  data class BookAdded(val book: Book) : DomainEvent() // TODO: publish that event
  data class BookUpdated(val book: Book, val user: KomgaUser? = null) : DomainEvent() // TODO: check usage, need something else for read progress
  data class BookDeleted(val book: Book) : DomainEvent()

  data class CollectionAdded(val collection: SeriesCollection) : DomainEvent()
  data class CollectionUpdated(val collection: SeriesCollection) : DomainEvent()
  data class CollectionDeleted(val collection: SeriesCollection) : DomainEvent()

  data class ReadListAdded(val readList: ReadList) : DomainEvent()
  data class ReadListUpdated(val readList: ReadList) : DomainEvent()
  data class ReadListDeleted(val readList: ReadList) : DomainEvent()
}
