// dataManager.js
const dataManager = {
    // Save todos to localStorage
    saveTodos: (todos) => {
      try {
        localStorage.setItem('actionItems', JSON.stringify(todos));
        return true;
      } catch (error) {
        console.error('Error saving to localStorage:', error);
        return false;
      }
    },
  
    // Load todos from localStorage
    loadTodos: () => {
      try {
        const savedTodos = localStorage.getItem('actionItems');
        return savedTodos ? JSON.parse(savedTodos) : null;
      } catch (error) {
        console.error('Error loading from localStorage:', error);
        return null;
      }
    },
  
    // Export todos to CSV
    exportToCSV: (todos) => {
      // Define CSV headers
      const headers = ['ID', 'Action Item', 'Project', 'Date Added', 'Scheduled For', 'Date Completed', 'Is Completed', 'Notes'];
      
      // Convert todos to CSV format
      const csvRows = todos.map(todo => [
        todo.id,
        `"${todo.text.replace(/"/g, '""')}"`, // Escape quotes in text
        `"${todo.project.replace(/"/g, '""')}"`,
        todo.dateAdded,
        todo.scheduledFor || '',
        todo.dateCompleted || '',
        todo.isCompleted,
        `"${todo.notes.replace(/"/g, '""')}"`
      ]);
      
      // Combine headers and rows
      const csvContent = [headers, ...csvRows]
        .map(row => row.join(','))
        .join('\n');
      
      // Create blob and download
      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
      const link = document.createElement('a');
      if (link.download !== undefined) {
        const url = URL.createObjectURL(blob);
        link.setAttribute('href', url);
        link.setAttribute('download', `action-items-${new Date().toISOString().split('T')[0]}.csv`);
        link.style.visibility = 'hidden';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      }
    },
  
    // Import todos from CSV
    importFromCSV: (file, onSuccess, onError) => {
      const reader = new FileReader();
      
      reader.onload = (event) => {
        try {
          const text = event.target.result;
          
          // Function to parse CSV line properly
          const parseCSVLine = (line) => {
            const result = [];
            let current = '';
            let inQuotes = false;
            
            for (let i = 0; i < line.length; i++) {
              const char = line[i];
              const nextChar = line[i + 1];
              
              if (char === '"') {
                if (inQuotes && nextChar === '"') {
                  // Double quotes within quoted text
                  current += '"';
                  i++; // Skip next quote
                } else {
                  // Start or end of quoted text
                  inQuotes = !inQuotes;
                }
              } else if (char === ',' && !inQuotes) {
                // End of field
                result.push(current);
                current = '';
              } else {
                current += char;
              }
            }
            // Don't forget the last field
            result.push(current);
            
            return result;
          };
          
          // Split by lines and parse each line
          const lines = text.trim().split(/\r?\n/);
          const headers = parseCSVLine(lines[0]);
          
          // Process data rows
          const importedTodos = [];
          for (let i = 1; i < lines.length; i++) {
            if (lines[i].trim()) {  // Skip empty lines
              const row = parseCSVLine(lines[i]);
              
              // Create todo object from parsed row
              const todo = {
                id: parseInt(row[0]) || Date.now() + Math.random(),
                text: row[1] || '',
                project: row[2] || '',
                dateAdded: row[3] || new Date().toISOString().split('T')[0],
                scheduledFor: row[4] || null,
                dateCompleted: row[5] || null,
                isCompleted: row[6] === 'true',
                notes: row[7] || ''
              };
              
              importedTodos.push(todo);
            }
          }
          
          onSuccess(importedTodos);
        } catch (error) {
          onError(error);
          console.error('CSV Import Error:', error);
        }
      };
      
      reader.onerror = () => {
        onError(new Error('Failed to read file'));
      };
      
      reader.readAsText(file);
    },  // This closing brace was missing!
  
    // Export todos to JSON (backup format)
    exportToJSON: (todos) => {
      const jsonContent = JSON.stringify(todos, null, 2);
      const blob = new Blob([jsonContent], { type: 'application/json' });
      const link = document.createElement('a');
      
      if (link.download !== undefined) {
        const url = URL.createObjectURL(blob);
        link.setAttribute('href', url);
        link.setAttribute('download', `action-items-${new Date().toISOString().split('T')[0]}.json`);
        link.style.visibility = 'hidden';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      }
    },
  
    // Import todos from JSON
    importFromJSON: (file, onSuccess, onError) => {
      const reader = new FileReader();
      
      reader.onload = (event) => {
        try {
          const todos = JSON.parse(event.target.result);
          // Validate that it's an array and has the expected structure
          if (Array.isArray(todos) && todos.every(todo => 
            typeof todo.id !== 'undefined' && 
            typeof todo.text === 'string' && 
            typeof todo.project === 'string'
          )) {
            onSuccess(todos);
          } else {
            throw new Error('Invalid file format');
          }
        } catch (error) {
          onError(error);
        }
      };
      
      reader.onerror = () => {
        onError(new Error('Failed to read file'));
      };
      
      reader.readAsText(file);
    }
  };
  
export default dataManager;