</select>
              <select value={editDuration} onChange={(e) => setEditDuration(Number(e.target.value))}>
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
        **</div>
      ))}
    </div>
  </div>
)**
- рендеринг отфильтрованного списка занятий с формой редактирования

---

## src/components/LessonList.css
.lesson-list
- фон: белый, скругление: 12px, отступы: 20px, тень: 0 2px 8px rgba(0,0,0,0.1)
---
.lesson-card
- фон: #f9f9f9, скругление: 8px, отступы: 12px, левая граница: 4px цветная
---
.edit-btn
- фон: #4ECDC4, кнопка редактирования
---
.delete-btn
- фон: #FF6B6B, кнопка удаления
---
.add-btn
- фон: #96CEB4, кнопка добавления в расписание

---

## src/components/Filters.jsx
import React from 'react'
- импорт React
---
import './Filters.css'
- импорт стилей фильтров
---
function Filters({ searchQuery, onSearchChange, categoryFilter, onCategoryChange, categories }) {
- компонент поиска и фильтрации по категориям
---
return (
  <div className="filters">
    <div className="search-box">
      <input type="text" placeholder="🔍 Поиск по названию..." value={searchQuery} onChange={(e) => onSearchChange(e.target.value)} />
    </div>
    <div className="category-filter">
      <select value={categoryFilter} onChange={(e) => onCategoryChange(e.target.value)}>
        <option value="all">Все категории</option>
        {categories.map(cat => (
          <option key={cat} value={cat}>{cat}</option>
        ))}
      </select>
    </div>
  </div>
)**
- рендеринг поля поиска и выпадающего списка категорий

---

## src/components/Filters.css
.filters
- фон: белый, скругление: 12px, отступы: 15px, гибкое расположение
---
.search-box input
- отступы: 10px 15px, ширина: 250px, скругление: 8px
---
.category-filter select
- отступы: 10px 15px, скругление: 8px

---

## src/components/Statistics.jsx
import React from 'react'
- импорт React
---
import './Statistics.css'
- импорт стилей статистики
---
function Statistics({ schedule }) {
- компонент отображения статистики: общее количество занятий и нагрузка по дням
---
const days = ['Понедельник', 'Вторник', 'Среда', 'Четверг', 'Пятница', 'Суббота', 'Воскресенье']
- массив дней недели
---
const totalLessons = Object.values(schedule).reduce((sum, dayLessons) => {
  return sum + (dayLessons?.length || 0)
}, 0)
- расчет общего количества занятий в расписании
---
const dayLoad = days.map(day => {
  const dayLessons = schedule[day] || []
const count = dayLessons.length
  const totalMinutes = dayLessons.reduce((sum, lesson) => sum + (lesson.duration || 0), 0)
  return { name: day, count, totalMinutes }
})
- расчет количества занятий и минут нагрузки по каждому дню
---
return (
  <div className="statistics">
    <h3>📊 Статистика</h3>
    <div className="stats-summary">
      <div className="stat-card">
        <span className="stat-value">{totalLessons}</span>
        <span className="stat-label">Всего занятий</span>
      </div>
      <div className="stat-card">
        <span className="stat-value">{avgPerDay}</span>
        <span className="stat-label">В день в среднем</span>
      </div>
    </div>
    <div className="day-load">
      <h4>Нагрузка по дням</h4>
      {dayLoad.map(day => (
        <div key={day.name} className="day-load-item">
          <span className="day-name">{day.name}</span>
          <div className="load-bar-container">
            <div className="load-bar" style={{ width: Math.min((day.totalMinutes / 120) * 100, 100) + '%', backgroundColor: day.count > 0 ? '#96CEB4' : '#ddd' }} />
          </div>
          <span className="load-count">{day.count} зан. ({day.totalMinutes} мин)</span>
        </div>
      ))}
    </div>
  </div>
)**
- рендеринг статистики: карточки с общим количеством и полосы нагрузки по дням

---

## src/components/Statistics.css
.statistics
- фон: белый, скругление: 12px, отступы: 20px
---
.stat-card
- градиент: #667eea → #764ba2, цвет текста: белый
---
.load-bar
- высота: 100%, скругление: 12px, плавное изменение ширины

---

## src/components/WeekGrid.jsx
import React, { useState } from 'react'
- импорт React и хука useState
---
import { DndContext, closestCenter, KeyboardSensor, PointerSensor, useSensor, useSensors, DragOverlay } from '@dnd-kit/core'
- импорт компонентов для реализации drag-and-drop функциональности
---
import { arrayMove, SortableContext, sortableKeyboardCoordinates, verticalListSortingStrategy } from '@dnd-kit/sortable'
- импорт утилит для сортируемых элементов
---
import { useSortable } from '@dnd-kit/sortable'
- импорт хука для создания перетаскиваемых элементов
---
import { CSS } from '@dnd-kit/utilities'
- импорт CSS-утилит для transform
---
import './WeekGrid.css'
- импорт стилей сетки расписания
---
const SortableLesson = ({ lesson, day, onEdit, onDelete }) => {
- компонент перетаскиваемого занятия с возможностью редактирования и удаления
---
const WeekGrid = ({ schedule, onEditLesson, onDeleteLesson, onMoveLesson }) => {
- компонент сетки расписания с drag-and-drop поддержкой
---
const days = ['Понедельник', 'Вторник', 'Среда', 'Четверг', 'Пятница', 'Суббота', 'Воскресенье']
- массив дней недели для отображения колонок
---
const sensors = useSensors(
  useSensor(PointerSensor),
  useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
)
- настройка сенсоров для drag-and-drop (мышь и клавиатура)
---
const [activeId, setActiveId] = useState(null)
- состояние ID активного перетаскиваемого элемента
---
const [activeLesson, setActiveLesson] = useState(null)
- состояние активного перетаскиваемого занятия
---
const [activeDay, setActiveDay] = useState(null)
- состояние дня, из которого перетаскивается занятие
---
const handleDragStart = (event) => {
- обработчик начала перетаскивания: определяет занятие и день
---
const handleDragEnd = (event) => {
- обработчик окончания перетаскивания: определяет целевой день, проверяет конфликты, выполняет перемещение
---
return (
  <div className="week-grid">
    <DndContext sensors={sensors} collisionDetection={closestCenter} onDragStart={handleDragStart} onDragEnd={handleDragEnd}>
<div className="days-container">
        {days.map(day => {
          const dayLessons = schedule[day] || []
          const lessonIds = dayLessons.map(l => l.id)
          return (
            <div key={day} className="day-column">
              <div className="day-title">{day}</div>
              <SortableContext items={lessonIds} strategy={verticalListSortingStrategy}>
                <div className="day-lessons-list">
                  {dayLessons.map(lesson => (
                    <SortableLesson key={lesson.id} lesson={lesson} day={day} onEdit={onEditLesson} onDelete={onDeleteLesson} />
                  ))}
                  {dayLessons.length === 0 && <div className="empty-day">Нет занятий</div>}
                </div>
              </SortableContext>
            </div>
          )
        })}
      </div>
      <DragOverlay>
        {activeId && activeLesson && (
          <div className="dragging-overlay" style={{ borderLeftColor: activeLesson.color }}>
            {activeLesson.name}
          </div>
        )}
      </DragOverlay>
    </DndContext>
  </div>
)**
- рендеринг сетки из 7 колонок с возможностью перетаскивания занятий

---

## src/components/WeekGrid.css
.week-grid
- фон: белый, скругление: 12px, отступы: 20px, горизонтальная прокрутка
---
.days-container
- сетка: 7 колонок, расстояние между колонками: 15px
---
.day-column
- фон: #fafafa, скругление: 8px, отступы: 10px
---
.schedule-lesson
- фон: белый, скругление: 8px, отступы: 8px 10px, курсор: grab, левая граница цветная
---
.lesson-drag-handle
- курсор: grab, цвет: #999
---
.small-edit
- фон: #4ECDC4, кнопка редактирования в расписании
---
.small-delete
- фон: #FF6B6B, кнопка удаления из расписания
---
.dragging-overlay
- фон: белый, скругление: 8px, тень, курсор: grabbing

---

## src/App.css
* { margin: 0; padding: 0; box-sizing: border-box }
- сброс стандартных отступов всех элементов
---
body
- шрифт: системный, фон: #f5f5f5, отступы: 20px
---
.app
- максимальная ширина: 1400px, центрирование
---
h1
- отступ снизу: 20px, цвет: #333
---
.main-content
- сетка: 2 колонки (350px и 1fr), расстояние между колонками: 20px
---
@media (max-width: 900px)
- адаптация: одна колонка на мобильных устройствах

---

## Функциональность приложения

Список занятий
- отображение 6 предустановленных занятий с цветовой индикацией
---
Поиск
- фильтрация занятий по названию в реальном времени
---
Фильтр по категориям
- фильтрация занятий по категориям: Основные, Языки, IT, Гуманитарные
---
Добавление в расписание
- кнопка "+" вызывает prompt для выбора дня недели, добавление с проверкой конфликтов
---
Редактирование занятия
- кнопка "✎" открывает форму редактирования названия, категории, длительности
---
Удаление из списка
- кнопка "🗑" удаляет занятие из списка и из всего расписания
---
Сетка расписания
- 7 колонок по дням недели, отображение добавленных занятий
---
Drag-and-Drop
- перетаскивание занятий за значок "⋮⋮" для изменения порядка внутри дня или переноса между днями
---
Редактирование в расписании
- кнопка "✎" для редактирования названия и длительности занятия в расписании
---
Удаление из расписания
- кнопка "🗑" для удаления занятия из конкретного дня
---
Статистика
- отображение общего количества занятий и нагрузки по дням в виде цветных полос
---
Сохранение данных
- автоматическое сохранение в localStorage, восстановление после перезагрузки страницы

---

## Технологии

React 18
- библиотека для построения пользовательского интерфейса
---
Hooks (useState, useEffect)
- управление состоянием и побочными эффектами
---
@dnd-kit
- библиотека для реализации drag-and-drop функциональности
---
localStorage
- хранение данных на стороне клиента
---
CSS Grid / Flexbox
- адаптивная верстка интерфейса
---
Vite
- сборка и разработка проекта
