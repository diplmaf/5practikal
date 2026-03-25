import React from 'react';
import './Statistics.css';

function Statistics({ schedule }) {
  const days = ['Понедельник', 'Вторник', 'Среда', 'Четверг', 'Пятница', 'Суббота', 'Воскресенье'];
  
  const totalLessons = Object.values(schedule).reduce((sum, dayLessons) => {
    return sum + (dayLessons?.length || 0);
  }, 0);
  
  const dayLoad = days.map(day => {
    const dayLessons = schedule[day] || [];
    const count = dayLessons.length;
    const totalMinutes = dayLessons.reduce((sum, lesson) => sum + (lesson.duration || 0), 0);
    return { name: day, count, totalMinutes };
  });

  let avgPerDay = 0;
  if (totalLessons > 0) {
    avgPerDay = Math.round(totalLessons / 7 * 10) / 10;
  }

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
        {dayLoad.map(day => {
          let barWidth = (day.totalMinutes / 120) * 100;
          if (barWidth > 100) barWidth = 100;
          if (barWidth < 0) barWidth = 0;
          
          const barColor = day.count > 0 ? "#96CEB4" : "#ddd";
          
          return (
            <div key={day.name} className="day-load-item">
              <span className="day-name">{day.name}</span>
              <div className="load-bar-container">
                <div 
                  className="load-bar" 
                  style={{ 
                    width: barWidth + "%",
                    backgroundColor: barColor
                  }}
                />
              </div>
              <span className="load-count">{day.count} зан. ({day.totalMinutes} мин)</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default Statistics;