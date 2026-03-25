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
