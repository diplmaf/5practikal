# Конструктор расписания

## src/main.jsx
import React from 'react'
- импорт библиотеки React для создания компонентов
---
import ReactDOM from 'react-dom/client'
- импорт ReactDOM для рендеринга приложения в DOM
---
import App from './App.jsx'
- импорт главного компонента приложения
---
import './App.css'
- импорт глобальных стилей приложения
---
ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)
- создание корневого элемента React и рендеринг главного компонента App в режиме строгой проверки

---

## src/App.jsx
import React, { useState, useEffect } from 'react'
- импорт React и хуков useState для управления состоянием, useEffect для побочных эффектов
---
import LessonList from './components/LessonList'
- импорт компонента списка занятий
---
import WeekGrid from './components/WeekGrid'
- импорт компонента сетки расписания на неделю
---
import Filters from './components/Filters'
- импорт компонента фильтров и поиска
---
import Statistics from './components/Statistics'
- импорт компонента статистики
---
import { loadData, saveData } from './utils/storage'
- импорт функций загрузки и сохранения данных из localStorage
---
import './App.css'
- импорт стилей главного приложения
---
function App() {
- объявление главного функционального компонента App
---
const [lessons, setLessons] = useState([])
- состояние для хранения списка всех доступных занятий, начальное значение - пустой массив
---
const [schedule, setSchedule] = useState({})
- состояние для хранения расписания по дням недели, начальное значение - пустой объект
---
const [searchQuery, setSearchQuery] = useState('')
- состояние для хранения строки поиска по названию занятия
---
const [categoryFilter, setCategoryFilter] = useState('all')
- состояние для хранения выбранной категории фильтрации
---
useEffect(() => {
  const data = loadData()
  setLessons(data.lessons)
  setSchedule(data.schedule)
}, [])
- хук эффекта, выполняющий загрузку данных из localStorage при первом рендеринге компонента
---
useEffect(() => {
  if (lessons.length > 0 && Object.keys(schedule).length > 0) {
    saveData({ lessons, schedule })
  }
}, [lessons, schedule])
- хук эффекта, сохраняющий данные в localStorage при каждом изменении списка занятий или расписания
---
const categories = ['Основные', 'Языки', 'IT', 'Гуманитарные']
- массив доступных категорий для фильтрации
---
const handleAddToSchedule = (lesson) => {
- функция добавления занятия в расписание по выбору дня через prompt
---
const handleEditLesson = (id, newName, newDuration, newCategory) => {
- функция редактирования занятия в списке (название, длительность, категория)
---
const handleEditScheduleLesson = (day, lessonId, newName, newDuration) => {
- функция редактирования занятия в расписании (название, длительность)
---
const handleDeleteLesson = (id) => {
- функция удаления занятия из списка с подтверждением, также удаляет из расписания
---
const handleDeleteScheduleLesson = (day, lessonId) => {
- функция удаления занятия из расписания с подтверждением
---
const handleMoveLesson = (day, newLessons) => {
- функция перемещения занятия (изменение порядка или перенос между днями)
---
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
)
- рендеринг структуры приложения: заголовок, статистика, фильтры, список занятий и сетка расписания

---

## src/utils/storage.js
const STORAGE_KEY = 'schedule_data'
- константа ключа для хранения данных в localStorage
---
const defaultLessons = [
  { id: '1', name: 'Математика', category: 'Основные', duration: 90, color: '#FF6B6B' },
  { id: '2', name: 'Физика', category: 'Основные', duration: 90, color: '#4ECDC4' },
  { id: '3', name: 'Английский', category: 'Языки', duration: 60, color: '#45B7D1' },
  { id: '4', name: 'Программирование', category: 'IT', duration: 120, color: '#96CEB4' },
  { id: '5', name: 'История', category: 'Гуманитарные', duration: 60, color: '#FFEAA7' },
  { id: '6', name: 'Литература', category: 'Гуманитарные', duration: 60, color: '#DDA0DD' }
]
- массив начальных занятий с id, названием, категорией, длительностью и цветом
---
const defaultSchedule = {
  'Понедельник': [],
  'Вторник': [],
  'Среда': [],
  'Четверг': [],
  'Пятница': [],
  'Суббота': [],
  'Воскресенье': []
}
- объект начального пустого расписания на все дни недели
---
export const loadData = () => {
  const saved = localStorage.getItem(STORAGE_KEY)
  if (saved) {
    return JSON.parse(saved)
  }
  return { lessons: defaultLessons, schedule: defaultSchedule }
}
- функция загрузки данных из localStorage, при отсутствии возвращает начальные данные
---
export const saveData = (data) => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(data))
}
- функция сохранения данных в localStorage

---

## src/components/LessonList.jsx
import React, { useState } from 'react'
- импорт React и хука useState для управления состоянием редактирования
---
import './LessonList.css'
- импорт стилей списка занятий
---
function LessonList({ lessons, onAddToSchedule, onEditLesson, onDeleteLesson, searchQuery, categoryFilter }) {
- компонент отображения списка занятий с возможностью редактирования, удаления и добавления в расписание
---
const [editingId, setEditingId] = useState(null)
- состояние ID редактируемого занятия
---
const filteredLessons = lessons.filter(lesson => {
  const matchesSearch = lesson.name.toLowerCase().includes(searchQuery.toLowerCase())
  const matchesCategory = categoryFilter === 'all' || lesson.category === categoryFilter
  return matchesSearch && matchesCategory
})
- фильтрация занятий по поисковому запросу и выбранной категории
---
return (
  <div className="lesson-list">
    <h2>Список занятий</h2>
    <div className="lessons-container">
      {filteredLessons.map(lesson => (
        <div key={lesson.id} className="lesson-card" style={{ borderLeftColor: lesson.color }}>
          {editingId === lesson.id ? (
            <div className="lesson-edit-form">
              <input type="text" value={editName} onChange={(e) => setEditName(e.target.value)} placeholder="Название" autoFocus />
              <select value={editCategory} onChange={(e) => setEditCategory(e.target.value)}>
                <option value="Основные">Основные</option>
                <option value="Языки">Языки</option>
                <option value="IT">IT</option>
                <option value="Гуманитарные">Гуманитарные</option>
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
