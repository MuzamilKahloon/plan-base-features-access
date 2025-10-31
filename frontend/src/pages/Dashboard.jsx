// frontend/src/pages/Dashboard.jsx
import { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import { Link, useNavigate } from "react-router-dom";
import API from "../services/api";

// REAL FEATURES (NOT JUST LABELS)
const realFeatures = [
  // BASIC: 3 features
  { id: 1, name: "Text Processor", plan: "basic", component: "TextProcessor" },
  { id: 2, name: "Counter", plan: "basic", component: "Counter" },
  { id: 3, name: "Task Manager", plan: "basic", component: "TaskManager" },

  // NORMAL: +1 new feature
  { id: 4, name: "Word Counter", plan: "normal", component: "WordCounter" },

  // PRO: +1 pro-only feature
  { id: 5, name: "QR Code Generator", plan: "pro", component: "QRCodeGenerator" },
];

const planLimits = {
  free: 0,
  basic: 3,
  normal: 4,
  pro: 5,
};

const Dashboard = () => {
  const { user, setUser } = useAuth();
  const [plan, setPlan] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  // State for each feature
  const [inputText, setInputText] = useState("");
  const [outputText, setOutputText] = useState("");
  const [counter, setCounter] = useState(0);
  const [tasks, setTasks] = useState([]);
  const [newTask, setNewTask] = useState("");
  const [wordInput, setWordInput] = useState("");
  const [qrText, setQrText] = useState("");
  const [qrImage, setQrImage] = useState("");

  useEffect(() => {
    const fetchPlan = async () => {
      try {
        const res = await API.get("/payment/plan");
        setPlan(res.data);
        setUser(prev => ({ ...prev, ...res.data }));
      } catch (err) {
        console.error("Failed to fetch plan", err);
      } finally {
        setLoading(false);
      }
    };
    if (user) fetchPlan();
  }, [user, setUser]);

  if (loading) return <div className="text-center mt-20 text-xl">Loading...</div>;
  if (!user) return <div className="text-center mt-20 text-xl">Not authenticated</div>;

  const currentPlan = plan?.currentPlan || "free";
  const allowedCount = planLimits[currentPlan];
  const allowedFeatures = realFeatures.slice(0, allowedCount);

  // Handlers
  const handleOutput = () => setOutputText(inputText);
  const handleCounter = () => setCounter(prev => prev + 1);
  const handleAddTask = (e) => {
    e.preventDefault();
    if (newTask.trim()) {
      setTasks([...tasks, { id: Date.now(), text: newTask, done: false }]);
      setNewTask("");
    }
  };
  const handleToggleTask = (id) => {
    setTasks(tasks.map(t => t.id === id ? { ...t, done: !t.done } : t));
  };
  const generateQR = async () => {
    if (!qrText.trim()) return;
    try {
      const res = await fetch(`https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(qrText)}`);
      setQrImage(res.url);
    } catch (err) {
      alert("Failed to generate QR code");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto">

        {/* HEADER */}
        <div className="bg-white rounded-2xl shadow-xl p-6 mb-8 border border-indigo-100">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div>
              <h1 className="text-3xl font-extrabold text-gray-900">Welcome, {user.username}!</h1>
              <p className="text-lg text-gray-600 mt-1">
                Plan: <span className="font-bold text-indigo-600">{currentPlan.toUpperCase()}</span>
                {plan?.planExpiry && (
                  <span className="ml-2 text-sm text-gray-500">
                    (Expires: {new Date(plan.planExpiry).toLocaleDateString()})
                  </span>
                )}
              </p>
            </div>
            {currentPlan === "free" && (
              <Link to="/payment">
                <button className="bg-gradient-to-r from-indigo-600 to-purple-700 text-white px-8 py-3 rounded-xl font-semibold hover:shadow-lg transition-all transform hover:scale-105">
                  Upgrade Now
                </button>
              </Link>
            )}
          </div>
        </div>

        {/* REAL FEATURES GRID */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          {allowedFeatures.map(feature => (
            <div key={feature.id} className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100 hover:shadow-xl transition-shadow">
              <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center">
                <span className="text-green-600 mr-2">Active</span> {feature.name}
              </h3>

              {/* TEXT PROCESSOR */}
              {feature.component === "TextProcessor" && (
                <div>
                  <input
                    type="text"
                    value={inputText}
                    onChange={(e) => setInputText(e.target.value)}
                    placeholder="Type anything..."
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                  />
                  <button
                    onClick={handleOutput}
                    className="mt-3 w-full bg-indigo-600 text-white py-2 rounded-lg hover:bg-indigo-700 transition"
                  >
                    Show Output
                  </button>
                  {outputText && (
                    <div className="mt-4 p-4 bg-indigo-50 border border-indigo-200 rounded-lg">
                      <p className="font-medium text-indigo-800">Output: {outputText}</p>
                    </div>
                  )}
                </div>
              )}

              {/* COUNTER */}
              {feature.component === "Counter" && (
                <div className="text-center">
                  <p className="text-5xl font-extrabold text-indigo-600 mb-4">{counter}</p>
                  <button
                    onClick={handleCounter}
                    className="bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 transition font-semibold"
                  >
                    +1 Click Me
                  </button>
                </div>
              )}

              {/* TASK MANAGER */}
              {feature.component === "TaskManager" && (
                <div>
                  <form onSubmit={handleAddTask} className="flex gap-2 mb-3">
                    <input
                      type="text"
                      value={newTask}
                      onChange={(e) => setNewTask(e.target.value)}
                      placeholder="New task..."
                      className="flex-1 p-2 border border-gray-300 rounded-lg text-sm"
                    />
                    <button type="submit" className="bg-indigo-600 text-white px-4 py-2 rounded-lg text-sm hover:bg-indigo-700">
                      Add
                    </button>
                  </form>
                  {tasks.length === 0 ? (
                    <p className="text-gray-500 text-sm">No tasks yet.</p>
                  ) : (
                    <ul className="space-y-2 max-h-40 overflow-y-auto">
                      {tasks.map(task => (
                        <li key={task.id} className="flex items-center p-2 bg-gray-50 rounded-lg text-sm">
                          <input
                            type="checkbox"
                            checked={task.done}
                            onChange={() => handleToggleTask(task.id)}
                            className="mr-2 h-4 w-4 text-indigo-600"
                          />
                          <span className={task.done ? "line-through text-gray-500" : "text-gray-700"}>
                            {task.text}
                          </span>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              )}

              {/* WORD COUNTER (Normal) */}
              {feature.component === "WordCounter" && (
                <div>
                  <textarea
                    value={wordInput}
                    onChange={(e) => setWordInput(e.target.value)}
                    placeholder="Paste text to count words..."
                    className="w-full p-3 border border-gray-300 rounded-lg h-24 resize-none focus:ring-2 focus:ring-indigo-500"
                  />
                  <div className="mt-3 p-3 bg-purple-50 border border-purple-200 rounded-lg">
                    <p className="font-semibold text-purple-800">
                      Words: <span className="text-xl">{wordInput.trim() ? wordInput.trim().split(/\s+/).length : 0}</span>
                    </p>
                  </div>
                </div>
              )}

              {/* QR CODE GENERATOR (Pro) */}
              {feature.component === "QRCodeGenerator" && (
                <div>
                  <input
                    type="text"
                    value={qrText}
                    onChange={(e) => setQrText(e.target.value)}
                    placeholder="Enter URL or text..."
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
                  />
                  <button
                    onClick={generateQR}
                    className="mt-3 w-full bg-gradient-to-r from-purple-600 to-pink-600 text-white py-2 rounded-lg hover:from-purple-700 hover:to-pink-700 transition font-semibold"
                  >
                    Generate QR
                  </button>
                  {qrImage && (
                    <div className="mt-4 text-center">
                      <img src={qrImage} alt="QR Code" className="inline-block rounded-lg shadow-md" />
                      <p className="text-xs text-gray-500 mt-2">Scan with camera</p>
                    </div>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>

        {/* UPGRADE PROMPT */}
        {currentPlan !== "pro" && (
          <div className="bg-gradient-to-r from-indigo-600 to-purple-700 text-white rounded-2xl p-6 text-center shadow-xl">
            <p className="text-lg font-semibold">
              Unlock {realFeatures.length - allowedCount} more powerful features!
            </p>
            <p className="text-sm mt-1 opacity-90">
              Upgrade to <strong>{currentPlan === "free" ? "Basic" : currentPlan === "basic" ? "Normal" : "Pro"}</strong> plan
            </p>
            <Link to="/payment">
              <button className="mt-4 bg-white text-indigo-700 px-8 py-3 rounded-xl font-bold hover:bg-gray-100 transition transform hover:scale-105">
                View Plans
              </button>
            </Link>
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;