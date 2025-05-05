import './App.css';
import React from 'react';
import dataManager from './utils/dataManager';
import Form, { ProjectSelect } from './components/form';

function App(){
  const [todos, setTodos] = React.useState(() => {
    const savedTodos = dataManager.loadTodos();
    if (savedTodos) {
      return savedTodos;
    }
    // Default initial data if no saved data exists
    return [
      {
        id: 1,
        text: 'Have some coffee and read the news',
        project: 'Morning routine',
        dateAdded: '2025-05-05',
        scheduledFor: '2025-05-05',
        dateCompleted: null,
        isCompleted: false,
        notes: 'Accompany coffee with a healthy breakfast'
      },
      {
        id: 2,
        text: 'Complete this part of the important work project',
        project: 'Important work project',
        dateAdded: '2025-05-05',
        scheduledFor: '2025-05-05',
        dateCompleted: null,
        isCompleted: false,
        notes: 'Keep these dependencies in mind while completing this part: dependency 1 and dependency 2'
      },
      {
        id: 3,
        text: 'Exercise',
        project: 'Healthy body and mind',
        dateAdded: '2025-05-05',
        scheduledFor: '2025-05-05',
        dateCompleted: null,
        isCompleted: false,
        notes: 'Exercise for today is a boxing class'
      }
    ];
  });

  // Save todos to localStorage whenever they change
  React.useEffect(() => {
    dataManager.saveTodos(todos);
  }, [todos]);

  // Import/Export state
  const [importError, setImportError] = React.useState('');
  
  // Search and filter state
  const [searchTerm, setSearchTerm] = React.useState('');
  const [projectFilter, setProjectFilter] = React.useState('');
  
  // Get unique project names from all todos
  const getUniqueProjects = () => {
    const projects = todos
      .map(todo => todo.project)
      .filter(project => project && project !== 'Unassigned');
    return [...new Set(projects)].sort();
  };

  // Filter todos based on search and project filter
  const filterTodos = (todosToFilter) => {
    return todosToFilter.filter(todo => {
      const matchesSearch = searchTerm === '' || 
        todo.text.toLowerCase().includes(searchTerm.toLowerCase()) ||
        todo.notes.toLowerCase().includes(searchTerm.toLowerCase()) ||
        todo.project.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesProject = projectFilter === '' || 
        todo.project === projectFilter;
      
      return matchesSearch && matchesProject;
    });
  };

  // In App.js, update the formatDate function:
  const formatDate = (dateString) => {
    if (!dateString) return '';
    
    // Parse the date string components to avoid timezone issues
    const [year, month, day] = dateString.split('-').map(num => parseInt(num, 10));
    
    // Create date using local timezone
    const date = new Date(year, month - 1, day);
    
    const options = { 
      weekday: 'long', 
      year: 'numeric', 
      month: 'long', 
      day: '2-digit',
      timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone // Use local timezone
    };
    
    return date.toLocaleDateString('en-US', options);
  };

  // Separate and sort todos by categories
  const scheduledTodos = filterTodos(
    todos.filter(todo => !todo.isCompleted && todo.scheduledFor)
  ).sort((a, b) => new Date(a.scheduledFor) - new Date(b.scheduledFor));
  
  const notScheduledTodos = filterTodos(
    todos.filter(todo => !todo.isCompleted && !todo.scheduledFor)
  ).sort((a, b) => new Date(b.dateAdded) - new Date(a.dateAdded));
  
  const completedTodos = filterTodos(
    todos.filter(todo => todo.isCompleted)
  ).sort((a, b) => new Date(b.dateCompleted) - new Date(a.dateCompleted));

  // Edit state
  const [editingId, setEditingId] = React.useState(null);
  const [editText, setEditText] = React.useState('');
  const [editProject, setEditProject] = React.useState('');
  const [editScheduledFor, setEditScheduledFor] = React.useState('');
  const [editNotes, setEditNotes] = React.useState('');

  // Handler for deleting a todo from Scheduled/Not Scheduled
  const removeTodo = (id) => {
    const updatedTodos = todos.filter(todo => todo.id !== id);
    setTodos(updatedTodos);
  };

  // Handler for completing a todo
  const completeTodo = (id) => {
    const updatedTodos = todos.map(todo => {
      if (todo.id === id) {
        const today = new Date();
        const year = today.getFullYear();
        const month = String(today.getMonth() + 1).padStart(2, '0');
        const day = String(today.getDate()).padStart(2, '0');
        
        return {
          ...todo,
          isCompleted: true,
          dateCompleted: `${year}-${month}-${day}`
        };
      }
      return todo;
    });
    setTodos(updatedTodos);
  };

  // Handler for restoring a completed todo back to active
  const restoreTodo = (id) => {
    const updatedTodos = todos.map(todo => {
      if (todo.id === id) {
        return {
          ...todo,
          isCompleted: false,
          dateCompleted: null
        };
      }
      return todo;
    });
    setTodos(updatedTodos);
  };

  // Handler for clearing a todo from the completed list
  const clearTodo = (id) => {
    const updatedTodos = todos.filter(todo => todo.id !== id);
    setTodos(updatedTodos);
  };

  // Handler for starting edit mode
  const startEdit = (todo) => {
    setEditingId(todo.id);
    setEditText(todo.text);
    setEditProject(todo.project);
    setEditScheduledFor(todo.scheduledFor || '');
    setEditNotes(todo.notes);
  };

  // Handler for canceling edit
  const cancelEdit = () => {
    setEditingId(null);
    setEditText('');
    setEditProject('');
    setEditScheduledFor('');
    setEditNotes('');
  };

  // Handler for saving edit
  const saveEdit = (id) => {
    const updatedTodos = todos.map(todo => {
      if (todo.id === id) {
        return {
          ...todo,
          text: editText,
          project: editProject,
          scheduledFor: editScheduledFor || null,
          notes: editNotes
        };
      }
      return todo;
    });
    setTodos(updatedTodos);
    cancelEdit();
  };

  // Handler for exporting todos
  const handleExportCSV = () => {
    dataManager.exportToCSV(todos);
  };

  const handleExportJSON = () => {
    dataManager.exportToJSON(todos);
  };

  // Handler for importing todos
  const handleImport = (event, type) => {
    const file = event.target.files[0];
    if (!file) return;

    const importFunction = type === 'csv' ? dataManager.importFromCSV : dataManager.importFromJSON;
    
    importFunction(file, 
      (importedTodos) => {
        setTodos(importedTodos);
        setImportError('');
        // Reset the file input
        event.target.value = '';
      },
      (error) => {
        setImportError(`Failed to import: ${error.message}`);
        event.target.value = '';
      }
    );
  };

  return (
    <div className="container">
      <div className="header-box">
        <h1>Action Item List</h1>
        {/* Import/Export Controls */}
        <div className="data-controls">
          <div className="export-buttons">
            <button onClick={handleExportCSV} className="export-button">
              Export to CSV
            </button>
            <button onClick={handleExportJSON} className="export-button">
              Export to JSON
            </button>
          </div>
          
          <div className="import-controls">
            <label className="import-button">
              Import CSV
              <input 
                type="file" 
                accept=".csv" 
                onChange={(e) => handleImport(e, 'csv')}
                style={{ display: 'none' }}
              />
            </label>
            <label className="import-button">
              Import JSON
              <input 
                type="file" 
                accept=".json" 
                onChange={(e) => handleImport(e, 'json')}
                style={{ display: 'none' }}
              />
            </label>
          </div>
          
          {importError && <div className="import-error">{importError}</div>}
        </div>
      </div>
      
      <div className="form-container">
        <h2>Add New Action Item</h2>
        <Form todos={todos} setTodos={setTodos} projects={getUniqueProjects()} />
      </div>

      <div className="todo-list">
        <h2>Action Items</h2>
        <div className="filter-controls">
          <div className="search-box">
            <input 
              type="text"
              className="input search-input"
              placeholder="Search action items and notes..."
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
            />
          </div>
          <div className="filter-box">
            <select 
              className="input project-filter"
              value={projectFilter}
              onChange={e => setProjectFilter(e.target.value)}
            >
              <option value="">All Projects</option>
              {getUniqueProjects().map((project, index) => (
                <option key={index} value={project}>
                  {project}
                </option>
              ))}
            </select>
          </div>
        </div>
        <h3>Scheduled</h3>
        {scheduledTodos.length > 0 ? (
          scheduledTodos.map((todo) => (
            <div className="todo" key={todo.id}>
              {editingId === todo.id ? (
                // Edit form
                <div className="edit-form">
                  <div className="form-group">
                    <label>Action Item</label>
                    <input 
                      type="text"
                      className="input"
                      value={editText}
                      onChange={e => setEditText(e.target.value)}
                    />
                  </div>
                  <div className="form-group">
                    <label>Project</label>
                    <ProjectSelect 
                      value={editProject}
                      onChange={setEditProject}
                      projects={getUniqueProjects()}
                    />
                  </div>
                  <div className="form-group">
                    <label>Scheduled for</label>
                    <input 
                      type="date"
                      className="input"
                      value={editScheduledFor}
                      onChange={e => setEditScheduledFor(e.target.value)}
                    />
                  </div>
                  <div className="form-group">
                    <label>Notes</label>
                    <textarea 
                      className="input"
                      value={editNotes}
                      onChange={e => setEditNotes(e.target.value)}
                    />
                  </div>
                  <div className="todo-actions">
                    <button 
                      onClick={() => saveEdit(todo.id)}
                      className="save-button"
                    >
                      Save
                    </button>
                    <button 
                      onClick={cancelEdit}
                      className="cancel-button"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              ) : (
                // View mode
                <>
                  <div><strong>{todo.text}</strong></div>
                  <div>Project: {todo.project}</div>
                  <div>Added: {formatDate(todo.dateAdded)}</div>
                  {todo.scheduledFor && <div>Scheduled: {formatDate(todo.scheduledFor)}</div>}
                  {todo.notes && <div>Notes: {todo.notes}</div>}
                  <div className="todo-actions">
                    <button 
                      onClick={() => removeTodo(todo.id)}
                      className="delete-button"
                    >
                      Delete
                    </button>
                    <button 
                      onClick={() => startEdit(todo)}
                      className="edit-button"
                    >
                      Edit
                    </button>
                    <button 
                      onClick={() => completeTodo(todo.id)}
                      className="complete-button"
                    >
                      Complete
                    </button>
                  </div>
                </>
              )}
            </div>
          ))
        ) : (
          <p>No scheduled action items.</p>
        )}
        
        <h3>Not Scheduled</h3>
        {notScheduledTodos.length > 0 ? (
          notScheduledTodos.map((todo) => (
            <div className="todo" key={todo.id}>
              {editingId === todo.id ? (
                // Edit form
                <div className="edit-form">
                  <div className="form-group">
                    <label>Action Item</label>
                    <input 
                      type="text"
                      className="input"
                      value={editText}
                      onChange={e => setEditText(e.target.value)}
                    />
                  </div>
                  <div className="form-group">
                    <label>Project</label>
                    <ProjectSelect 
                      value={editProject}
                      onChange={setEditProject}
                      projects={getUniqueProjects()}
                    />
                  </div>
                  <div className="form-group">
                    <label>Scheduled for</label>
                    <input 
                      type="date"
                      className="input"
                      value={editScheduledFor}
                      onChange={e => setEditScheduledFor(e.target.value)}
                    />
                  </div>
                  <div className="form-group">
                    <label>Notes</label>
                    <textarea 
                      className="input"
                      value={editNotes}
                      onChange={e => setEditNotes(e.target.value)}
                    />
                  </div>
                  <div className="todo-actions">
                    <button 
                      onClick={() => saveEdit(todo.id)}
                      className="save-button"
                    >
                      Save
                    </button>
                    <button 
                      onClick={cancelEdit}
                      className="cancel-button"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              ) : (
                // View mode
                <>
                  <div><strong>{todo.text}</strong></div>
                  <div>Project: {todo.project}</div>
                  <div>Added: {formatDate(todo.dateAdded)}</div>
                  {todo.scheduledFor && <div>Scheduled: {formatDate(todo.scheduledFor)}</div>}
                  {todo.notes && <div>Notes: {todo.notes}</div>}
                  <div className="todo-actions">
                    <button 
                      onClick={() => removeTodo(todo.id)}
                      className="delete-button"
                    >
                      Delete
                    </button>
                    <button 
                      onClick={() => startEdit(todo)}
                      className="edit-button"
                    >
                      Edit
                    </button>
                    <button 
                      onClick={() => completeTodo(todo.id)}
                      className="complete-button"
                    >
                      Complete
                    </button>
                  </div>
                </>
              )}
            </div>
          ))
        ) : (
          <p>No unscheduled action items.</p>
        )}
        
        <h3>Completed</h3>
        {completedTodos.length > 0 ? (
          completedTodos.map((todo) => (
            <div className="todo completed" key={todo.id}>
              <div><strong>{todo.text}</strong></div>
              <div>Project: {todo.project}</div>
              <div>Added: {formatDate(todo.dateAdded)}</div>
              {todo.scheduledFor && <div>Scheduled: {formatDate(todo.scheduledFor)}</div>}
              {todo.dateCompleted && <div>Completed: {formatDate(todo.dateCompleted)}</div>}
              {todo.notes && <div>Notes: {todo.notes}</div>}
              <div className="todo-actions">
                <button 
                  onClick={() => restoreTodo(todo.id)}
                  className="restore-button"
                >
                  Restore
                </button>
                <button 
                  onClick={() => removeTodo(todo.id)}
                  className="clear-button"
                >
                  Clear
                </button>
              </div>
            </div>
          ))
        ) : (
          <p>No completed items yet.</p>
        )}
      </div>
    </div>
  );
}

export default App;