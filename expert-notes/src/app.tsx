import { ChangeEvent, useState } from "react";
import expert_logo from "./assets/expert-logo.svg";
import { NewNoteCard } from "./components/new-note-card";
import { NoteCard } from "./components/note-card";

interface Note {
  id: string;
  date: Date;
  content: string;
}

export function App() {
  const [search, setSearch] = useState("");
  const [notes, setNotes] = useState<Note[]>(() => {
    const stored_notes = localStorage.getItem("notes");

    if (stored_notes) {
      return JSON.parse(stored_notes);
    }

    return [];
  });

  function onNoteCreated(content: string) {
    const new_note: Note = {
      id: crypto.randomUUID(),
      date: new Date(),
      content,
    };

    const notes_array = [new_note, ...notes];
    setNotes(notes_array);

    localStorage.setItem("notes", JSON.stringify(notes_array));
  }

  function handleSearch(event: ChangeEvent<HTMLInputElement>) {
    const query = event.target.value;

    setSearch(query);
  }

  function onNoteDeleted(id: string) {
    const notes_array = notes.filter((note) => note.id !== id);

    setNotes(notes_array);

    localStorage.setItem("notes", JSON.stringify(notes_array));
  }

  const filteredNotes =
    search !== ""
      ? notes.filter((note) =>
          note.content.toLowerCase().includes(search.toLowerCase())
        )
      : notes;

  return (
    <div className="mx-auto max-w-6xl my-12 space-y-6 px-5">
      <img src={expert_logo} alt="Expert notes logo" />

      <form className="w-full">
        <input
          type="text"
          placeholder="Busque algo em suas notas..."
          className="w-full bg-transparent text-3xl font-semibold tracking-tight placeholder:text-slate-500 outline-none"
          onChange={handleSearch}
          autoComplete="off"
          value={search}
        />
      </form>

      <div className="h-px bg-slate-700" />

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 auto-rows-[250px]">
        <NewNoteCard onNoteCreated={onNoteCreated} />

        {filteredNotes.map((note) => (
          <NoteCard
            key={note.id}
            note={{
              id: note.id,
              content: note.content,
              date: note.date,
            }}
            onNoteDeleted={onNoteDeleted}
          />
        ))}
      </div>
    </div>
  );
}
