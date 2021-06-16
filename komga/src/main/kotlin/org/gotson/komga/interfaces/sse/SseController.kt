package org.gotson.komga.interfaces.sse

import mu.KotlinLogging
import org.gotson.komga.domain.model.DomainEvent
import org.gotson.komga.infrastructure.jms.QUEUE_SSE
import org.gotson.komga.infrastructure.jms.QUEUE_SSE_SELECTOR
import org.gotson.komga.infrastructure.jms.TOPIC_FACTORY
import org.gotson.komga.interfaces.sse.dto.BookSseDto
import org.gotson.komga.interfaces.sse.dto.CollectionSseDto
import org.gotson.komga.interfaces.sse.dto.LibrarySseDto
import org.gotson.komga.interfaces.sse.dto.ReadListSseDto
import org.gotson.komga.interfaces.sse.dto.SeriesSseDto
import org.springframework.http.MediaType
import org.springframework.jms.annotation.JmsListener
import org.springframework.stereotype.Controller
import org.springframework.web.bind.annotation.GetMapping
import org.springframework.web.servlet.mvc.method.annotation.SseEmitter
import java.io.IOException
import java.util.Collections

private val logger = KotlinLogging.logger {}

@Controller
class SseController {

  private val emitters = Collections.synchronizedSet(HashSet<SseEmitter>())

  @GetMapping("api/v1/sse")
  fun sse(): SseEmitter {
    val emitter = SseEmitter()
    emitter.onCompletion { synchronized(emitters) { emitters.remove(emitter) } }
    emitter.onTimeout { emitter.complete() }
    emitters.add(emitter)
    return emitter
  }

  @JmsListener(destination = QUEUE_SSE, selector = QUEUE_SSE_SELECTOR, containerFactory = TOPIC_FACTORY)
  fun handleSseEvent(event: DomainEvent) {
    val (name, data) = when (event) {
      is DomainEvent.LibraryAdded -> "LibraryAdded" to LibrarySseDto(event.library.id)
      is DomainEvent.LibraryUpdated -> "LibraryChanged" to LibrarySseDto(event.library.id)
      is DomainEvent.LibraryDeleted -> "LibraryDeleted" to LibrarySseDto(event.library.id)

      is DomainEvent.SeriesAdded -> "SeriesAdded" to SeriesSseDto(event.series.id, event.series.libraryId)
      is DomainEvent.SeriesUpdated -> "SeriesChanged" to SeriesSseDto(event.series.id, event.series.libraryId)
      is DomainEvent.SeriesDeleted -> "SeriesDeleted" to SeriesSseDto(event.series.id, event.series.libraryId)

      is DomainEvent.BookAdded -> "BookAdded" to BookSseDto(event.book.id, event.book.seriesId, event.book.libraryId)
      is DomainEvent.BookUpdated -> "BookChanged" to BookSseDto(event.book.id, event.book.seriesId, event.book.libraryId, event.user?.id)
      is DomainEvent.BookDeleted -> "BookDeleted" to BookSseDto(event.book.id, event.book.seriesId, event.book.libraryId)

      is DomainEvent.ReadListAdded -> "ReadListAdded" to ReadListSseDto(event.readList.id, event.readList.bookIds.map { it.value })
      is DomainEvent.ReadListUpdated -> "ReadListChanged" to ReadListSseDto(event.readList.id, event.readList.bookIds.map { it.value })
      is DomainEvent.ReadListDeleted -> "ReadListDeleted" to ReadListSseDto(event.readList.id, event.readList.bookIds.map { it.value })

      is DomainEvent.CollectionAdded -> "CollectionAdded" to CollectionSseDto(event.collection.id, event.collection.seriesIds)
      is DomainEvent.CollectionUpdated -> "CollectionChanged" to CollectionSseDto(event.collection.id, event.collection.seriesIds)
      is DomainEvent.CollectionDeleted -> "CollectionDeleted" to CollectionSseDto(event.collection.id, event.collection.seriesIds)
    }

    logger.debug { "Publish SSE: '$name':$data" }

    synchronized(emitters) {
      emitters.forEach {
        try {
          it.send(
            SseEmitter.event()
              .name(name)
              .data(data, MediaType.APPLICATION_JSON)
          )
        } catch (e: IOException) {
        }
      }
    }
  }
}
