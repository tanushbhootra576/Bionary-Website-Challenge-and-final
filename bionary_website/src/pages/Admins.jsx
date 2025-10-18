import { useState, useEffect, useRef } from "react";
import { API_URL } from '../../url.js';

function Admins() {
  const [token, setToken] = useState("");
  const [tab, setTab] = useState("events");
  const [login, setLogin] = useState({ username: "", password: "" });
  const [error, setError] = useState("");
  const [data, setData] = useState({
    events: [],
    gallery: [],
    leaderboard: [],
    blog: [],
  });
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({});
  const [editId, setEditId] = useState(null);
  const usernameRef = useRef(null);

  // Load token from localStorage on mount
  useEffect(() => {
    const saved = localStorage.getItem("admin_jwt");
    if (saved) setToken(saved);
  }, []);

  // Login handler
  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const res = await fetch(`${API_URL}/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(login),
      });
      const result = await res.json();
      if (res.ok && result.token) {
        setToken(result.token);
        localStorage.setItem("admin_jwt", result.token);
        setLogin({ username: "", password: "" });
      } else {
        setError(result.error || "Login failed");
      }
    } catch (err) {
      setError("Network error");
    }
    setLoading(false);
  };

  // Logout handler
  const handleLogout = () => {
    setToken("");
    localStorage.removeItem("admin_jwt");
  };

  // Fetch data for current tab
  const fetchData = async (section) => {
    setLoading(true);
    setError("");
    try {
      const res = await fetch(`${API_URL}/${section}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const result = await res.json();
      if (res.ok) {
        setData((prev) => ({ ...prev, [section]: result }));
      } else {
        setError(result.error || "Failed to fetch");
      }
    } catch (err) {
      setError("Network error");
    }
    setLoading(false);
  };

  useEffect(() => {
    if (token) fetchData(tab);
    // eslint-disable-next-line
  }, [token, tab]);

  // CRUD handlers
  const handleSave = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const method = editId ? "PUT" : "POST";
      const url = editId ? `${API_URL}/${tab}/${editId}` : `${API_URL}/${tab}`;
      const res = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ ...form }),
      });
      if (!res.ok) {
        const result = await res.json();
        setError(result.error || "Save failed");
      } else {
        setForm({});
        setEditId(null);
        fetchData(tab);
      }
    } catch (err) {
      setError("Network error");
    }
    setLoading(false);
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this entry?")) return;
    setLoading(true);
    setError("");
    try {
      const res = await fetch(`${API_URL}/${tab}/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) {
        const result = await res.json();
        setError(result.error || "Delete failed");
      } else {
        fetchData(tab);
      }
    } catch (err) {
      setError("Network error");
    }
    setLoading(false);
  };

  // Render table headers and forms for each tab
  const renderTable = () => {
    const items = data[tab] || [];
    
    if (tab === "events") {
      return (
        <div className="overflow-auto">
          <table className="min-w-full border-collapse border border-neon-cyan/30 mb-6 bg-space-800/50 backdrop-blur-sm">
            <thead className="bg-space-700">
              <tr className="border-b-2 border-neon-cyan">
                <th className="px-4 py-3 text-left text-neon-cyan">Title</th>
                <th className="px-4 py-3 text-left text-neon-cyan">Date</th>
                <th className="px-4 py-3 text-center text-neon-cyan">Actions</th>
              </tr>
            </thead>
            <tbody>
              {items.map((ev) => (
                <tr key={ev._id} className="border-b border-space-600 hover:bg-space-700/50 transition-colors">
                  <td className="px-4 py-3 text-space-100">{ev.title}</td>
                  <td className="px-4 py-3 text-space-300">{ev.date}</td>
                  <td className="px-4 py-3">
                    <div className="flex gap-2 justify-center">
                      <button
                        className="px-3 py-1 text-amber-400 border border-amber-500 rounded-md hover:bg-amber-500/10 transition-colors"
                        onClick={() => {
                          setForm(ev);
                          setEditId(ev.id);
                        }}
                      >
                        Edit
                      </button>
                      <button 
                        className="px-3 py-1 text-red-400 border border-red-500 rounded-md hover:bg-red-500/10 transition-colors" 
                        onClick={() => handleDelete(ev.id)}
                      >
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          
          <form onSubmit={handleSave} className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 bg-space-800/50 rounded-lg border border-neon-cyan/20">
            <div>
              <label className="block text-neon-cyan mb-1 text-sm">Title *</label>
              <input
                required
                placeholder="Event Title"
                value={form.title || ""}
                onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))}
                className="w-full px-3 py-2 bg-space-700 border border-space-600 rounded-md text-space-100 focus:border-neon-cyan focus:outline-none"
              />
            </div>
            
            <div>
              <label className="block text-neon-cyan mb-1 text-sm">Date *</label>
              <input
                required
                placeholder="Event Date"
                value={form.date || ""}
                onChange={(e) => setForm((f) => ({ ...f, date: e.target.value }))}
                className="w-full px-3 py-2 bg-space-700 border border-space-600 rounded-md text-space-100 focus:border-neon-cyan focus:outline-none"
              />
            </div>
            
            <div className="md:col-span-2">
              <label className="block text-neon-cyan mb-1 text-sm">Description</label>
              <textarea
                placeholder="Event Description"
                value={form.description || ""}
                onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))}
                className="w-full px-3 py-2 bg-space-700 border border-space-600 rounded-md text-space-100 focus:border-neon-cyan focus:outline-none min-h-[80px]"
              />
            </div>
            
            <div>
              <label className="block text-neon-cyan mb-1 text-sm">Image URL</label>
              <input
                placeholder="https://example.com/image.jpg"
                value={form.image || ""}
                onChange={(e) => setForm((f) => ({ ...f, image: e.target.value }))}
                className="w-full px-3 py-2 bg-space-700 border border-space-600 rounded-md text-space-100 focus:border-neon-cyan focus:outline-none"
              />
            </div>
            
            <div>
              <label className="block text-neon-cyan mb-1 text-sm">Location</label>
              <input
                placeholder="Event Location"
                value={form.location || ""}
                onChange={(e) => setForm((f) => ({ ...f, location: e.target.value }))}
                className="w-full px-3 py-2 bg-space-700 border border-space-600 rounded-md text-space-100 focus:border-neon-cyan focus:outline-none"
              />
            </div>
            
            <div>
              <label className="block text-neon-cyan mb-1 text-sm">Capacity</label>
              <input
                placeholder="0"
                value={form.capacity || ""}
                type="number"
                onChange={(e) => setForm((f) => ({ ...f, capacity: e.target.value }))}
                className="w-full px-3 py-2 bg-space-700 border border-space-600 rounded-md text-space-100 focus:border-neon-cyan focus:outline-none"
              />
            </div>
            
            <div>
              <label className="block text-neon-cyan mb-1 text-sm">Registered</label>
              <input
                placeholder="0"
                value={form.registered || ""}
                type="number"
                onChange={(e) => setForm((f) => ({ ...f, registered: e.target.value }))}
                className="w-full px-3 py-2 bg-space-700 border border-space-600 rounded-md text-space-100 focus:border-neon-cyan focus:outline-none"
              />
            </div>
            
            <div>
              <label className="block text-neon-cyan mb-1 text-sm">Type</label>
              <input
                placeholder="Workshop/Conference/Meetup"
                value={form.type || ""}
                onChange={(e) => setForm((f) => ({ ...f, type: e.target.value }))}
                className="w-full px-3 py-2 bg-space-700 border border-space-600 rounded-md text-space-100 focus:border-neon-cyan focus:outline-none"
              />
            </div>
            
            <div>
              <label className="block text-neon-cyan mb-1 text-sm">Tags</label>
              <input
                placeholder="tech, ai, workshop"
                value={form.tags || ""}
                onChange={(e) => setForm((f) => ({ ...f, tags: e.target.value }))}
                className="w-full px-3 py-2 bg-space-700 border border-space-600 rounded-md text-space-100 focus:border-neon-cyan focus:outline-none"
              />
            </div>
            
            <div>
              <label className="block text-neon-cyan mb-1 text-sm">Featured (0 or 1)</label>
              <input
                placeholder="0"
                value={form.featured || ""}
                type="number"
                min="0"
                max="1"
                onChange={(e) => setForm((f) => ({ ...f, featured: e.target.value }))}
                className="w-full px-3 py-2 bg-space-700 border border-space-600 rounded-md text-space-100 focus:border-neon-cyan focus:outline-none"
              />
            </div>
            
            <div className="md:col-span-2 flex gap-3 mt-2">
              <button
                type="submit"
                disabled={loading}
                className="px-6 py-2 bg-gradient-to-r from-neon-cyan to-neon-violet text-white rounded-md font-semibold hover:opacity-90 transition-opacity disabled:opacity-50"
              >
                {loading ? "Saving..." : editId ? "Update Event" : "Create Event"}
              </button>
              {editId && (
                <button
                  type="button"
                  onClick={() => {
                    setForm({});
                    setEditId(null);
                  }}
                  className="px-6 py-2 bg-space-700 text-space-200 border border-space-600 rounded-md hover:bg-space-600 transition-colors"
                >
                  Cancel
                </button>
              )}
            </div>
          </form>
        </div>
      );
    }
    
    if (tab === "gallery") {
      return (
        <div className="overflow-auto">
          <table className="min-w-full border-collapse border border-neon-cyan/30 mb-6 bg-space-800/50">
            <thead className="bg-space-700">
              <tr className="border-b-2 border-neon-cyan">
                <th className="px-4 py-3 text-left text-neon-cyan">Title</th>
                <th className="px-4 py-3 text-left text-neon-cyan">Date</th>
                <th className="px-4 py-3 text-center text-neon-cyan">Actions</th>
              </tr>
            </thead>
            <tbody>
              {items.map((g) => (
                <tr key={g._id} className="border-b border-space-600 hover:bg-space-700/50 transition-colors">
                  <td className="px-4 py-3 text-space-100">{g.title}</td>
                  <td className="px-4 py-3 text-space-300">{g.date}</td>
                  <td className="px-4 py-3">
                    <div className="flex gap-2 justify-center">
                      <button
                        className="px-3 py-1 text-amber-400 border border-amber-500 rounded-md hover:bg-amber-500/10 transition-colors"
                        onClick={() => {
                          setForm(g);
                          setEditId(g.id);
                        }}
                      >
                        Edit
                      </button>
                      <button 
                        className="px-3 py-1 text-red-400 border border-red-500 rounded-md hover:bg-red-500/10 transition-colors"
                        onClick={() => handleDelete(g.id)}
                      >
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          
          <form onSubmit={handleSave} className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 bg-space-800/50 rounded-lg border border-neon-cyan/20">
            <div>
              <label className="block text-neon-cyan mb-1 text-sm">Title *</label>
              <input
                required
                placeholder="Gallery Title"
                value={form.title || ""}
                onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))}
                className="w-full px-3 py-2 bg-space-700 border border-space-600 rounded-md text-space-100 focus:border-neon-cyan focus:outline-none"
              />
            </div>
            
            <div>
              <label className="block text-neon-cyan mb-1 text-sm">Date *</label>
              <input
                required
                placeholder="Date"
                value={form.date || ""}
                onChange={(e) => setForm((f) => ({ ...f, date: e.target.value }))}
                className="w-full px-3 py-2 bg-space-700 border border-space-600 rounded-md text-space-100 focus:border-neon-cyan focus:outline-none"
              />
            </div>
            
            <div className="md:col-span-2">
              <label className="block text-neon-cyan mb-1 text-sm">Description</label>
              <textarea
                placeholder="Description"
                value={form.description || ""}
                onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))}
                className="w-full px-3 py-2 bg-space-700 border border-space-600 rounded-md text-space-100 focus:border-neon-cyan focus:outline-none min-h-[80px]"
              />
            </div>
            
            <div>
              <label className="block text-neon-cyan mb-1 text-sm">Image URL</label>
              <input
                placeholder="https://example.com/image.jpg"
                value={form.image || ""}
                onChange={(e) => setForm((f) => ({ ...f, image: e.target.value }))}
                className="w-full px-3 py-2 bg-space-700 border border-space-600 rounded-md text-space-100 focus:border-neon-cyan focus:outline-none"
              />
            </div>
            
            <div>
              <label className="block text-neon-cyan mb-1 text-sm">Category</label>
              <input
                placeholder="Category"
                value={form.category || ""}
                onChange={(e) => setForm((f) => ({ ...f, category: e.target.value }))}
                className="w-full px-3 py-2 bg-space-700 border border-space-600 rounded-md text-space-100 focus:border-neon-cyan focus:outline-none"
              />
            </div>
            
            <div className="md:col-span-2">
              <label className="block text-neon-cyan mb-1 text-sm">Tags</label>
              <input
                placeholder="Tags (comma separated)"
                value={form.tags || ""}
                onChange={(e) => setForm((f) => ({ ...f, tags: e.target.value }))}
                className="w-full px-3 py-2 bg-space-700 border border-space-600 rounded-md text-space-100 focus:border-neon-cyan focus:outline-none"
              />
            </div>
            
            <div className="md:col-span-2 flex gap-3 mt-2">
              <button
                type="submit"
                disabled={loading}
                className="px-6 py-2 bg-gradient-to-r from-neon-cyan to-neon-violet text-white rounded-md font-semibold hover:opacity-90 transition-opacity disabled:opacity-50"
              >
                {loading ? "Saving..." : editId ? "Update Gallery" : "Create Gallery"}
              </button>
              {editId && (
                <button
                  type="button"
                  onClick={() => {
                    setForm({});
                    setEditId(null);
                  }}
                  className="px-6 py-2 bg-space-700 text-space-200 border border-space-600 rounded-md hover:bg-space-600 transition-colors"
                >
                  Cancel
                </button>
              )}
            </div>
          </form>
        </div>
      );
    }
    
    if (tab === "leaderboard") {
      return (
        <div className="overflow-auto">
          <table className="min-w-full border-collapse border border-neon-cyan/30 mb-6 bg-space-800/50">
            <thead className="bg-space-700">
              <tr className="border-b-2 border-neon-cyan">
                <th className="px-4 py-3 text-left text-neon-cyan">Name</th>
                <th className="px-4 py-3 text-center text-neon-cyan">Score</th>
                <th className="px-4 py-3 text-center text-neon-cyan">Rank</th>
                <th className="px-4 py-3 text-center text-neon-cyan">Actions</th>
              </tr>
            </thead>
            <tbody>
              {items.map((l, index) => (
                <tr key={l.id} className="border-b border-space-600 hover:bg-space-700/50 transition-colors">
                  <td className="px-4 py-3 text-space-100">{l.name}</td>
                  <td className="px-4 py-3 text-center text-neon-cyan font-semibold">{l.score}</td>
                  <td className="px-4 py-3 text-center text-space-300">#{index + 1}</td>
                  <td className="px-4 py-3">
                    <div className="flex gap-2 justify-center">
                      <button
                        className="px-3 py-1 text-amber-400 border border-amber-500 rounded-md hover:bg-amber-500/10 transition-colors"
                        onClick={() => {
                          setForm(l);
                          setEditId(l.id);
                        }}
                      >
                        Edit
                      </button>
                      <button 
                        className="px-3 py-1 text-red-400 border border-red-500 rounded-md hover:bg-red-500/10 transition-colors" 
                        onClick={() => handleDelete(l.id)}
                      >
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          
          <form onSubmit={handleSave} className="grid grid-cols-1 md:grid-cols-3 gap-4 p-4 bg-space-800/50 rounded-lg border border-neon-cyan/20">
            <div>
              <label className="block text-neon-cyan mb-1 text-sm">Name *</label>
              <input
                required
                placeholder="Student Name"
                value={form.name || ""}
                onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
                className="w-full px-3 py-2 bg-space-700 border border-space-600 rounded-md text-space-100 focus:border-neon-cyan focus:outline-none"
              />
            </div>
            
            <div>
              <label className="block text-neon-cyan mb-1 text-sm">Score *</label>
              <input
                required
                placeholder="0"
                type="number"
                value={form.score || ""}
                onChange={(e) => setForm((f) => ({ ...f, score: e.target.value }))}
                className="w-full px-3 py-2 bg-space-700 border border-space-600 rounded-md text-space-100 focus:border-neon-cyan focus:outline-none"
              />
            </div>
            
            <div>
              <label className="block text-neon-cyan mb-1 text-sm">Department</label>
              <input
                placeholder="CSE/ECE/ME"
                value={form.department || ""}
                onChange={(e) => setForm((f) => ({ ...f, department: e.target.value }))}
                className="w-full px-3 py-2 bg-space-700 border border-space-600 rounded-md text-space-100 focus:border-neon-cyan focus:outline-none"
              />
            </div>
            
            <div className="md:col-span-3 flex gap-3 mt-2">
              <button
                type="submit"
                disabled={loading}
                className="px-6 py-2 bg-gradient-to-r from-neon-cyan to-neon-violet text-white rounded-md font-semibold hover:opacity-90 transition-opacity disabled:opacity-50"
              >
                {loading ? "Saving..." : editId ? "Update Entry" : "Create Entry"}
              </button>
              {editId && (
                <button
                  type="button"
                  onClick={() => {
                    setForm({});
                    setEditId(null);
                  }}
                  className="px-6 py-2 bg-space-700 text-space-200 border border-space-600 rounded-md hover:bg-space-600 transition-colors"
                >
                  Cancel
                </button>
              )}
            </div>
          </form>
        </div>
      );
    }
    
    if (tab === "blog") {
      return (
        <div className="overflow-auto">
          <table className="min-w-full border-collapse border border-neon-cyan/30 mb-6 bg-space-800/50">
            <thead className="bg-space-700">
              <tr className="border-b-2 border-neon-cyan">
                <th className="px-4 py-3 text-left text-neon-cyan">Title</th>
                <th className="px-4 py-3 text-left text-neon-cyan">Author</th>
                <th className="px-4 py-3 text-left text-neon-cyan">Date</th>
                <th className="px-4 py-3 text-center text-neon-cyan">Actions</th>
              </tr>
            </thead>
            <tbody>
              {items.map((b) => (
                <tr key={b.id} className="border-b border-space-600 hover:bg-space-700/50 transition-colors">
                  <td className="px-4 py-3 text-space-100">{b.title}</td>
                  <td className="px-4 py-3 text-space-300">{b.author}</td>
                  <td className="px-4 py-3 text-space-300">{b.date}</td>
                  <td className="px-4 py-3">
                    <div className="flex gap-2 justify-center">
                      <button
                        className="px-3 py-1 text-amber-400 border border-amber-500 rounded-md hover:bg-amber-500/10 transition-colors"
                        onClick={() => {
                          setForm(b);
                          setEditId(b.id);
                        }}
                      >
                        Edit
                      </button>
                      <button 
                        className="px-3 py-1 text-red-400 border border-red-500 rounded-md hover:bg-red-500/10 transition-colors" 
                        onClick={() => handleDelete(b.id)}
                      >
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          
          <form onSubmit={handleSave} className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 bg-space-800/50 rounded-lg border border-neon-cyan/20">
            <div>
              <label className="block text-neon-cyan mb-1 text-sm">Title *</label>
              <input
                required
                placeholder="Blog Title"
                value={form.title || ""}
                onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))}
                className="w-full px-3 py-2 bg-space-700 border border-space-600 rounded-md text-space-100 focus:border-neon-cyan focus:outline-none"
              />
            </div>
            
            <div>
              <label className="block text-neon-cyan mb-1 text-sm">Author *</label>
              <input
                required
                placeholder="Author Name"
                value={form.author || ""}
                onChange={(e) => setForm((f) => ({ ...f, author: e.target.value }))}
                className="w-full px-3 py-2 bg-space-700 border border-space-600 rounded-md text-space-100 focus:border-neon-cyan focus:outline-none"
              />
            </div>
            
            <div>
              <label className="block text-neon-cyan mb-1 text-sm">Date *</label>
              <input
                required
                placeholder="Date"
                value={form.date || ""}
                onChange={(e) => setForm((f) => ({ ...f, date: e.target.value }))}
                className="w-full px-3 py-2 bg-space-700 border border-space-600 rounded-md text-space-100 focus:border-neon-cyan focus:outline-none"
              />
            </div>
            
            <div>
              <label className="block text-neon-cyan mb-1 text-sm">Image URL</label>
              <input
                placeholder="https://example.com/image.jpg"
                value={form.image || ""}
                onChange={(e) => setForm((f) => ({ ...f, image: e.target.value }))}
                className="w-full px-3 py-2 bg-space-700 border border-space-600 rounded-md text-space-100 focus:border-neon-cyan focus:outline-none"
              />
            </div>
            
            <div className="md:col-span-2">
              <label className="block text-neon-cyan mb-1 text-sm">Body</label>
              <textarea
                placeholder="Blog content..."
                value={form.body || ""}
                onChange={(e) => setForm((f) => ({ ...f, body: e.target.value }))}
                className="w-full px-3 py-2 bg-space-700 border border-space-600 rounded-md text-space-100 focus:border-neon-cyan focus:outline-none min-h-[120px]"
              />
            </div>
            
            <div className="md:col-span-2">
              <label className="block text-neon-cyan mb-1 text-sm">Tags</label>
              <input
                placeholder="tech, ai, tutorial"
                value={form.tags || ""}
                onChange={(e) => setForm((f) => ({ ...f, tags: e.target.value }))}
                className="w-full px-3 py-2 bg-space-700 border border-space-600 rounded-md text-space-100 focus:border-neon-cyan focus:outline-none"
              />
            </div>
            
            <div className="md:col-span-2 flex gap-3 mt-2">
              <button
                type="submit"
                disabled={loading}
                className="px-6 py-2 bg-gradient-to-r from-neon-cyan to-neon-violet text-white rounded-md font-semibold hover:opacity-90 transition-opacity disabled:opacity-50"
              >
                {loading ? "Saving..." : editId ? "Update Blog" : "Create Blog"}
              </button>
              {editId && (
                <button
                  type="button"
                  onClick={() => {
                    setForm({});
                    setEditId(null);
                  }}
                  className="px-6 py-2 bg-space-700 text-space-200 border border-space-600 rounded-md hover:bg-space-600 transition-colors"
                >
                  Cancel
                </button>
              )}
            </div>
          </form>
        </div>
      );
    }
    
    return null;
  };

  useEffect(() => {
    if (!token && usernameRef.current) {
      usernameRef.current.focus();
    }
  }, [token]);

  // Login page - full viewport
  if (!token) {
    return (
      <div className="min-h-screen w-full flex items-center justify-center bg-gradient-to-br from-space-900 via-space-800 to-space-900 p-4">
        <div className="w-full max-w-md p-8 rounded-xl border border-neon-cyan/30 shadow-2xl bg-space-800/50 backdrop-blur-sm">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-neon-cyan to-neon-violet mb-2">
              Admin Portal
            </h2>
            <p className="text-space-300">Sign in to manage content</p>
          </div>
          
          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-neon-cyan mb-2 text-sm font-medium">Username</label>
              <input
                ref={usernameRef}
                required
                placeholder="Enter username"
                value={login.username}
                onChange={(e) => setLogin((l) => ({ ...l, username: e.target.value }))}
                className="w-full px-4 py-3 bg-space-700 border border-space-600 rounded-lg text-space-100 placeholder-space-400 focus:border-neon-cyan focus:outline-none focus:ring-2 focus:ring-neon-cyan/20 transition-all"
              />
            </div>
            
            <div>
              <label className="block text-neon-cyan mb-2 text-sm font-medium">Password</label>
              <input
                required
                type="password"
                placeholder="Enter password"
                value={login.password}
                onChange={(e) => setLogin((l) => ({ ...l, password: e.target.value }))}
                className="w-full px-4 py-3 bg-space-700 border border-space-600 rounded-lg text-space-100 placeholder-space-400 focus:border-neon-cyan focus:outline-none focus:ring-2 focus:ring-neon-cyan/20 transition-all"
              />
            </div>
            
            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 bg-gradient-to-r from-neon-cyan to-neon-violet text-white rounded-lg font-semibold hover:opacity-90 transition-opacity disabled:opacity-50 shadow-lg"
            >
              {loading ? "Signing in..." : "Sign In"}
            </button>
          </form>
          
          {error && (
            <div className="mt-4 p-3 bg-red-500/10 border border-red-500/30 rounded-lg">
              <p className="text-red-400 text-sm text-center">{error}</p>
            </div>
          )}
        </div>
      </div>
    );
  }

  // Admin dashboard - full viewport
  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-space-900 via-space-800 to-space-900 p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h1 className="text-3xl md:text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-neon-cyan to-neon-violet mb-2">
              Admin Dashboard
            </h1>
            <p className="text-space-300">Manage your content efficiently</p>
          </div>
          
          <button
            onClick={handleLogout}
            className="px-6 py-2 bg-red-500/10 border border-red-500 text-red-400 rounded-lg font-semibold hover:bg-red-500/20 transition-colors"
          >
            Logout
          </button>
        </div>
        
        {/* Tab Navigation */}
        <div className="mb-6 flex flex-wrap gap-2 p-2 bg-space-800/50 rounded-lg border border-neon-cyan/20">
          {["events", "gallery", "leaderboard", "blog"].map((t) => (
            <button
              key={t}
              onClick={() => {
                setTab(t);
                setForm({});
                setEditId(null);
              }}
              className={`px-6 py-2 rounded-md font-medium transition-all ${
                tab === t
                  ? "bg-gradient-to-r from-neon-cyan to-neon-violet text-white shadow-lg"
                  : "bg-space-700 text-space-300 hover:bg-space-600"
              }`}
            >
              {t.charAt(0).toUpperCase() + t.slice(1)}
            </button>
          ))}
        </div>
        
        {/* Loading & Error States */}
        {loading && (
          <div className="mb-4 p-4 bg-neon-cyan/10 border border-neon-cyan/30 rounded-lg">
            <p className="text-neon-cyan text-center">Loading...</p>
          </div>
        )}
        
        {error && (
          <div className="mb-4 p-4 bg-red-500/10 border border-red-500/30 rounded-lg">
            <p className="text-red-400 text-center font-semibold">{error}</p>
          </div>
        )}
        
        {/* Content Area */}
        <div className="bg-space-800/30 backdrop-blur-sm rounded-xl border border-neon-cyan/20 p-4 md:p-6 shadow-2xl">
          {renderTable()}
        </div>
      </div>
    </div>
  );
}

export default Admins;
