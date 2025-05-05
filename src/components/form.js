// form.js
import React from 'react';

// ProjectSelect component for autosuggest functionality
const ProjectSelect = ({ value, onChange, projects }) => {
    const [showSuggestions, setShowSuggestions] = React.useState(false);
    const [filteredProjects, setFilteredProjects] = React.useState(projects);
    
    const handleInputChange = (e) => {
      const inputValue = e.target.value;
      onChange(inputValue);
      
      // Filter projects based on input
      if (inputValue) {
        const filtered = projects.filter(project =>
          project.toLowerCase().includes(inputValue.toLowerCase())
        );
        setFilteredProjects(filtered);
      } else {
        setFilteredProjects(projects);
      }
    };
    
    const handleProjectSelect = (project) => {
      onChange(project);
      setShowSuggestions(false);
    };
    
    return (
      <div style={{ position: 'relative' }}>
        <input 
          type="text"
          className="input"
          value={value}
          placeholder="Project name"
          onChange={handleInputChange}
          onFocus={() => setShowSuggestions(true)}
          onBlur={() => setTimeout(() => setShowSuggestions(false), 200)}
        />
        {showSuggestions && filteredProjects.length > 0 && (
          <div className="project-suggestions">
            {filteredProjects.map((project, index) => (
              <div 
                key={index}
                className="project-suggestion-item"
                onClick={() => handleProjectSelect(project)}
              >
                {project}
              </div>
            ))}
          </div>
        )}
      </div>
    );
};

function Form({ todos, setTodos, projects }) {
  // Form state
  const [text, setText] = React.useState('');
  const [project, setProject] = React.useState('');
  const [scheduledFor, setScheduledFor] = React.useState('');
  const [notes, setNotes] = React.useState('');

  // Add the helper function here
  const formatDateForStorage = (dateString) => {
    if (!dateString) return null;
    // Simply return the date string as-is from the input
    // The HTML date input gives us YYYY-MM-DD which is what we want to store
    return dateString;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Check if at least the text field has a value
    if (!text.trim()) return;
    
    // Create today's date in YYYY-MM-DD format
    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, '0');
    const day = String(today.getDate()).padStart(2, '0');
    
    // Create new todo with all fields
    const newTodo = {
      id: Date.now(), // Simple unique ID
      text: text,
      project: project || 'Unassigned',
      dateAdded: `${year}-${month}-${day}`, // Use the formatted date
      scheduledFor: scheduledFor || null, // This already comes as YYYY-MM-DD from input
      dateCompleted: null,
      isCompleted: false,
      notes: notes || ''
    };
    
    // Add new todo to the list
    const newTodos = [...todos, newTodo];
    setTodos(newTodos);
    
    // Clear the form
    setText('');
    setProject('');
    setScheduledFor('');
    setNotes('');
  };
  
  return (
    <form onSubmit={handleSubmit} className="todo-form">        
      <div className="form-group">
        <label>Action Item</label>
        <input 
          type="text"
          className="input"
          value={text}
          placeholder="What needs to be done?"
          onChange={e => setText(e.target.value)}
          required
        />
      </div>

      <div className="form-group">
        <label>Project</label>
        <ProjectSelect 
          value={project}
          onChange={setProject}
          projects={projects}
        />
      </div>

      <div className="form-group">
        <label>Scheduled for</label>
        <input 
          type="date"
          className="input"
          value={scheduledFor}
          onChange={e => setScheduledFor(e.target.value)}
        />
      </div>

      <div className="form-group">
        <label>Notes</label>
        <textarea 
          className="input"
          value={notes}
          placeholder="Additional notes..."
          onChange={e => setNotes(e.target.value)}
        />
      </div>

      <button type="submit" className="submit-button">
        Add Action Item
      </button>
    </form>
  );
}

// Export Form as default
export default Form;
export { ProjectSelect };