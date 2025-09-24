import { useState, useEffect, useRef } from "react";
import {API_URL} from '../../url.js'

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
        body: JSON.stringify({...form}),
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
        <>
          <table className="min-w-full border mb-4 mt-6 text-center">
            <thead>
              <tr className="border-b-4 border-white">
                <th>Title</th>
                <th>Date</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {items.map((ev) => (
                <tr key={ev._id} className="border-b-2 border-white">
                  <td>{ev.title}</td>
                  <td>{ev.date}</td>
                  <td>
                    <button
                      className="p-2 m-2"
                      onClick={() => {
                        setForm(ev);
                        setEditId(ev.id);
                      }}
                    >
                      Edit
                    </button>
                    <button onClick={() => handleDelete(ev.id)}>Delete</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <form onSubmit={handleSave} className="mb-4 grid grid-cols-4 gap-2 text-left">
            Title:
            <input
              required
              placeholder="Title"
              value={form.title || ""}
              onChange={(e) =>
                setForm((f) => ({ ...f, title: e.target.value }))
              }
            />
             Date:
            <input
              required
              placeholder="Date"
              value={form.date || ""}
              onChange={(e) => setForm((f) => ({ ...f, date: e.target.value }))}
            />
            <br />
            Description:
            <input
              placeholder="Description"
              value={form.description || ""}
              onChange={(e) =>
                setForm((f) => ({ ...f, description: e.target.value }))
              }
            />
             Image:
            <input
              placeholder="Image"
              value={form.image || ""}
              onChange={(e) =>
                setForm((f) => ({ ...f, image: e.target.value }))
              }
            />
            <br />
            Capacity:
            <input
              placeholder="Capacity"
              value={form.capacity || 0}
              type="number"
              onChange={(e) =>
                setForm((f) => ({ ...f, capacity: e.target.value }))
              }
            />
             Registered:
            <input
              placeholder="Registered"
              value={form.registered || 0}
              type="number"
              onChange={(e) =>
                setForm((f) => ({ ...f, registered: e.target.value }))
              }
            />
            <br />
            Type:
            <input
              placeholder="Type"
              value={form.type || ""}
              onChange={(e) => setForm((f) => ({ ...f, type: e.target.value }))}
            />{" "}
             Tags:
            <input
              placeholder="Tags"
              value={form.tags || ""}
              onChange={(e) => setForm((f) => ({ ...f, tags: e.target.value }))}
            />
            <br />
            Location:
            <input
              placeholder="Location"
              value={form.location || ""}
              onChange={(e) =>
                setForm((f) => ({ ...f, location: e.target.value }))
              }
            />
             Featured:
            <input
              placeholder="Featured (0/1)"
              value={form.featured || ""}
              onChange={(e) =>
                setForm((f) => ({ ...f, featured: e.target.value }))
              }
            />
            <br />
            <button
              type="submit"
              className="bg-red-500 border-2 border-yellow-300 p-5"
            >
              {editId ? "Update" : "Create"}
            </button>
            {editId && (
              <button
                type="button"
                onClick={() => {
                  setForm({});
                  setEditId(null);
                }}
                className="bg-red-500 border-2 border-yellow-300 p-5"
              >
                Cancel
              </button>
            )}
          </form>
        </>
      );
    }
    if (tab === "gallery") {
      return (
        <>
          <table className="min-w-full border mb-4">
            <thead>
              <tr className="border-b-4 border-white">
                <th>Title</th>
                <th>Date</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {items.map((g) => (
                <tr key={g._id} className="border-b-2 border-white">
                  <td>{g.title}</td>
                  <td>{g.date}</td>
                  <td>
                    <button
                      onClick={() => {
                        setForm(g);
                        setEditId(g.id);
                      }}
                    >
                      Edit
                    </button>
                    <button onClick={() => handleDelete(g.id)}>Delete</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <form onSubmit={handleSave} className="mb-4 grid grid-cols-4 gap-2">
            Title:
            <input
              required
              placeholder="Title"
              value={form.title || ""}
              onChange={(e) =>
                setForm((f) => ({ ...f, title: e.target.value }))
              }
            />
            Date:
            <input
              required
              placeholder="Date"
              value={form.date || ""}
              onChange={(e) => setForm((f) => ({ ...f, date: e.target.value }))}
            />
            Description:
            <input
              placeholder="Description"
              value={form.description || ""}
              onChange={(e) =>
                setForm((f) => ({ ...f, description: e.target.value }))
              }
            />
            Image:
            <input
              placeholder="Image"
              value={form.image || ""}
              onChange={(e) =>
                setForm((f) => ({ ...f, image: e.target.value }))
              }
            />
            Category:
            <input
              placeholder="Category"
              value={form.category || ""}
              onChange={(e) =>
                setForm((f) => ({ ...f, image: e.target.value }))
              }
            />
            Tags:
            <input
              placeholder="Tags"
              value={form.tags || ""}
              onChange={(e) =>
                setForm((f) => ({ ...f, image: e.target.value }))
              }
            />
            <button type="submit">{editId ? "Update" : "Create"}</button>
            {editId && (
              <button
                type="button"
                onClick={() => {
                  setForm({});
                  setEditId(null);
                }}
              >
                Cancel
              </button>
            )}
          </form>
        </>
      );
    }
    if (tab === "leaderboard") {
      return (
        <>
          <table className="min-w-full border mb-4">
            <thead>
              <tr className="border-b-4 border-white">
                <th>Name</th>
                <th>Score</th>
                <th>Rank</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {items.map((l, index) => (
                <tr key={l.id} className="border-b-2 border-white">
                  <td>{l.name}</td>
                  <td>{l.score}</td>
                  <td>{index+1}</td>
                  <td>
                    <button
                      onClick={() => {
                        setForm(l);
                        setEditId(l.id);
                      }}
                    >
                      Edit
                    </button>
                    <button onClick={() => handleDelete(l.id)}>Delete</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <form onSubmit={handleSave} className="mb-4 grid grid-cols-4 gap-2">
            Name:
            <input
              required
              placeholder="Name"
              value={form.name || ""}
              onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
            />
            Score:
            <input
              required
              placeholder="Score"
              value={form.score || ""}
              onChange={(e) =>
                setForm((f) => ({ ...f, score: e.target.value }))
              }
            />
            Department:
            <input
              placeholder="Department"
              value={form.department || ""}
              onChange={(e) =>
                setForm((f) => ({ ...f, department: e.target.value }))
              }
            />
            <button type="submit">{editId ? "Update" : "Create"}</button>
            {editId && (
              <button
                type="button"
                onClick={() => {
                  setForm({});
                  setEditId(null);
                }}
              >
                Cancel
              </button>
            )}
          </form>
        </>
      );
    }
    if (tab === "blog") {
      return (
        <>
          <table className="min-w-full border mb-4">
            <thead>
              <tr className="border-b-4 border-white">
                <th>Title</th>
                <th>Author</th>
                <th>Date</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {items.map((b) => (
                <tr key={b.id} className="border-b-2 border-white">
                  <td>{b.title}</td>
                  <td>{b.author}</td>
                  <td>{b.date}</td>
                  <td>
                    <button
                      onClick={() => {
                        setForm(b);
                        setEditId(b.id);
                      }}
                    >
                      Edit
                    </button>
                    <button onClick={() => handleDelete(b.id)}>Delete</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <form onSubmit={handleSave} className="mb-4 grid grid-cols-4 gap-2">
            Title:
            <input
              required
              placeholder="Title"
              value={form.title || ""}
              onChange={(e) =>
                setForm((f) => ({ ...f, title: e.target.value }))
              }
            />
            Author:
            <input
              required
              placeholder="Author"
              value={form.author || ""}
              onChange={(e) =>
                setForm((f) => ({ ...f, author: e.target.value }))
              }
            />
            Date:
            <input
              required
              placeholder="Date"
              value={form.date || ""}
              onChange={(e) => setForm((f) => ({ ...f, date: e.target.value }))}
            />
            Body:
            <input
              placeholder="Body"
              value={form.body || ""}
              onChange={(e) => setForm((f) => ({ ...f, body: e.target.value }))}
            />
            Tags:
            <input
              placeholder="Tags"
              value={form.tags || ""}
              onChange={(e) => setForm((f) => ({ ...f, tags: e.target.value }))}
            />
            Image:
            <input
              placeholder="Image"
              value={form.image || ""}
              onChange={(e) =>
                setForm((f) => ({ ...f, image: e.target.value }))
              }
            />
            <button type="submit">{editId ? "Update" : "Create"}</button>
            {editId && (
              <button
                type="button"
                onClick={() => {
                  setForm({});
                  setEditId(null);
                }}
              >
                Cancel
              </button>
            )}
          </form>
        </>
      );
    }
    return null;
  };

  useEffect(() => {
    if (!token && usernameRef.current) {
      usernameRef.current.focus();
    }
  }, [token]);

  if (!token) {
    return (
      <div className="max-w-md mx-auto mt-20 p-6 border rounded shadow-lg bg-white">
        <h2 className="text-2xl mb-4">Admin Login</h2>
        <form onSubmit={handleLogin}>
          <input
            ref={usernameRef}
            required
            placeholder="Username"
            value={login.username}
            onChange={(e) =>
              setLogin((l) => ({ ...l, username: e.target.value }))
            }
            className="block mb-2 w-full border px-2 py-2 rounded"
          />
          <input
            required
            type="password"
            placeholder="Password"
            value={login.password}
            onChange={(e) =>
              setLogin((l) => ({ ...l, password: e.target.value }))
            }
            className="block mb-2 w-full border px-2 py-2 rounded"
          />
          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-2 rounded font-semibold hover:bg-blue-700 transition"
          >
            {loading ? "Logging in..." : "Login"}
          </button>
        </form>
        {error && (
          <div className="text-red-500 mt-2 font-semibold">{error}</div>
        )}
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto mt-10 p-6 border rounded shadow bg-black admin">
      <h2 className="text-2xl mb-4">Admin Content Management</h2>
      <div className="mb-4 flex gap-2">
        {["events", "gallery", "leaderboard", "blog"].map((t) => (
          <button
            key={t}
            onClick={() => {
              setTab(t);
              setForm({});
              setEditId(null);
            }}
            className={tab === t ? "font-bold underline text-blue-700" : ""}
          >
            {t.charAt(0).toUpperCase() + t.slice(1)}
          </button>
        ))}
        <button
          onClick={handleLogout}
          className="ml-auto text-red-600 font-semibold"
        >
          Logout
        </button>
      </div>
      {loading && <div>Loading...</div>}
      {error && <div className="text-red-500 mb-2 font-semibold">{error}</div>}
      {renderTable()}
    </div>
  );
}

export default Admins;
