import React, { useState } from 'react';
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragOverlay,
  useDroppable,
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import './WeekGrid.css';

const SortableLesson = ({ lesson, day, onEdit, onDelete }) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: lesson.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  const [isEditing, setIsEditing] = useState(false);
  const [editName, setEditName] = useState(lesson.name);
  const [editDuration, setEditDuration] = useState(lesson.duration);

  const handleSaveEdit = () => {
    if (editName.trim()) {
      onEdit(day, lesson.id, editName, editDuration);
    }
    setIsEditing(false);
  };

  return (
    <div
      ref={setNodeRef}
      style={{ ...style, borderLeftColor: lesson.color }}
      className="schedule-lesson"
    >
      {isEditing ? (
        <div className="lesson-edit-inline">
          <input
            type="text"
            value={editName}
            onChange={(e) => setEditName(e.target.value)}
            autoFocus
          />
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
          <button onClick={handleSaveEdit} className="save-inline">✓</button>
          <button onClick={() => setIsEditing(false)} className="cancel-inline">✗</button>
        </div>
      ) : (
        <>
          <div className="lesson-drag-handle" {...attributes} {...listeners}>
            ⋮⋮
          </div>
          <div className="lesson-content">
            <span className="lesson-name">{lesson.name}</span>
            <span className="lesson-duration">{lesson.duration} мин</span>
          </div>
          <div className="lesson-controls">
            <button onClick={() => setIsEditing(true)} className="small-edit">✎</button>
            <button onClick={() => onDelete(day, lesson.id)} className="small-delete">🗑</button>
          </div>
        </>
      )}
    </div>
  );
};

const DroppableDay = ({ day, children, schedule }) => {
  const { setNodeRef, isOver } = useDroppable({
    id: "day-" + day,
    data: { day: day, type: 'day' }
  });

  const dayLessons = schedule[day] || [];
  const isEmpty = dayLessons.length === 0;

  return (
    <div 
      ref={setNodeRef} 
      className={"day-column " + (isOver ? 'drag-over' : '')}
    >
      <div className="day-title">{day}</div>
      <div className="day-lessons-list">
        {children}
        {isEmpty && (
          <div className="empty-day">Нет занятий</div>
        )}
      </div>
    </div>
  );
};
  const WeekGrid = ({ schedule, onEditLesson, onDeleteLesson, onMoveLesson }) => {
  const days = ['Понедельник', 'Вторник', 'Среда', 'Четверг', 'Пятница', 'Суббота', 'Воскресенье'];
  
  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const [activeId, setActiveId] = useState(null);
  const [activeLesson, setActiveLesson] = useState(null);
  const [activeDay, setActiveDay] = useState(null);
  const handleDragStart = (event) => {
    const { active } = event;
    setActiveId(active.id);
    
    for (const day of days) {
      const lessonsInDay = schedule[day] || [];
      const lesson = lessonsInDay.find(l => l.id === active.id);
      if (lesson) {
        setActiveLesson(lesson);
        setActiveDay(day);
        break;
      }
    }
  };

  const handleDragEnd = (event) => {
    const { active, over } = event;
    
    if (!over) {
      setActiveId(null);
      setActiveLesson(null);
      setActiveDay(null);
      return;
    }
    
    let overDay = null;
    
    if (over.data.current?.type === 'day') {
      overDay = over.data.current?.day;
    } else {
      
      for (const day of days) {
        const lessonsInDay = schedule[day] || [];
        const found = lessonsInDay.find(l => l.id === over.id);
        if (found) {
          overDay = day;
          break;
        }
      }
    }
    
    if (!overDay) {
      setActiveId(null);
      setActiveLesson(null);
      setActiveDay(null);
      return;
    }
    
    if (overDay === activeDay) {
      const currentLessons = schedule[overDay] || [];
      const oldIndex = currentLessons.findIndex(l => l.id === active.id);
      let newIndex = currentLessons.findIndex(l => l.id === over.id);
      
      if (newIndex === -1) {
        newIndex = currentLessons.length;
      }
      
      if (oldIndex !== -1 && oldIndex !== newIndex) {
        const newLessons = arrayMove(currentLessons, oldIndex, newIndex);
        onMoveLesson(overDay, newLessons);
      }
    } 

    else {
      const lesson = activeLesson;
      if (!lesson) {
        setActiveId(null);
        setActiveLesson(null);
        setActiveDay(null);
        return;
      }
      
      const targetLessons = schedule[overDay] || [];
      const hasConflict = targetLessons.some(existing => existing.name === lesson.name);
      
      if (hasConflict) {
        alert('Ошибка: В этот день уже есть такое занятие!');
      } else {
        const sourceLessons = schedule[activeDay] || [];
        const newSourceDay = sourceLessons.filter(l => l.id !== lesson.id);
        const newTargetDay = [...targetLessons, lesson];
        
        onMoveLesson(activeDay, newSourceDay);
        onMoveLesson(overDay, newTargetDay);
      }
    }
    
    setActiveId(null);
    setActiveLesson(null);
    setActiveDay(null);
  };

  return (
    <div className="week-grid">
      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragStart={handleDragStart}
        onDragEnd={handleDragEnd}
      >
        <div className="days-container">
          {days.map(day => {
            const dayLessons = schedule[day] || [];
            const lessonIds = dayLessons.map(l => l.id);
            
            return (
              <DroppableDay key={day} day={day} schedule={schedule}>
                <SortableContext
                  items={lessonIds}
                  strategy={verticalListSortingStrategy}
                >
                  {dayLessons.map(lesson => (
                    <SortableLesson
                      key={lesson.id}
                      lesson={lesson}
                      day={day}
                      onEdit={onEditLesson}
                      onDelete={onDeleteLesson}
                    />
                  ))}
                </SortableContext>
              </DroppableDay>
            );
          })}
        </div>
        
        <DragOverlay>
          {activeId && activeLesson ? (
            <div className="dragging-overlay" style={{ borderLeftColor: activeLesson.color }}>
              {activeLesson.name}
            </div>
          ) : null}
        </DragOverlay>
      </DndContext>
    </div>
  );
};

export default WeekGrid;