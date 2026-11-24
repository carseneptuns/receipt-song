import React from "react";
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";
import SongItem from "./SongItem";

export default function SongList({ songs, onReorder, onUpdate, onDelete }) {
  function handleDragEnd(result) {
    if (!result.destination) return;
    if (result.destination.index === result.source.index) return;

    const reordered = Array.from(songs);
    const [moved] = reordered.splice(result.source.index, 1);
    reordered.splice(result.destination.index, 0, moved);
    onReorder(reordered);
  }

  if (songs.length === 0) {
    return (
      <p className="rounded-xl border border-dashed border-ink/15 py-8 text-center text-sm text-muted">
        No songs added yet. Add your first one above.
      </p>
    );
  }

  return (
    <DragDropContext onDragEnd={handleDragEnd}>
      <Droppable droppableId="song-list">
        {(provided) => (
          <div ref={provided.innerRef} {...provided.droppableProps} className="space-y-2.5">
            {songs.map((song, index) => (
              <Draggable key={song.id} draggableId={String(song.id)} index={index}>
                {(dragProvided, snapshot) => (
                  <div
                    ref={dragProvided.innerRef}
                    {...dragProvided.draggableProps}
                    className={snapshot.isDragging ? "opacity-90" : ""}
                  >
                    <SongItem
                      song={song}
                      index={index}
                      onUpdate={onUpdate}
                      onDelete={onDelete}
                      dragHandleProps={dragProvided.dragHandleProps}
                    />
                  </div>
                )}
              </Draggable>
            ))}
            {provided.placeholder}
          </div>
        )}
      </Droppable>
    </DragDropContext>
  );
}
