import React, { useState } from 'react';
import './LessonList.css';

function LessonList({ lessons, onAddToSchedule, onEditLesson, onDeleteLesson, searchQuery, categoryFilter }) {
  const [editingId, setEditingId] = useState(null);
  const [editName, setEditName] = useState('');
  const [editDuration, setEditDuration] = useState(60);
  const [editCategory, setEditCategory] = useState('');

  const filteredLessons = lessons.filter(lesson => {
    const matchesSearch = lesson.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = categoryFilter === 'all' || lesson.category === categoryFilter;
    return matchesSearch && matchesCategory;
  });

  const handleEdit = (lesson) => {
    setEditingId(lesson.id);
    setEditName(lesson.name);
    setEditDuration(lesson.duration);
    setEditCategory(lesson.category);
  };

  const handleSaveEdit = (id) => {
    if (editName.trim()) {
      onEditLesson(id, editName, editDuration, editCategory);
    }
    setEditingId(null);
  };

  const handleCancelEdit = () => {
    setEditingId(null);
  };

  return (
    <div className="lesson-list">
      <h2>Список занятий</h2>
      <div className="lessons-container">
        {filteredLessons.map(lesson => (
          <div key={lesson.id} className="lesson-card" style={{ borderLeftColor: lesson.color }}>
            {editingId === lesson.id ? (
              <div className="lesson-edit-form">
                <input
                  type="text"
                  value={editName}
                  onChange={(e) => setEditName(e.target.value)}
                  placeholder="Название"
                  autoFocus
                />
                <select
                  value={editCategory}
                  onChange={(e) => setEditCategory(e.target.value)}
                >
                  <option value="Основные">Основные</option>
                  <option value="Языки">Языки</option>
                  <option value="IT">IT</option>
                  <option value="Гуманитарные">Гуманитарные</option>
                </select>
                <select
                  value={editDuration}
                  onChange={(e) => setEditDuration(Number(e.target.value))}
                >
                  <option value={30}>30 мин</option>
                  <option value={45}>45 мин</option>
                  <option value={60}>60 мин</option>
                  <option value={90}>90 мин</option>
                  <option value={120}>120 мин</option>
                </select>
                <div className="edit-buttons">
                  <button onClick={() => handleSaveEdit(lesson.id)} className="save-btn">✓</button>
                  <button onClick={handleCancelEdit} className="cancel-btn">✗</button>
                </div>
              </div>
            ) : (
              <>
                <div className="lesson-info">
                  <h3>{lesson.name}</h3>
                  <p className="category">{lesson.category}</p>
                  <p className="duration">{lesson.duration} мин</p>
                </div>
                <div className="lesson-actions">
                  <button onClick={() => handleEdit(lesson)} className="edit-btn">✎</button>
                  <button onClick={() => onDeleteLesson(lesson.id)} className="delete-btn">🗑</button>
                  <button onClick={() => onAddToSchedule(lesson)} className="add-btn">+</button>
                </div>
              </>
            )}
          </div>
        ))}
      </div>
      {filteredLessons.length === 0 && (
        <p className="no-lessons">Нет занятий по заданным критериям</p>
      )}
    </div>
  );
}

export default LessonList;