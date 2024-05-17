


document.addEventListener('DOMContentLoaded', () => {
   const submit = document.getElementById('submitTask');
   submit.addEventListener('click', (event) => {
       event.preventDefault();
       console.log('clicked');
       const task = document.getElementById('task').value;
       console.log(task);
       const timerInput = document.getElementById('times').value;
       console.log(timerInput);
       const data = document.getElementById('data').value;
       console.log(data);
       const selectedOptions = Array.from(document.querySelectorAll('.option.active:not(.all-tags)')).map(option => option.getAttribute('data-value'));

       const timerData = {
           timer: timerInput,
           task: task,
           date: data,
           employees: selectedOptions
       };
       
       ipcRenderer.send('open-timer-window', timerData);
   });
});
