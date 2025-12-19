import { useState, useEffect } from "react";
import "./App.css";
import Notes from "./components/Notes";
import { supabase } from "./supabaseClient";
function App() {
  const [notes, setNotes] = useState([]);
  useEffect(() => {
    fetchNotes();
  }, []);
  const fetchNotes = async () => {
    try {
      const { data, error } = await supabase.from("Notes").select("*");
      if (error) {
        throw error;
      }
      setNotes(data || []);
    } catch (error) {
      console.error("Error fetching notes: " + error.message);
    }
  };
  const addnote = async () => {
    try {
      const { data, error } = await supabase
        .from("Notes")
        .insert([{ text: "Click Edit to write your note" }])
        .select();
      if (error) {
        throw error;
      }
      setNotes([...notes, data]);
    } catch (error) {
      console.error("Error inserting notes: " + error.message);
    }
  };
  const updatenote = async (id, newText) => {
    try {
      const { data, error } = await supabase
        .from("Notes")
        .update({ text: newText })
        .eq("id", id)
        .select();
      if (error) {
        throw error;
      }
      setNotes((preNote) =>
        preNote.map((note) =>
          note.id === id ? { ...note, text: newText } : note
        )
      );
    } catch (error) {
      console.error("Error updating notes: " + error.message);
    }
  };
  const deletenote = async (id) => {
    try {
      const { error } = await supabase.from("Notes").delete().eq("id", id);
      if (error) {
        throw error;
      }
      setNotes(notes.filter((note) => note.id !== id));
    } catch (error) {
      console.error("Error deleting notes: " + error.message);
    }
  };
  return (
    <>
      <h1 className="m-3 ml-5 text-white font-bold text-5xl italic">
        My Notes
      </h1>
      <div className="text-center">
        <button
          onClick={addnote}
          className="p-3 bg-green-400 rounded-full text-white cursor-pointer hover:bg-green-700"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            stroke-width="1.5"
            stroke="currentColor"
            class="size-6"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              d="M12 4.5v15m7.5-7.5h-15"
            />
          </svg>
        </button>
      </div>
      <div className="flex flex-wrap">
        {notes.map((note) => (
          <Notes
            key={note.id}
            id={note.id}
            text={note.text}
            updatenote={updatenote}
            ondelete={() => deletenote(note.id)}
          />
        ))}
      </div>
    </>
  );
}

export default App;
