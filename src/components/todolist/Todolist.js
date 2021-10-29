import React, { useState } from 'react';
import './Todolist.css';
import trashIcon from '../../images/trash.png';
import mark from '../../images/mark.svg';
import { useEffect } from 'react';

function Todolist(){

  /* Initial local data */

  const initialIdCounter = () => {
    if(localStorage.getItem('id')){
      return
    } else {
      localStorage.setItem('id', 1);
    }
  }
  
  const initialList = () => {
    if(localStorage.getItem('list')){
      return
    } else {
      localStorage.setItem('list', JSON.stringify([]))
    }
  }

  initialIdCounter(); 
  initialList();

  /* ============================== */


  /* Add local data to state */

  const [list, setList] = useState(JSON.parse(localStorage.getItem('list')));
  /* ============================== */


  /* Add note ======================*/
  
  const handleAddClick = (e) => {
    e.preventDefault();
    const arr = JSON.parse(localStorage.getItem('list'));
    arr.push({
      id: Number(localStorage.getItem('id')),
      note: document.querySelector('.todolist__input').value,
      color: document.querySelector('.todolist__color').value,
      dayCreation: new Date().getDate(),
      done: false
    });
    localStorage.setItem('id', Number(localStorage.getItem('id')) + 1);
    localStorage.setItem('countNotDone', Number(localStorage.getItem('countNotDone')) + 1);
    localStorage.setItem('list', JSON.stringify(arr));
    setList(JSON.parse(localStorage.getItem('list')));
  }


  /* ============================== */


  /* Delete Note ===================*/

  const handleDeleteClick = (e) => {
    const localList = JSON.parse(localStorage.getItem('list'));
    const newList = localList.filter(i => {
      return i.id !== Number(e.target.parentElement.parentElement.parentElement.id)
    })
    const deletedNote = localList.filter(i => {
      return i.id === Number(e.target.parentElement.parentElement.parentElement.id)
    })
    if(deletedNote[0].done){
      localStorage.setItem('countDone', Number(localStorage.getItem('countDone')) - 1);
    } else{
      localStorage.setItem('countNotDone', Number(localStorage.getItem('countNotDone')) - 1);
    }
    localStorage.setItem('list', JSON.stringify(newList));
    setList(JSON.parse(localStorage.getItem('list')));
  }

  /* ============================== */
  

  /* Change text-decoration on note */

  const handleDoneClick = (e) => {
    const listNote = JSON.parse(localStorage.getItem('list'));
    const idOfNote = Number(e.target.parentElement.parentElement.parentElement.id);
    const foundedNote = listNote.find(x => x.id === idOfNote);
    const foundedNoteIndex = listNote.findIndex(x => x.id === idOfNote);

    const changeDone = (bool, foundedNoteIndex, foundedNote, listNote) => {
      listNote.splice(foundedNoteIndex, 1);
      listNote.unshift({
        id: foundedNote.id,
        note: foundedNote.note,
        color: foundedNote.color,
        dayCreation: foundedNote.dayCreation,
        done: bool
      });
      localStorage.setItem('list', JSON.stringify(listNote));
      setList(JSON.parse(localStorage.getItem('list')));
    }
    if(foundedNote !== undefined){
      if(foundedNote.done === false){
        localStorage.setItem('countDone', Number(localStorage.getItem('countDone')) + 1);
        localStorage.setItem('countNotDone', Number(localStorage.getItem('countNotDone') - 1));
        changeDone(true, foundedNoteIndex, foundedNote, listNote);
      } else{
        localStorage.setItem('countNotDone', Number(localStorage.getItem('countNotDone')) + 1);
        localStorage.setItem('countDone', Number(localStorage.getItem('countDone')) - 1);
        changeDone(false, foundedNoteIndex, foundedNote, listNote)
      }
    }
  }

  /* ============================== */


  /* Timer =========================*/
  
  const [hours, setHours] = useState(23);
  const [minutes, setMinutes] = useState(59);
  const [seconds, setSeconds] = useState(59);

  useEffect(() => {
    const timer = new Promise((resolve, reject) => {
      setTimeout(function getTime() {
        let hours = new Date().getHours();
        let minutes = new Date().getMinutes();
        let seconds = new Date().getSeconds();
        let day = new Date().getDate();
        setHours(hours);
        setMinutes(minutes);
        setSeconds(seconds);
        setTimeout(getTime, 1000);
        resolve([day, hours, minutes, seconds]);
      }, 1000);
    });
  
    timer.then((res)=>{
      document.querySelector('.timer__container').classList.add('timer__container_show');
      checkDay(res[0], res[1], res[2], res[3]);
    })
  }, [list]);

  const checkDay = (day, hours, minutes, seconds) => {
    if(list.length !== 0){
      if(list[0]){
        if(list[0].dayCreation === day){
          const mSecondsToReset = (((23 - hours) * 3600) + ((59 - minutes) * 60) + (59 - seconds)) * 1000;
          clearList(mSecondsToReset);
        } else{
          clearList(100);
        }
      } else {
      }
    }
  }

  
  /* Reset ============================================== */

  const clearList = (time) => {
    setTimeout(() => {
      localStorage.setItem('globalCountDone', Number(localStorage.getItem('globalCountDone')) + Number(localStorage.getItem('countDone')));
      localStorage.setItem('globalCountNotDone', Number(localStorage.getItem('globalCountNotDone')) + Number(localStorage.getItem('countNotDone')));
      setGlobalCountDone(Number(localStorage.getItem('globalCountDone')));
      setGlobalCountNotDone(Number(localStorage.getItem('globalCountNotDone')));
      setList([]);
      localStorage.removeItem('list');
      localStorage.removeItem('id');
      localStorage.removeItem('countDone');
      localStorage.removeItem('countNotDone');
    }, time)
  }

  const [globalCountDone, setGlobalCountDone] = useState(Number(localStorage.getItem('globalCountDone')));
  const [globalCountNotDone, setGlobalCountNotDone] = useState(Number(localStorage.getItem('globalCountNotDone')));
 
  return(
    <section className="todolist">
      <form className="todolist__form" action="#" onSubmit={handleAddClick}>
        <fieldset className="todolist__text-info" alt="Ввод текста">
          <input className="todolist__input" 
          placeholder="Ваша заметка"
          name="note"
          type="text">
          </input>
        </fieldset>
        <fieldset className="todolist__color-info" alt="Ввод цвета и отправка">
          <input className="todolist__color" type="color"></input>
          <button 
          className="todolist__button"
          type="submit"
          >
          Добавить
          </button>
        </fieldset>
      </form>
      <ul className="todolist__list">
        {
          list.map(({id, note, color, done}) => {
            if(id >= 1){
              const curcleStyle = {
                backgroundColor: color
              }
              const doneMark = done ? 'todolist__note_done' : '';
              return (
                <li className="todolist__item" key={id} id={id}>
                  <div className="todolist__note-container">
                    <div className="todolist__curcle" style={curcleStyle}></div>
                    <p className={doneMark}>{note}</p>
                  </div>
                  <div className="todolist__control">
                    <button className="todolist__control-button" onClick={handleDeleteClick}>
                      <img className="todolist__control-img" src={trashIcon} alt="Удалить" />
                    </button>
                    <button className="todolist__control-button" onClick={handleDoneClick}>
                      <img className="todolist__control-img" src={mark} alt="Выполнено"/>
                    </button>
                  </div>
                </li>   
              );
            } else{
              return false;
            }
          }).reverse()
        }
      </ul>
      <div className="timer">
        <p className="timer__subtitle">Успей сделать! У тебя осталось:</p>
        <div className="timer__container">
          <time className="timer__time">
          { 
            `${(23 - hours < 10) ? '0' : ''}${23 - hours}`
          }
          </time>
          <p className="timer__dots">:</p>
          <time className="timer__time">
          { 
            `${(59 - minutes < 10) ? '0' : ''}${59 - minutes}`
          }
          </time>
          <p className="timer__dots">:</p>
          <time className="timer__time">
          { 
            `${(59 - seconds < 10) ? '0' : ''}${59 - seconds}`
          }
          </time>
        </div>
      </div>
      <div className="counter">
        <h3 className="counter__count counter__count_color_green">{globalCountDone}</h3>
        <h3 className="counter__count counter__count_color_red">{globalCountNotDone}</h3>
        <p className="counter__subtitle">Сделано</p>
        <p className="counter__subtitle">Не сделано</p>
      </div>
    </section>
    
  )
}

export default Todolist;