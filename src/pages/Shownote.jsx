import { useParams } from "react-router-dom";
import React, { useState, useEffect } from 'react';
import { toast } from "react-hot-toast";

export function Shownotes() {
  const { noteid } = useParams();
  const [note, setNote] = useState(null);
  const [editingIndex, setEditingIndex] = useState(-1);
  const [editedContent, setEditedContent] = useState('');
  const [loading, setLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [contentArray, setContentArray] = useState([]);
  const [isEditingTitle, setIsEditingTitle] = useState(false);
  const [editedTitle, setEditedTitle] = useState('');

  useEffect(() => {
    const fetchNote = async () => {
      try {
        const response = await fetch('https://autonotebackend.shadowbites10.workers.dev/getfiletitle', {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${localStorage.getItem('autotoken699')}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ id: parseInt(noteid) }),
        });

        const data = await response.json();
        if (data.success) {
          setNote(data.res);
          const parsedContent = parseContent(data.res.content);
          console.log(parseContent);
          setContentArray(parsedContent);
        }
      } catch (error) {
        console.error('Error fetching note:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchNote();
  }, [noteid]);

  const parseContent = (content) => {
    try {
      const parsed = JSON.parse(content);
      return Array.isArray(parsed) ? parsed : [parsed];
    } catch (e) {
      return [content];
    }
  };

  const handleDelete = async (index) => {
    if (!window.confirm("Are you sure you want to delete this section?")) return;

    try {
      setIsSaving(true);
      // Create new array without the deleted item
      const newArray = contentArray.filter((_, i) => i !== index);
      
      // Update backend
      const response = await fetch(`https://autonotebackend.shadowbites10.workers.dev/addcontent`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${localStorage.getItem('autotoken699')}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          id: parseInt(noteid),
          content: JSON.stringify(newArray)
        }),
      });

      if (response.ok) {
        setContentArray(newArray);
        setNote({ ...note, content: JSON.stringify(newArray) });
      }
    } catch (error) {
      console.error('Error deleting note:', error);
      alert("Failed to delete note section");
    } finally {
      setIsSaving(false);
    }
  };

  const handleCopy = (text) => {
    const cleanText = text.replace(/\\n/g, '\n').replace(/\\"/g, '"');
    navigator.clipboard.writeText(cleanText);
    toast.success("Copied to clipboard!");
  };

  const handleCopyAll = () => {
    const allText = contentArray
      .map(section => section.replace(/\\n/g, '\n').replace(/\\"/g, '"'))
      .join('\n\n');
    navigator.clipboard.writeText(allText);
    toast.success("All notes copied!");
  };

  const handleTitleSave = async () => {
    try {
      setIsSaving(true);
      const response = await fetch('https://autonotebackend.shadowbites10.workers.dev/updatetitle', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${localStorage.getItem('autotoken699')}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ id: parseInt(noteid), title: editedTitle }),
      });

      if (response.ok) {
        setNote({ ...note, title: editedTitle });
        setIsEditingTitle(false);
        toast.success("Title updated!");
      }
    } catch (error) {
      console.error('Error updating title:', error);
      toast.error("Failed to update title");
    } finally {
      setIsSaving(false);
    }
  };

  const handleEditStart = (index, content) => {
    setEditingIndex(index);
    setEditedContent(content.replace(/\\n/g, '\n'));
  };

  const handleSave = async (index) => {
    try {
      setIsSaving(true);
      
      // Update local state first
      const newArray = [...contentArray];
      newArray[index] = editedContent.replace(/\n/g, '\\n');
      setContentArray(newArray);
      
      // Update backend
      const response = await fetch(`https://autonotebackend.shadowbites10.workers.dev/addcontent`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${localStorage.getItem('autotoken699')}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          id: parseInt(noteid),
          content: JSON.stringify(newArray)
        }),
      });
      const data = await response.json();
      console.log(data);
      if (response.ok) {
        setNote({ ...note, content: JSON.stringify(newArray) });
        setEditingIndex(-1);
      }
    } catch (error) {
      console.error('Error saving note:', error);
    } finally {
      setIsSaving(false);
    }
  };

  const handleAddNote = () => {
    setContentArray([...contentArray, "New note"]);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (!note) return <div className="text-center mt-8 text-red-500">Note not found</div>;

  return (
    <div className="min-h-screen bg-gray-100 p-4">
      <div className="max-w-6xl mx-auto bg-white rounded-lg shadow-md p-6">
        <div className="flex justify-between items-start mb-6 gap-4">
          <div className="flex items-start gap-2 max-w-[80%] flex-1">
            {isEditingTitle ? (
              <div className="flex gap-2 w-full">
                <input
                  type="text"
                  value={editedTitle}
                  onChange={(e) => setEditedTitle(e.target.value)}
                  className="flex-1 px-2 py-1 text-xl font-semibold border rounded focus:ring-2 focus:ring-blue-500 outline-none"
                  autoFocus
                />
                <button
                  onClick={handleTitleSave}
                  disabled={isSaving}
                  className="px-3 py-1 text-sm bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50"
                >
                  Save
                </button>
                <button
                  onClick={() => setIsEditingTitle(false)}
                  className="px-3 py-1 text-sm bg-gray-200 text-gray-700 rounded hover:bg-gray-300"
                >
                  Cancel
                </button>
              </div>
            ) : (
              <>
                <h1 className="text-xl font-semibold text-gray-800 break-words">
                  {note.title}
                </h1>
                <button
                  onClick={() => {
                    setEditedTitle(note.title);
                    setIsEditingTitle(true);
                  }}
                  className="mt-1 p-1 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded transition-colors"
                  title="Edit title"
                >
                  ✏️
                </button>
                <button
                  onClick={handleCopyAll}
                  className="mt-1 p-1 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded transition-colors"
                  title="Copy all notes"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15.666 3.888A2.25 2.25 0 0 0 13.5 2.25h-3c-1.03 0-1.9.693-2.166 1.638m7.332 0c.055.194.084.4.084.612v0a.75.75 0 0 1-.75.75H9a.75.75 0 0 1-.75-.75v0c0-.212.03-.418.084-.612m7.332 0c.646.049 1.288.11 1.927.184 1.1.128 1.907 1.077 1.907 2.185V19.5a2.25 2.25 0 0 1-2.25 2.25H6.75A2.25 2.25 0 0 1 4.5 19.5V6.257c0-1.108.806-2.057 1.907-2.185a48.208 48.208 0 0 1 1.927-.184" />
                  </svg>
                </button>
                {note.tab && (
                  <a
                    href={note.tab}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-1 p-1 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded transition-colors"
                    title="Open original URL"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 6H5.25A2.25 2.25 0 0 0 3 8.25v10.5A2.25 2.25 0 0 0 5.25 21h10.5A2.25 2.25 0 0 0 18 18.75V10.5m-10.5 6L21 3m0 0h-5.25M21 3v5.25" />
                    </svg>
                  </a>
                )}
              </>
            )}
          </div>
          <button
            onClick={handleAddNote}
            className="px-3 py-1 rounded-md text-sm bg-green-600 text-white hover:opacity-90 whitespace-nowrap shrink-0"
          >
            Add New Note
          </button>
        </div>

        <div className="space-y-4">
          {contentArray.map((section, index) => (
            <div key={index} className="group relative border-b pb-4">
              {editingIndex === index ? (
                <div className="space-y-2">
                  <textarea
                    value={editedContent}
                    onChange={(e) => setEditedContent(e.target.value)}
                    className="w-full h-96 p-3 border rounded-md font-mono text-sm bg-green-50 
                             focus:ring-2 focus:ring-blue-500 outline-none break-words 
                             whitespace-pre-wrap resize-y"
                  />
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleSave(index)}
                      disabled={isSaving}
                      className="px-4 py-2 text-sm rounded-md bg-blue-600 text-white hover:bg-blue-700 
                               disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {isSaving ? 'Saving...' : 'Save'}
                    </button>
                    <button
                      onClick={() => setEditingIndex(-1)}
                      className="px-4 py-2 text-sm rounded-md bg-gray-200 text-gray-700 hover:bg-gray-300"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              ) : (
                <div className="flex justify-between items-start gap-4">
                  <pre className="whitespace-pre-wrap break-words font-mono text-sm bg-gray-50 p-3 
                                rounded-md border border-gray-200 flex-1 min-w-0 overflow-x-auto">
                    {section.replace(/\\n/g, '\n').replace(/\\"/g, '"')}
                  </pre>
                  <div className="flex flex-col gap-2 shrink-0 ml-2">
                    <button
                      onClick={() => handleCopy(section)}
                      className="px-2 py-1 text-xs rounded border border-gray-300 text-gray-600 hover:bg-gray-50 flex items-center gap-1"
                      title="Copy to clipboard"
                    >
                      📋 Copy
                    </button>
                    <button
                      onClick={() => handleEditStart(index, section)}
                      className="px-2 py-1 text-xs rounded border border-blue-200 text-blue-600 hover:bg-blue-50 flex items-center gap-1"
                    >
                      ✏️ Edit
                    </button>
                    <button
                      onClick={() => handleDelete(index)}
                      disabled={isSaving}
                      className="px-2 py-1 text-xs rounded border border-red-200 text-red-600 hover:bg-red-50 flex items-center gap-1 disabled:opacity-50"
                    >
                      🗑️ Del
                    </button>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}