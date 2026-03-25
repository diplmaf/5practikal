import React, { useState, useEffect } from 'react';
import LessonList from './components/LessonList';
import WeekGrid from './components/WeekGrid';
import Filters from './components/Filters';
import Statistics from './components/Statistics';
import { loadData, saveData } from './utils/storage';
import './App.css';

function App() {
  const [lessons, setLessons] = useState([]);
  const [schedule, setSchedule] = useState({});
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  
  useEffect(() => {
    const data = loadData();
    setLessons(data.lessons);
    setSchedule(data.schedule);
  }, []);
  
  useEffect(() => {
    if (lessons.length > 0 && Object.keys(schedule).length > 0) {
      saveData({ lessons, schedule });
    }
  }, [lessons, schedule]);
  
  const categories = ['Основные', 'Языки', 'IT', 'Гуманитарные'];
  
  const handleAddToSchedule = (lesson) => {
    const day = prompt('На какой день добавить? (Понедельник, Вторник, Среда, Четверг, Пятница, Суббота, Воскресенье)');
    if (day && schedule[day]) {
      const hasConflict = schedule[day].some(existing => existing.name === lesson.name);
      if (hasConflict) {
        alert('Ошибка: В этот день уже есть такое занятие!');
        return;
      }
      const newLesson = { ...lesson, id: Date.now() + Math.random() };
      setSchedule({
        ...schedule,
        [day]: [...schedule[day], newLesson]
      });
    } else if (day) {
      alert('Некорректное название дня');
    }
  };
  
  const handleEditLesson = (id, newName, newDuration, newCategory) => {
    setLessons(lessons.map(lesson => 
      lesson.id === id 
        ? { ...lesson, name: newName, duration: newDuration, category: newCategory }
        : lesson
    ));
  };
  
  const handleEditScheduleLesson = (day, lessonId, newName, newDuration) => {
    setSchedule({
      ...schedule,
      [day]: schedule[day].map(lesson => 
        lesson.id === lessonId 
          ? { ...lesson, name: newName, duration: newDuration }
          : lesson
      )
    });
  };
  
  const handleDeleteLesson = (id) => {
    if (confirm('Удалить это занятие из списка?')) {
      setLessons(lessons.filter(lesson => lesson.id !== id));
      const newSchedule = { ...schedule };
      Object.keys(newSchedule).forEach(day => {
        newSchedule[day] = newSchedule[day].filter(lesson => lesson.id !== id);
      });
      setSchedule(newSchedule);
    }
  };
  
  const handleDeleteScheduleLesson = (day, lessonId) => {
    if (confirm('Удалить это занятие из расписания?')) {
      setSchedule({
        ...schedule,
        [day]: schedule[day].filter(lesson => lesson.id !== lessonId)
      });
    }
  };
  
  const handleMoveLesson = (day, newLessons) => {
    setSchedule({
      ...schedule,
      [day]: newLessons
    });
  };

  return (
    <div className="app">
      <h1>📅 Конструктор расписания на неделю</h1>
      
      <Statistics schedule={schedule} />
      
      <Filters 
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        categoryFilter={categoryFilter}
        onCategoryChange={setCategoryFilter}
        categories={categories}
      />
      
      <div className="main-content">
        <LessonList 
          lessons={lessons}
          onAddToSchedule={handleAddToSchedule}
          onEditLesson={handleEditLesson}
          onDeleteLesson={handleDeleteLesson}
          searchQuery={searchQuery}
          categoryFilter={categoryFilter}
        />
        
        <WeekGrid 
          schedule={schedule}
          onEditLesson={handleEditScheduleLesson}
          onDeleteLesson={handleDeleteScheduleLesson}
          onMoveLesson={handleMoveLesson}
        />
      </div>
    </div>
  );
}

export default App;